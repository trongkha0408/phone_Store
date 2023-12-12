const Customer = require("../models/Customers");
const Product = require("../models/Products");
const mongoose = require('mongoose');

exports.listCustomers = async (req, res) => {
    res.render("listCustomers",{username:req.session.username,footer:1,_id:req.session.remember});
};

exports.datalistCustomers = async (req, res) => {
    let customers = await Customer.find();
    return res.status(200).json({ data: customers });
};

exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { phoneNumber, fullName, address } = req.body;

    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(
        id,
        { phoneNumber, fullName, address },
        { new: true }
      );

      if (updatedCustomer) {
        res.status(200).json({ success: true, message: "Customer updated successfully", data: updatedCustomer });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
      const deletedCustomer = await Customer.findByIdAndRemove(id);

      if (deletedCustomer) {
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.profile = async (req, res) => {
    const { id } = req.params;

    try {
      const customer = await Customer.findOne({ _id: id }).lean();

      console.log(customer);
      return res.render("customerInfor", { customer,username:req.session.username,footer:1,_id:req.session.remember });
    } catch (error) {
      console.error(error);
      return res.status(500).render("500", { message: error.message });
    }
};


exports.storeCustomer = async (req, res) => {
    const phoneNumber = req.body.phone;
    const fullName = req.body.fullName;
    const address = req.body.address;

    // check phone is exists
    let isExists = await Customer.findOne({ phoneNumber: phoneNumber });
    if (isExists) {
      return res.status(400).json({ data: null, error: true, message: "Số đã tồn tại" });
    }

    customer = new Customer({
      phoneNumber,
      fullName,
      address
    });

    await customer.save();
    return res.status(200).json({ data: customer });
};

exports.createOrder = async (req, res) => {
    return res.render("transaction",{username:req.session.username,footer:1,_id:req.session.remember});
};

exports.createPurchase = async (req, res) => {
    return res.render("checkOut",{username:req.session.username,footer:1,_id:req.session.remember});
};

exports.searchCustomerByPhoneNumber = async (req, res) => {
    let { phoneNumber } = req.params;
    let customer = await Customer.findOne({ phoneNumber: phoneNumber });
    return res.status(200).json({ data: customer });
};

exports.searchProduct = async (req, res) => {
    let { barcode } = req.params;
    let product = await Product.findOne({ barcode: barcode });
    return res.status(200).json({ data: product });
};

exports.storePurchase = async (req, res) => {
    let { phoneNumber, purchase, amountPaid, totalAmount } = req.body;
    amountPaid = parseFloat(amountPaid);
    totalAmount = parseFloat(totalAmount);
    // get customer by phone number
    let customer = await Customer.findOne({ phoneNumber: phoneNumber });
    // var id=mongoose.Types.ObjectId.isValid(req.session.remember) ? new mongoose.Types.ObjectId(req.session.remember) : req.session.remember;
    // var id=req.session.remember;
    let time = new Date();
    if (customer) {
      // store purchase
      customer.totalAmountSpent += totalAmount;
      customer.purchaseHistory.push({
        // userId:id,
        orderDate: `${time.getHours()}:${time.getMinutes()} ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`,
        products: purchase,
        totalAmount: totalAmount,
        amountPaid: amountPaid,
        changeReturned: amountPaid - totalAmount
      });
      await customer.save();
      return res.status(200).json({ data: req.body });
    }
    return res.status(400).json({ data: req.body });
};

