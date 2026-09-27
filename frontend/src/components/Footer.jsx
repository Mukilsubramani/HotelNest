// Page footer with navigation links and newsletter
import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="mdb-footer">
      <div className="mdb-footer-main">
        <div className="mdb-footer-col brand-col">
          <div className="footer-brand-title">Hotel Nest</div>
          <p className="footer-copyright">
            &copy; 2026 Copyright:{' '}
            <a href="/" rel="noreferrer">
              Hotel Nest
            </a>
          </p>
        </div>

        <div className="mdb-footer-col">
          <h4 className="footer-heading">STORE</h4>
          <ul className="footer-links">
            <li><a href="#!">About us</a></li>
            <li><a href="#!">Find store</a></li>
            <li><a href="#!">Categories</a></li>
            <li><a href="#!">Blogs</a></li>
          </ul>
        </div>

        <div className="mdb-footer-col">
          <h4 className="footer-heading">INFORMATION</h4>
          <ul className="footer-links">
            <li><a href="#!">Help center</a></li>
            <li><a href="#!">Money refund</a></li>
            <li><a href="#!">Shipping info</a></li>
            <li><a href="#!">Refunds</a></li>
          </ul>
        </div>

        <div className="mdb-footer-col">
          <h4 className="footer-heading">SUPPORT</h4>
          <ul className="footer-links">
            <li><a href="#!">Help center</a></li>
            <li><a href="#!">Documents</a></li>
            <li><a href="#!">Account restore</a></li>
            <li><a href="#!">My orders</a></li>
          </ul>
        </div>

        <div className="mdb-footer-col newsletter-col">
          <h4 className="footer-heading">NEWSLETTER</h4>
          <p className="newsletter-desc">
            Stay in touch with latest updates about our products and offers
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              JOIN
            </button>
          </form>
          {subscribed && (
            <p className="newsletter-success">Thank you for subscribing!</p>
          )}
        </div>
      </div>

      <div className="mdb-footer-bottom">
        <div className="payment-badges">
          <span className="pay-badge">VISA</span>
          <span className="pay-badge">MasterCard</span>
          <span className="pay-badge">AMEX</span>
          <span className="pay-badge">PayPal</span>
        </div>
        <div className="language-selector">
          <span>🇺🇸 English ▼</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
