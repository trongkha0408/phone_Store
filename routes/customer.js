// routes/customer.js

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.listCustomers);

router.get("/data", customerController.datalistCustomers);

router.put("/update/:id", customerController.updateCustomer);

router.delete("/delete/:id", customerController.deleteCustomer);

router.post("/store", customerController.storeCustomer);

router.get("/profile/:id", customerController.profile);

router.get("/orders/create", customerController.createOrder);

router.get("/pruchase", customerController.createPurchase);

router.post("/purchase/store", customerController.storePurchase);

router.get("/search/:phoneNumber", customerController.searchCustomerByPhoneNumber);

router.get("/search-product/:barcode", customerController.searchProduct);

module.exports = router;
