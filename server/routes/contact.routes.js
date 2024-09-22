const express = require("express");
const router = express.Router();

const { createContact } = require("../controllers/contact.controller.js");

router.post("/send-message", createContact);

module.exports = router;
