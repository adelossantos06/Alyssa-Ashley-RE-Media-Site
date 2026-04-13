import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    navLinks,
    heroData,
    services,
    portfolioItems,
    aboutData,
    serviceAreaGroups,
    pricingData,
    howItWorksSteps,
    contactDetails,
    footerData
} from "./data";

const portfolioFilters = [
    { label: "All", value: "all" },
    { label: "Interior", value: "interior" },
    { label: "Exterior", value: "exterior" }
];

const portfolioHoverLabel = "Veramendi Model Home in New Braunfels, TX";

function encodeFormData(data) {
    return new URLSearchParams(data).toString();
}

function App() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const bookingSectionRef = useRef(null);
    const bookingEmbedRef = useRef(null);

    const filteredPortfolio = useMemo(() => {
        if (activeFilter === "all") return portfolioItems;
        return portfolioItems.filter((item) => item.category === activeFilter);
    }, [activeFilter]);

    const handleContactChange = (event) => {
        const { name, value } = event.target;
        setContactForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContactSubmit = async (event) => {
        event.preventDefault();

        try {
            await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: encodeFormData({
                    "form-name": "contact",
                    "bot-field": "",
                    ...contactForm
                })
            });

            alert("Thanks! Your message was sent successfully.");
            setContactForm({
                name: "",
                email: "",
                phone: "",
                message: ""
            });
        } catch (error) {
            alert("Something went wrong while sending your message. Please try again.");
        }
    };

    useEffect(() => {
        const embedContainer = bookingEmbedRef.current;

        if (!embedContainer) {
            return undefined;
        }

        embedContainer.innerHTML = "";

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://form.jotform.com/jsform/260996807429069";
        script.async = true;
        embedContainer.appendChild(script);

        return () => {
            embedContainer.innerHTML = "";
        };
    }, []);

    return (
        <div className="site-shell">
            <header className="site-header">
                <div className="container header-inner">
                    <a className="brand" href="#home" aria-label="Alyssa Ashley Real Estate Media home">
                        <img
                            className="brand-logo"
                            src="/images/logo.png"
                            alt="Alyssa Ashley Real Estate Media logo"
                        />
                    </a>

                    <nav className="main-nav" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className="nav-link">
                                {link.label}
                            </a>
                        ))}
                        <a href="#booking" className="btn btn-primary nav-cta">
                            Book Now
                        </a>
                    </nav>
                </div>
            </header>

            <main>
                <section id="home" className="hero-section">
                    <div className="hero-overlay" />
                    <img
                        className="hero-image"
                        src="/images/hero-home.jpg"
                        alt="Luxury home exterior"
                    />
                    <div className="container hero-content">
                        <h1>
                            {heroData.title.split("\n").map((line) => (
                                <span key={line} className="hero-line">
                                    {line}
                                </span>
                            ))}
                        </h1>
                        <p className="hero-subtitle">{heroData.subtitle}</p>
                        <div className="hero-actions">
                            <a href={heroData.primaryCta.href} className="btn btn-primary btn-lg">
                                {heroData.primaryCta.label}
                            </a>
                            <a href={heroData.secondaryCta.href} className="btn btn-secondary btn-lg">
                                {heroData.secondaryCta.label}
                            </a>
                        </div>
                    </div>
                </section>

                <section id="portfolio" className="section section-light">
                    <div className="container narrow-header">
                        <h2>My Portfolio</h2>
                        <p>Explore my collection of stunning real estate photography</p>
                    </div>

                    <div className="portfolio-filters">
                        {portfolioFilters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                className={`filter-pill ${activeFilter === filter.value ? "active" : ""}`}
                                onClick={() => setActiveFilter(filter.value)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                        <div className="container">
                            <div className="portfolio-grid">
                                {filteredPortfolio.map((item) => (
                                    <article key={item.title} className="portfolio-card">
                                        <img src={item.image} alt={item.alt} />
                                        <div className="portfolio-card-overlay">
                                            <p>{portfolioHoverLabel}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                </section>

                <section id="services" className="section section-soft">
                    <div className="container narrow-header">
                        <h2>Our Services</h2>
                        <p>Comprehensive photography solutions tailored for real estate professionals</p>
                    </div>

                    <div className="container">
                        <div className="service-grid">
                            {services.map((service) => (
                                <article
                                    key={service.title}
                                    className={`service-card ${service.comingSoon ? "muted" : ""}`}
                                >
                                    <div className="service-icon" aria-hidden="true">
                                        <span>□</span>
                                    </div>
                                    <div className="service-card-header">
                                        <h3>{service.title}</h3>
                                        {service.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
                                    </div>
                                    <p>{service.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="about" className="section section-light">
                    <div className="container centered-copy">
                        <h2>{aboutData.heading}</h2>
                        <p className="about-intro">{aboutData.intro}</p>
                        <div className="about-copy">
                            {aboutData.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section section-soft">
                    <div className="container narrow-header">
                        <h2>Service Areas</h2>
                        <p>
                            We proudly provide real estate photography services across the greater San Antonio
                            and Hill Country region, including:
                        </p>
                    </div>

                    <div className="container">
                        <div className="area-grid">
                            {serviceAreaGroups.map((group) => (
                                <article key={group.title} className="area-card">
                                    <h3>{group.title}</h3>
                                    <ul>
                                        {group.areas.map((area) => (
                                            <li key={area}>{area}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>

                        <div className="service-area-note">
                            <h3>Not sure if we cover your area?</h3>
                            <p>
                                If your property is nearby but not listed, feel free to <a href="#contact">reach out</a>.
                                We&apos;re happy to accommodate surrounding areas when possible.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section section-light">
                    <div className="container narrow-header">
                        <h2>Pricing</h2>
                        <p>
                            Professional real estate photography designed to help listings stand out and attract
                            buyers. All packages include professionally edited images ready for MLS and marketing.
                        </p>
                    </div>

                    <div className="container">
                        <div className="pricing-promo-banner" role="note" aria-label="New customer promotion">
                            <span className="pricing-promo-eyebrow">Limited-Time Offer</span>
                            <p>
                                First-time customers get 50% off their first shoot — use code <strong><u>NEW50</u></strong>.
                            </p>
                        </div>
                    </div>

                    <div className="container narrow-header narrow-header-tight">
                        <h3>Photography Packages</h3>
                    </div>

                    <div className="container">
                        <div className="pricing-grid">
                            {pricingData.packages.map((pkg) => (
                                <article
                                    key={pkg.name}
                                    className={`pricing-card ${pkg.featured ? "featured" : ""}`}
                                >
                                    <h4>{pkg.name}</h4>
                                    <div className="current-price">{pkg.price}</div>

                                    <ul className="pricing-features">
                                        {pkg.features.map((feature) => (
                                            <li key={feature}>{feature}</li>
                                        ))}
                                    </ul>

                                    <p className="pricing-description">{pkg.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section section-soft">
                    <div className="container narrow-header">
                        <h2>How It Works</h2>
                    </div>

                    <div className="container">
                        <div className="steps-grid">
                            {howItWorksSteps.map((step) => (
                                <article key={step.number} className="step-card">
                                    <div className="step-number">{step.number}</div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="booking" className="section section-light" ref={bookingSectionRef}>
                    <div className="container narrow-header">
                        <h2>Book Your Shoot</h2>
                        <p>Use the booking form below to submit your shoot request.</p>
                    </div>

                    <div className="container">
                        <div className="pricing-promo-banner" role="note" aria-label="New customer promotion">
                            <span className="pricing-promo-eyebrow">Limited-Time Offer</span>
                            <p>
                                First-time customers get 50% off their first shoot — use code <strong><u>NEW50</u></strong>.
                            </p>
                        </div>
                    </div>

                    <div className="container">
                        <div className="booking-card booking-embed-shell">
                            <div ref={bookingEmbedRef} className="booking-embed" aria-label="Booking form" />
                        </div>
                    </div>
                </section>

                <section id="contact" className="section section-soft">
                    <div className="container narrow-header">
                        <h2>Get In Touch</h2>
                        <p>Have a question? I&apos;m here to help.</p>
                    </div>

                    <div className="container contact-grid">
                        <div className="contact-info">
                            <div className="contact-info-item">
                                <div className="contact-icon">☎</div>
                                <div>
                                    <h3>Phone</h3>
                                    <p>{contactDetails.phone}</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon">✉</div>
                                <div>
                                    <h3>Email</h3>
                                    <p>{contactDetails.email}</p>
                                </div>
                            </div>
                        </div>

                        <form
                            className="contact-form"
                            name="contact"
                            method="POST"
                            data-netlify="true"
                            data-netlify-honeypot="bot-field"
                            onSubmit={handleContactSubmit}
                        >
                            <input type="hidden" name="form-name" value="contact" />
                            <input type="hidden" name="bot-field" />
                            <label className="field">
                                <span>Name *</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={contactForm.name}
                                    onChange={handleContactChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </label>

                            <label className="field">
                                <span>Email *</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={contactForm.email}
                                    onChange={handleContactChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </label>

                            <label className="field">
                                <span>Phone</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={contactForm.phone}
                                    onChange={handleContactChange}
                                    placeholder="(555) 123-4567"
                                />
                            </label>

                            <label className="field">
                                <span>Message *</span>
                                <textarea
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactChange}
                                    rows="6"
                                    placeholder="Tell us about your project..."
                                    required
                                />
                            </label>

                            <button type="submit" className="btn btn-primary btn-full">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <img
                            className="footer-logo"
                            src="/images/logo.png"
                            alt="Alyssa Ashley Real Estate Media logo"
                        />
                        <p>{footerData.description}</p>
                        <div className="social-row">
                            <a href="#" aria-label="Instagram">
                                IG
                            </a>
                            <a href="#" aria-label="Facebook">
                                FB
                            </a>
                            <a href="#" aria-label="Twitter">
                                X
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                IN
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            {footerData.quickLinks.map((link) => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase()}`}>{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3>Services</h3>
                        <ul className="footer-links">
                            {footerData.services.map((service) => (
                                <li key={service}>{service}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="container footer-bottom">
                    <p>{footerData.copyright}</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
