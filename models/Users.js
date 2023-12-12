const mongoose=require("mongoose");

const SchemaUser= new mongoose.Schema({
  username: {type:String,trim:true,require:true},
  email: {type:String,trim:true,require:true},
  fullname: {type:String,trim:true,require:true},
  avatar: {type:String,trim:true,require:true},
  password: {type:String,trim:true,require:true},
  status: {type:String,trim:true,default:"Inactive"},
  role: {type:String,trim:true,default:"Employee"},
  createdAt:{type:Date,default:Date.now()},
  verified:{type:Boolean,default:false}
});




module.exports =mongoose.model('User', SchemaUser);