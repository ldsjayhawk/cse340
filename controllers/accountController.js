const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */

async function buildRegistration(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ***************************
 *  Build account management view
 * ************************** */
async function accountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Managment",
    nav,
  })
}

/* ***************************
*  Build Update Account view
* ************************** */
async function buildAccountUpdate (req, res, next) {
  let nav = await utilities.getNav()
  const { account_id } = req.params

  const data = await accountModel.getAccountById(account_id)


  if (data) {
    res.render("./account/update", {
      title: "Update Account",
      nav,
      account_id: data.account_id,
      account_firstname: data.account_firstname,  
      account_lastname: data.account_lastname,
      account_email: data.account_email,
      errors: []
    })
  } else {
    req.flash("notice", "Sorry, cannot locate the account.")
    return res.redirect("/account/management")
  }
}

/* ****************************************
*  Process account update 
* *************************************** */
async function processAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  
  const data = await accountModel.updateAccount(
    account_id, 
    account_firstname, 
    account_lastname, 
    account_email
  )

  if (data) {
    req.flash(
      "notice",
      `Account has been updated.`
    )
    res.status(201).render("./account/management", {
      title: "Update Account",
      nav,
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email, 
      errors: errors
    })
  } else {
    req.flash("notice", "Sorry, updating the account has failed.")
    res.status(501).render("./account/update", {
      title: "Update Account",
      nav,
      errors: errors,
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email, 
    })
  }
}

/* ****************************************
*  Process password update 
* *************************************** */
async function processPasswordUpdate(req, res, next){
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, updating the password has failed.")
    return res.status(501).render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }

  const result = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (result) {
    req.flash(
      "notice",
      `Your password has been updated.`
    )
    res.status(201).render("./account/management", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("./account/update", {
      title: "Update Account",
      nav,
    })
  }
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, accountManagement, 
  buildAccountUpdate, processAccountUpdate, processPasswordUpdate }