const express=require("express");
const router=express.Router();
const {getproduct,getupdate,deleteproduct,createproduct,getcreate,updateproduct,getdetailproduct,upload}=require("../controllers/ProductController");
router.get("/",getproduct);

router.get("/add",getcreate);

router.post("/add",upload.single("image"),createproduct);

router.get("/update/:id",getupdate);

router.post("/update/:id",upload.single("image"),updateproduct)

router.post("/delete/:id",deleteproduct);

router.get("/detail",getdetailproduct);

module.exports=router;
