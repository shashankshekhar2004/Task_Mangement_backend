const timespan = require('jsonwebtoken/lib/timespan');
const mongoose=require('mongoose');
const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        //unique:true,
        
    },
    desc:{
        type:String,
        required:true,
        
    },
    important:{
        type:Boolean,
        default:false,
    },
    complete:{
        type:Boolean,
        default:false,
    }
},{timestamps:true}
)

module.exports=mongoose.model('task',taskSchema);