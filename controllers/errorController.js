/* ************************
 * Assignment 3, task 3
 ************************** */
const utilities = require("../utilities/")
const errorController = {}

errorController.createError = async function (req, res, next) {
    const abc = null
    let def = abc.toString

    res.send(def) 
}

module.exports = { errorController };