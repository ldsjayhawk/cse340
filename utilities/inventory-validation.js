const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const invModel = require("../models/inventory-model")
  const validate = {}


 /*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty().withMessage("Please provide a classification name.")
        .isLength({ min: 1 }).withMessage("Classification name must contain at least 1 character.")
        .matches(/^[A-Za-z]+$/).withMessage("Classification name must not contain spaces, numbers or symbols.")
    ]
    }

  /* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors = errors.array()
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

  /*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
  
      // inv_make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle make."), // on error this message is sent.

      // inv_model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle model."), // on error this message is sent.
  
      // inv_year is required and must be string
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 4})
        .withMessage("Please provide a vehicle year."), // on error this message is sent.

      // inv_description is required and must be string
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle description."), // on error this message is sent.

      // inv_price is required and must be string
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 9})
        .withMessage("Please provide a vehicle model."), // on error this message is sent.

      // inv_miles is required and must be string
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle mileage."), // on error this message is sent.

      // inv_color is required and must be string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle color."), // on error this message is sent.

 ]
}


  /* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkVehData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors = errors.array()
    let nav = await utilities.getNav()

    const classificationData = await invModel.getClassifications()
    const classifications = classificationData.rows

    res.render("./inventory/add-vehicle", {
      errors,
      classifications,
      title: "Add Vehicle",
      nav,
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
    })
    return
  }
  next()
}

module.exports = validate