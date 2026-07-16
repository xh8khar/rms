export const rmsConfig = {
  app: {
    name: 'Himalayan Kitchen',
    description: 'Restaurant Management System',
    version: '1.0.0',
  },

  restaurant: {
    name: 'Himalayan Kitchen',
    slug: 'himalayan-kitchen',
    email: 'info@himalayankitchen.jp',
    phone: '+81312345678',
    address: '〒160-0022 東京都新宿区新宿3-17-5',
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },

  currency: {
    code: 'JPY',
    symbol: '¥',
    locale: 'ja-JP',
    decimals: 0,
    format: '{symbol}{value}',
  },

  tax: {
    rate: 10,
    label: 'Consumption Tax',
    localName: '消費税',
    type: 'inclusive',
  },

  serviceCharge: {
    enabled: false,
    rate: 0,
    label: 'Service Charge',
  },

  ordering: {
    courseBased: true,
    courseOrder: ['Starter', 'Main', 'Dessert', 'Beverage'],
    sequentialFiring: true,
    defaultCoverCount: 1,
  },

  kitchen: {
    refreshInterval: 5000,
    newOrderSound: true,
    courseSequential: true,
  },

  menu: {
    allergens: [
      'Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts',
      'Soybeans', 'Milk', 'Nuts', 'Celery', 'Mustard',
      'Sesame', 'Sulphites', 'Lupin', 'Molluscs',
    ],
    courseTypes: ['Starter', 'Main', 'Dessert', 'Beverage'],
    setMenuEnabled: true,
  },

  tables: {
    sections: ['Window', 'Main Hall', 'Private Room', 'Terrace'],
    statuses: ['Available', 'Occupied', 'Reserved', 'Cleanup'],
  },

  orders: {
    statusFlow: ['Pending', 'Confirmed', 'Preparing', 'Served', 'Paid'],
    allowSplit: true,
    allowTransfer: true,
  },

  payments: {
    methods: ['Cash', 'Suica/Pasmo', 'Card', 'PayPay', 'LINE Pay'],
    defaultMethod: 'Cash',
  },

  inventory: {
    lowStockThreshold: 0,
    autoDeductOnOrder: true,
    units: ['kg', 'g', 'L', 'ml', 'pcs', 'btl', 'box'],
  },

  auth: {
    jwtExpiresIn: '24h',
    passwordMinLength: 6,
    roles: ['Owner', 'Manager', 'Cashier', 'Waiter'],
  },

  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
  },

  deployment: {
    frontend: { platform: 'Cloudflare Pages', domain: 'pos.yourdomain.com' },
    backend: { platform: 'Render.com', domain: 'api.yourdomain.com' },
    database: { platform: 'Neon.tech', type: 'PostgreSQL' },
    dns: 'Cloudflare',
  },
} as const;

export type RmsConfig = typeof rmsConfig;
