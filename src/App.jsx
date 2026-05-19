import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
    navLinks,
    heroData,
    services,
    portfolioItems,
    portfolioProjects,
    aboutData,
    serviceAreaGroups,
    pricingData,
    howItWorksSteps,
    contactDetails,
    footerData
} from "./data";

function encodeFormData(data) {
    return new URLSearchParams(data).toString();
}

function formatProjectLabel(value) {
    return value
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function BeforeAfterViewer({ beforeImage, afterImage, alt, value }) {
    return (
        <div
            className="comparison-slider"
            style={{ "--comparison-opacity": value / 100 }}
        >
            <img className="comparison-image" src={beforeImage} alt={`${alt} before`} />
            <div className="comparison-after">
                <img className="comparison-image" src={afterImage} alt={`${alt} after`} />
            </div>
            <span className="comparison-label comparison-label-before">Before</span>
            <span className="comparison-label comparison-label-after">After</span>
        </div>
    );
}

function PortfolioGallery({ items, activeIndex, onActiveIndexChange }) {
    const [comparisonValue, setComparisonValue] = useState(50);
    const activeItem = items[activeIndex] ?? null;
    const hasMultipleItems = items.length > 1;

    useLayoutEffect(() => {
        setComparisonValue(0);
    }, [activeItem?.id]);

    const showPreviousImage = () => {
        setComparisonValue(0);
        onActiveIndexChange(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
    };

    const showNextImage = () => {
        setComparisonValue(0);
        onActiveIndexChange(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
    };

    if (!activeItem) {
        return (
            <div className="portfolio-empty">
                <p>No portfolio images are available yet.</p>
            </div>
        );
    }

    return (
        <div className="portfolio-gallery">
            <div className="portfolio-stage">
                {hasMultipleItems && (
                    <button
                        className="gallery-nav gallery-nav-prev"
                        type="button"
                        aria-label="Previous portfolio image"
                        onClick={showPreviousImage}
                    >
                        ‹
                    </button>
                )}

                <figure className="portfolio-feature">
                    {activeItem.comparison ? (
                        <BeforeAfterViewer
                            beforeImage={activeItem.beforeImage}
                            afterImage={activeItem.afterImage}
                            alt={activeItem.alt}
                            value={comparisonValue}
                        />
                    ) : (
                        <img src={activeItem.image} alt={activeItem.alt} />
                    )}
                </figure>

                {hasMultipleItems && (
                    <button
                        className="gallery-nav gallery-nav-next"
                        type="button"
                        aria-label="Next portfolio image"
                        onClick={showNextImage}
                    >
                        ›
                    </button>
                )}

                {activeItem.comparison && (
                    <div className="comparison-controls" aria-label="Before and after image controls">
                        <button type="button" onClick={() => setComparisonValue(0)}>
                            Before
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={comparisonValue}
                            aria-label="Adjust before and after comparison"
                            onChange={(event) => setComparisonValue(Number(event.target.value))}
                        />
                        <button type="button" onClick={() => setComparisonValue(100)}>
                            After
                        </button>
                    </div>
                )}
            </div>

            {hasMultipleItems && (
                <div className="portfolio-thumbnails" aria-label="Portfolio image thumbnails">
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`portfolio-thumbnail ${index === activeIndex ? "active" : ""}`}
                            aria-label={`Show ${item.title}`}
                            onClick={() => {
                                setComparisonValue(0);
                                onActiveIndexChange(index);
                            }}
                        >
                            <img src={item.comparison ? item.afterImage : item.image} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function PortfolioProjectGrid({ projects, onSelectProject }) {
    return (
        <div className="portfolio-project-grid">
            {projects.map((project) => (
                <button
                    key={project.id}
                    type="button"
                    className="portfolio-project-card"
                    aria-label={`View ${project.label} portfolio collection`}
                    onClick={() => onSelectProject(project.id)}
                >
                    <img src={project.thumbnail} alt="" />
                    <span className="portfolio-project-title">{project.label}</span>
                    <span className="portfolio-project-meta">
                        <span aria-hidden="true" />
                        {project.count} {project.count === 1 ? "item" : "items"}
                    </span>
                </button>
            ))}
        </div>
    );
}

function VirtualThumbnailGrid({ items, onSelectItem }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="virtual-thumbnail-group">
            <div className="virtual-thumbnail-grid">
                {items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className="virtual-thumbnail-card"
                        aria-label={`Open ${item.title} before and after comparison`}
                        onClick={() => onSelectItem(item.id)}
                    >
                        <img src={item.afterImage} alt="" />
                    </button>
                ))}
            </div>
        </section>
    );
}

function VirtualShowcase({ title, items, activeIndex, onActiveIndexChange }) {
    const selectedItem = activeIndex === null ? null : items[activeIndex];

    const handleSelectItem = (itemId) => {
        const selectedIndex = items.findIndex((item) => item.id === itemId);
        onActiveIndexChange(Math.max(selectedIndex, 0));
    };

    if (items.length === 0) {
        return (
            <div className="portfolio-empty">
                <p>{title} examples coming soon.</p>
            </div>
        );
    }

    if (selectedItem) {
        return (
            <div className="virtual-detail">
                <button
                    type="button"
                    className="portfolio-back-button"
                    onClick={() => onActiveIndexChange(null)}
                >
                    Back to {title}
                </button>
                <PortfolioGallery
                    items={items}
                    activeIndex={activeIndex}
                    onActiveIndexChange={onActiveIndexChange}
                />
            </div>
        );
    }

    return (
        <div className="virtual-thumbnail-groups">
            <VirtualThumbnailGrid
                items={items}
                onSelectItem={handleSelectItem}
            />
        </div>
    );
}

function App() {
    const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
    const [activeTwilightIndex, setActiveTwilightIndex] = useState(null);
    const [activeStagingIndex, setActiveStagingIndex] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const bookingSectionRef = useRef(null);
    const bookingEmbedRef = useRef(null);

    const standardPortfolioItems = useMemo(() => (
        portfolioItems.filter((item) => item.category !== "virtual")
    ), []);

    const virtualPortfolioItems = useMemo(() => (
        portfolioItems.filter((item) => item.category === "virtual")
    ), []);

    const virtualTwilightItems = useMemo(() => (
        virtualPortfolioItems.filter((item) => item.categoryLabel === "Virtual Twilight")
    ), [virtualPortfolioItems]);

    const virtualStagingItems = useMemo(() => (
        virtualPortfolioItems.filter((item) => item.categoryLabel === "Virtual Staging")
    ), [virtualPortfolioItems]);

    const projectCards = useMemo(() => (
        portfolioProjects.map((project) => {
            const projectItems = standardPortfolioItems.filter((item) => item.projectAddress === project.id);
            const thumbnailItem = projectItems[0];

            return {
                ...project,
                count: projectItems.length,
                thumbnail: project.thumbnail ?? thumbnailItem?.image
            };
        }).filter((project) => project.thumbnail)
    ), [standardPortfolioItems]);

    const selectedProjectItems = useMemo(() => (
        selectedProject
            ? standardPortfolioItems.filter((item) => item.projectAddress === selectedProject)
            : []
    ), [selectedProject, standardPortfolioItems]);

    const selectedProjectLabel = selectedProject ? formatProjectLabel(selectedProject) : "";

    const handleSelectProject = (projectId) => {
        setSelectedProject(projectId);
        setActivePortfolioIndex(0);
    };

    const handleBackToProjects = () => {
        setSelectedProject(null);
        setActivePortfolioIndex(0);
    };

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

                    <div className="container">
                        {selectedProject ? (
                            <div className="portfolio-project-detail">
                                <button
                                    type="button"
                                    className="portfolio-back-button"
                                    onClick={handleBackToProjects}
                                >
                                    Back to projects
                                </button>
                                <div className="portfolio-project-heading">
                                    <h3>{selectedProjectLabel}</h3>
                                    <p>{selectedProjectItems.length} {selectedProjectItems.length === 1 ? "item" : "items"}</p>
                                </div>
                                <PortfolioGallery
                                    items={selectedProjectItems}
                                    activeIndex={activePortfolioIndex}
                                    onActiveIndexChange={setActivePortfolioIndex}
                                />
                            </div>
                        ) : projectCards.length > 0 ? (
                            <div className="portfolio-projects-section">
                                <div className="portfolio-section-heading">
                                    <h3>Projects</h3>
                                </div>
                                <PortfolioProjectGrid projects={projectCards} onSelectProject={handleSelectProject} />
                            </div>
                        ) : (
                            <div className="portfolio-empty">
                                <p>Project collections coming soon.</p>
                            </div>
                        )}
                    </div>

                    <div className="container">
                        <div className="virtual-showcase">
                            <div className="virtual-showcase-header">
                                <h3>Virtual Twilight</h3>
                            </div>
                            <VirtualShowcase
                                title="Virtual Twilight"
                                items={virtualTwilightItems}
                                activeIndex={activeTwilightIndex}
                                onActiveIndexChange={setActiveTwilightIndex}
                            />
                        </div>
                    </div>

                    <div className="container">
                        <div className="virtual-showcase virtual-showcase-secondary">
                            <div className="virtual-showcase-header">
                                <h3>Virtual Staging</h3>
                            </div>
                            <VirtualShowcase
                                title="Virtual Staging"
                                items={virtualStagingItems}
                                activeIndex={activeStagingIndex}
                                onActiveIndexChange={setActiveStagingIndex}
                            />
                        </div>
                    </div>
                </section>

                <section id="services" className="section section-soft">
                    <div className="container narrow-header">
                        <h2>Services</h2>
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
                                <div className="contact-icon contact-icon-email">✉</div>
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
                                    placeholder="Tell me about your project..."
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
                            {footerData.socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    aria-label={link.label}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {link.logoUrl && (
                                        <img
                                            src={link.logoUrl}
                                            alt=""
                                            onError={(event) => {
                                                event.currentTarget.hidden = true;
                                                event.currentTarget.nextElementSibling.hidden = false;
                                            }}
                                        />
                                    )}
                                    <span hidden={Boolean(link.logoUrl)}>{link.shortLabel}</span>
                                </a>
                            ))}
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
