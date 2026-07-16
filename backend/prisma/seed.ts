import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Himalayan Kitchen",
      slug: "himalayan-kitchen",
      email: "info@himalayankitchen.jp",
      phone: "+81312345678",
      address: "〒160-0022 東京都新宿区新宿3-17-5",
      currency: "JPY",
      vatRate: 10,
      serviceCharge: 0,
    },
  });

  const owner = await prisma.user.create({
    data: {
      email: "owner@himalayan.jp",
      passwordHash: "$2b$10$placeholder_hash",
      name: "Raju Sharma",
      role: "Owner",
      restaurantId: restaurant.id,
    },
  });

  await prisma.user.createMany({
    data: [
      { email: "manager@himalayan.jp", passwordHash: "$2b$10$placeholder_hash", name: "Sita Gurung", role: "Manager", restaurantId: restaurant.id },
      { email: "cashier@himalayan.jp", passwordHash: "$2b$10$placeholder_hash", name: "Binod Thapa", role: "Cashier", restaurantId: restaurant.id },
      { email: "waiter@himalayan.jp", passwordHash: "$2b$10$placeholder_hash", name: "Anita Tamang", role: "Waiter", restaurantId: restaurant.id },
    ],
  });

  await prisma.allergen.createMany({
    data: [
      { name: "Gluten", icon: "🌾" },
      { name: "Crustaceans", icon: "🦐" },
      { name: "Eggs", icon: "🥚" },
      { name: "Fish", icon: "🐟" },
      { name: "Peanuts", icon: "🥜" },
      { name: "Soybeans", icon: "🫘" },
      { name: "Milk", icon: "🥛" },
      { name: "Nuts", icon: "🌰" },
      { name: "Celery", icon: "🥬" },
      { name: "Mustard", icon: "🫙" },
      { name: "Sesame", icon: "🫓" },
      { name: "Sulphites", icon: "🍷" },
      { name: "Lupin", icon: "🌸" },
      { name: "Molluscs", icon: "🐚" },
    ],
  });

  const starters = await prisma.menuCategory.create({
    data: { name: "Starters", sortOrder: 1, restaurantId: restaurant.id },
  });
  const mains = await prisma.menuCategory.create({
    data: { name: "Main Courses", sortOrder: 2, restaurantId: restaurant.id },
  });
  const desserts = await prisma.menuCategory.create({
    data: { name: "Desserts", sortOrder: 3, restaurantId: restaurant.id },
  });
  const beverages = await prisma.menuCategory.create({
    data: { name: "Beverages", sortOrder: 4, restaurantId: restaurant.id },
  });
  const sides = await prisma.menuCategory.create({
    data: { name: "Sides & Breads", sortOrder: 5, restaurantId: restaurant.id },
  });

  const gluten = await prisma.allergen.findUniqueOrThrow({ where: { name: "Gluten" } });
  const eggs = await prisma.allergen.findUniqueOrThrow({ where: { name: "Eggs" } });
  const milk = await prisma.allergen.findUniqueOrThrow({ where: { name: "Milk" } });
  const fish = await prisma.allergen.findUniqueOrThrow({ where: { name: "Fish" } });
  const peanuts = await prisma.allergen.findUniqueOrThrow({ where: { name: "Peanuts" } });
  const soy = await prisma.allergen.findUniqueOrThrow({ where: { name: "Soybeans" } });
  const nuts = await prisma.allergen.findUniqueOrThrow({ where: { name: "Nuts" } });
  const sesa = await prisma.allergen.findUniqueOrThrow({ where: { name: "Sesame" } });

  // Momo
  await prisma.menuItem.create({
    data: {
      name: "Momo (Steamed Dumplings)",
      description: "Traditional Nepali dumplings filled with spiced chicken, served with achar",
      price: 880, courseType: "Starter", categoryId: starters.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten.id }] },
      modifiers: { create: [
        { name: "Fried Momo", price: 100 },
        { name: "Buff (Water Buffalo) Momo", price: 200 },
        { name: "Vegetable Momo", price: 0 },
        { name: "Extra achar", price: 100 },
      ]},
    },
  });

  // Chhoila
  await prisma.menuItem.create({
    data: {
      name: "Chhoila",
      description: "Spiced grilled buffalo meat with herbs, mustard oil & green chillies",
      price: 1200, courseType: "Starter", categoryId: starters.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: sesa.id }] },
    },
  });

  // Aloo Tama
  await prisma.menuItem.create({
    data: {
      name: "Aloo Tama",
      description: "Tangy potato & bamboo shoot soup with black-eyed peas",
      price: 750, courseType: "Starter", categoryId: starters.id, restaurantId: restaurant.id,
    },
  });

  // Dal Bhat
  await prisma.menuItem.create({
    data: {
      name: "Dal Bhat",
      description: "Nepali national dish — lentil soup, steamed rice, vegetable curry, pickles & papad",
      price: 1500, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten.id }] },
    },
  });

  // Chicken Tikka Masala
  await prisma.menuItem.create({
    data: {
      name: "Chicken Tikka Masala",
      description: "Marinated chicken cooked in creamy tomato-spiced gravy with naan bread",
      price: 1680, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: milk.id }] },
      modifiers: { create: [
        { name: "Extra spicy", price: 0 },
        { name: "Mild", price: 0 },
        { name: "Extra naan", price: 300 },
      ]},
    },
  });

  // Khasi Ko Masu
  await prisma.menuItem.create({
    data: {
      name: "Khasi Ko Masu",
      description: "Slow-cooked goat curry with traditional Nepali spices & herbs",
      price: 1980, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
      modifiers: { create: [{ name: "With rice", price: 0 }, { name: "With roti", price: 0 }] },
    },
  });

  // Sekuwa
  await prisma.menuItem.create({
    data: {
      name: "Sekuwa (Mixed Grill)",
      description: "Traditionally grilled chicken, buffalo & fish skewers with herbs",
      price: 2200, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
    },
  });

  // Thukpa
  await prisma.menuItem.create({
    data: {
      name: "Thukpa",
      description: "Tibetan-Nepali noodle soup with vegetables and chicken in clear broth",
      price: 1200, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten.id }, { allergenId: soy.id }] },
    },
  });

  // Vegetable Curry
  await prisma.menuItem.create({
    data: {
      name: "Vegetable Curry (Tarkari)",
      description: "Seasonal mixed vegetables cooked in light Nepali curry (vegan)",
      price: 1100, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
    },
  });

  // Sel Roti
  await prisma.menuItem.create({
    data: {
      name: "Sel Roti",
      description: "Traditional ring-shaped rice flour bread, crispy outside, soft inside",
      price: 500, courseType: "Main", categoryId: sides.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten.id }] },
    },
  });

  // Naan
  await prisma.menuItem.create({
    data: {
      name: "Garlic Naan",
      description: "Tandoor-baked leavened bread with garlic butter",
      price: 400, courseType: "Main", categoryId: sides.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten.id }, { allergenId: milk.id }] },
      modifiers: { create: [
        { name: "Butter Naan", price: 0 },
        { name: "Cheese Naan", price: 200 },
      ]},
    },
  });

  // Gundruk
  await prisma.menuItem.create({
    data: {
      name: "Gundruk",
      description: "Fermented leafy greens stir-fried with garlic & chillies (vegan)",
      price: 650, courseType: "Main", categoryId: sides.id, restaurantId: restaurant.id,
    },
  });

  // Juju Dhau
  await prisma.menuItem.create({
    data: {
      name: "Juju Dhau",
      description: "King of yogurts — creamy sweetened yogurt from Bhaktapur in clay pot",
      price: 600, courseType: "Dessert", categoryId: desserts.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: milk.id }] },
    },
  });

  // Yomari
  await prisma.menuItem.create({
    data: {
      name: "Yomari",
      description: "Steamed rice-flour dumpling filled with melted jaggery & sesame seeds",
      price: 700, courseType: "Dessert", categoryId: desserts.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten.id }, { allergenId: sesa.id }] },
    },
  });

  // Kheer
  await prisma.menuItem.create({
    data: {
      name: "Kheer (Rice Pudding)",
      description: "Slow-cooked rice pudding with cardamom, saffron & pistachios",
      price: 650, courseType: "Dessert", categoryId: desserts.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: milk.id }, { allergenId: nuts.id }] },
    },
  });

  // Chiya
  await prisma.menuItem.create({
    data: {
      name: "Nepali Chiya (Masala Tea)",
      description: "Traditional spiced milk tea with ginger, cardamom & cinnamon",
      price: 400, courseType: "Beverage", categoryId: beverages.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: milk.id }] },
    },
  });

  // Lassi
  await prisma.menuItem.create({
    data: {
      name: "Mango Lassi",
      description: "Creamy yogurt drink blended with Alphonso mango",
      price: 550, courseType: "Beverage", categoryId: beverages.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: milk.id }] },
    },
  });

  // Black Tea / Coffee
  await prisma.menuItem.create({
    data: {
      name: "Black Tea / Coffee",
      description: "Choice of Assam black tea or filter coffee",
      price: 350, courseType: "Beverage", categoryId: beverages.id, restaurantId: restaurant.id,
    },
  });

  // Set menu
  const setMenu = await prisma.setMenu.create({
    data: {
      name: "Nepali Set Lunch",
      description: "Starter + main + dessert — taste of Nepal",
      price: 2500, restaurantId: restaurant.id,
    },
  });

  const momoItem = await prisma.menuItem.findFirstOrThrow({ where: { name: { contains: "Momo" } } });
  const dalBhatItem = await prisma.menuItem.findFirstOrThrow({ where: { name: "Dal Bhat" } });
  const jujuDhauItem = await prisma.menuItem.findFirstOrThrow({ where: { name: "Juju Dhau" } });

  await prisma.setMenuItem.createMany({
    data: [
      { setMenuId: setMenu.id, menuItemId: momoItem.id, courseType: "Starter" },
      { setMenuId: setMenu.id, menuItemId: dalBhatItem.id, courseType: "Main" },
      { setMenuId: setMenu.id, menuItemId: jujuDhauItem.id, courseType: "Dessert" },
    ],
  });

  // Tables
  for (let i = 1; i <= 4; i++) {
    await prisma.table.create({
      data: { number: String(i), capacity: 2, section: "Window", restaurantId: restaurant.id },
    });
  }
  for (let i = 5; i <= 10; i++) {
    await prisma.table.create({
      data: { number: String(i), capacity: 4, section: "Main Hall", restaurantId: restaurant.id },
    });
  }
  for (let i = 11; i <= 12; i++) {
    await prisma.table.create({
      data: { number: String(i), capacity: 8, section: "Private Room", restaurantId: restaurant.id },
    });
  }

  // Inventory
  await prisma.inventoryItem.createMany({
    data: [
      { name: "Chicken Breast", sku: "CHK-001", quantity: 25, unit: "kg", minStock: 5, price: 800, restaurantId: restaurant.id },
      { name: "Goat Meat", sku: "GOT-001", quantity: 15, unit: "kg", minStock: 3, price: 1200, restaurantId: restaurant.id },
      { name: "Basmati Rice", sku: "RICE-001", quantity: 50, unit: "kg", minStock: 10, price: 400, restaurantId: restaurant.id },
      { name: "Dal (Lentils)", sku: "DAL-001", quantity: 20, unit: "kg", minStock: 5, price: 350, restaurantId: restaurant.id },
      { name: "Momo Wrappers", sku: "MOM-001", quantity: 500, unit: "pcs", minStock: 100, price: 10, restaurantId: restaurant.id },
      { name: "Yogurt Culture", sku: "YOG-001", quantity: 10, unit: "L", minStock: 2, price: 500, restaurantId: restaurant.id },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(`   Restaurant: Himalayan Kitchen (Shinjuku, Tokyo)`);
  console.log(`   Login: owner@himalayan.jp`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
