
import PropTypes from 'prop-types';

import React, { useState } from 'react';

import './App.css';

import { Facebook, X, Instagram, WhatsApp, Telegram , Close, Link } from '@mui/icons-material';

const ShareModal = ({ shareLink }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const toggleModal = () => setIsVisible(!isVisible);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        });
    };

    const platforms = [
        { icon: <Facebook style={{ color: 'white' }} />, link: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`, color: '#1877f2' },
        { icon: <X style={{ color: 'white' }} />, link: `https://twitter.com/intent/tweet?url=${shareLink}`, color: '#000000' },
        { icon: <Instagram style={{ color: 'white' }} />, link: `https://www.instagram.com/?url=${shareLink}`, color: '#e1306c' },
        { icon: <WhatsApp style={{ color: 'white' }} />, link: `https://wa.me/?text=${shareLink}`, color: '#25d366' },
        { icon: <Telegram style={{ color: 'white' }} />, link: `https://t.me/share/url?url=${shareLink}`, color: '#0088cc' }
    ];

    return (
        <div dir="rtl">


<button className="btn" onClick={toggleModal} type="button">
مشاركة  
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20px" width="20px">
            <path strokeLinecap="round" strokeWidth="2" stroke="#000" d="M15.2141 7.39294L8.68387 10.6581M8.68387 10.6581C8.19134 9.67492 7.17449 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C7.17449 15 8.19134 14.3251 8.68387 13.3419M8.68387 10.6581C8.88616 11.0619 9 11.5176 9 12C9 12.4824 8.88616 12.9381 8.68387 13.3419M15.2141 16.6071L8.68387 13.3419M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6ZM21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z"/>
        </svg>
    </button>




            {isVisible && (
                <div className={`popup ${isVisible ? 'show' : ''}`} >
                    <header>
                        <span>نافذة المشاركة</span>
                        <button 
                            className="close" 
                            type="button"
                            onClick={toggleModal} 
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                            aria-label="Close Modal"
                        >
                            <Close style={{ color: 'black' }} />
                        </button>
                    </header>
                    <div className="content">
                        <p>شارك الرابط عبر</p>
                        <ul className="icons">
                            {platforms.map((platform, index) => (
                                <li key={index} style={{ backgroundColor: platform.color, padding: '10px', borderRadius: '50%' }}>
                                    <a href={platform.link} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                                        {platform.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p style={{textAlign:"center"}}>أو نسخ الرابط</p>
                        <div className={`field ${isCopied ? 'active' : ''}`}>
                            <Link className="url-icon" />
                            <input type="text" readOnly value={shareLink} />
                            <button 
                            type="button"
                                onClick={copyToClipboard} 
                                style={{ backgroundColor: isCopied ? '#4CAF50' : '#008CBA', color: 'white' }}
                            >
                                {isCopied ? 'تم النسخ' : 'نسخ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


ShareModal.propTypes = {
    shareLink: PropTypes.string.isRequired,  // Validating shareLink as a required string
};
export default ShareModal;
