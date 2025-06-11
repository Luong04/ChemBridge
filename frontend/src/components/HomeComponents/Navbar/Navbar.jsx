import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { assets } from '../../../assets/assets'

const Navbar = () => {

  return (
    <div className="navbar">
        <Link to="/"><img src={assets.logo} width={100} height={100}  alt="" className="logo" /></Link>
        <div className="navbar-right">
            <ul className="navbar-menu">
                <Link to="/" className="nav">Home</Link>
                <a href="/#about" className="nav">About</a>
                <a href="/#footer" className="nav">Contact</a>
            </ul>
            <Link to="/login"><button>Sign In</button></Link>
        </div>
        
    </div>
  )
}

export default Navbar
