import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../index.css";
import './Navigation.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning!");
    else if (hour < 18) setGreeting("Good Afternoon!");
    else setGreeting("Good Evening!");
  }, []);

  return (
    <div className="home-container">
      <style>{`
        .home-container {
          background-color: #F7F7FB;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #171717;
          padding: 24px;
        }

        .hero-card {
          max-width: 1200px;
          margin: 0 auto 40px auto;
          background: #FFFFFF;
          border: 1px solid #E8E7F0;
          border-radius: 24px;
          padding: 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          color: #171717;
          margin: 0 0 20px 0;
          letter-spacing: -0.03em;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #6B7280;
          margin-bottom: 32px;
          max-width: 520px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .btn-primary-hero {
          background-color: #171717;
          color: #FFFFFF;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary-hero:hover {
          background-color: #6D5CE7;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(109, 92, 231, 0.25);
        }

        .btn-secondary-hero {
          background-color: #FFFFFF;
          color: #171717;
          border: 1px solid #E8E7F0;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary-hero:hover {
          background-color: #F7F7FB;
          border-color: #CBD5E1;
        }

        .hero-illustration-wrapper {
          width: 100%;
          background: #EEEAFE;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
        }

        .hero-illustration-img {
          width: 100%;
          height: auto;
          max-height: 380px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(109, 92, 231, 0.15);
        }

        /* Features Section */
        .features-section {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          padding: 20px 0 40px 0;
        }

        .badge-pill-features {
          display: inline-block;
          background-color: #EEEAFE;
          color: #6D5CE7;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .features-main-heading {
          font-size: 2.5rem;
          font-weight: 800;
          color: #171717;
          margin: 0 0 12px 0;
          letter-spacing: -0.03em;
        }

        .features-subheading {
          font-size: 1.1rem;
          color: #6B7280;
          margin: 0 0 44px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: #FFFFFF;
          border: 1px solid #E8E7F0;
          border-radius: 20px;
          padding: 36px 32px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(109, 92, 231, 0.08);
          border-color: #D6D1F9;
        }

        .feature-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-box-purple { background-color: #A58BFF; color: #FFFFFF; }
        .icon-box-blue { background-color: #3B82F6; color: #FFFFFF; }
        .icon-box-green { background-color: #4ADE80; color: #FFFFFF; }

        .feature-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #171717;
          margin: 0 0 12px 0;
        }

        .feature-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #6B7280;
          margin: 0;
        }

        /* Footer */
        .home-footer {
          max-width: 1200px;
          margin: 40px auto 0 auto;
          background: #FFFFFF;
          border: 1px solid #E8E7F0;
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          color: #6B7280;
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero-card {
            grid-template-columns: 1fr;
            padding: 28px;
            gap: 28px;
          }

          .hero-title {
            font-size: 2.25rem;
          }

          .features-main-heading {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero Section Card */}
      <section className="hero-card">
        <div className="hero-content">
          <h1 className="hero-title">
            {greeting} Take Control of Your Money 💰
          </h1>
          <p className="hero-subtitle">
            The all-in-one dashboard to monitor spending, build budgets, and reach your financial goals with confidence. Real-time insights, zero hassle.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/expenses") : "/signup")}
              className="btn-primary-hero"
            >
              {user ? `Go to ${user.role === "admin" ? "Admin Panel" : "Dashboard"}` : "Get Started"} →
            </button>
            <button
              onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/expenses") : "/signup")}
              className="btn-secondary-hero"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-illustration-wrapper">
          <img
            src="/budget_hero_illustration.png"
            alt="Budget Tracker Financial Dashboard"
            className="hero-illustration-img"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <span className="badge-pill-features">FEATURES</span>
        <h2 className="features-main-heading">Built for modern money management</h2>
        <p className="features-subheading">Everything you need, designed to be simple.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box icon-box-purple">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3 className="feature-title">Track Every Penny</h3>
            <p className="feature-text">
              Log expenses and income instantly with smart categorization, receipts, and real-time balance updates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box icon-box-blue">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 9l-5 5-4-4-3 3" />
              </svg>
            </div>
            <h3 className="feature-title">Smart Analytics</h3>
            <p className="feature-text">
              Visualize spending trends, budgeting insights, and forecasts to make informed financial decisions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box icon-box-green">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-text">
              Bank-level encryption and privacy-first design to keep your data safe and secure at all times.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p style={{ margin: 0 }}>&copy; 2025 Budget Tracker. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
