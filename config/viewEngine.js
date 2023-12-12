const express=require("express");
require("dotenv").config();
var cookieParser = require('cookie-parser');
const handlebars=require("express-handlebars");
var session = require('express-session');
var cookieParser = require("cookie-parser");
const req = require("express/lib/request");
const configViewEngine=(app)=>{
    app.engine("hbs",handlebars.engine({
        defaultLayout:"main",extname:'.hbs',
        helpers:{
            sum: (a,b)=>a+b,
            multiply:(a, b) => a * b,
            check:function(s1,s2,options){
                return (s1==s2)? options.fn(this):options.inverse(this);
            }
            ,
            format:function(s1){
                return new Date(s1).toLocaleDateString('en-GB');
            },
            _format:function(s2){
                const words = s2.split(' ');
                const formattedWords = words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase());
                return formattedWords.join('_');
            },
            formatprice:function(s3){
                return s3.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
            },
            times:function(n,block){
                var accum = [];
                for(var i = 1; i <= n; ++i)
                    accum.push(i);
                return accum;
            },
            test:function(n,options){
                return n>1? options.fn(this):options.inverse(this)
            },
            test1:function(n,s,options){
                return n<s?options.fn(this): options.inverse(this)
            },
            add:function(n){
                return n+1;
            },
            minus:function(n){
                return n-1;
            },
            formatint:function(n){
                return parseInt(n);
            },
            checkactive:function(s,s1){
                if(s==s1){
                    return "active";
                }
                else{
                    return "";
                }
            }
        }
            
    }));
    app.set("view engine","hbs");
    app.use(express.static("./public"));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser("secret_key"));
    app.use(express.json());
    app.use(session({
        cookie:{maxAge:1800000 },
        secret:"my secret key",
        saveUninitialized:false,
        resave:false
    }))
    app.use(cookieParser());
}
module.exports=configViewEngine;
