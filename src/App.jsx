import React, { useMemo, useRef, useState } from "react";
import {
    navLinks,
    heroData,
    services,
    portfolioItems,
    aboutData,
    serviceAreaGroups,
    pricingData,
    howItWorksSteps,
    bookingSteps,
    bookingPackages,
    contactDetails,
    footerData
} from "./data";

const portfolioFilters = [
    { label: "All", value: "all" },
    { label: "Interior", value: "interior" },
    { label: "Exterior", value: "exterior" }
];

const initialBookingForm = {
    streetAddress: "",
    city: "",
    state: "TX",
    zipCode: "",
    squareFootage: "",
    bedrooms: "",
    bathrooms: "",
    occupancy: "vacant",
    package: "standard",
    preferredDate: "",
    preferredTime: "",
    alternateDate: "",
    alternateTime: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
    accessType: "meet-onsite",
    accessDetails: ""
};

const packagePricingById = {
    basic: "Basic Listing",
    standard: "Standard Listing",
    premium: "Premium Listing"
};

const accessTypeOptions = [
    {
        value: "meet-onsite",
        title: "I will meet them on-site",
        description: "You or an agent will be present during the shoot."
    },
    {
        value: "lockbox",
        title: "Lockbox on property",
        description: "Provide lockbox details and entry instructions below."
    },
    {
        value: "remote-access",
        title: "Agent will provide access remotely",
        description: "Arrangements will be made before the shoot."
    },
    {
        value: "other",
        title: "Other",
        description: "Share the access plan and any special notes below."
    }
];

function encodeFormData(data) {
    return new URLSearchParams(data).toString();
}

function App() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingForm, setBookingForm] = useState(initialBookingForm);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const bookingSectionRef = useRef(null);

    const filteredPortfolio = useMemo(() => {
        if (activeFilter === "all") return portfolioItems;
        return portfolioItems.filter((item) => item.category === activeFilter);
    }, [activeFilter]);

    const selectedPackagePricing = useMemo(() => {
        const selectedPackageName = packagePricingById[bookingForm.package];
        return pricingData.packages.find((pkg) => pkg.name === selectedPackageName) ?? null;
    }, [bookingForm.package]);

    const handleBookingChange = (event) => {
        const { name, value } = event.target;
        setBookingForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContactChange = (event) => {
        const { name, value } = event.target;
        setContactForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const scrollBookingSectionIntoView = () => {
        window.requestAnimationFrame(() => {
            bookingSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    };

    const nextBookingStep = () => {
        setBookingStep((prev) => Math.min(prev + 1, 3));
        scrollBookingSectionIntoView();
    };

    const prevBookingStep = () => {
        setBookingStep((prev) => Math.max(prev - 1, 1));
        scrollBookingSectionIntoView();
    };

    const handleBookingSubmit = async (event) => {
        event.preventDefault();

        try {
            await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: encodeFormData({
                    "form-name": "booking",
                    "bot-field": "",
                    ...bookingForm
                })
            });

            alert("Thanks! Your booking request was submitted successfully.");
            setBookingForm(initialBookingForm);
            setBookingStep(1);
        } catch (error) {
            alert("Something went wrong while submitting your booking. Please try again.");
        }
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

                    <div className="container pricing-promo-wrap">
                        <div className="pricing-promo">
                            <div className="promo-title">🎉 {pricingData.promo.eyebrow}</div>
                            <div className="promo-text">{pricingData.promo.text}</div>
                            <div className="promo-subtext">{pricingData.promo.subtext}</div>
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
                                    <div className="old-price">{pkg.oldPrice}</div>
                                    <div className="current-price">{pkg.price}</div>
                                    <div className="save-badge">{pkg.badge}</div>

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
                        <p>Schedule your real estate shoot in three simple steps.</p>
                    </div>

                    <div className="container">
                        <div className="booking-progress">
                            {bookingSteps.map((step, index) => (
                                <div key={step.number} className="booking-progress-item">
                                    <div className={`booking-step-circle ${bookingStep === step.number ? "active" : ""}`}>
                                        {step.number}
                                    </div>
                                    <div className="booking-step-label">{step.label}</div>
                                    {index < bookingSteps.length - 1 && <div className="booking-step-line" />}
                                </div>
                            ))}
                        </div>

                        <form
                            className="booking-card"
                            name="booking"
                            method="POST"
                            data-netlify="true"
                            data-netlify-honeypot="bot-field"
                            onSubmit={handleBookingSubmit}
                        >
                            <input type="hidden" name="form-name" value="booking" />
                            <input type="hidden" name="bot-field" />
                            {bookingStep === 1 && (
                                <div className="booking-panel">
                                    <div className="panel-heading">
                                        <h3>Property Information</h3>
                                    </div>

                                    <label className="field">
                                        <span>Street Address *</span>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={bookingForm.streetAddress}
                                            onChange={handleBookingChange}
                                            placeholder="123 Main Street"
                                            required
                                        />
                                    </label>

                                    <div className="three-col">
                                        <label className="field">
                                            <span>City *</span>
                                            <input
                                                type="text"
                                                name="city"
                                                value={bookingForm.city}
                                                onChange={handleBookingChange}
                                                placeholder="San Antonio"
                                                required
                                            />
                                        </label>

                                        <label className="field">
                                            <span>State *</span>
                                            <input
                                                type="text"
                                                name="state"
                                                value={bookingForm.state}
                                                onChange={handleBookingChange}
                                                placeholder="TX"
                                                required
                                            />
                                        </label>

                                        <label className="field">
                                            <span>Zip Code *</span>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={bookingForm.zipCode}
                                                onChange={handleBookingChange}
                                                placeholder="78201"
                                                required
                                            />
                                        </label>
                                    </div>

                                    <label className="field">
                                        <span>Square Footage</span>
                                        <input
                                            type="text"
                                            name="squareFootage"
                                            value={bookingForm.squareFootage}
                                            onChange={handleBookingChange}
                                            placeholder="2,500"
                                        />
                                    </label>

                                    <div className="two-col">
                                        <label className="field">
                                            <span>Bedrooms</span>
                                            <select
                                                name="bedrooms"
                                                value={bookingForm.bedrooms}
                                                onChange={handleBookingChange}
                                            >
                                                <option value="">Select</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5+">5+</option>
                                            </select>
                                        </label>

                                        <label className="field">
                                            <span>Bathrooms</span>
                                            <select
                                                name="bathrooms"
                                                value={bookingForm.bathrooms}
                                                onChange={handleBookingChange}
                                            >
                                                <option value="">Select</option>
                                                <option value="1">1</option>
                                                <option value="1.5">1.5</option>
                                                <option value="2">2</option>
                                                <option value="2.5">2.5</option>
                                                <option value="3+">3+</option>
                                            </select>
                                        </label>
                                    </div>

                                    <fieldset className="field-group">
                                        <legend>Is the property currently occupied?</legend>
                                        <label className="radio-option">
                                            <input
                                                type="radio"
                                                name="occupancy"
                                                value="vacant"
                                                checked={bookingForm.occupancy === "vacant"}
                                                onChange={handleBookingChange}
                                            />
                                            <span>Vacant</span>
                                        </label>
                                        <label className="radio-option">
                                            <input
                                                type="radio"
                                                name="occupancy"
                                                value="owner occupied"
                                                checked={bookingForm.occupancy === "owner occupied"}
                                                onChange={handleBookingChange}
                                            />
                                            <span>Owner occupied</span>
                                        </label>
                                        <label className="radio-option">
                                            <input
                                                type="radio"
                                                name="occupancy"
                                                value="tenant occupied"
                                                checked={bookingForm.occupancy === "tenant occupied"}
                                                onChange={handleBookingChange}
                                            />
                                            <span>Tenant occupied</span>
                                        </label>
                                    </fieldset>

                                    <fieldset className="field-group">
                                        <legend>Photography Package *</legend>
                                        <div className="package-options">
                                            {bookingPackages.map((pkg) => (
                                                <label key={pkg.id} className="package-option">
                                                    <input
                                                        type="radio"
                                                        name="package"
                                                        value={pkg.id}
                                                        checked={bookingForm.package === pkg.id}
                                                        onChange={handleBookingChange}
                                                    />
                                                    <span>{pkg.title}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {selectedPackagePricing && (
                                            <div className="package-price-preview" aria-live="polite">
                                                <div className="package-price-copy">
                                                    <p className="package-price-label">Original Price:</p>
                                                    <p className="package-sale-label">
                                                        {pricingData.promo.eyebrow} Price:
                                                    </p>
                                                    <p className="package-price-deadline">
                                                        {pricingData.promo.subtext}
                                                    </p>
                                                </div>

                                                <div className="package-price-values">
                                                    <p className="package-old-price">
                                                        {selectedPackagePricing.oldPrice}
                                                    </p>
                                                    <p className="package-sale-price">
                                                        {selectedPackagePricing.price}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </fieldset>
                                </div>
                            )}

                            {bookingStep === 2 && (
                                <div className="booking-panel">
                                    <div className="panel-heading schedule-panel-heading">
                                        <div className="schedule-heading-mark" aria-hidden="true">
                                            02
                                        </div>
                                        <div>
                                            <h3>Schedule Your Shoot</h3>
                                            <p className="panel-subcopy">
                                                Typical shoots take 30-60 minutes depending on property size.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="two-col schedule-grid">
                                        <label className="field">
                                            <span>Preferred Date *</span>
                                            <input
                                                type="date"
                                                name="preferredDate"
                                                value={bookingForm.preferredDate}
                                                onChange={handleBookingChange}
                                                required
                                            />
                                        </label>

                                        <label className="field">
                                            <span>Preferred Time *</span>
                                            <select
                                                name="preferredTime"
                                                value={bookingForm.preferredTime}
                                                onChange={handleBookingChange}
                                                required
                                            >
                                                <option value="">Select a time</option>
                                                <option value="morning">Morning (8-11 AM)</option>
                                                <option value="midday">Midday (11 AM-2 PM)</option>
                                                <option value="afternoon">Afternoon (2-5 PM)</option>
                                                <option value="twilight">Twilight (6-7 PM)</option>
                                            </select>
                                        </label>

                                        <label className="field">
                                            <span>Alternate Date</span>
                                            <input
                                                type="date"
                                                name="alternateDate"
                                                value={bookingForm.alternateDate}
                                                onChange={handleBookingChange}
                                            />
                                        </label>

                                        <label className="field">
                                            <span>Alternate Time</span>
                                            <select
                                                name="alternateTime"
                                                value={bookingForm.alternateTime}
                                                onChange={handleBookingChange}
                                            >
                                                <option value="">Select a time</option>
                                                <option value="morning">Morning (8-11 AM)</option>
                                                <option value="midday">Midday (11 AM-2 PM)</option>
                                                <option value="afternoon">Afternoon (2-5 PM)</option>
                                                <option value="twilight">Twilight (6-7 PM)</option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className="booking-divider" />

                                    <label className="field">
                                        <span>Project Notes</span>
                                        <textarea
                                            name="notes"
                                            value={bookingForm.notes}
                                            onChange={handleBookingChange}
                                            rows="6"
                                            placeholder="Anything you want Alyssa to know about the property, seller prep, gate codes, special shots, or listing timeline..."
                                        />
                                    </label>
                                </div>
                            )}

                            {bookingStep === 3 && (
                                <div className="booking-panel">
                                    <div className="panel-heading schedule-panel-heading">
                                        <div className="schedule-heading-mark" aria-hidden="true">
                                            03
                                        </div>
                                        <div>
                                            <h3>Contact &amp; Property Access</h3>
                                            <p className="panel-subcopy">
                                                Share the best contact info and how Alyssa should access the property.
                                            </p>
                                        </div>
                                    </div>

                                    <label className="field">
                                        <span>Full Name *</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={bookingForm.name}
                                            onChange={handleBookingChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </label>

                                    <div className="two-col">
                                        <label className="field">
                                            <span>Email *</span>
                                            <input
                                                type="email"
                                                name="email"
                                                value={bookingForm.email}
                                                onChange={handleBookingChange}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </label>

                                        <label className="field">
                                            <span>Phone</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={bookingForm.phone}
                                                onChange={handleBookingChange}
                                                placeholder="(555) 123-4567"
                                            />
                                        </label>
                                    </div>

                                    <fieldset className="field-group">
                                        <legend>Property Access Type *</legend>
                                        <div className="access-type-options">
                                            {accessTypeOptions.map((option) => (
                                                <label key={option.value} className="access-type-option">
                                                    <input
                                                        type="radio"
                                                        name="accessType"
                                                        value={option.value}
                                                        checked={bookingForm.accessType === option.value}
                                                        onChange={handleBookingChange}
                                                    />
                                                    <span className="access-type-copy">
                                                        <span className="access-type-title">{option.title}</span>
                                                        <span className="access-type-description">
                                                            {option.description}
                                                        </span>
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>

                                    <label className="field">
                                        <span>Notes &amp; Special Instructions</span>
                                        <textarea
                                            name="accessDetails"
                                            value={bookingForm.accessDetails}
                                            onChange={handleBookingChange}
                                            rows="6"
                                            placeholder="Parking instructions, alarm codes, pets on property, lockbox details, gate codes, occupant notes, or anything else Alyssa should know before arrival."
                                        />
                                    </label>
                                </div>
                            )}

                            <div className="booking-actions">
                                <button
                                    type="button"
                                    className={`btn btn-ghost ${bookingStep === 1 ? "hidden" : ""}`}
                                    onClick={prevBookingStep}
                                >
                                    Back
                                </button>

                                {bookingStep < 3 ? (
                                    <button type="button" className="btn btn-primary" onClick={nextBookingStep}>
                                        Next
                                    </button>
                                ) : (
                                    <button type="submit" className="btn btn-primary">
                                        Submit Booking
                                    </button>
                                )}
                            </div>
                        </form>
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
