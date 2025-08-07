const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by vehicle view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleById(inv_id)
  const detail = await utilities.buildVehicleDetail(data)

  let nav = await utilities.getNav()
  const vehMake = data[0].inv_make
  const vehModel = data[0].inv_model
  res.render("./inventory/detail", {
    title: vehMake +' ' + vehModel,
    nav,
    detail
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Managment",
    nav,
  })
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
  })
}

/* ***************************
 *  Build Add Vehicle view
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationData = await invModel.getClassifications();
  const classifications = classificationData.rows;
  const classification_id = null;
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    classifications,
    classification_id
  })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addNewClassification = async function addNewClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addNewClassification(
    classification_name,
  )

  if (regResult) {
    req.flash(
      "notice",
      `${classification_name} has been added.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification has failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ****************************************
*  Process Add Vehicle
* *************************************** */
invCont.addNewVehicle = async function addNewVehicle(req, res) {
  console.log("✅ addNewVehicle controller reached")
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.addNewVehicle(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )

  const classificationData = await invModel.getClassifications()
  const classifications = classificationData.rows

  if (regResult) {
    req.flash(
      "notice",
      `${inv_make} has been added.`
    )
    res.status(201).render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classifications,
      classification_id
    })
  } else {
    req.flash("notice", "Sorry, adding the vehicle has failed.")
    res.status(501).render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
    })
  }
}

  module.exports = invCont