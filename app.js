const express=require("express");
const app=express();
const db=require("./config/mongodb");
require("dotenv").config();
const index=require("./routes/index");
const product=require("./routes/product");
const user=require("./routes/users");
const PORT = process.env.PORT||3000;
//----------------------------------------------------------------
const customer = require("./routes/customer");
const report = require("./routes/report");
//----------------------------------------------------------------
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD
const URL=process.env.URL;
db.connect(URL);
const configViewEngine=require("./config/viewEngine");
configViewEngine(app);


app.use("/",index);

app.use("/products",product);
app.use("/users",user);
app.use("/user",user);
//----------------------------------------------------------------
app.use("/report",report);
app.use("/customer",customer);
//----------------------------------------------------------------


app.use((err, req, res, next) => {
    console.error('** SERVER ERROR: ' + err.message)
    res.status(500).render('500', { message:err.message })
    })

app.use((req,res) =>{
    res.status(404).render("404",{title:"Something went wrong",message:"Page not found",layout:false});
  });

app.listen(PORT,()=>{
    console.log("Listening on port http://localhost:"+PORT);
});
