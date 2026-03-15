import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var lucide: any;

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <header>
        <a routerLink="/" class="logo">
            <img src="logo.png" alt="OrbitBin Logo" style="height: 40px; margin-right: 10px; mix-blend-mode: multiply;">
            <div class="logo-text">Orbit<span>Bin</span></div>
        </a>
        <nav>
            <ul>
                <li><a routerLink="/">Home</a></li>
                <li><a href="#features">Smart Solutions</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a routerLink="/login" class="btn-login">Login Portal</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <video autoplay muted loop playsinline class="hero-video">
            <source src="https://cdn.pixabay.com/video/2020/08/18/47516-451623701_large.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <span class="hero-label">Reinventing Urban Hygiene</span>
            <h1>Smarter Cities Start With Smarter Waste.</h1>
            <p>OrbitBin empowers communities with real-time geo-tracking and AI-driven insights to create cleaner,
                healthier environments for everyone.</p>
            <a routerLink="/login" class="btn-primary">
                Start Tracking
                <i data-lucide="arrow-right"></i>
            </a>
        </div>
    </section>

    <section class="features" id="features">
        <div class="section-header" data-aos="fade-up">
            <span>Our Core Technology</span>
            <h2>Intelligence Meets Infrastructure</h2>
        </div>

        <div class="feature-grid">
            <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                <div class="icon-box">
                    <i data-lucide="map-pin"></i>
                </div>
                <h3>Precision Geo-Tracking</h3>
                <p>Pinpoint waste collection needs in real-time using advanced GPS tracking.</p>
            </div>

            <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                <div class="icon-box">
                    <i data-lucide="cpu"></i>
                </div>
                <h3>AI Waste Classification</h3>
                <p>Machine learning models analyze waste composition instantly for better recycling.</p>
            </div>

            <div class="feature-card" data-aos="fade-up" data-aos-delay="300">
                <div class="icon-box">
                    <i data-lucide="bar-chart-3"></i>
                </div>
                <h3>Operational Analytics</h3>
                <p>Data dashboards help city planners reduce costs and improve efficiency.</p>
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section class="how-it-works" id="work-flow">
        <div class="container">
            <div class="section-header">
                <span>The Process</span>
                <h2>How OrbitBin Works</h2>
            </div>
            <div class="steps-grid">
                <div class="step-item">
                    <div class="step-number">01</div>
                    <h4>Spot & Snap</h4>
                    <p>Capture a photo of the waste area using our intuitive mobile application.</p>
                </div>
                <div class="step-item">
                    <div class="step-number">02</div>
                    <h4>AI Analysis</h4>
                    <p>Our neural networks instantly classify the waste type and volume.</p>
                </div>
                <div class="step-item">
                    <div class="step-number">03</div>
                    <h4>Smart Routing</h4>
                    <p>The nearest collector is dispatched via optimized GPS pathfinding.</p>
                </div>
                <div class="step-item">
                    <div class="step-number">04</div>
                    <h4>Earn Rewards</h4>
                    <p>Get instant sustainability points and badges for your contribution.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- IMPACT METRICS -->
    <section class="impact-metrics">
        <div class="metrics-grid">
            <div class="metric-card">
                <h2 class="counter">450+</h2>
                <p>Tons of Waste Diverted</p>
            </div>
            <div class="metric-card">
                <h2 class="counter">12k</h2>
                <p>Registered Citizens</p>
            </div>
            <div class="metric-card">
                <h2 class="counter">98%</h2>
                <p>Collection Efficiency</p>
            </div>
            <div class="metric-card">
                <h2 class="counter">$2M</h2>
                <p>City Budget Saved</p>
            </div>
        </div>
    </section>

    <!-- CITIZEN REWARDS SECTION -->
    <section class="rewards">
        <div class="rewards-container">
            <div class="rewards-text">
                <span>Citizen Engagement</span>
                <h2>Clean Streets, Real Rewards</h2>
                <p>Our gamified platform rewards sustainability. Every report helps you climb the leaderboard and unlock exclusive community benefits.</p>
                <ul class="rewards-list">
                    <li><i data-lucide="check-circle"></i> Local Merchant Discounts</li>
                    <li><i data-lucide="check-circle"></i> Priority City Services</li>
                    <li><i data-lucide="check-circle"></i> Environmental MVP Badges</li>
                </ul>
                <a routerLink="/login" class="btn-primary">Join the Movement</a>
            </div>
            <div class="rewards-image">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" alt="Dashboard Preview">
            </div>
        </div>
    </section>


    <footer>
        <div class="footer-content">
            <div class="footer-brand">
                <h2>OrbitBin.</h2>
                <p>Pioneering the next generation of urban sanitation technology.</p>
            </div>

            <div class="footer-links">
                <h4>Platform</h4>
                <ul>
                    <li><a href="#">Citizen App</a></li>
                    <li><a href="#">Staff Portal</a></li>
                    <li><a href="#">City API</a></li>
                </ul>
            </div>

            <div class="footer-links">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            &copy; 2026 OrbitBin Systems Inc. All rights reserved.
        </div>
    </footer>
  `,
    styles: [`
        :host {
            --brand-blue: #0f172a;
            --brand-gold: #fbbf24;
            --brand-green: #10b981;
            --text-main: #334155;
            --text-light: #64748b;
            --bg-light: #f8fafc;
            --white: #ffffff;
            --glass: rgba(255, 255, 255, 0.95);
            display: block;
        }

        /* NAVIGATION */
        header {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1rem 5%;
            z-index: 1000;
            background: var(--glass);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .logo img {
            height: 40px;
        }

        .logo-text {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--brand-blue);
        }

        .logo-text span {
            color: var(--brand-green);
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2.5rem;
            align-items: center;
            margin: 0;
            padding: 0;
        }

        nav a {
            text-decoration: none;
            color: var(--text-main);
            font-weight: 500;
            position: relative;
        }

        nav a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: var(--brand-green);
            transition: width 0.3s;
        }

        nav a:hover::after {
            width: 100%;
        }

        .btn-login {
            padding: 0.6rem 1.8rem;
            background: var(--brand-blue);
            color: white !important;
            border-radius: 50px;
            font-weight: 600;
        }

        .btn-login::after {
            display: none;
        }

        .btn-login:hover {
            background: var(--brand-green);
        }

        /* HERO */
        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 5%;
            overflow: hidden;
            background: #0f172a; /* Fallback */
        }

        .hero-video {
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: 0;
            transform: translate(-50%, -50%);
            object-fit: cover;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.5));
            z-index: 1;
        }

        .hero-content {
            position: relative;
            max-width: 900px;
            z-index: 10;
            text-align: center;
            margin: 0 auto;
            color: white;
        }

        .hero-label {
            display: inline-block;
            background: rgba(16, 185, 129, 0.1);
            color: var(--brand-green);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .hero h1 {
            font-family: 'Playfair Display', serif;
            font-size: 4.5rem;
            line-height: 1.1;
            color: white;
            margin-bottom: 1.5rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .hero p {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2.5rem;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .btn-primary {
            background: var(--brand-green);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn-primary:hover {
            background: #0ea371;
            color: white;
        }

        /* FEATURES */
        .features {
            padding: 8rem 5%;
            background: white;
            text-align: center;
        }

        .section-header span {
            color: var(--brand-green);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.9rem;
        }

        .section-header h2 {
            font-size: 2.5rem;
            color: var(--brand-blue);
            margin: 10px 0 50px;
            font-family: 'Playfair Display', serif;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }

        .feature-card {
            background: var(--bg-light);
            padding: 40px;
            border-radius: 20px;
            transition: 0.3s;
            text-align: left;
        }

        .feature-card:hover {
            background: white;
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        .icon-box {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 25px;
            color: var(--brand-green);
        }

        .feature-card h3 {
            font-size: 1.3rem;
            margin-bottom: 15px;
            color: var(--brand-blue);
        }

        .feature-card p {
            color: var(--text-light);
            line-height: 1.6;
        }

        /* HOW IT WORKS */
        .how-it-works {
            padding: 8rem 5%;
            background: var(--bg-light);
        }

        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            margin-top: 60px;
        }

        .step-item {
            position: relative;
            text-align: center;
        }

        .step-number {
            font-size: 3.5rem;
            font-weight: 900;
            color: rgba(16, 185, 129, 0.1);
            line-height: 1;
            margin-bottom: -20px;
        }

        .step-item h4 {
            font-size: 1.4rem;
            color: var(--brand-blue);
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
        }

        /* IMPACT METRICS */
        .impact-metrics {
            padding: 6rem 5%;
            background: var(--brand-blue);
            color: white;
            text-align: center;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 50px;
        }

        .metric-card h2 {
            font-size: 3.5rem;
            font-weight: 800;
            color: var(--brand-green);
            margin-bottom: 10px;
        }

        .metric-card p {
            font-size: 1.1rem;
            opacity: 0.8;
        }

        /* REWARDS SECTION */
        .rewards {
            padding: 8rem 5%;
            background: white;
        }

        .rewards-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 80px;
            align-items: center;
        }

        .rewards-text span {
            color: var(--brand-green);
            font-weight: 700;
            text-transform: uppercase;
        }

        .rewards-text h2 {
            font-size: 3rem;
            font-family: 'Playfair Display', serif;
            color: var(--brand-blue);
            margin: 15px 0 25px;
        }

        .rewards-list {
            list-style: none;
            padding: 0;
            margin: 30px 0;
        }

        .rewards-list li {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            font-weight: 500;
            color: var(--text-main);
        }

        .rewards-list i {
            color: var(--brand-green);
        }

        .rewards-image img {
            width: 100%;
            border-radius: 30px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }


        /* FOOTER */
        footer {
            background: var(--brand-blue);
            color: #94a3b8;
            padding: 5rem 5% 2rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 50px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 4rem;
            margin-bottom: 2rem;
        }

        .footer-brand h2,
        .footer-links h4 {
            color: white;
            margin-bottom: 1rem;
        }

        .footer-links ul {
            list-style: none;
            padding: 0;
        }

        .footer-links li {
            margin-bottom: 10px;
        }

        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
        }

        .footer-links a:hover {
            color: var(--brand-gold);
        }

        .footer-bottom {
            text-align: center;
            font-size: 0.9rem;
        }

        @media (max-width: 968px) {
            nav ul {
                display: none;
            }

            .hero h1 {
                font-size: 2.8rem;
            }

            .hero::before {
                display: none;
            }

            .footer-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
        }
  `]
})
export class LandingComponent implements OnInit {

    ngOnInit() {
        // Re-initialize lucide icons since this is an SPA navigation
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }
}
