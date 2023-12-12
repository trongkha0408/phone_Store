const mongoose=require("mongoose");

const ProductSchema = new mongoose.Schema({
    barcode: { type: String, required: true , unique: true },
    image:{type:String,required:true},
    name: { type: String, required: true },
    importPrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status:{type:Boolean,default:false,required:true}
  });
module.exports=mongoose.model('Product', ProductSchema);