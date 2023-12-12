const express=require("express");
const router=express.Router();
const {getuser,processlogin,adduser,getdetail,getprofile,changepassword,processadd,upload,getupdate,updateuser,deleteuser,processchangepassword,resendemail,changestatus,changeavatar,updateprofile,watchsales}=require("../controllers/UserController");
router.get("/",getuser);


router.post("/login",processlogin);


router.get("/profile/:id",getprofile);

router.get("/resetpassword/:id",changepassword);

router.post ("/resetpassword/:id",processchangepassword);


router.post("/add",upload.single("avatar"),processadd);

router.get("/update/:id",getupdate);

router.post("/update/:id",upload.single("avatar"),updateuser);

router.post("/delete/:id",deleteuser);

router.get("/detail/:id",getdetail);

router.get("/add",adduser);

router.get("/resendemail/:id",resendemail);

router.get("/changestatus/:id",changestatus);

router.post("/changeavatar/:id",upload.single("avatar"),changeavatar);

router.post("/changeprofile/:id",updateprofile);

router.get("/watchsales/:id/",watchsales);

module.exports=router;
