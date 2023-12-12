const Users=require("../models/users");
const checkpermission=async(req,res,next)=>{
    try{
        if(!req.session.loggedin){
            res.redirect("/login");
        }
        else{
            const id=req.session.remember;
            var _id=mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
            const user=await Users.findOne({_id:id});
            if(user.verified){
                res.redirect("/home");
            }
            else{
                res.redirect("/login");
            }

        }
    }catch(error){

    }
}
module.exports={checkpermission}