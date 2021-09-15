const nodemailer = require('nodemailer')
const path = require('path')

const pug = require('pug')
const juice = require('juice')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
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