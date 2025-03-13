import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
    const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext)

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]: value}))
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const placeOrder = async(event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        })
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 200
        }
        
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        
        let response = await axios.post(url + "/api/order/place", orderData, {headers: {token}});
        if (response.data.success) {
            const { order_id, amount, key_id } = response.data;
            
            const options = {
                key: key_id,
                amount: amount,
                currency: "INR",
                name: "Food Delivery",
                description: "Food Order Payment",
                order_id: order_id,
                handler: function(response) {
                    // Handle successful payment
                    window.location.href = "https://jainam-caterers-backend.onrender.com/verify?success=true&orderId=" + response.razorpay_order_id;
                },
                prefill: {
                    name: data.firstName + " " + data.lastName,
                    email: data.email,
                    contact: data.phone
                },
                theme: {
                    color: "#F37254"
                }
            };
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        }
        else {
            alert("Error");
        }
    }
    const navigate = useNavigate();
    useEffect(()=>{
        if (!token) {

            navigate('/cart')
        }
        else if(getTotalCartAmount()==0){
            navigate('/cart')
        }
    },[token])

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-field">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-field">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-field">
                    <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                    <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>₹{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>₹{getTotalCartAmount()===0?0:200}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+200}</b>
                        </div>
                    </div>
                    <button type='submit'>PROCEED TO PAYMENT</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder


// import React, { useContext } from 'react'
// import './PlaceOrder.css'
// import { StoreContext } from '../../context/StoreContext'

// const PlaceOrder = () => {
//     const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

//     const [data,setData] = useState({
//         firstName:"",
//         lastName:"",
//         email:"",
//         street:"",
//         city:"",
//         state:"",
//         zipcode:"",
//         country:"",
//         phone:""
//     })

//     const onChangeHandler =(event)=>{
//         const name = event.target.name;
//         const value = event.targe.value;
//         setData(data=>({...data,[name]:value}))
//     }

//     const placeOrder = async(event) =>{
//         event.preventDefault();
//         let orderItems = [];
//         food_list.map(()=>{
//             if (cartItems[item._id]>0) {
//                 let itemInfo = item;
//                 itemInfo["quantity"] = cartItems[item._id];
//                 orderItems.push(itemInfo)
                
//             }
//         })
//          let orderData ={
//             address:data,
//             items:orderItems,
//             amount:getTotalCartAmount()+200
//          }
//          let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
//          if (response.data.success) {
//             const{session_url} = response.data;
//             window.location.replace(session_url);
            
//          }
//          else {
//             alert("Error")
//          }

//     }
//     return (
//         <form onSubmit={placeOrder} className="place-order">
//             <div className="place-order-left">
//                 <p className="title">Delivery Information</p>
//                 <div className="multi-field">
//                     <input required  name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
//                     <input required  name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
//                 </div>
//                 <input required  name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
//                 <input required  name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
//                 <div className="multi-field">
//                     <input required  name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
//                     <input required  name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
//                 </div>
//                 <div className="multi-field">
//                     <input required  name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
//                     <input required  name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
//                 </div>
//                 <input required  name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />

//             </div>
//             <div className="place-order-right">
//                 <div className="cart-total">
//                     <h2>Cart Totals</h2>
//                     <div>
//                     <div className="cart-total-details">
//                             <p>Subtotal</p>
//                             <p>₹{getTotalCartAmount()}</p>
//                         </div>
//                         <hr />
//                         <div className="cart-total-details">
//                             <p>Delivery Fee</p>
//                             <p>₹{getTotalCartAmount()===0?0:200}</p>
//                         </div>
//                         <hr />
//                         <div className="cart-total-details">
//                             <b>Total</b>
//                             <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+200}</b>
//                         </div>

//                     </div>
//                     <button type='submit' >PROCEED TO PAYMENT</button>
//                 </div>


//             </div>
//         </form>
//     )
// }

// export default PlaceOrder
