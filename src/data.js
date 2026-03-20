export const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
];

export const heroData = {
    title: "Capturing Homes.\nElevating Listings.",
    subtitle:
        "Professional real estate photography that makes properties shine.",
    primaryCta: {
        label: "Get Started",
        href: "#booking"
    },
    secondaryCta: {
        label: "View Portfolio",
        href: "#portfolio"
    }
};

export const services = [
    {
        title: "Interior Photography",
        description:
            "Beautiful interior shots that highlight each room's layout, design, and standout features.",
        comingSoon: false
    },
    {
        title: "Exterior Photography",
        description:
            "Beautiful exterior shots that show off your property's best angles, landscaping, and curb appeal.",
        comingSoon: false
    },
    {
        title: "Floor Plans",
        description:
            "Detailed floor plans that help buyers understand the property layout and flow.",
        comingSoon: true
    },
    {
        title: "Video Tours",
        description:
            "Walkthrough-style video coverage that helps listings feel more immersive and engaging.",
        comingSoon: true
    },
    {
        title: "Virtual Staging",
        description:
            "Digital furniture and decor placement to help buyers visualize the space.",
        comingSoon: true
    },
    {
        title: "Aerial Photography",
        description:
            "Drone photography showcasing the property and surrounding area from above.",
        comingSoon: true
    }
];

export const portfolioItems = [
    {
        title: "Modern Exterior",
        category: "exterior",
        image: "/images/portfolio-exterior-1.jpg",
        alt: "Front exterior of a modern home"
    },
    {
        title: "Bright Kitchen",
        category: "interior",
        image: "/images/portfolio-interior-1.jpg",
        alt: "Bright white kitchen interior"
    },
    {
        title: "Living Room",
        category: "interior",
        image: "/images/portfolio-interior-2.jpg",
        alt: "Wide living room interior"
    },
    {
        title: "Bedroom",
        category: "interior",
        image: "/images/portfolio-interior-3.jpg",
        alt: "Primary bedroom interior"
    },
    {
        title: "Bathroom Tub",
        category: "interior",
        image: "/images/portfolio-interior-4.jpg",
        alt: "Bathroom with freestanding tub"
    },
    {
        title: "Bathroom Vanity",
        category: "interior",
        image: "/images/portfolio-interior-5.jpg",
        alt: "Bathroom vanity and shower"
    },
    {
        title: "Patio",
        category: "exterior",
        image: "/images/portfolio-exterior-2.jpg",
        alt: "Outdoor patio seating area"
    },
    {
        title: "Dining Area",
        category: "interior",
        image: "/images/portfolio-interior-6.jpg",
        alt: "Dining area with large windows"
    }
];

export const aboutData = {
    heading: "About Me",
    intro: "Hi, I'm Alyssa!",
    paragraphs: [
        "I'm the photographer behind Alyssa Ashley Real Estate Media, and I love helping homes look their absolute best. With a background in broadcast production, I've spent years learning how to use lighting and composition to tell a story and now I bring that same approach to real estate.",
        "I believe great photos do more than just show a space, they help buyers imagine themselves living there. That's why I focus on creating bright, natural, and inviting images that highlight what makes each property unique.",
        "I'm based in Selma, TX and work with agents and homeowners who want an easy, reliable photography experience with beautiful results."
    ]
};

export const serviceAreaGroups = [
    {
        title: "San Antonio Area",
        areas: [
            "San Antonio",
            "Alamo Heights",
            "Leon Valley",
            "Helotes",
            "Windcrest",
            "Kirby",
            "Converse",
            "Live Oak",
            "Universal City",
            "Selma"
        ]
    },
    {
        title: "Northeast & I-35 Corridor",
        areas: [
            "Schertz",
            "Cibolo",
            "New Braunfels",
            "Marion",
            "McQueeney",
            "Geronimo",
            "Seguin"
        ]
    },
    {
        title: "Hill Country & North",
        areas: [
            "Boerne",
            "Bulverde",
            "Spring Branch",
            "Canyon Lake",
            "Blanco",
            "San Marcos",
            "Timberwood Park"
        ]
    }
];

export const pricingData = {
    promo: {
        eyebrow: "50% Off Spring Special!",
        text: "Book now and save 50% on all photography packages",
        subtext: "Promotion ends April 30, 2026"
    },
    packages: [
        {
            name: "Basic Listing",
            oldPrice: "$150",
            price: "$75",
            badge: "Save 50%",
            featured: false,
            description: "Best for small homes and rental listings.",
            features: [
                "Up to 20 professionally edited photos",
                "Interior and exterior coverage",
                "HDR image blending",
                "Vertical line correction",
                "MLS-ready images",
                "24–48 hour delivery"
            ]
        },
        {
            name: "Standard Listing",
            oldPrice: "$185",
            price: "$93",
            badge: "Save 50%",
            featured: true,
            description: "Perfect for most residential listings.",
            features: [
                "Up to 30 professionally edited photos",
                "Interior and exterior coverage",
                "HDR image blending",
                "Vertical line correction",
                "MLS-ready images",
                "24–48 hour delivery"
            ]
        },
        {
            name: "Premium Listing",
            oldPrice: "$225",
            price: "$113",
            badge: "Save 50%",
            featured: false,
            description: "Ideal for large homes and luxury listings.",
            features: [
                "Up to 40 professionally edited photos",
                "Interior and exterior coverage",
                "HDR image blending",
                "Vertical line correction",
                "MLS-ready images",
                "24–48 hour delivery"
            ]
        }
    ]
};

export const howItWorksSteps = [
    {
        number: "1",
        title: "Book Your Shoot",
        description:
            "Use the booking form to schedule a date and provide property details."
    },
    {
        number: "2",
        title: "I Photograph the Property",
        description:
            "Interior and exterior photos are captured to showcase the home at its best."
    },
    {
        number: "3",
        title: "Professional Editing",
        description:
            "Images are edited for brightness, color balance, and straight vertical lines."
    },
    {
        number: "4",
        title: "Delivery",
        description:
            "Photos are delivered via an online gallery within 24–48 hours ready for MLS and marketing."
    }
];

export const bookingSteps = [
    { number: 1, label: "Property" },
    { number: 2, label: "Schedule" },
    { number: 3, label: "Contact + Access" }
];

export const bookingPackages = [
    {
        id: "basic",
        title: "Basic – 20 Photos"
    },
    {
        id: "standard",
        title: "Standard – 30 Photos"
    },
    {
        id: "premium",
        title: "Premium – 40 Photos"
    }
];

export const contactDetails = {
    phone: "210-541-2522",
    email: "alyssa@alyssaashleymedia.com"
};

export const footerData = {
    description:
        "Professional real estate photography services that make your properties stand out in the market.",
    quickLinks: ["Home", "Portfolio", "Services", "About", "Contact"],
    services: [
        "Interior Photography",
        "Exterior Photography",
        "Video Tours",
        "Twilight Photography",
        "Virtual Staging"
    ],
    copyright: "© 2026 Alyssa Ashley Real Estate Media. All rights reserved."
};