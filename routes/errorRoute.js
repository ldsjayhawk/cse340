// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errController = require("../controllers/errController")
const utilities = require("../utilities/")

// Route to handle error link
router.get("/error-link", utilities.handleErrors(errController.createError));

module.exports = router;