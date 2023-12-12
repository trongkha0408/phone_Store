const getindex=(req,res)=>{
    if(req.session.loggedin){
        res.redirect("/home");
    }
    else{
        res.render("index",{layout:false});
    }
}
const getlogin=(req,res)=>{
    if(req.session.loggedin){
        res.redirect("/home");
    }
    else{
        const username = req.signedCookies.username;
        const password = req.signedCookies.password;
        res.render('login',{loginmessage:req.session.login,type:req.session.logintype,
            username:username,
            password:password,footer:1})
    }
}




const gethome=(req,res)=>{
    if(req.session.loggedin){
        res.render("home",{username:req.session.username,home:1,_id:req.session.remember,role:req.session.role});
    }
    else{
        res.redirect("/login");
    }
}



const logout=(req,res)=>{
    req.session.loggedin=false;
    res.redirect("/login");
}




module.exports={getindex,getlogin,gethome,logout};
