import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbconfig.js"
import cors from "cors"
import dns from 'dns';

// Fix for Render IPv6 ENETUNREACH error with nodemailer
dns.setDefaultResultOrder('ipv4first');

//Local Imports
import authRoutes from "./routes/authRoutes.js"
import followRoutes from "./routes/followRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import errorHandler from "./middleware/errorhandler.js"
import adminRoutes from "./routes/adminRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import savedPostRoutes from "./routes/savedPostRoutes.js"

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

//CORS
app.use(cors())

//DB Connection
connectDB()

//Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// console.log(process.env.MONGO_URI)

// Default Route
app.get("/", (req, res) => {
    res.json({
        message: "WELCOME TO IMAGINEX API"
    })
})


// Auth Routes
app.use("/api/auth", authRoutes)


//Follow Routes
app.use("/api/user", followRoutes)

//Profile Routes
app.use("/api/profile", profileRoutes)

//Admin Routes
app.use("/api/admin", adminRoutes)

//Post Routes
app.use("/api/posts", postRoutes)

//Save Post Routes
app.use("/api/saved-posts", savedPostRoutes)


//Error Handler 
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT : ${PORT}`)
})