import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto"; // Add this for signature verification

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

// Placing user order from frontend
const placeOrder = async(req,res)=>{
    const frontend_url = "http://localhost:5173"
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

        // Calculate total amount (including delivery charge)
        const totalAmount = req.body.amount + 200; // Adding 200 for delivery charges

        // Create Razorpay order
        const options = {
            amount: totalAmount * 100, // Razorpay expects amount in paise (smallest currency unit)
            currency: "INR",
            receipt: `receipt_${newOrder._id}`,
            notes: {
                orderId: newOrder._id.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            key_id: process.env.KEY_ID,
            product_name: "Food Order",
            description: "Food Delivery Payment",
            contact: "9999999999",
            name: "Customer",
            email: "customer@example.com"
            // Remove callback_url and cancel_url as they're not used in this way
        });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// Updated verify function to properly verify Razorpay signature
const verifyOrder = async(req,res) => {
    try {
        // Get payment details from request
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;
        
        // Verify signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
            
        if (generated_signature === razorpay_signature) {
            // Payment is verified
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            res.json({success: true, message: "Payment verified successfully"});
        } else {
            // Payment verification failed
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Payment verification failed"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error during payment verification"});
    }
}

//User Orders for frontend
const userOrders = async(req,res)=> {

    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//Listing orders for admin panel
const listOrders = async(req,res) =>{
    try {
        const orders = await  orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

//api for updating order status
const updateStatus =async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}

export {placeOrder, verifyOrder,userOrders,listOrders,updateStatus};

// import orderModel from "../models/orderModel.js";
// import userModel from"../models/userModel.js"
// import { useRazorpay } from "react-razorpay";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// // Placing user order from frontend
// const placeOrder = async(req,res)=>{
//     const frontend_url = "http://localhost:5173"
//     try {
//         const newOrder= new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })

//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price
//             },
//             quantity:item.quantity
//         }))
//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:200
//             },
//             quanitiy :1
//         })

//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })
//         res.json({success:true,session_url:session.url})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Error"})
        
//     }

// }

// export {placeOrder}