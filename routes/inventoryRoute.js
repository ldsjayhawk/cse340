// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to inventory management
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId));


// // Route to add classification & inventory views
router.get("/add-classification", utilities.handleErrors(invController.addClassification));
router.get("/add-vehicle", utilities.handleErrors(invController.addVehicle));

// Route to process process adding classification
router.post(
    "/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addNewClassification)
);

// Route to process process adding vehicle
router.post(
    "/add-vehicle", 
    invValidate.inventoryRules(),
    invValidate.checkVehData,
    utilities.handleErrors(invController.addNewVehicle)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Delete

// router.get("/delete/:inv_id", invController.buildDeleteView);
// router.post("/delete", invController.deleteInventory);
 
// const inventoryRoute = require("./routes/inventoryRoute");
// app.use("/inv", inventoryRoute);

module.exports = router;