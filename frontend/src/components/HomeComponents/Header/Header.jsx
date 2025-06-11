import React from 'react'
import './Header.css'
import { assets } from '../../../assets/assets'
import { Link } from 'react-router-dom'


const Header = () => {
  return (
    <div className="header">
        <img src={assets.header_img} alt="" />
      <div className="header-contents">
        <h2>ChemBridge - Hóa học online </h2>
        <p>Nền tảng hỗ trợ học trực tuyến</p>
        <Link to="/main"><button>Học ngay</button></Link>
      </div>
    </div>
  )
}

export default Header
