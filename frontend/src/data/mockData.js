// src/data/mockData.js

export const MOCK_LISTINGS = [
  {
    _id: "1",
    type: "pg",
    title: "Sunrise PG for Men",
    address: { area: "Koramangala", city: "Bangalore" },
    price: { amount: 8500, unit: "month" },
    rating: 4.3,
    reviewCount: 12,
    images: [],
    isVerified: true,
    description:
      "Comfortable PG with all amenities including WiFi, meals, and laundry. Walking distance from major tech parks.",
    owner: { name: "Raj Kumar", phone: "+91-9876543210" },
    pgDetails: {
      gender: "male",
      roomType: "double",
      amenities: ["WiFi", "Food", "AC", "Laundry", "Hot Water"],
      furnishing: "furnished",
    },
  },
  {
    _id: "2",
    type: "tiffin",
    title: "Amma's Home Kitchen",
    address: { area: "HSR Layout", city: "Bangalore" },
    price: { amount: 2800, unit: "month" },
    rating: 4.7,
    reviewCount: 28,
    images: [],
    isVerified: true,
    description:
      "Authentic home-style South Indian and North Indian meals. Fresh, hygienic, and delivered hot to your doorstep.",
    owner: { name: "Lakshmi Aunty", phone: "+91-8765432109" },
    tiffinDetails: {
      dietType: "veg",
      mealsPerDay: 2,
      deliveryAvailable: true,
      cuisineType: ["South Indian", "North Indian"],
    },
  },
  {
    _id: "3",
    type: "cook",
    title: "Chef Ramesh - Personal Cook",
    address: { area: "Whitefield", city: "Bangalore" },
    price: { amount: 5000, unit: "month" },
    rating: 4.5,
    reviewCount: 9,
    images: [],
    isVerified: false,
    description:
      "Experienced cook with 8 years of experience. Can cook both Indian and continental cuisine.",
    owner: { name: "Ramesh G", phone: "+91-7654321098" },
    cookDetails: {
      experience: 8,
      specializations: ["South Indian", "Continental", "Chinese"],
      availableTimings: ["Morning", "Evening"],
    },
  },
  {
    _id: "4",
    type: "pg",
    title: "Golden Stay PG - Ladies",
    address: { area: "Marathahalli", city: "Bangalore" },
    price: { amount: 7200, unit: "month" },
    rating: 4.1,
    reviewCount: 15,
    images: [],
    isVerified: true,
    description:
      "Safe and secure PG for working women. 24/7 security, clean rooms, and vegetarian food provided.",
    owner: { name: "Priya Sharma", phone: "+91-6543210987" },
    pgDetails: {
      gender: "female",
      roomType: "single",
      amenities: ["WiFi", "Food", "Security", "Power Backup"],
      furnishing: "semi-furnished",
    },
  },
  {
    _id: "5",
    type: "tiffin",
    title: "Desi Dhaba Tiffin",
    address: { area: "Indiranagar", city: "Bangalore" },
    price: { amount: 3200, unit: "month" },
    rating: 4.4,
    reviewCount: 21,
    images: [],
    isVerified: true,
    description:
      "Pure Punjabi home-style food. Generous portions, real ghee, and the taste of home.",
    owner: { name: "Hardeep Singh", phone: "+91-5432109876" },
    tiffinDetails: {
      dietType: "both",
      mealsPerDay: 3,
      deliveryAvailable: false,
      cuisineType: ["North Indian", "Punjabi"],
    },
  },
  {
    _id: "6",
    type: "pg",
    title: "Tech Hub PG for Men",
    address: { area: "Electronic City", city: "Bangalore" },
    price: { amount: 12000, unit: "month" },
    rating: 3.9,
    reviewCount: 6,
    images: [],
    isVerified: false,
    description:
      "Modern PG with co-working space, high-speed WiFi, and shuttle service to major tech parks.",
    owner: { name: "Ankit Verma", phone: "+91-9123456789" },
    pgDetails: {
      gender: "co-ed",
      roomType: "single",
      amenities: ["WiFi", "AC", "Gym", "Co-working", "Shuttle"],
      furnishing: "furnished",
    },
  },
  {
    _id: "7",
    type: "cook",
    title: "Meenakshi - Vegetarian Specialist",
    address: { area: "JP Nagar", city: "Bangalore" },
    price: { amount: 4500, unit: "month" },
    rating: 4.8,
    reviewCount: 17,
    images: [],
    isVerified: true,
    description:
      "Pure vegetarian cooking specialist. Expert in South Indian, Jain food, and healthy cuisine.",
    owner: { name: "Meenakshi V", phone: "+91-8901234567" },
    cookDetails: {
      experience: 5,
      specializations: ["South Indian", "Jain", "Healthy"],
      availableTimings: ["Morning", "Evening", "Full-day"],
    },
  },
  {
    _id: "8",
    type: "pg",
    title: "Comfort Zone PG",
    address: { area: "BTM Layout", city: "Bangalore" },
    price: { amount: 6800, unit: "month" },
    rating: 4.2,
    reviewCount: 11,
    images: [],
    isVerified: true,
    description:
      "Well-maintained PG with weekly room cleaning, WiFi, and common room with TV.",
    owner: { name: "Deepak Patel", phone: "+91-7890123456" },
    pgDetails: {
      gender: "co-ed",
      roomType: "double",
      amenities: ["WiFi", "Food", "TV", "Housekeeping"],
      furnishing: "semi-furnished",
    },
  },
];

export const AREAS = [
  "Koramangala",
  "HSR Layout",
  "Indiranagar",
  "Whitefield",
  "Marathahalli",
  "Electronic City",
  "JP Nagar",
  "BTM Layout",
  "Bellandur",
  "Hebbal",
  "Yelahanka",
  "Jayanagar",
];

export const TYPE_ICONS = { pg: "🏠", tiffin: "🍱", cook: "👨‍🍳" };
export const TYPE_LABELS = {
  pg: "PG Accommodation",
  tiffin: "Tiffin Service",
  cook: "Personal Cook",
};

export const AI_SUGGESTIONS = [
  "Affordable PG in Koramangala with WiFi",
  "Veg tiffin near Whitefield",
  "Female PG under ₹8000 in HSR Layout",
  "Cook for 2 people in Indiranagar",
];
