import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : true
    },
    text : {
        type : String , 
        required : [true , "Please Enter Text"] 
    }
} , {
    timestamps :  true
})

const Report = mongoose.model("Report" , reportSchema)


export default Report