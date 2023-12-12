const Products=require("../models/Products");
const mongoose=require("mongoose");
const multer=require("multer");
const fs=require("fs");
const Token=require("../models/token");
const{mutipleMongooseToObject,mongooseToObject}=require("../public/JS/mongoose.js");
const Users=require("../models/users");

const getproduct=async(req,res)=>{
    var product=await Products.find({});
    // const existingToken = await Token.findOne({ userId: id });
    // var user=mongooseToObject(users);
    console.log(req.session.role);
        if(product){
            res.render("product",{products:mutipleMongooseToObject(product),
                username:req.session.username,footer:1,_id: req.session.remember,footer:1,
                message:req.session.product,type:req.session.productype,role:req.session.role})   
        }
    // else{
    //     if(existingToken){
    //         res.redirect(`/users/resetpassword/${id}`);
    //     }
    //     else{
    //         res.redirect("/login");
    //     }
    // }
}

const getcreate=(req,res)=>{
    res.render("addproduct",{username:req.session.username,footer:1,message:req.session.productadd,type:req.session.producttypeadd});
};


var storage=multer.diskStorage({
    destination:function(req,file,cb,res){
        if(file.mimetype==="image/jpg"|| file.mimetype==="image/jpeg"||file.mimetype==="image/png"){
            cb(null,"public/Image/product");
        }
        else{
            cb(new Error("Not image"),false);
        }
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});

var upload=multer({storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});


const createproduct=async(req,res,next)=>{
    var productname=req.body.name;
    var barcode=req.body.barcode;
    var importPrice=req.body.importPrice;
    var retailPrice=req.body.retailPrice;
    var category=req.body.category;
    if(!productname||!barcode||!importPrice||!retailPrice||!category){
        req.session.productadd="Please fill all";
        req.session.producttypeadd="danger";
        res.redirect("/products/add");
        return;
    }
    const file=req.file;
    if(!file){
        const error=new Error("Please upload a file");
        return next(error);
    }
    try{
        const product=await new Products({
            name:productname,
            barcode:barcode,
            image:req.file.filename,
            importPrice: importPrice,
            retailPrice: retailPrice,
            category:category,
        }).save();
    if(product){
        req.session.product=" Add Product "+productname+ " Successfully";
        req.session.productype="success";
        res.redirect("/products");
    }
    else{
        res.render("addproduct",{message:err.message})
    }
    }catch(error){
        console.log(error);
        return next(error);
    }
};



const getupdate=(req,res)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    Products.findById(id).then(product=>{
        if(product){
            res.render("updateproduct",{products: mongooseToObject(product),username:req.session.username,footer:1,
            title:"Update Product",message:req.session.productupdate,type:req.session.producttyeupdate
            })
        }
        else{
            res.redirect("/products");
        }
    }).catch(err=>{
        res.redirect("/products");
    })
}

const updateproduct=async(req,res,next)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    var name=req.body.name;
    var barcode=req.body.barcode;
    var importPrice=req.body.importPrice;
    var retailPrice=req.body.retailPrice;
    var category=req.body.category;
    if(!name||!barcode||!importPrice||!retailPrice||!category){
        req.session.productupdate="Please fill all";
        req.session.producttyeupdate="danger";
        res.redirect(`/products/update/${id}`);
        return;
    }
    const file=req.file;
    let new_image="";
    if(!file){
        const error=new Error("Please upload a file");
        return next(error);
    }
    if(req.file){
        new_image=req.file.filename;
        try{
         fs.unlinkSync("./public/Image/product/"+req.body.old_image);   
        } catch(err){
            const error=new Error("Image not found");
            return next(error);
        }
    }
    else{
        new_image=req.body.old_image;
    }
    const product=await Products.findByIdAndUpdate(id,{name:name,barcode:barcode,importPrice:importPrice,retailPrice:retailPrice,image:new_image,category:category});
        if(product){
            req.session.user="Update Product "+name+ " successfully";
            req.session.usertype="success";
            res.redirect("/products");
        }
        else{
            req.session.productupdate="Error";
            req.session.producttyeupdate="danger";
            res.redirect(`/products/update/${id}`);
        }
}

const deleteproduct=(req,res,next)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    Products.findByIdAndRemove(id)
        .then((product)=>{
            if(product){
                try{
                    fs.unlinkSync("./public/Image/product/"+product.image);   
                    req.session.product="Delete product " + product.name+" succesfully";
                    req.session.productype="success";
                    res.redirect("/products");
                }
                catch(err){
                    const error=new Error("Product not found");
                    return next(error);
                }
            }
        })
        .catch(err=>{
          req.session.product=err.message;
          req.session.productype="danger";  
          res.redirect("/products");
        });
}

const getdetailproduct=(req,res)=>{
    res.render("detailproduct");
}



module.exports={getproduct,createproduct,getcreate,getupdate,updateproduct,deleteproduct,getdetailproduct,upload}