import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const razorpay_payment_id = searchParams.get("razorpay_payment_id");
    const razorpay_order_id = searchParams.get("razorpay_order_id");
    const razorpay_signature = searchParams.get("razorpay_signature");
    const orderId = searchParams.get("orderId");
    
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async() => {
        try {
            const response = await axios.post(url+"/api/order/verify", {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                orderId
            });
            
            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Verification error:", error);
            navigate("/");
        }
    }
    
    useEffect(() => {
        if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
            verifyPayment();
        } else {
            // Handle case where parameters are missing
            navigate("/");
        }
    }, []);
    
    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify

// import React, { useContext, useEffect } from 'react'
// import './Verify.css'
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { StoreContext } from '../../context/StoreContext';
// import axios from 'axios';

// const Verify = () => {

//     const [searchParams,setSearchParams] = useSearchParams();
//     const success = searchParams.get("success")
//     const orderId = searchParams.get("orderId")
//     const {url} =useContext(StoreContext);
//     const navigate = useNavigate();


//     const verifyPayment = async()=>{
//         const response = await axios.post(url+"/api/order/verify",{success,orderId});
//         if (response.data.success) {
//             navigate("/myorders");
//         }
//         else{
//             navigate("/")
//         }
//     }
//     useEffect(()=>{
//         verifyPayment()
//     },[])
//   return (
//      <div className='verify'>
//         <div className="spinner">

//         </div>
      
//     </div>
//   )
// }

// export default Verify
