import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Jainam Caterers is dedicated to bringing you the purest and most authentic flavors in every bite. We specialize in samosas, kachoris, namakpare, and a variety of traditional snacks, all crafted with the highest standards of cleanliness and purity.

✨ Our Promise:
✅ 100% Pure Vegetarian (No Onion & No Garlic)
✅ No chemical additives or preservatives
✅ Freshly made with hygienic practices

At Jainam Caterers, we take pride in serving wholesome, satvik food that preserves the rich flavors of tradition while ensuring quality and freshness. Taste the purity with every bite!</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
                
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH </h2>
                <ul>
                    <li>+91-9653255718</li>
                    <li>jainamcaterers1008@gmail.com</li>
                </ul>

            </div>
            
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2024 @ JainamCaterers.com-All Right Reserved</p>

      
    </div>
  )
}

export default Footer
