export const products: Record<string, any[]> = {
    Italian: [
        {
            id: 1,
            name: "Garlic Pasta",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "A creamy pasta infused with the rich flavor of roasted garlic.",
            category: "Italian",
            image: "/assets/Italian/garlic.jpg"
        },
        {
            id: 2,
            name: "Spicy Pasta",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Delicious pasta with a bold and spicy kick.",
            category: "Italian",
            image: '/assets/Italian/spicy.webp'
        },
        {
            id: 3,
            name: "Carbonara",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Classic Italian pasta made with creamy sauce, pancetta, and Parmesan cheese.",
            category: "Italian",
            image: '/assets/Italian/carbonara.jpeg'
        },
        {
            id: 4,
            name: "Alfredo",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Rich and creamy pasta topped with Parmesan and butter.",
            category: "Italian",
            image: '/assets/Italian/alfredo.jpg'
        },
        {
            id: 5,
            name: "Cheese Pizza",
            portions: [
                { size: "Medium", price: "800" },
                { size: "Large", price: "1800" },
                { size: "Extra Large", price: "2800" }
            ],
            description: "Classic cheese pizza with a perfectly crispy crust.",
            category: "Italian",
            image: '/assets/Italian/cheesepizza.jpg'
        },
    ],

    Chinese: [
        {
            id: 6,
            name: "Sour Pork",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "A tangy and savory pork dish with a perfect balance of flavors.",
            category: "Chinese",
            image: "/assets/chineese/dish1.jpg"
        },
        {
            id: 7,
            name: "Dim Sum",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "A delightful assortment of bite-sized Chinese dumplings.",
            category: "Chinese",
            image: '/assets/chineese/dish2.jpg'
        },
        {
            id: 8,
            name: "Kung Pao",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Spicy stir-fry with chicken, peanuts, and vegetables.",
            category: "Chinese",
            image: '/assets/chineese/dish3.jpg'
        },
        {
            id: 9,
            name: "Fried Rice",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Classic fried rice with vegetables and your choice of protein.",
            category: "Chinese",
            image: '/assets/chineese/dish4.jpg'
        },
    ],

    Dessert: [
        {
            id: 10,
            name: "Sundaes",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "A creamy and delicious ice cream treat topped with syrup and nuts.",
            category: "Dessert",
            image: "/assets/dessert/item1.jpg"
        },
        {
            id: 11,
            name: "Brownies",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Rich and fudgy chocolate brownies, perfect for dessert lovers.",
            category: "Dessert",
            image: "/assets/dessert/item2.jpg"
        },
        {
            id: 12,
            name: "Chocolate Mousse",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Light and airy mousse with a rich chocolate flavor.",
            category: "Dessert",
            image: '/assets/dessert/item3.jpg'
        },
    ],

    Coffees: [
        {
            id: 13,
            name: "Americano",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "A strong and bold black coffee to keep you energized.",
            category: "Coffee",
            image: "/assets/coffee/coffee2.jpg"
        },
        {
            id: 14,
            name: "Espresso",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Intense and flavorful shot of espresso for coffee enthusiasts.",
            category: "Coffee",
            image: "/assets/coffee/coffee3.jpg"
        },
        {
            id: 15,
            name: "Cappuccino",
            portions: [
                { size: "Regular", price: "800" },
                { size: "Large", price: "1800" }
            ],
            description: "Creamy coffee with steamed milk and a frothy top.",
            category: "Coffee",
            image: '/assets/coffee/coffee2.jpg'
        },
    ],
};
