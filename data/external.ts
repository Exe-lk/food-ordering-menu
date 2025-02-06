export interface ExternalProduct {
  id: number; // Add this
  category: string;
  brand: string;
  productName: string;
  quantity: number;
  unit: string;
  manufactureDate: string;
  expireDate: string;
  dateIn: string;
  costPrice: number;
  supplier: string;
  description: string;
}

export const external: ExternalProduct[] = [
  {
      id: 1,
      category: "Italian",
      brand: "KFC",
      productName: "Garlic Pasta",
      quantity: 5,
      unit: "Kg",
      manufactureDate: "2025.01.31",
      expireDate: "2025.01.31",
      dateIn: "2025.01.31",
      costPrice: 1000.0,
      supplier: "Mr. Gamage",
      description: "Our super service & tasty food in the Sri Lankan best food company & no. 1 foreign food restaurant",
  },
  {
      id: 2, 
      category: "Fast Food",
      brand: "McDonald's",
      productName: "Cheese Burger",
      quantity: 10,
      unit: "Pieces",
      manufactureDate: "2025.02.01",
      expireDate: "2025.02.10",
      dateIn: "2025.02.01",
      costPrice: 800.0,
      supplier: "Mrs. Perera",
      description: "A delicious cheesy burger made with fresh ingredients and premium beef patty.",
  },
  {
      id: 3, // Add ID here
      category: "Beverages",
      brand: "Coca-Cola",
      productName: "Coke 1L",
      quantity: 20,
      unit: "Bottles",
      manufactureDate: "2025.01.15",
      expireDate: "2025.06.15",
      dateIn: "2025.01.20",
      costPrice: 200.0,
      supplier: "Mr. Fernando",
      description: "Refreshing Coca-Cola drink to quench your thirst and boost energy.",
  },
  {
      id: 4, 
      category: "Desserts",
      brand: "Baskin Robbins",
      productName: "Chocolate Ice Cream",
      quantity: 7,
      unit: "Liters",
      manufactureDate: "2025.01.25",
      expireDate: "2025.03.25",
      dateIn: "2025.01.26",
      costPrice: 1500.0,
      supplier: "Ms. Silva",
      description: "Rich and creamy chocolate ice cream made with the finest cocoa beans.",
  },
  {
      id: 5, 
      category: "Snacks",
      brand: "Lay's",
      productName: "Classic Chips",
      quantity: 15,
      unit: "Packets",
      manufactureDate: "2025.01.10",
      expireDate: "2025.04.10",
      dateIn: "2025.01.12",
      costPrice: 250.0,
      supplier: "Mr. Jayasundara",
      description: "Crispy and salty potato chips, the perfect snack for any occasion.",
  },
];
