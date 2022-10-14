import puppeteer from 'puppeteer'
import * as c from '../common'
import { addSeenValueForUrl, urlHasSeen } from '../db'

// import { getAllCheckers } from '../db/fancy'
import { notifyWatchers } from '../mailer'

const watchers = ['jasperstephenson@gmail.com']

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
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()

  // * ----- rental -----
  try {
    await page.goto(
      'https://akiya-bank.org/blog/kodate/kind/housing/',
    )
    const allElements = await page.$$('.bukken-item')
    const possibleElements: any[] = []
    for (let e of allElements) {
      const isAccepting = await e.$('.accepting')
      if (!isAccepting) continue
      const area = (
        await e.$eval(
          '.bukken-name',
          (el) => el.textContent,
        )
      )
        ?.trim()
        .split(/[\s|｜]/gi)[0]
      if (!area) continue
      for (let l of ['左京区', '浄土寺', '白川', '出町柳'])
        if (area.includes(l)) possibleElements.push(e)
    }
    const element = possibleElements[0]
    if (!element) {
      console.log('No valid element found')
      return
    }
    const [location, type] = (
      await element.$eval(
        '.bukken-name',
        (el) => el.textContent,
      )
    )
      ?.trim()
      .split(/[\s|｜]/gi) as string[]
    const data = {
      url: await element.$eval('a', (el) =>
        el.getAttribute('href'),
      ),
      location,
      type,
      price: (
        await element.$eval(
          '.bukken-text-box .bukken-info > *:last-child',
          (el) => el.textContent,
        )
      )?.trim(),
      image: await element.$eval('img', (el) =>
        el.getAttribute('src'),
      ),
    }

    if (
      !(await urlHasSeen(
        'https://akiya-bank.org/blog/kodate/kind/housing/',
        data.url,
      ))
    ) {
      c.log(
        'green',
        'new entry found! notifying watchers...',
        data,
      )
      await addSeenValueForUrl(
        'https://akiya-bank.org/blog/kodate/kind/housing/',
        data.url,
      )
      notifyWatchers(
        data.url,
        JSON.stringify(data, null, 2),
        watchers,
      )
    } else {
      c.log('yellow', 'known entry found')
    }
  } catch (e) {
    c.error(e)
  }

  // * ----- purchase -----
  try {
    await page.goto(
      'https://akiya-bank.org/blog/?s=&post_type=kodate&kind%5B%5D=sale&areas%5B%5D=sakyo-ku&status%5B%5D=accepting',
    )
    const allElements = await page.$$('.bukken-item')
    const possibleElements: any[] = []
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
      possibleElements.push(e)
    }
    const element = possibleElements[0]
    if (!element) {
      console.log('No valid listings found')
      return
    }
    const [location, type] = (
      await element.$eval(
        '.bukken-name',
        (el) => el.textContent,
      )
    )
      ?.trim()
      .split(/[\s|｜]/gi) as string[]
    const data = {
      url: await element.$eval('a', (el) =>
        el.getAttribute('href'),
      ),
      location,
      type,
      price: (
        await element.$eval(
          '.bukken-text-box .bukken-info > *:last-child',
          (el) => el.textContent,
        )
      )?.trim(),
      image: await element.$eval('img', (el) =>
        el.getAttribute('src'),
      ),
    }

    if (
      !(await urlHasSeen(
        'https://akiya-bank.org/',
        data.url,
      ))
    ) {
      c.log(
        'green',
        'new entry found! notifying watchers...',
        data,
      )
      await addSeenValueForUrl(
        'https://akiya-bank.org/',
        data.url,
      )
      notifyWatchers(
        data.url,
        JSON.stringify(data, null, 2),
        watchers,
      )
    } else {
      c.log('yellow', 'known entry found')
    }
  } catch (e) {
    c.error(e)
  }

  await browser.close()
}

setInterval(scrape, 1000 * 60 * 30)
scrape()
