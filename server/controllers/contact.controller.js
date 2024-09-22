const Contact = require("../models/contact.model");
const path = require("path");
const fs = require("fs");
const User = require("../models/user.model");
const { sendMail } = require("../utils/mail.utils");
const contactTemplate = async (name, email, message) => {
  let html = fs.readFileSync(
    path.resolve(__dirname, "../templates/contact-us-template.html"),
    "utf8"
  );

  html = html.replace(/{name}/g, name);
  html = html.replace(/{email}/g, email);
  html = html.replace(/{message}/g, message);

  return html;
};

exports.createContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();

    const html = await contactTemplate(name, email, message);

    const admins = await User.find({ role: "admin" });

    admins.forEach(async (admin) => {
      await sendMail(admin.email, "New Contact Message", "", html);
    });

    return res.status(200).json({
      status: "success",
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Failed to send message",
    });
  }
};
