const Newsletter = require("../models/newsletter.model");
const fs = require("fs");
const path = require("path");
const { sendMail } = require("../utils/mail.utils");
const logger = require("../utils/logger.utils");

const newsletterTemplate = async (email) => {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "newsletter.html"
    );
    const html = await fs.promises.readFile(templatePath, "utf-8");
    return html.replace(/{{ email }}/g, email);
  } catch (error) {
    logger.error("Error reading newsletter template:", error);
    throw new Error("Failed to load email template");
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newsLetter = new Newsletter({ email });

    await newsLetter.save();

    const html = await newsletterTemplate(email);

    await sendMail(
      email,
      "Welcome to our newsletter",
      "You have successfully subscribed to our newsletter",
      html
    );

    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
