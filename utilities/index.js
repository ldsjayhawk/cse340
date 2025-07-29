const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(data){
  let detail = ""
  if(data.length > 0){
    data.forEach(vehicle => { 
      detail += '<div id="vehicle">'
    
      detail += '<div id="vehicle-image">'
      detail += '<picture>'
      detail += '<source media="(min-width: 700px)" srcset="' + vehicle.inv_image + '">'
      detail += '<img src="' + vehicle.inv_image +'"'
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +'" width="400">'
      detail += '</picture>'    
      detail += '</div>'

      detail += '<div id="vehicle-details">'
      detail += '<h2>'
      detail += vehicle.inv_make + ' ' + vehicle.inv_model + ' details' 
      detail += '</h2>'
      detail += `<p id="price"><strong>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</strong></p>`
      detail += '<p><strong>Description: </strong>' + vehicle.inv_description + '<p>'
      detail += '<p><strong>Color: </strong>' + vehicle.inv_color + '<p>'
      detail += '<p><strong>Mileage: </strong>' + vehicle.inv_miles + '<p>'
      detail += '</div>'

      detail += '</div>'

  })
 } else { 
    detail += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}

module.exports = Util


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)