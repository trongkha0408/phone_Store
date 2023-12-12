const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const CustomerSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  totalAmountSpent: { 
    type: Number, 
    default: 0 
  },
  purchaseHistory: [
    {
    //   userId:{
    //     type:Schema.Types.ObjectId,
    //     required:true,
    //     ref:"User",
    // },
      orderDate: { 
        type: String, 
        default: Date.now
      },
      products: [
        {
          productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product" 
          },
          productName: { 
            type: String, 
            required: true 
          },
          quantity: { 
            type: Number, 
            required: true 
          },
          unitPrice: { 
            type: Number, 
            required: true 
          },
        },
      ],
      totalAmount: { 
        type: Number, 
        required: true 
      },
      amountPaid: { 
        type: Number, 
        required: true 
      },
      changeReturned: { 
        type: Number, 
        required: true 
      },
    },
  ],
});

module.exports = mongoose.model("Customer", CustomerSchema);
