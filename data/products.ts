export const products: Record<string, any[]> = {
    Cocktails: [
        {
            id: 1,
            name: "Margarita",
            portions: [
                { size: "Regular", price: "1200" },
                { size: "Large", price: "2200" }
            ],
            description: "A refreshing tequila-based cocktail with lime juice and triple sec.",
            category: "Cocktails",
            image: "/assets/barmenu/1.webp"
        },
        {
            id: 2,
            name: "Mojito",
            portions: [
                { size: "Regular", price: "1100" },
                { size: "Large", price: "2000" }
            ],
            description: "A Cuban classic made with white rum, fresh mint, lime, and soda.",
            category: "Cocktails",
            image: "/assets/cocktails/mojito.jpg"
        },
        {
            id: 3,
            name: "Old Fashioned",
            portions: [
                { size: "Regular", price: "1400" },
                { size: "Large", price: "2500" }
            ],
            description: "A timeless whiskey cocktail with bitters, sugar, and an orange twist.",
            category: "Cocktails",
            image: "/assets/cocktails/old.jpg"
        },
        {
            id: 4,
            name: "Negroni",
            portions: [
                { size: "Regular", price: "1300" },
                { size: "Large", price: "2400" }
            ],
            description: "A balanced mix of gin, Campari, and sweet vermouth.",
            category: "Cocktails",
            image: "/assets/cocktails/negroni.jpg"
        },
    ],

    Beers: [
        {
            id: 5,
            name: "Lager",
            portions: [
                { size: "Pint", price: "800" },
                { size: "Pitcher", price: "2500" }
            ],
            description: "Crisp and refreshing light beer with a smooth finish.",
            category: "Beers",
            image: "/assets/beer/1.jpg"
        },
        {
            id: 6,
            name: "IPA",
            portions: [
                { size: "Pint", price: "900" },
                { size: "Pitcher", price: "2700" }
            ],
            description: "Hoppy and aromatic India Pale Ale with bold flavors.",
            category: "Beers",
            image: "/assets/beer/2.jpg"
        },
        {
            id: 7,
            name: "Stout",
            portions: [
                { size: "Pint", price: "950" },
                { size: "Pitcher", price: "2800" }
            ],
            description: "Dark and rich beer with notes of coffee and chocolate.",
            category: "Beers",
            image: "/assets/beer/3.jpg"
        },
        {
            id: 8,
            name: "Pilsner",
            portions: [
                { size: "Pint", price: "850" },
                { size: "Pitcher", price: "2600" }
            ],
            description: "A light, crisp, and slightly hoppy golden beer.",
            category: "Beers",
            image: "/assets/beer/4.jpg"
        },
    ],

    Wines: [
        {
            id: 9,
            name: "Chardonnay",
            portions: [
                { size: "Glass", price: "1200" },
                { size: "Bottle", price: "5000" }
            ],
            description: "A smooth and buttery white wine with hints of oak.",
            category: "Wines",
            image: "/assets/wines/1.webp"
        },
        {
            id: 10,
            name: "Merlot",
            portions: [
                { size: "Glass", price: "1300" },
                { size: "Bottle", price: "5200" }
            ],
            description: "A rich and velvety red wine with dark fruit flavors.",
            category: "Wines",
            image: "/assets/wines/2.jpg"
        },
        {
            id: 11,
            name: "Rosé",
            portions: [
                { size: "Glass", price: "1100" },
                { size: "Bottle", price: "4800" }
            ],
            description: "A refreshing and fruity pink wine perfect for any occasion.",
            category: "Wines",
            image: "/assets/wines/3.webp"
        },
        {
            id: 12,
            name: "Cabernet Sauvignon",
            portions: [
                { size: "Glass", price: "1400" },
                { size: "Bottle", price: "5400" }
            ],
            description: "A bold and full-bodied red wine with dark berry flavors.",
            category: "Wines",
            image: "/assets/wines/4.jpg"
        },
    ],

    Spirits: [
        {
            id: 13,
            name: "Whiskey",
            portions: [
                { size: "Single", price: "1500" },
                { size: "Double", price: "2800" }
            ],
            description: "A smooth and aged whiskey with deep smoky notes.",
            category: "Spirits",
            image: "/assets/spirits/whiskey.jpg"
        },
        {
            id: 14,
            name: "Vodka",
            portions: [
                { size: "Single", price: "1300" },
                { size: "Double", price: "2500" }
            ],
            description: "A clean and crisp spirit, perfect for mixing or sipping straight.",
            category: "Spirits",
            image: "/assets/spirits/vodka.jpg"
        },
        {
            id: 15,
            name: "Gin",
            portions: [
                { size: "Single", price: "1400" },
                { size: "Double", price: "2600" }
            ],
            description: "A fragrant and herbal gin with notes of juniper and citrus.",
            category: "Spirits",
            image: "/assets/spirits/gin.jpg"
        },
        {
            id: 16,
            name: "Rum",
            portions: [
                { size: "Single", price: "1350" },
                { size: "Double", price: "2550" }
            ],
            description: "A sweet and smooth rum perfect for tropical drinks.",
            category: "Spirits",
            image: "/assets/spirits/rum.webp"
        },
        {
            id: 17,
            name: "Tequila",
            portions: [
                { size: "Single", price: "1600" },
                { size: "Double", price: "3000" }
            ],
            description: "A bold and earthy tequila perfect for shots or mixing.",
            category: "Spirits",
            image: "/assets/spirits/tequila.jpg"
        },
    ],
};
