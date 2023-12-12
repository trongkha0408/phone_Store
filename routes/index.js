const express=require("express");
const router=express.Router();
const {getindex,getlogin,gethome,logout}=require("../controllers/homeController");
const {checkpermission}=require("../middlewares/checkpermission");

router.get("/",getindex);

router.get("/home",gethome);

router.get("/login",getlogin);


router.get("/logout",logout);





module.exports=router;