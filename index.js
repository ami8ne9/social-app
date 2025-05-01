const express = require("express")
const bodyparser = require("body-parser")
const cors =require("cors")
const mysql=require("mysql2")
require("dotenv").config()
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')
const sessions=require('express-session')


const db_user=process.env.DB_USR;
const db_pass=process.env.DB_PASS;
const db_name=process.env.DB_NAME;
const GMAIL=process.env.GMAIL;
const PASS=process.env.G_PASS;

const app = express()
app.use(express.json())
app.use(cors())
app.use(sessions({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}))



const conn=mysql.createConnection({
    host:'localhost',
    user:db_user,
    password:db_pass,
    database:db_name
})

conn.connect((error)=>{
    if(error){
        console.log('not connected to mysql',error)
    }else{
        console.log('db connected sucesfully')
    }
}
)




app.post('/login',async(req,res)=>{
    const responce=req.body;
    console.log(`${responce.email}`)
    conn.query(`SELECT Email,Password FROM social_users_t where Email='${responce.email}'`,async(err,result)=>{
        if(result==[]){
            console.log('no user found',result)
            res.json(false);
        }
        else{
            const isSame= await bcrypt.compare(responce.password,result[0].Password)
            if(isSame){
                //start a session 
                req.session.userId=123
                res.json(true);
            }
            else{
                res.json(false)
            }
            }
        })
    
})

const pendingV={}


app.put('/signup',async(req,res)=>{
    const request=req.body;
    // hash pass
    const hpass=await bcrypt.hash(request.Password,3)
    let state;
    conn.query('SELECT Email FROM social_users_t',async(err,result)=>{
        if(err){console.log('there is a error')}
        else{
            for (let i=0;i<result.length;i++){
                if (request.Email==result[i].Email){
                    state=true;
                    break
                }else{
                    state=false;
                }
            }
            if(!state){
                //send verification code
                const code=Math.floor(100000 + Math.random() * 900000);

                pendingV['data']={
                    code,
                    name:request.Name,
                    email:request.Email,
                    password:hpass,
                    createdAt:Date.now(),
                }

                const transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:GMAIL,
                        pass:PASS,
                    }
                })
                
                await transporter.sendMail({
                    from:`${GMAIL}`,
                    to:request.Email,
                    subject:`your verification`,
                    text: `Hello! Your verification code is: ${code}`
                })

                res.json('email sent')
                
            }else{
                res.json('user already exists')
            }
        }
        })
    
    
})

app.put('/verification',async(req,res)=>{
    const code=req.body.Code;

    console.log(pendingV['data'],code);

    const Email=pendingV['data'].email;
    const Name=pendingV['data'].name;
    const Code=pendingV['data'].code;
    const Password=pendingV['data'].password;

    

    if (Code == code){
        //add user to db
        conn.query(`insert into social_users_t (Name,Email,Password) values ('${Name}','${Email}','${Password}');`,(err,result)=>{
            if (err){
                console.log("couldn't add user",err);
            }else{
                res.json('added to the db');
            }
        })
        console.log('verification valid')
        res.json('the user is added to db');
    }else{
        res.json("code isn't correct")
    }

    
})

app.listen('5000',()=>{
    console.log('server is running');
})