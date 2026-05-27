import { portfolioImageFiles } from "./portfolioImages";

export const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
];

export const heroData = {
    title: "Capturing Homes.\nElevating Listings.",
    subtitle:
        "Professional real estate photography for Selma, New Braunfels, San Antonio, and surrounding Texas Hill Country communities.",
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
        comingSoon: false
    },
    {
        title: "Virtual Staging & Twilight",
        description:
            "Digital furniture placement and twilight edits that help buyers visualize a home's potential and curb appeal.",
        comingSoon: false
    },
    {
        title: "Video Tours",
        description:
            "Walkthrough-style video coverage that helps listings feel more immersive and engaging.",
        comingSoon: true
    },
    {
        title: "Aerial Photography",
        description:
            "Drone photography showcasing the property and surrounding area from above.",
        comingSoon: true
    }
];

const portfolioCategories = {
    E: { category: "exterior", label: "Exterior" },
    I: { category: "interior", label: "Interior" },
    VT: { category: "virtual", label: "Virtual Twilight" },
    VS: { category: "virtual", label: "Virtual Staging" }
};

const comparisonStateMap = {
    1: "before",
    2: "after",
    before: "before",
    after: "after"
};

const sectionOrder = {
    exterior: 0,
    interior: 0,
    virtual: 1
};

const virtualTypeOrder = {
    VT: 0,
    VS: 1
};

const coverFileNames = new Set(["cover", "thumbnail"]);

const projectDisplayNameOverrides = {
    "sulpher sprgs": "sulpher springs"
};

function toTitleCase(value) {
    return value
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getProjectDisplayName(projectAddress) {
    const streetName = projectAddress.replace(/^\d+\s+/, "");
    return projectDisplayNameOverrides[streetName] ?? streetName;
}

function comparePortfolioItems(firstItem, secondItem) {
    if (firstItem.sectionOrder === sectionOrder.virtual && secondItem.sectionOrder === sectionOrder.virtual) {
        return (
            firstItem.virtualTypeOrder - secondItem.virtualTypeOrder ||
            firstItem.projectAddress.localeCompare(secondItem.projectAddress, undefined, { numeric: true, sensitivity: "base" }) ||
            firstItem.photoOrder - secondItem.photoOrder ||
            firstItem.title.localeCompare(secondItem.title, undefined, { numeric: true, sensitivity: "base" })
        );
    }

    return (
        firstItem.sectionOrder - secondItem.sectionOrder ||
        firstItem.projectAddress.localeCompare(secondItem.projectAddress, undefined, { numeric: true, sensitivity: "base" }) ||
        firstItem.photoOrder - secondItem.photoOrder ||
        firstItem.virtualTypeOrder - secondItem.virtualTypeOrder ||
        firstItem.category.localeCompare(secondItem.category, undefined, { numeric: true, sensitivity: "base" }) ||
        firstItem.title.localeCompare(secondItem.title, undefined, { numeric: true, sensitivity: "base" })
    );
}

function parseStandardPortfolioImage(parts, category) {
    const order = Number(parts.at(-1)) || 0;
    const projectAddress = parts.slice(1, -1).join(" ").toLowerCase() || "portfolio";
    const title = toTitleCase(`${projectAddress} ${order}`);

    return {
        title,
        projectAddress,
        state: null,
        pairKey: null,
        photoOrder: order,
        sectionOrder: sectionOrder[category.category]
    };
}

function parseProjectPortfolioImage(fileName) {
    const [projectFolder, imageFileName] = fileName.split("/");
    const nameWithoutExtension = imageFileName.replace(/\.[^.]+$/, "");
    const isCover = coverFileNames.has(nameWithoutExtension.toLowerCase());
    const parts = nameWithoutExtension
        .split("-")
        .map((part) => part.trim())
        .filter(Boolean);
    const order = isCover ? 0 : Number(parts.at(-1)) || 0;
    const projectAddress = isCover
        ? projectFolder.toLowerCase()
        : parts.slice(0, -1).join(" ").toLowerCase() || projectFolder.toLowerCase();
    const title = toTitleCase(`${projectAddress} ${order}`);

    return {
        id: fileName,
        fileName,
        title,
        category: "project",
        categoryLabel: "Project",
        image: `/images/portfolio/${fileName}`,
        alt: `Real estate photo of ${title.toLowerCase()}`,
        state: null,
        pairKey: null,
        projectAddress,
        projectFolder: projectFolder.toLowerCase(),
        sectionOrder: 0,
        photoOrder: order,
        virtualTypeOrder: 0,
        isCover
    };
}

function parseVirtualPortfolioImage(parts, categoryCode, category) {
    const ending = parts.at(-1)?.toLowerCase();
    const state = comparisonStateMap[ending] ?? null;
    const secondPartIsOrder = /^\d+$/.test(parts[1]);
    const secondToLastPartIsOrder = /^\d+$/.test(parts.at(-2));
    let addressParts = [];
    let photoOrder = 0;

    if (secondPartIsOrder) {
        photoOrder = Number(parts[1]) || 0;
        addressParts = state ? parts.slice(2, -1) : parts.slice(2);
    } else if (secondToLastPartIsOrder) {
        photoOrder = Number(parts.at(-2)) || 0;
        addressParts = state ? parts.slice(1, -2) : parts.slice(1, -1);
    } else {
        photoOrder = 1;
        addressParts = state ? parts.slice(1, -1) : parts.slice(1);
    }

    const projectAddress = addressParts.join(" ").toLowerCase() || "portfolio";
    const title = toTitleCase(`${category.label} ${projectAddress} ${photoOrder}`);

    return {
        title,
        projectAddress,
        state,
        pairKey: [categoryCode, projectAddress, photoOrder].join("-"),
        photoOrder,
        sectionOrder: sectionOrder[category.category],
        virtualTypeOrder: virtualTypeOrder[categoryCode] ?? 0
    };
}

function parsePortfolioImage(fileName) {
    if (fileName.includes("/")) {
        return parseProjectPortfolioImage(fileName);
    }

    const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
    const parts = nameWithoutExtension
        .split("-")
        .map((part) => part.trim())
        .filter(Boolean);
    const categoryCode = parts[0]?.toUpperCase();
    const category = portfolioCategories[categoryCode] ?? portfolioCategories.I;
    const parsedDetails = category.category === "virtual"
        ? parseVirtualPortfolioImage(parts, categoryCode, category)
        : parseStandardPortfolioImage(parts, category);

    return {
        id: fileName,
        fileName,
        title: parsedDetails.title,
        category: category.category,
        categoryLabel: category.label,
        image: `/images/portfolio/${fileName}`,
        alt: `${category.label} real estate photo of ${parsedDetails.title.toLowerCase()}`,
        state: parsedDetails.state,
        pairKey: parsedDetails.pairKey,
        projectAddress: parsedDetails.projectAddress,
        projectFolder: parsedDetails.projectFolder,
        sectionOrder: parsedDetails.sectionOrder,
        photoOrder: parsedDetails.photoOrder,
        virtualTypeOrder: parsedDetails.virtualTypeOrder ?? 0
    };
}

function buildPortfolioItems(parsedImages) {
    const groupedImages = parsedImages.filter((image) => !image.isCover).reduce((groups, image) => {
        if (!image.state) {
            return groups;
        }

        const existingGroup = groups.get(image.pairKey) ?? [];
        groups.set(image.pairKey, [...existingGroup, image]);
        return groups;
    }, new Map());
    const pairedKeys = new Set();

    const comparisonItems = [...groupedImages.values()]
        .filter((group) => group.some((image) => image.state === "before") && group.some((image) => image.state === "after"))
        .map((group) => {
            const before = group.find((image) => image.state === "before");
            const after = group.find((image) => image.state === "after");
            pairedKeys.add(before.pairKey);

            return {
                id: before.pairKey,
                title: before.title,
                category: before.category,
                categoryLabel: before.categoryLabel,
                alt: before.alt,
                comparison: true,
                beforeImage: before.image,
                afterImage: after.image,
                projectAddress: before.projectAddress,
                projectFolder: before.projectFolder,
                sectionOrder: before.sectionOrder,
                photoOrder: before.photoOrder,
                virtualTypeOrder: before.virtualTypeOrder
            };
        });

    const singleItems = parsedImages
        .filter((image) => !image.isCover)
        .filter((image) => !pairedKeys.has(image.pairKey))
        .map(({ state, pairKey, fileName, ...image }) => image);

    return [...comparisonItems, ...singleItems].sort(comparePortfolioItems);
}

const parsedPortfolioImages = portfolioImageFiles.map(parsePortfolioImage);

export const portfolioItems = buildPortfolioItems(parsedPortfolioImages);

export const portfolioProjects = [...new Set(
    portfolioItems
        .filter((item) => item.category !== "virtual")
        .map((item) => item.projectAddress)
)].map((projectAddress) => ({
    id: projectAddress,
    label: toTitleCase(getProjectDisplayName(projectAddress)),
    thumbnail: parsedPortfolioImages.find((image) => (
        image.isCover &&
        portfolioItems.some((item) => (
            item.projectAddress === projectAddress &&
            item.projectFolder === image.projectFolder
        ))
    ))?.image
}));

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
    packages: [
        {
            name: "Basic Listing",
            price: "$150",
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
            price: "$185",
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
            price: "$225",
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
    ],
    addOns: [
        {
            name: "Floor Plan",
            price: "$35",
            unit: "",
            description: "Professional 2D floor plan with accurate measurements and room labels"
        },
        {
            name: "Virtual Staging",
            price: "$20",
            unit: "per photo",
            description: "Digitally furnish empty spaces to help buyers visualize potential"
        },
        {
            name: "Virtual Twilight",
            price: "$20",
            unit: "per photo",
            description: "Stunning dusk edits that showcase your property's evening appeal"
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
        "Professional real estate photography in Selma, New Braunfels, San Antonio, and surrounding areas that helps listings stand out.",
    socialLinks: [
        {
            label: "Google Business",
            href: "https://share.google/t1ljeTYaWN1AIvtZN",
            logoUrl: "/images/google-business-logo.svg",
            shortLabel: "G"
        },
        {
            label: "Facebook",
            href: "https://www.facebook.com/AlyssaAshleyMedia",
            logoUrl: "/images/facebook-logo.svg",
            shortLabel: "FB"
        },
        {
            label: "Instagram",
            href: "https://www.instagram.com/alyssaashleymedia/?hl=en",
            logoUrl: "/images/instagram-logo.svg",
            shortLabel: "IG"
        }
    ],
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
