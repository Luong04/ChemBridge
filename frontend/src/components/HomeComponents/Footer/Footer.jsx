import React from 'react'
import { assets } from '../../../assets/assets'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          {/* <img src={assets.logo} alt="" /> */}
          <h2>ChemBridge Corporation</h2>
          <ul>
            <li>Minh Tam</li>
            <li>Le Trinh</li>
            <li>Khanh Linh</li>
            <li>Phuong Thao</li>
            <li>Dang Trang</li>
          </ul>
          <div className="footer-social-icons">
            {/* <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" /> */}
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Contact us</h2>
          <ul>
            <li>Phone:  +84-984-884-285</li>
            <li>Email : lulune1205@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 ChemBridge Team - All Right Reserved.</p>
    </div>
  )
}

export default Footer
