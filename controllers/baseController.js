const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  req.flash("notice", "Sale, Sale, Sale!")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController