import * as c from '../common'

import nodemailer from 'nodemailer'
let transporter = nodemailer.createTransport({
  service: `gmail`,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

transporter.verify((error, success) => {
  if (error) console.log(error)
  else c.log('green', `Email server ready.`)
})

export async function notifyWatchers(
  url: string,
  output: string,
  watchers: string[],
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: watchers.join(', '),
    subject: `Change detected on ${url}`,
    text: output,
  }
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err)
    else
      c.log('green', `Email sent to ${watchers.join(', ')}`)
  })
}

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
