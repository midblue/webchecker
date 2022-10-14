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
exports.notifyWatchers = void 0;
const c = __importStar(require("../common"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = nodemailer_1.default.createTransport({
    service: `gmail`,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error, success) => {
    if (error)
        console.log(error);
    else
        c.log('green', `Email server ready.`);
});
async function notifyWatchers(url, output, watchers) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: watchers.join(', '),
        subject: `Change detected on ${url}`,
        text: output,
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err)
            console.log(err);
        else
            c.log('green', `Email sent to ${watchers.join(', ')}`);
    });
}
exports.notifyWatchers = notifyWatchers;
// export async function sendMail(
//   to: string,
//   title: string,
//   text: string,
// ): Promise<{
//   ok: boolean
//   message: string
// }> {
//   let mailOptions = {
//     from: `auto@webchecker.com`,
//     to,
//     subject: title,
//     text,
//   }
//   // send mail with defined transport object
//   return new Promise((resolve) =>
//     transporter.sendMail(mailOptions, (e, info) => {
//       if (e) {
//         console.log(
//           `Error sending password reset email for ${to}`,
//           e,
//         )
//         resolve({
//           ok: false,
//           message: e.message,
//         })
//       } else {
//         console.log(
//           `Password reset email for ${to} sent: ` +
//             info.response,
//         )
//         resolve({
//           ok: true,
//           message: `email sent to ${to}.`,
//         })
//       }
//     }),
//   )
// }
//# sourceMappingURL=index.js.map