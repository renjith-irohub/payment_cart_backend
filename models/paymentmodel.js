const mongoose=require('mongoose')

const paymentschema=new mongoose.Schema({
    items:[{
        name:String,
        price:Number,
        quantity:Number
    }],
    totalamount:Number,
    status:{
        type:String,
        enum:['pending','paid','cancelled'],
        default:'pending'
    }
},{
    timestamps:true
})

const paymodel=mongoose.model('payment',paymentschema)
module.exports=paymodel