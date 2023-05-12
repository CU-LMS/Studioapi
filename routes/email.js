const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY =
  "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";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || SENDGRID_API_KEY);

const sendEmail = async (
  req,
  res,
  to,
  subject,
  templateId,
  dynamicTemplateData
) => {
  const msg = {
    to: to,
    from: "fortuner6023@gmail.com",
    subject,
    templateId,
    dynamicTemplateData,
    // text: 'test mail after booking using Node.js',
    // html: '<strong>this is test mail from Chandigarh University ignore it please</strong>',
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    res.status(500).json({ msg: "there is some error", err: error.message });
    console.log(error);
  }
};

module.exports = sendEmail;
