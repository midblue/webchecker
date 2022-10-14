"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const c = __importStar(require("../common"));
const db_1 = require("../db");
// import { getAllCheckers } from '../db/fancy'
const mailer_1 = require("../mailer");
const watchers = ['jasperstephenson@gmail.com'];
// const scrape = async () => {
//   const checkers = await getAllCheckers()
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   for (const checker of checkers) {
//     await page.goto(checker.url)
//     const possibleElements = await page.$$(
//       checker.mainElement,
//     )
//     const element = checker.qualifyingSelector
//       ? possibleElements.filter(
//           async (e) =>
//             await e.$(checker.qualifyingSelector!),
//         )[0]
//       : possibleElements[0]
//     if (!element) {
//       console.log('No element found')
//       continue
//     }
//     const value = await element.$eval(
//       checker.compareSelector,
//       (el) => el.textContent,
//     )
//     if (value !== checker.lastValue) {
//       checker.lastValue = value
//       checker.lastChecked = Date.now()
//       checker.lastOutput =
//         checker.onChangeOutputSelectorsContent
//           .map((selector) =>
//             page.$eval(selector, (el) => el.textContent),
//           )
//           .join(`\n`)
//       console.log(checker.lastOutput)
//       notifyWatchers(
//         checker.url,
//         checker.lastOutput,
//         checker.watchers,
//       )
//     }
//   }
//   await browser.close()
// }
const scrape = async () => {
    const browser = await puppeteer_1.default.launch({
        args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    // * ----- rental -----
    try {
        await page.goto('https://akiya-bank.org/blog/kodate/kind/housing/');
        const allElements = await page.$$('.bukken-item');
        const possibleElements = [];
        for (let e of allElements) {
            const isAccepting = await e.$('.accepting');
            if (!isAccepting)
                continue;
            const area = (await e.$eval('.bukken-name', (el) => el.textContent))
                ?.trim()
                .split(/[\s|｜]/gi)[0];
            if (!area)
                continue;
            for (let l of ['左京区', '浄土寺', '白川', '出町柳'])
                if (area.includes(l))
                    possibleElements.push(e);
        }
        const element = possibleElements[0];
        if (!element) {
            console.log('No valid element found');
            return;
        }
        const [location, type] = (await element.$eval('.bukken-name', (el) => el.textContent))
            ?.trim()
            .split(/[\s|｜]/gi);
        const data = {
            url: await element.$eval('a', (el) => el.getAttribute('href')),
            location,
            type,
            price: (await element.$eval('.bukken-text-box .bukken-info > *:last-child', (el) => el.textContent))?.trim(),
            image: await element.$eval('img', (el) => el.getAttribute('src')),
        };
        if (!(await (0, db_1.urlHasSeen)('https://akiya-bank.org/blog/kodate/kind/housing/', data.url))) {
            c.log('green', 'new entry found! notifying watchers...', data);
            await (0, db_1.addSeenValueForUrl)('https://akiya-bank.org/blog/kodate/kind/housing/', data.url);
            (0, mailer_1.notifyWatchers)(data.url, JSON.stringify(data, null, 2), watchers);
        }
        else {
            c.log('yellow', 'known entry found');
        }
    }
    catch (e) {
        c.error(e);
    }
    // * ----- purchase -----
    try {
        await page.goto('https://akiya-bank.org/blog/?s=&post_type=kodate&kind%5B%5D=sale&areas%5B%5D=sakyo-ku&status%5B%5D=accepting');
        const allElements = await page.$$('.bukken-item');
        const possibleElements = [];
        for (let e of allElements) {
            // const area = (
            //   await e.$eval(
            //     '.bukken-name',
            //     (el) => el.textContent,
            //   )
            // )
            //   ?.trim()
            //   .split(/[\s|｜]/gi)[0]
            // if (!area) continue
            // for (let l of ['左京区', '浄土寺', '白川', '出町柳'])
            //   if (area.includes(l))
            possibleElements.push(e);
        }
        const element = possibleElements[0];
        if (!element) {
            console.log('No valid listings found');
            return;
        }
        const [location, type] = (await element.$eval('.bukken-name', (el) => el.textContent))
            ?.trim()
            .split(/[\s|｜]/gi);
        const data = {
            url: await element.$eval('a', (el) => el.getAttribute('href')),
            location,
            type,
            price: (await element.$eval('.bukken-text-box .bukken-info > *:last-child', (el) => el.textContent))?.trim(),
            image: await element.$eval('img', (el) => el.getAttribute('src')),
        };
        if (!(await (0, db_1.urlHasSeen)('https://akiya-bank.org/', data.url))) {
            c.log('green', 'new entry found! notifying watchers...', data);
            await (0, db_1.addSeenValueForUrl)('https://akiya-bank.org/', data.url);
            (0, mailer_1.notifyWatchers)(data.url, JSON.stringify(data, null, 2), watchers);
        }
        else {
            c.log('yellow', 'known entry found');
        }
    }
    catch (e) {
        c.error(e);
    }
    await browser.close();
};
setInterval(scrape, 1000 * 60 * 30);
scrape();
//# sourceMappingURL=index.js.map