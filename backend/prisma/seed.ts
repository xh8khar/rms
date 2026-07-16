import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Le Bistrot Parisien",
      slug: "le-bistrot-parisien",
      email: "contact@lebistrotparisien.com",
      phone: "+33123456789",
      address: "15 Rue de la Paix, 75001 Paris, France",
      currency: "JPY",
      vatRate: 10,
      serviceCharge: 10,
    },
  });

  // Create users
  const owner = await prisma.user.create({
    data: {
      email: "owner@lebistrot.com",
      passwordHash: "$2b$10$placeholder_hash",
      name: "Jean Dupont",
      role: "Owner",
      restaurantId: restaurant.id,
    },
  });

  await prisma.user.createMany({
    data: [
      { email: "manager@lebistrot.com", passwordHash: "$2b$10$placeholder_hash", name: "Marie Laurent", role: "Manager", restaurantId: restaurant.id },
      { email: "cashier@lebistrot.com", passwordHash: "$2b$10$placeholder_hash", name: "Pierre Martin", role: "Cashier", restaurantId: restaurant.id },
      { email: "waiter@lebistrot.com", passwordHash: "$2b$10$placeholder_hash", name: "Sophie Bernard", role: "Waiter", restaurantId: restaurant.id },
    ],
  });

  // Create 14 EU allergens
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

  // Create menu categories
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
  const wineList = await prisma.menuCategory.create({
    data: { name: "Wine List", sortOrder: 5, restaurantId: restaurant.id },
  });

  const gluten = await prisma.allergen.findUnique({ where: { name: "Gluten" } });
  const eggs = await prisma.allergen.findUnique({ where: { name: "Eggs" } });
  const milk = await prisma.allergen.findUnique({ where: { name: "Milk" } });
  const nuts = await prisma.allergen.findUnique({ where: { name: "Nuts" } });
  const fish = await prisma.allergen.findUnique({ where: { name: "Fish" } });
  const soy = await prisma.allergen.findUnique({ where: { name: "Soybeans" } });
  const sulphites = await prisma.allergen.findUnique({ where: { name: "Sulphites" } });

  // Create menu items
  const soup = await prisma.menuItem.create({
    data: {
      name: "French Onion Soup",
      description: "Traditional onion soup with Gruyère crouton",
      price: 1400, courseType: "Starter", categoryId: starters.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten!.id }, { allergenId: milk!.id }] },
      modifiers: { create: [{ name: "Extra cheese", price: 300 }] },
    },
  });

  const salad = await prisma.menuItem.create({
    data: {
      name: "Niçoise Salad",
      description: "Tuna, olives, green beans, egg, potatoes",
      price: 1600, courseType: "Starter", categoryId: starters.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: eggs!.id }, { allergenId: fish!.id }] },
    },
  });

  const steak = await prisma.menuItem.create({
    data: {
      name: "Steak Frites",
      description: "Grilled ribeye with hand-cut fries & peppercorn sauce",
      price: 3800, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
      modifiers: {
        create: [
          { name: "Medium-rare", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Well-done", price: 0 },
          { name: "Extra sauce", price: 200 },
        ],
      },
    },
  });

  const salmon = await prisma.menuItem.create({
    data: {
      name: "Pan-Seared Salmon",
      description: "With lemon butter sauce and seasonal vegetables",
      price: 3200, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: fish!.id }, { allergenId: milk!.id }] },
    },
  });

  const ratatouille = await prisma.menuItem.create({
    data: {
      name: "Ratatouille Provençale",
      description: "Slow-cooked vegetable medley with herbs de Provence (vegan)",
      price: 2400, courseType: "Main", categoryId: mains.id, restaurantId: restaurant.id,
    },
  });

  const cremeBrulee = await prisma.menuItem.create({
    data: {
      name: "Crème Brûlée",
      description: "Classic vanilla custard with caramelised sugar",
      price: 1200, courseType: "Dessert", categoryId: desserts.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: eggs!.id }, { allergenId: milk!.id }] },
    },
  });

  const tatin = await prisma.menuItem.create({
    data: {
      name: "Tarte Tatin",
      description: "Upside-down caramelised apple tart with crème fraîche",
      price: 1400, courseType: "Dessert", categoryId: desserts.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: gluten!.id }, { allergenId: milk!.id }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Espresso", description: "Double shot espresso", price: 400,
      courseType: "Beverage", categoryId: beverages.id, restaurantId: restaurant.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Café Crème", description: "Espresso with steamed milk", price: 500,
      courseType: "Beverage", categoryId: beverages.id, restaurantId: restaurant.id,
      allergens: { create: [{ allergenId: milk!.id }] },
    },
  });

  // Wine list
  await prisma.menuItem.create({
    data: {
      name: "Château Margaux 2015", description: "Bordeaux Grand Cru Classé",
      price: 45000, courseType: "Beverage", categoryId: wineList.id, restaurantId: restaurant.id,
      isWine: true, wineVintage: 2015, wineRegion: "Bordeaux", wineAppellation: "Margaux AOC", wineGrape: "Cabernet Sauvignon, Merlot",
      allergens: { create: [{ allergenId: sulphites!.id }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Sancerre Blanc 2023", description: "Loire Valley Sauvignon Blanc",
      price: 8500, courseType: "Beverage", categoryId: wineList.id, restaurantId: restaurant.id,
      isWine: true, wineVintage: 2023, wineRegion: "Loire Valley", wineAppellation: "Sancerre AOC", wineGrape: "Sauvignon Blanc",
      allergens: { create: [{ allergenId: sulphites!.id }] },
    },
  });

  // Set menu
  const setMenu = await prisma.setMenu.create({
    data: {
      name: "Menu du Jour",
      description: "Three-course lunch menu",
      price: 5500, restaurantId: restaurant.id,
    },
  });

  await prisma.setMenuItem.createMany({
    data: [
      { setMenuId: setMenu.id, menuItemId: soup.id, courseType: "Starter" },
      { setMenuId: setMenu.id, menuItemId: steak.id, courseType: "Main" },
      { setMenuId: setMenu.id, menuItemId: cremeBrulee.id, courseType: "Dessert" },
    ],
  });

  // Create tables
  for (let i = 1; i <= 5; i++) {
    await prisma.table.create({
      data: { number: String(i), capacity: i === 1 ? 2 : 4, section: i <= 2 ? "Window" : "Main", restaurantId: restaurant.id },
    });
  }
  for (let i = 6; i <= 8; i++) {
    await prisma.table.create({
      data: { number: String(i), capacity: 6, section: "Terrace", restaurantId: restaurant.id },
    });
  }

  // Create inventory items
  await prisma.inventoryItem.createMany({
    data: [
      { name: "Ribeye Beef", sku: "BEEF-001", quantity: 20, unit: "kg", minStock: 5, price: 2500, restaurantId: restaurant.id },
      { name: "Salmon Fillet", sku: "FISH-001", quantity: 10, unit: "kg", minStock: 3, price: 3200, restaurantId: restaurant.id },
      { name: "Potatoes", sku: "VEG-001", quantity: 50, unit: "kg", minStock: 10, price: 300, restaurantId: restaurant.id },
      { name: "Eggs", sku: "DAIRY-001", quantity: 60, unit: "pcs", minStock: 24, price: 40, restaurantId: restaurant.id },
      { name: "Heavy Cream", sku: "DAIRY-002", quantity: 10, unit: "L", minStock: 3, price: 800, restaurantId: restaurant.id },
      { name: "Château Margaux 2015", sku: "WINE-001", quantity: 12, unit: "btl", minStock: 3, price: 35000, restaurantId: restaurant.id },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
