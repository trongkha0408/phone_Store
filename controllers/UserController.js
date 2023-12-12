const Users=require("../models/users");
const Customers=require("../models/Customers");
require("dotenv").config();
const mongoose = require('mongoose');
const multer=require("multer");
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT;
const{mutipleMongooseToObject,mongooseToObject}=require("../public/JS/mongoose.js");
const Token=require("../models/token");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
const fs=require("fs");



var storage=multer.diskStorage({
    destination:function(req,file,cb,res){
        if(file.mimetype==="image/jpg"|| file.mimetype==="image/jpeg"||file.mimetype==="image/png"){
            cb(null,"public/Image/avatar");
        }
        else{
            cb(new Error("Not image"),false);
        }
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});

const upload=multer({storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

const getuser=async(req,res)=>{
        // const user=await Users.findOne({_id:id});
        // // const existingToken = await Token.findOne({ userId: id });
        // var _user=mongooseToObject(user);
        // if(_user.verified){
        //     if(users){
        //     }
        // }
        const page=req.query.page||1;
        const booksPerPage=10;
        const users=await Users.find({}).skip((page-1)*booksPerPage).limit(booksPerPage);
        const totalDocuments = await Users.countDocuments({});
        const totalPage= Math.ceil(totalDocuments / booksPerPage);
        var array=[];

        for(let i=1;i<=totalPage;i++){
            array.push(i);
            console.log(typeof i);
        }
        res.render("User",{users:mutipleMongooseToObject(users),username:req.session.username,footer:1,
            _id: req.session.remember, message:req.session.user,type:req.session.usertype,totalPage:Number(totalPage),array:array
            ,currentpage:Number(page),role:req.session.role
        });

};


const adduser=(req,res)=>{
    res.render("Adduser",{username:req.session.username,footer:1,_id:req.session.remember,message:req.session.useradd,type:req.session.usertypeadd,role:req.session.role});
}




const getupdate=async(req,res)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    const user=await Users.findById(id);
        if(user){
            res.render("updateuser",{users: mongooseToObject(user),username:req.session.username,footer:1,_id:id,message:req.session.userupdate,type:req.session.userupdatetype,
            title:"Update User",role:req.session.role
            })
        }
        else{
            res.redirect("/user");
        }
};


const updateuser=async(req,res,next)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    var name=req.body.name;
    var email=req.body.email;
    var status=req.body.status;
    var role=req.body.role;
    if(!name||!email||!status||!role){
        req.session.useradd="Please fill all";
        req.session.usertypeadd="danger;"
        res.redirect("/users/add");
        return;
    }
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if(!filter.test(email)){
        req.session.useradd="Email khong hop le";
        req.session.usertypeadd="danger;"
        res.redirect("/users/add");
        return;
    }

    const file=req.file;
    if(!file){
        const error=new Error("Please upload a file");
        return next(error);
    }

    let new_image="";
    if(file){
        new_image=req.file.filename;
        try{
         fs.unlinkSync("./public/Image/avatar/"+req.body.old_image);   
        } catch(err){
            const error=new Error("Image not found");
            return next(error);
        }
    }
    else{
        new_image=req.body.old_image;
    }

    const user=await Users.findOne({_id:id});
    if(user){
        if(user.email!=email){
            const _user=await Users.findOne({email:email});
            if(_user){
                req.session.userupdate="User with given email already Exist!";
                req.session.userupdatetype="danger";
                res.redirect(`/users/update/${id}`);
                return;
            }
            const token = await new Token({
                userId: _user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
            const url = `${process.env.BASE_URL}users/resetpassword/${user._id}`;
            await sendEmail(user.email, "Verify Email", url);
        }
    }
    const update= await Users.findByIdAndUpdate(id,{fullname:name,email:email,status:status,role:role,avatar:new_image})
        if(update){
            req.session.user="Update User "+name+ " successfully";
            req.session.usertype="success";
            res.redirect("/users");
        }
        else{
            req.session.userupdate=err.message;
            req.session.userupdatetype="success";
            res.redirect(`/users/update/${id}`);
        }
}


const getdetail=(req,res)=>{
    const id=mongoose.Types.ObjectId.isValid(req.params.id)?new mongoose.Types.ObjectId(req.params.id):req.params.id;
    Users.findById(id).then(users=>{
        res.render("detailuser",{_users:mongooseToObject(users),username:req.session.username,footer:1,_id:id,role:req.session.role});
    })
}


const getprofile=async(req,res)=>{
    const id=mongoose.Types.ObjectId.isValid(req.params.id)?new mongoose.Types.ObjectId(req.params.id):req.params.id;
    const existingToken = await Token.findOne({ userId: id });
    const user=await Users.findOne({_id:id});
    if(user.verified){
        res.render("profile",{users:mongooseToObject(user),_id:id,_image:mongooseToObject(user).avatar,username:req.session.username,footer:1,message:req.session.flash,type:req.session.type,role:req.session.role})
    }
    else{
        if(existingToken){
            res.redirect(`/users/resetpassword/${id}`);
        }
        else{
            res.redirect("/login");
        }
    }
};






const processadd=async(req,res,next)=>{
    try{
    var email=req.body.email;
    var name=req.body.name;
    if(!email||!name){
        req.session.useradd="Please fill all";
        req.session.usertypeadd="danger;"
        res.redirect("/users/add");
        return;
    }
    const file=req.file;
    if(!file){
        const error=new Error("Please upload a file");
        return next(error);
    }
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if(!filter.test(email)){
        req.session.useradd="Email khong hop le";
        req.session.usertypeadd="danger;"
        res.redirect("/users/add");
        return;
    }
    const user = await Users.findOne({ email: email });
    var users=mongooseToObject(user);
        if(users){
            req.session.useradd="User with given email already Exist!";
            req.session.usertypeadd="danger;"
            res.redirect("/users/add");
            return;
        }
        const username=email.substring(0,email.indexOf("@"));
        const salt = await bcrypt.genSalt(Number(saltRounds));
        const hash = await bcrypt.hash(username, salt);
            const _user=await new Users({
                username:username,
                email:email,
                fullname:name,
                avatar:req.file.filename,
                password:hash,
            }).save();
                const token = await new Token({
                    userId: _user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.BASE_URL}users/resetpassword/${_user._id}`;
                await sendEmail(_user.email, "Verify Email", url);
                req.session.user=" Add User "+username + "Successfully";
                req.session.usertype="success";
                res.redirect("/users");
                
    }catch(error){
        console.log(error);
        return next(error);
    }

}


const getverified=(req,res,next)=>{
    try {
        const id=mongoose.Types.ObjectId.isValid(req.params.id)?new mongoose.Types.ObjectId(req.params.id):req.params.id;
		const user = User.findOne({ _id: id});
		if (!user) return res.render("404",{message:"Invalid link"});
        
		const token = Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.render("404",{message:"Invalid link"});

		User.updateOne({ _id: user._id, verified: true });
		token.remove();
        req.session.flash("Email verified successfully");
        res.redirect("/login");
	} catch (error) {
		return next(error);
	}
}



const processlogin=async(req,res,next)=>{
    var username=req.body.username;
    var password=req.body.password;
    var remember=req.body.remember;
    if(!username||!password){
        req.session.flash="Please fill all";
        req.session.type="danger";
        res.redirect("/login");
    }
    try {
        const user = await Users.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
          req.session.login = "Username or Password is incorrect";
          req.session.logintype = "danger";
          res.redirect("/login");
          return;
        }
    
    
        if (remember != null) {
          res.cookie("username", username, { maxAge: 900000, signed: true });
          res.cookie("password", password, { maxAge: 900000, signed: true });
        }
        if (!user.verified) {
        //     const existingToken = await Token.findOne({ userId: id });
        //   if (!existingToken) {
        //     const token = await new Token({
        //       userId: user._id,
        //       token: crypto.randomBytes(32).toString("hex"),
        //     }).save();
        //     const url = `${process.env.BASE_URL}users/resetpassword/${user.id}`;
        //     await sendEmail(user.email, "Verify Email", url);
        //     }
        req.session.login = "Please login by clicking on the link in your email";
        req.session.logintype = "danger";
        res.redirect("/login");
    }
    else{
        req.session.username = username;
        req.session.image = user.avatar;
        id=user._id.toString();
        req.session.remember=id;
        req.session.role=user.role;
        console.log(user.role);
        req.session.loggedin = true;
        res.redirect("/home");
    }
      } catch (error) {
        next(error);
      }
}

const deleteuser=async(req,res,next)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    const user= await Users.findByIdAndRemove(id);
            if(user){
                try{
                    fs.unlinkSync("./public/Image/avatar/"+user.avatar);   
                    req.session.user="Delete user" + user.fullname+" succesfully";
                    req.session.usertype="success";
                    res.redirect("/users");
                }
                catch(err){
                    const error=new Error("Image not found");
                    return next(error);
                }
            }
        else{
          req.session.user=err.message;
          req.session.usertype="danger";  
          res.redirect("/users");
        };
}




const changepassword= async(req,res,next)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id)?new mongoose.Types.ObjectId(req.params.id):req.params.id;
    try {
        var user = await Users.findById(id);
        var users = mongooseToObject(user);
        var existingToken = await Token.findOne({ userId: id });
        if(users.verified){
            req.session._idproduct=id;
            req.session._idacccount=id;
            console.log(req.session.flash);
            res.render("changepassword", {
                password: users.password,
                username: req.session.username,
                footer: 1,
                message:req.session.flash,
                type:req.session.type,
                check:"1",
                _id: id,role:req.session.role
              });
        }
        else{
            if (!existingToken) {
                res.redirect("/login");
                return;
            }
            else{
                req.session._idacccount=id;
                req.session._idproduct=id;
                res.render("changepassword", {
                    password: users.password,
                    username: req.session.message,
                    message:req.session.flash,
                    type:req.session.type,
                    footer: 1,
                    _id: id,role:req.session.role
                  });
            }
        }   
      } catch (error) {
          console.log(error);
        next(error);
      }
    };

const processchangepassword=async(req,res,next)=>{
    var newpass= req.body.newpass;
    var cnewpass=req.body._newpass;
    var id=mongoose.Types.ObjectId.isValid(req.params.id)?new mongoose.Types.ObjectId(req.params.id):req.params.id;
    try {
        var user = await Users.findById(id);
        var users = mongooseToObject(user);
        var existingToken=await Token.findOne({userId:id});
        if(!users.verified){
            if(!existingToken){
                req.session.flash="Thoi gian xac thuc da het";
                req.session.type="danger";  
                res.redirect("/login");
            }
            if(!newpass||!cnewpass){
                req.session.flash="Please fill all";
                req.session.type="danger";
                res.redirect(`/users/resetpassword/${id}`);  
            }
            if(newpass!=cnewpass){
                req.session.flash="Mat khau khong trung khop";
                req.session.type="danger";  
                res.redirect(`/users/resetpassword/${id}`);
            }
            try {
                const salt = await bcrypt.genSalt(Number(saltRounds));
                const hash = await bcrypt.hash(newpass, salt);
            
                await Users.findByIdAndUpdate(id, { verified: true, password: hash,status:"Active" });
            
                req.session.flash = "Update Password successfully";
                req.session.type = "success";
                req.session.loggedin = true;
                res.redirect("/home");
              } catch (error) {
                    return(next(error));
              }
        }
        else{
            var oldpass=req.body.oldpass;

            if(!newpass||!cnewpass||!oldpass){
                req.session.flash = "Please fill all";
                req.session.type = "danger";
                res.redirect(`/users/resetpassword/${id}`);
            }

            if (!bcrypt.compareSync(oldpass, users.password)) {
                req.session.flash = "Password is not correct";
                req.session.type = "danger";
                res.redirect(`/users/resetpassword/${id}`);
              }
            if(newpass!=cnewpass){
                req.session.flash="Mat khau khong trung khop";
                req.session.type="danger";  
                res.redirect(`/users/resetpassword/${id}`);
            }
            const salt = await bcrypt.genSalt(Number(saltRounds));
            const hash = await bcrypt.hash(newpass, salt);
        
            await Users.findByIdAndUpdate(id, { verified: true, password: hash,status:"Active" });
                        req.session.flash="Update Password successfully";
                        console.log(req.session.flash);
                        req.session.type="success";
                        res.redirect(`/users/resetpassword/${id}`);
            }
        
    }
    catch (error) {
        console.log(error);
      next(error);
    }
}


const resendemail=async(req,res)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    var user = await Users.findById(id);
    var users = mongooseToObject(user);
    if(users.verified){
        req.session.user="Account da duoc xac thuc";
        req.session.usertype="success";  
    }
    else{
        const existingToken = await Token.findOne({ userId: id });
        if(!existingToken){
                const token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                  const url = `${process.env.BASE_URL}users/resetpassword/${user.id}`;
                  await sendEmail(user.email, "Verify Email", url);
                  req.session.user="Email da duoc gui";
                  req.session.usertype="success";  
        }
        else{
            req.session.user="Email van con hieu luc";
            req.session.usertype="success";  
        }
    }
        res.redirect("/users");
    };

const changestatus=async(req,res)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    var user = await Users.findById(id);
    var users = mongooseToObject(user);
    var status=users.status;
    if(status=="Active"){
        Users.findByIdAndUpdate(id,{status:"Inactive",verified:false}).then(()=>{
        })  
    }
    else{
        Users.findByIdAndUpdate(id,{status:"Active",verified:true}).then(()=>{
        })  
    }
    req.session.user="Update Status successfully";
    req.session.usertype="success";
    res.redirect("/users");
};

const changeavatar=async(req,res,next)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    const file=req.file;
    if(!file){
        const error=new Error("Please upload a file");
        return next(error);
    }
    let new_image="";
    if(req.file){
        new_image=req.file.filename;
        try{
         fs.unlinkSync("./public/Image/avatar/"+req.body.old_image);   
        } catch(err){
            const error=new Error("Image not found");
            return next(error);
        }
    }
    else{
        new_image=req.body.old_image;
    }
    console.log(new_image); 
    const user=await Users.findByIdAndUpdate(id,{avatar:new_image})
    if(user){
        req.session.flash="Change avatar successfully";
        req.session.type="success";
    }
    else{
        req.session.flash="Error";
        req.session.type="danger";
    }
    res.redirect(`/users/profile/${id}`);
}

const updateprofile=(req,res)=>{
    var username=req.body.username;
    var fullname=req.body.fullname;
    var email=req.body.email;
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    Users.findByIdAndUpdate(id,{username:username,fullname:fullname,email:email})
    .then(()=>{
        req.session.flash="Change profile successfully";
        req.session.type="success";
        res.redirect(`/users/profile/${id}`);
    })
    .catch(err=>{
        req.session.flash="Error";
        req.session.type="danger";
        res.redirect(`/users/profile/${id}`);
    })
}

const watchsales=async(req,res)=>{
    var id=mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id;
    const customers = await Customers.find({ _id: id }).populate("purchaseHistory");
    for (const customer of customers) {
        const purchaseHistory = customer.purchaseHistory;
    
        for (const purchase of purchaseHistory) {
          console.log(purchase); 
    }
}
    res.redirect("/home");
}

module.exports={getuser,processlogin,adduser,getdetail,getprofile,changepassword,processadd,upload,getverified,getupdate,updateuser,deleteuser,processchangepassword,resendemail,changestatus,changeavatar,updateprofile,watchsales}
