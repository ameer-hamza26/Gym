import express from "express"
import {config} from "dotenv"
import cors from "cors"
import { sendMail } from "./utils/sendMail.js"


const app = express()

const router = express.Router()

config({path: "./config.env"})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
}))

app.use(express.json());

app.use(express.urlencoded({extended:true}))

router.get("/",(req,res,next)=>{
    res.json({success:true,
        message:"Server is Running"
    })
})

router.post("/send/mail",async (req,res,next)=>{
    const {name,email,message} = req.body;

    console.log("Received mail request:", { name, email, message });

    if(!name || !email || !message){
        return res.status(400).json({
            success: false,
            message: "Please provide all details"
        });
    }

    try {
        console.log("Attempting to send email to:", "hamzaameer9710@gmail.com");
        
        await sendMail({
            email: "hamzaameer9710@gmail.com",
            subject: "GYM WEBSITE CONTACT",
            message: `Name: ${name}\nMessage: ${message}`,
            userEmail: email
        });
        
        console.log("Email sent successfully");
        res.status(200).json({
            success: true,
            message: "Message sent Successfully"
        });
    } catch (error) {
        console.error("Detailed error in /send/mail route:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        res.status(500).json({
            success: false,
            message: `Failed to send email: ${error.message}`
        });
    }

});

app.use(router)

app.listen(process.env.PORT || 500,()=>{
    console.log(`Server is listening at port ${process.env.PORT}`)
})