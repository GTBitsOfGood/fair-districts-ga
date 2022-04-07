import nodemailer from "nodemailer";


async function handler(req, res) {
    if (req.method === "POST") {
        await emailVolunteers(req, res);
    }
};

async function emailVolunteers(req, res) {
    const { emails } = req.body;
    const testAccount = await nodemailer.createTestAccount();
    // Update to use Mailchimp SMTP server and API key
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    const mailOptions = {
        from: '"Manu Gupta" <manu@bitsofgood.org>', // replace with Manu's address
        to: emails.toString(),
        subject: "Test email",
        text: "Hello world!",
        html: "<b>Hello world!</b>"
    };

    const mailInfo = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", mailInfo.messageId);
    res.status(200).json({});
};

export default handler;
