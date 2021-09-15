const nodemailer = require('nodemailer')
const path = require('path')

const pug = require('pug')
const juice = require('juice')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
})

const HtmlEmailTemplate = (tokenURL, filename) => {
    const emailTemplate = pug.renderFile(path.join(__dirname, `../views/emails/${filename}.pug`), { tokenURL })
    return juice(emailTemplate)
}

const SendEmail = async (subject, pugTemplate, to) => {
    await transporter.sendMail({
        from: 'Tengo Una Idea <no-reply@tengounaidea.xyz>',
        to,
        subject,
        text: '',
        html: pugTemplate
    })
}
module.exports = {
    HtmlEmailTemplate,
    SendEmail
}