const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// =========================
// Ã˜ÂªÃ˜Â³Ã˜Â¬Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¯Ã˜Â®Ã™Ë†Ã™â€ž
// =========================

const OWNER_USERNAME = "admin";
const OWNER_PASSWORD = "123456";

// =========================
// Ã™â€¦Ã™â€žÃ™ÂÃ˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª
// =========================

const dataDirectory = path.join(__dirname, "data");

const customersFile = path.join(dataDirectory, "customers.json");
const carsFile = path.join(dataDirectory, "cars.json");
const invoicesFile = path.join(dataDirectory, "invoices.json");
const expensesFile = path.join(dataDirectory, "expenses.json");
const carpetsFile = path.join(dataDirectory, "carpets.json");
const membershipsFile = path.join(dataDirectory, "memberships.json");
const servicesFile = path.join(dataDirectory, "services.json");
const settingsFile = path.join(dataDirectory, "settings.json");
const usersFile = path.join(dataDirectory, "users.json");

// =========================
// Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™ÂÃ˜ÂªÃ˜Â±Ã˜Â§Ã˜Â¶Ã™Å Ã˜Â©
// =========================

const initialCustomers = [
  {
    id: 1,
    name: "Ã˜Â£Ã˜Â­Ã™â€¦Ã˜Â¯ Ã˜Â­Ã˜Â³Ã™â€ ",
    phone: "01000000000",
    address: "Ã˜Â§Ã™â€žÃ™â€šÃ˜Â§Ã™â€¡Ã˜Â±Ã˜Â©",
    notes: "Ã˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂªÃ˜Â¬Ã˜Â±Ã™Å Ã˜Â¨Ã™Å ",
    cars: 1,
    carpets: 2,
  },
  {
    id: 2,
    name: "Ã™â€¦Ã˜Â­Ã™â€¦Ã˜Â¯ Ã˜Â¹Ã™â€žÃ™Å ",
    phone: "01111111111",
    address: "Ã˜Â§Ã™â€žÃ˜Â¬Ã™Å Ã˜Â²Ã˜Â©",
    notes: "",
    cars: 2,
    carpets: 0,
  },
  {
    id: 3,
    name: "Ã™â€¦Ã˜Â­Ã™â€¦Ã™Ë†Ã˜Â¯ Ã˜Â¥Ã˜Â¨Ã˜Â±Ã˜Â§Ã™â€¡Ã™Å Ã™â€¦",
    phone: "01222222222",
    address: "Ã™â€¦Ã˜Â¯Ã™Å Ã™â€ Ã˜Â© Ã™â€ Ã˜ÂµÃ˜Â±",
    notes: "Ã™Å Ã™ÂÃ˜Â¶Ã™â€ž Ã˜Â§Ã™â€žÃ˜ÂªÃ™Ë†Ã˜Â§Ã˜ÂµÃ™â€ž Ã™â€šÃ˜Â¨Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â³Ã˜ÂªÃ™â€žÃ˜Â§Ã™â€¦",
    cars: 0,
    carpets: 3,
  },
];

const initialCars = [
  {
    id: 1,
    customerId: 1,
    plateNumber: "Ã˜Â£ Ã˜Â¨ Ã˜Â¬ 1234",
    brand: "Toyota",
    model: "Corolla",
    color: "Ã˜Â£Ã˜Â¨Ã™Å Ã˜Â¶",
    year: 2022,
    notes: "Ã˜ÂºÃ˜Â³Ã™Å Ã™â€ž Ã˜Â£Ã˜Â³Ã˜Â¨Ã™Ë†Ã˜Â¹Ã™Å ",
    active: true,
  },
  {
    id: 2,
    customerId: 2,
    plateNumber: "Ã˜Â¯ Ã™â€¡Ã™â‚¬ Ã™Ë† 5678",
    brand: "Hyundai",
    model: "Elantra",
    color: "Ã˜Â£Ã˜Â³Ã™Ë†Ã˜Â¯",
    year: 2021,
    notes: "",
    active: true,
  },
  {
    id: 3,
    customerId: 2,
    plateNumber: "Ã˜Â³ Ã˜Âµ Ã˜Â¹ 9012",
    brand: "Kia",
    model: "Sportage",
    color: "Ã˜Â±Ã™â€¦Ã˜Â§Ã˜Â¯Ã™Å ",
    year: 2023,
    notes: "Ã˜ÂªÃ™â€ Ã˜Â¸Ã™Å Ã™Â Ã˜Â¯Ã˜Â§Ã˜Â®Ã™â€žÃ™Å  Ã™ÂÃ™â€šÃ˜Â·",
    active: true,
  },
];

const initialInvoices = [];
const initialExpenses = [];
const initialCarpets = [];
const initialMemberships = [];

const initialUsers = [
  {
    id: 1,
    name: "Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â¯Ã™Å Ã˜Â±",
    username: "admin",
    password: "123456",
    role: "Ã™â€¦Ã˜Â§Ã™â€žÃ™Æ’",
    active: true,
  },
];

const initialServices = [
  {
    id: 1,
    name: "Ã˜ÂºÃ˜Â³Ã™Å Ã™â€ž Ã˜Â®Ã˜Â§Ã˜Â±Ã˜Â¬Ã™Å ",
    type: "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª",
    price: 80,
    unit: "Ã˜Â«Ã˜Â§Ã˜Â¨Ã˜Âª",
    count: 12,
    description: "Ã˜ÂºÃ˜Â³Ã™Å Ã™â€ž Ã™Ë†Ã˜ÂªÃ™â€ Ã˜Â¸Ã™Å Ã™Â Ã˜Â§Ã™â€žÃ™â€¡Ã™Å Ã™Æ’Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â§Ã˜Â±Ã˜Â¬Ã™Å  Ã™â€žÃ™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©",
    active: true,
  },
  {
    id: 2,
    name: "Ã˜ÂºÃ˜Â³Ã™Å Ã™â€ž Ã˜Â¯Ã˜Â§Ã˜Â®Ã™â€žÃ™Å  Ã™Ë†Ã˜Â®Ã˜Â§Ã˜Â±Ã˜Â¬Ã™Å ",
    type: "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª",
    price: 120,
    unit: "Ã˜Â«Ã˜Â§Ã˜Â¨Ã˜Âª",
    count: 8,
    description: "Ã˜ÂªÃ™â€ Ã˜Â¸Ã™Å Ã™Â Ã™Æ’Ã˜Â§Ã™â€¦Ã™â€ž Ã™â€žÃ™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â¯Ã˜Â§Ã˜Â®Ã™â€ž Ã™Ë†Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â§Ã˜Â±Ã˜Â¬",
    active: true,
  },
  {
    id: 3,
    name: "Ã˜ÂªÃ™â€žÃ™â€¦Ã™Å Ã˜Â¹ Ã™Æ’Ã˜Â§Ã™â€¦Ã™â€ž",
    type: "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª",
    price: 250,
    unit: "Ã˜Â«Ã˜Â§Ã˜Â¨Ã˜Âª",
    count: 4,
    description: "Ã˜ÂªÃ™â€žÃ™â€¦Ã™Å Ã˜Â¹ Ã™Æ’Ã˜Â§Ã™â€¦Ã™â€ž Ã™â€žÃ™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©",
    active: true,
  },
  {
    id: 4,
    name: "Ã˜ÂºÃ˜Â³Ã™Å Ã™â€ž Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯",
    type: "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯",
    price: 30,
    unit: "Ã™â€¦Ã˜ÂªÃ˜Â±",
    count: 0,
    description: "Ã˜ÂºÃ˜Â³Ã™Å Ã™â€ž Ã™Ë†Ã˜ÂªÃ™â€ Ã˜Â¸Ã™Å Ã™Â Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯",
    active: true,
  },
  {
    id: 5,
    name: "Ã˜ÂªÃ™â€ Ã˜Â¸Ã™Å Ã™Â Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯ Ã™ÂÃ˜Â§Ã˜Â®Ã˜Â±",
    type: "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯",
    price: 45,
    unit: "Ã™â€¦Ã˜ÂªÃ˜Â±",
    count: 0,
    description: "Ã˜ÂªÃ™â€ Ã˜Â¸Ã™Å Ã™Â Ã˜Â¹Ã™â€¦Ã™Å Ã™â€š Ã™â€žÃ™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯ Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜Â®Ã˜Â±",
    active: true,
  },
];

const initialSettings = {
  businessName: "Mussa Wash & Clean",
  phone: "",
  address: "",
  invoiceFooter: "Ã˜Â´Ã™Æ’Ã˜Â±Ã™â€¹Ã˜Â§ Ã™â€žÃ˜Â²Ã™Å Ã˜Â§Ã˜Â±Ã˜ÂªÃ™Æ’Ã™â€¦",
  defaultPaymentMethod: "Ã™â€ Ã™â€šÃ˜Â¯Ã™Å ",
  showPhoneOnInvoice: true,
  showAddressOnInvoice: true,
  showFooterOnInvoice: true,
};

// =========================
// Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â¬Ã™â€žÃ˜Â¯ Ã™Ë†Ã˜Â§Ã™â€žÃ™â€¦Ã™â€žÃ™ÂÃ˜Â§Ã˜Âª
// =========================

function ensureDataDirectory() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
}

function ensureJsonFile(filePath, initialData) {
  ensureDataDirectory();

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(initialData, null, 2),
      "utf8"
    );
  }
}

function readJsonFile(filePath, fallbackData) {
  ensureJsonFile(filePath, fallbackData);

  try {
    const content = fs.readFileSync(filePath, "utf8");

    if (!content.trim()) {
      return fallbackData;
    }

    const data = JSON.parse(content);

    return Array.isArray(data) ? data : fallbackData;
  } catch (error) {
    console.error(`Ã˜Â®Ã˜Â·Ã˜Â£ Ã™ÂÃ™Å  Ã™â€šÃ˜Â±Ã˜Â§Ã˜Â¡Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã™â€žÃ™Â: ${filePath}`);
    return fallbackData;
  }
}

function writeJsonFile(filePath, data) {
  ensureDataDirectory();

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// =========================
// Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™â€žÃ˜Â§Ã˜Â¡
// =========================

function readCustomers() {
  return readJsonFile(customersFile, initialCustomers);
}

function writeCustomers(customers) {
  writeJsonFile(customersFile, customers);
}

// =========================
// Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª
// =========================

function readCars() {
  return readJsonFile(carsFile, initialCars);
}

function writeCars(cars) {
  writeJsonFile(carsFile, cars);
}

// =========================
// Ã˜Â§Ã™â€žÃ™ÂÃ™Ë†Ã˜Â§Ã˜ÂªÃ™Å Ã˜Â±
// =========================

function readInvoices() {
  return readJsonFile(invoicesFile, initialInvoices);
}

function writeInvoices(invoices) {
  writeJsonFile(invoicesFile, invoices);
}

// =========================
// Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™ÂÃ˜Â§Ã˜Âª
// =========================

function readExpenses() {
  return readJsonFile(expensesFile, initialExpenses);
}

function writeExpenses(expenses) {
  writeJsonFile(expensesFile, expenses);
}

// =========================
// Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯
// =========================

function readCarpets() {
  return readJsonFile(carpetsFile, initialCarpets);
}

function writeCarpets(carpets) {
  writeJsonFile(carpetsFile, carpets);
}

function readMemberships() {
  return readJsonFile(
    membershipsFile,
    initialMemberships
  );
}

function writeMemberships(memberships) {
  writeJsonFile(
    membershipsFile,
    memberships
  );
}

// =========================
// Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â§Ã˜Âª
// =========================

function readServices() {
  return readJsonFile(servicesFile, initialServices);
}

function writeServices(services) {
  writeJsonFile(servicesFile, services);
}

// =========================
// Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¹Ã˜Â¯Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª
// =========================

function readSettings() {
  ensureJsonFile(settingsFile, initialSettings);

  try {
    const content = fs.readFileSync(settingsFile, "utf8");

    if (!content.trim()) {
      return { ...initialSettings };
    }

    const data = JSON.parse(content);

    if (!data || Array.isArray(data)) {
      return { ...initialSettings };
    }

    return {
      ...initialSettings,
      ...data,
    };
  } catch (error) {
    console.error(
      `Ã˜Â®Ã˜Â·Ã˜Â£ Ã™ÂÃ™Å  Ã™â€šÃ˜Â±Ã˜Â§Ã˜Â¡Ã˜Â© Ã™â€¦Ã™â€žÃ™Â Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¹Ã˜Â¯Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª: ${settingsFile}`
    );
    return { ...initialSettings };
  }
}

function writeSettings(settings) {
  writeJsonFile(settingsFile, {
    ...initialSettings,
    ...settings,
  });
}


// =========================
// Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦Ã™Å Ã™â€ 
// =========================

function readUsers() {
  return readJsonFile(usersFile, initialUsers);
}

function writeUsers(users) {
  writeJsonFile(usersFile, users);
}

// =========================
// Ã˜Â§Ã™â€žÃ˜ÂµÃ™ÂÃ˜Â­Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â¦Ã™Å Ã˜Â³Ã™Å Ã˜Â©
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mussa Car Wash System is running!",
  });
});

// =========================
// Ã˜ÂªÃ˜Â³Ã˜Â¬Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¯Ã˜Â®Ã™Ë†Ã™â€ž
// =========================

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const cleanUser = String(username || "").trim();
  const cleanPass = String(password || "");

  const users = readUsers();
  const found = users.find(
    (u) =>
      String(u.username).trim() === cleanUser &&
      String(u.password) === cleanPass &&
      u.active !== false
  );

  if (found) {
    return res.json({
      success: true,
      message: "ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù†Ø¬Ø§Ø­",
      user: {
        id: found.id,
        name: found.name,
        username: found.username,
        role: found.role || "Ù…ÙˆØ¸Ù",
      },
    });
  }

  // ØªÙˆØ§ÙÙ‚ Ù…Ø¹ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ù‚Ø¯ÙŠÙ…
  if (
    cleanUser === OWNER_USERNAME &&
    cleanPass === OWNER_PASSWORD
  ) {
    return res.json({
      success: true,
      message: "ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù†Ø¬Ø§Ø­",
      user: {
        id: 1,
        name: "Ø§Ù„Ù…Ø¯ÙŠØ±",
        username: "admin",
        role: "Ù…Ø§Ù„Ùƒ",
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø£Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©",
  });
});

// =====================================================
// Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† (Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†)
// =====================================================

app.get("/api/users", (req, res) => {
  const users = readUsers().map((u) => {
    const { password, ...rest } = u;
    return rest;
  });
  return res.json({ success: true, users });
});

app.post("/api/users", (req, res) => {
  const { name, username, password, role, active } = req.body;

  if (!String(name || "").trim() || !String(username || "").trim() || !password) {
    return res.status(400).json({
      success: false,
      message: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ÙˆÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ù…Ø·Ù„ÙˆØ¨Ø©",
    });
  }

  const users = readUsers();
  const cleanUsername = String(username).trim();

  if (users.some((u) => String(u.username).trim() === cleanUsername)) {
    return res.status(400).json({
      success: false,
      message: "Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù„ÙØ¹Ù„",
    });
  }

  const newUser = {
    id: Date.now(),
    name: String(name).trim(),
    username: cleanUsername,
    password: String(password),
    role: role || "Ù…ÙˆØ¸Ù",
    active: active !== false,
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...safe } = newUser;
  return res.status(201).json({
    success: true,
    message: "ØªÙ…Øª Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø¨Ù†Ø¬Ø§Ø­",
    user: safe,
  });
});

app.put("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯",
    });
  }

  const { name, username, password, role, active } = req.body;

  if (!String(name || "").trim() || !String(username || "").trim()) {
    return res.status(400).json({
      success: false,
      message: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…Ø·Ù„ÙˆØ¨Ø§Ù†",
    });
  }

  const cleanUsername = String(username).trim();
  if (
    users.some(
      (u) => u.id !== userId && String(u.username).trim() === cleanUsername
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…Ø³ØªØ®Ø¯Ù… Ø¨Ø§Ù„ÙØ¹Ù„",
    });
  }

  const updated = {
    ...users[index],
    name: String(name).trim(),
    username: cleanUsername,
    role: role || users[index].role || "Ù…ÙˆØ¸Ù",
    active: active !== false,
  };

  if (password && String(password).trim()) {
    updated.password = String(password).trim();
  }

  users[index] = updated;
  writeUsers(users);

  const { password: _, ...safe } = updated;
  return res.json({
    success: true,
    message: "ØªÙ… ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø¨Ù†Ø¬Ø§Ø­",
    user: safe,
  });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯",
    });
  }

  if (user.username === "admin") {
    return res.status(400).json({
      success: false,
      message: "Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø­Ø°Ù Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø¯ÙŠØ± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
    });
  }

  writeUsers(users.filter((u) => u.id !== userId));
  return res.json({ success: true, message: "ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø¨Ù†Ø¬Ø§Ø­" });
});

app.post("/api/users/change-password", (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Ø¨ÙŠØ§Ù†Ø§Øª ØºÙŠØ± Ù…ÙƒØªÙ…Ù„Ø©",
    });
  }

  if (String(newPassword).length < 4) {
    return res.status(400).json({
      success: false,
      message: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ù‚ØµÙŠØ±Ø© Ø¬Ø¯Ù‹Ø§",
    });
  }

  const users = readUsers();
  const index = users.findIndex(
    (u) => String(u.username).trim() === String(username).trim()
  );

  if (index === -1 || String(users[index].password) !== String(currentPassword)) {
    return res.status(400).json({
      success: false,
      message: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø§Ù„ÙŠØ© ØºÙŠØ± ØµØ­ÙŠØ­Ø©",
    });
  }

  users[index].password = String(newPassword);
  writeUsers(users);

  return res.json({
    success: true,
    message: "ØªÙ… ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø¨Ù†Ø¬Ø§Ø­",
  });
});

// =====================================================
// Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡
// =====================================================

app.get("/api/customers", (req, res) => {
  res.json({
    success: true,
    customers: readCustomers(),
  });
});

app.post("/api/customers", (req, res) => {
  const {
    name,
    phone,
    address,
    notes,
    cars,
    carpets,
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã˜Â³Ã™â€¦ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã™Ë†Ã˜Â±Ã™â€šÃ™â€¦ Ã˜Â§Ã™â€žÃ™â€¡Ã˜Â§Ã˜ÂªÃ™Â Ã™â€¦Ã˜Â·Ã™â€žÃ™Ë†Ã˜Â¨Ã˜Â§Ã™â€ ",
    });
  }

  const customers = readCustomers();

  const cleanPhone = String(phone).trim();

  const duplicatePhone = customers.some(
    (customer) =>
      String(customer.phone).trim() === cleanPhone
  );

  if (duplicatePhone) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â±Ã™â€šÃ™â€¦ Ã˜Â§Ã™â€žÃ™â€¡Ã˜Â§Ã˜ÂªÃ™Â Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯ Ã˜Â¨Ã˜Â§Ã™â€žÃ™ÂÃ˜Â¹Ã™â€ž",
    });
  }

  const newCustomer = {
    id: Date.now(),
    name: String(name).trim(),
    phone: cleanPhone,
    address: address ? String(address).trim() : "",
    notes: notes ? String(notes).trim() : "",
    cars: Number(cars) || 0,
    carpets: Number(carpets) || 0,
  };

  customers.push(newCustomer);
  writeCustomers(customers);

  return res.status(201).json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    customer: newCustomer,
  });
});

app.put("/api/customers/:id", (req, res) => {
  const customerId = Number(req.params.id);
  const customers = readCustomers();

  const index = customers.findIndex(
    (customer) => customer.id === customerId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const {
    name,
    phone,
    address,
    notes,
    cars,
    carpets,
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã˜Â³Ã™â€¦ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã™Ë†Ã˜Â±Ã™â€šÃ™â€¦ Ã˜Â§Ã™â€žÃ™â€¡Ã˜Â§Ã˜ÂªÃ™Â Ã™â€¦Ã˜Â·Ã™â€žÃ™Ë†Ã˜Â¨Ã˜Â§Ã™â€ ",
    });
  }

  const cleanPhone = String(phone).trim();

  const duplicatePhone = customers.some(
    (customer) =>
      customer.id !== customerId &&
      String(customer.phone).trim() === cleanPhone
  );

  if (duplicatePhone) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â±Ã™â€šÃ™â€¦ Ã˜Â§Ã™â€žÃ™â€¡Ã˜Â§Ã˜ÂªÃ™Â Ã™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦ Ã™â€žÃ˜Â¯Ã™â€° Ã˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜Â¢Ã˜Â®Ã˜Â±",
    });
  }

  const updatedCustomer = {
    ...customers[index],
    name: String(name).trim(),
    phone: cleanPhone,
    address: address ? String(address).trim() : "",
    notes: notes ? String(notes).trim() : "",
    cars: Number(cars) || 0,
    carpets: Number(carpets) || 0,
  };

  customers[index] = updatedCustomer;
  writeCustomers(customers);

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    customer: updatedCustomer,
  });
});

app.delete("/api/customers/:id", (req, res) => {
  const customerId = Number(req.params.id);

  const customers = readCustomers();
  const cars = readCars();

  const exists = customers.some(
    (customer) => customer.id === customerId
  );

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const hasCars = cars.some(
    (car) => car.customerId === customerId
  );

  if (hasCars) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™â€žÃ˜Â§ Ã™Å Ã™â€¦Ã™Æ’Ã™â€  Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã™â€šÃ˜Â¨Ã™â€ž Ã˜Â­Ã˜Â°Ã™Â Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜ÂªÃ™â€¡ Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â±Ã˜ÂªÃ˜Â¨Ã˜Â·Ã˜Â©",
    });
  }

  const updatedCustomers = customers.filter(
    (customer) => customer.id !== customerId
  );

  writeCustomers(updatedCustomers);

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª
// =====================================================

app.get("/api/cars", (req, res) => {
  res.json({
    success: true,
    cars: readCars(),
  });
});

app.post("/api/cars", (req, res) => {
  const {
    customerId,
    plateNumber,
    brand,
    model,
    color,
    year,
    notes,
    active,
  } = req.body;

  if (
    !customerId ||
    !plateNumber ||
    !brand ||
    !model ||
    !color ||
    !year
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const customers = readCustomers();

  const customerExists = customers.some(
    (customer) =>
      customer.id === Number(customerId)
  );

  if (!customerExists) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const cars = readCars();
  const cleanPlate = String(plateNumber).trim();

  const duplicatePlate = cars.some(
    (car) =>
      String(car.plateNumber).trim() === cleanPlate
  );

  if (duplicatePlate) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â±Ã™â€šÃ™â€¦ Ã˜Â§Ã™â€žÃ™â€žÃ™Ë†Ã˜Â­Ã˜Â© Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯ Ã˜Â¨Ã˜Â§Ã™â€žÃ™ÂÃ˜Â¹Ã™â€ž",
    });
  }

  const newCar = {
    id: Date.now(),
    customerId: Number(customerId),
    plateNumber: cleanPlate,
    brand: String(brand).trim(),
    model: String(model).trim(),
    color: String(color).trim(),
    year: Number(year),
    notes: notes ? String(notes).trim() : "",
    active: active !== false,
  };

  cars.push(newCar);
  writeCars(cars);

  return res.status(201).json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    car: newCar,
  });
});

app.put("/api/cars/:id", (req, res) => {
  const carId = Number(req.params.id);
  const cars = readCars();

  const index = cars.findIndex(
    (car) => car.id === carId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const {
    customerId,
    plateNumber,
    brand,
    model,
    color,
    year,
    notes,
    active,
  } = req.body;

  if (
    !customerId ||
    !plateNumber ||
    !brand ||
    !model ||
    !color ||
    !year
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const customers = readCustomers();

  const customerExists = customers.some(
    (customer) =>
      customer.id === Number(customerId)
  );

  if (!customerExists) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const cleanPlate = String(plateNumber).trim();

  const duplicatePlate = cars.some(
    (car) =>
      car.id !== carId &&
      String(car.plateNumber).trim() === cleanPlate
  );

  if (duplicatePlate) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â±Ã™â€šÃ™â€¦ Ã˜Â§Ã™â€žÃ™â€žÃ™Ë†Ã˜Â­Ã˜Â© Ã™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦ Ã™ÂÃ™Å  Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â£Ã˜Â®Ã˜Â±Ã™â€°",
    });
  }

  const updatedCar = {
    ...cars[index],
    customerId: Number(customerId),
    plateNumber: cleanPlate,
    brand: String(brand).trim(),
    model: String(model).trim(),
    color: String(color).trim(),
    year: Number(year),
    notes: notes ? String(notes).trim() : "",
    active: active !== false,
  };

  cars[index] = updatedCar;
  writeCars(cars);

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    car: updatedCar,
  });
});

app.delete("/api/cars/:id", (req, res) => {
  const carId = Number(req.params.id);
  const cars = readCars();

  const exists = cars.some(
    (car) => car.id === carId
  );

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const updatedCars = cars.filter(
    (car) => car.id !== carId
  );

  writeCars(updatedCars);

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â§Ã˜Âª
// =====================================================

app.get("/api/services", (req, res) => {
  const { type, active } = req.query;

  let services = readServices();

  if (type && type !== "Ã˜Â§Ã™â€žÃ™Æ’Ã™â€ž") {
    services = services.filter(
      (service) => service.type === type
    );
  }

  if (active === "true") {
    services = services.filter(
      (service) => service.active
    );
  }

  return res.json({
    success: true,
    services,
  });
});

app.post("/api/services", (req, res) => {
  const {
    name,
    type,
    price,
    unit,
    description,
    active,
  } = req.body;

  if (
    !String(name || "").trim() ||
    !type ||
    price === undefined ||
    Number(price) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  if (
    type !== "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª" &&
    type !== "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯"
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã™â€ Ã™Ë†Ã˜Â¹ Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â­Ã™Å Ã˜Â­",
    });
  }

  const services = readServices();
  const cleanName = String(name).trim();

  if (
    services.some(
      (service) =>
        String(service.name).trim() ===
        cleanName
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã˜Â³Ã™â€¦ Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯ Ã˜Â¨Ã˜Â§Ã™â€žÃ™ÂÃ˜Â¹Ã™â€ž",
    });
  }

  const newService = {
    id: Date.now(),
    name: cleanName,
    type,
    price: Number(price),
    unit: unit || "Ã˜Â«Ã˜Â§Ã˜Â¨Ã˜Âª",
    count: 0,
    description: description
      ? String(description).trim()
      : "",
    active: active !== false,
  };

  services.push(newService);
  writeServices(services);

  return res.status(201).json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    service: newService,
  });
});

app.put("/api/services/:id", (req, res) => {
  const serviceId = Number(req.params.id);

  const services = readServices();

  const index = services.findIndex(
    (service) =>
      service.id === serviceId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const {
    name,
    type,
    price,
    unit,
    description,
    active,
  } = req.body;

  if (
    !String(name || "").trim() ||
    !type ||
    price === undefined ||
    Number(price) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  if (
    type !== "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª" &&
    type !== "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯"
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã™â€ Ã™Ë†Ã˜Â¹ Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â­Ã™Å Ã˜Â­",
    });
  }

  const cleanName = String(name).trim();

  if (
    services.some(
      (service) =>
        service.id !== serviceId &&
        String(service.name).trim() ===
        cleanName
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã˜Â³Ã™â€¦ Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã™â€¦Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã™â€¦ Ã˜Â¨Ã˜Â§Ã™â€žÃ™ÂÃ˜Â¹Ã™â€ž",
    });
  }

  const updatedService = {
    ...services[index],
    name: cleanName,
    type,
    price: Number(price),
    unit: unit || "Ã˜Â«Ã˜Â§Ã˜Â¨Ã˜Âª",
    description: description
      ? String(description).trim()
      : "",
    active: active !== false,
  };

  services[index] = updatedService;

  writeServices(services);

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    service: updatedService,
  });
});

app.delete("/api/services/:id", (req, res) => {
  const serviceId = Number(req.params.id);

  const services = readServices();

  if (
    !services.some(
      (service) =>
        service.id === serviceId
    )
  ) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  writeServices(
    services.filter(
      (service) =>
        service.id !== serviceId
    )
  );

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â¯Ã™â€¦Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¹Ã˜Â¯Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª
// =====================================================

app.get("/api/settings", (req, res) => {
  return res.json({
    success: true,
    settings: readSettings(),
  });
});

app.put("/api/settings", (req, res) => {
  const {
    businessName,
    phone,
    address,
    invoiceFooter,
    defaultPaymentMethod,
    showPhoneOnInvoice,
    showAddressOnInvoice,
    showFooterOnInvoice,
  } = req.body;

  const cleanSettings = {
    businessName:
      String(
        businessName ||
        initialSettings.businessName
      ).trim() ||
      initialSettings.businessName,

    phone:
      String(phone || "").trim(),

    address:
      String(address || "").trim(),

    invoiceFooter:
      String(invoiceFooter || "").trim(),

    defaultPaymentMethod:
      [
        "Ã™â€ Ã™â€šÃ˜Â¯Ã™Å ",
        "Ã˜Â¨Ã˜Â·Ã˜Â§Ã™â€šÃ˜Â©",
        "Ã˜ÂªÃ˜Â­Ã™Ë†Ã™Å Ã™â€ž",
      ].includes(
        defaultPaymentMethod
      )
        ? defaultPaymentMethod
        : initialSettings.defaultPaymentMethod,



    showPhoneOnInvoice:
      showPhoneOnInvoice !== false,

    showAddressOnInvoice:
      showAddressOnInvoice !== false,

    showFooterOnInvoice:
      showFooterOnInvoice !== false,
  };
  writeSettings(cleanSettings);

  return res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã™ÂÃ˜Â¸ Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¹Ã˜Â¯Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    settings: readSettings(),
  });
});

app.post("/api/settings/reset", (req, res) => {
  writeSettings(initialSettings);

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â¹Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¹Ã˜Â¯Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â§Ã™ÂÃ˜ÂªÃ˜Â±Ã˜Â§Ã˜Â¶Ã™Å Ã˜Â©",
    settings: readSettings(),
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â§Ã˜Âª
// =====================================================

app.get("/api/memberships", (req, res) => {
  try {
    res.json({
      success: true,
      memberships: readMemberships(),
    });
  } catch (error) {
    console.error("Ã˜ÂªÃ˜Â¹Ã˜Â°Ã˜Â± Ã˜ÂªÃ˜Â­Ã™â€¦Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â§Ã˜Âª:", error);

    res.status(500).json({
      success: false,
      message: "Ã˜ÂªÃ˜Â¹Ã˜Â°Ã˜Â± Ã˜ÂªÃ˜Â­Ã™â€¦Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â§Ã˜Âª",
    });
  }
});

app.post("/api/memberships", (req, res) => {
  const {
    customerId,
    planName,
    durationMonths,
    startDate,
    endDate,
    totalVisits,
    remainingVisits,
    price,
    status,
    notes,
  } = req.body;

  if (
    !customerId ||
    !planName ||
    !startDate ||
    !endDate ||
    Number(durationMonths) <= 0 ||
    Number(totalVisits) < 0 ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const customers = readCustomers();
  const customer = customers.find(
    (item) => item.id === Number(customerId)
  );

  if (!customer) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const memberships = readMemberships();

  const total =
    Number(totalVisits) || 0;

  const newMembership = {
    id: Date.now(),
    customerId: Number(customerId),
    customerName: customer.name,
    customerPhone: customer.phone,
    planName: String(planName).trim(),
    durationMonths: Number(durationMonths),
    startDate: String(startDate),
    endDate: String(endDate),
    totalVisits: total,
    remainingVisits: Math.max(
      0,
      Math.min(
        total,
        remainingVisits === undefined
          ? total
          : Number(remainingVisits) || 0
      )
    ),
    price: Number(price) || 0,
    status: status === "Ã™â€¦Ã™â€ Ã˜ÂªÃ™â€¡Ã™Å Ã˜Â©" ? "Ã™â€¦Ã™â€ Ã˜ÂªÃ™â€¡Ã™Å Ã˜Â©" : "Ã˜Â³Ã˜Â§Ã˜Â±Ã™Å Ã˜Â©",
    notes: notes ? String(notes).trim() : "",
    createdAt: new Date().toISOString(),
  };

  memberships.unshift(newMembership);
  writeMemberships(memberships);

  res.status(201).json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    membership: newMembership,
  });
});

app.put("/api/memberships/:id", (req, res) => {
  const id = Number(req.params.id);
  const memberships = readMemberships();
  const index = memberships.findIndex(
    (membership) => membership.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const {
    customerId,
    planName,
    durationMonths,
    startDate,
    endDate,
    totalVisits,
    remainingVisits,
    price,
    status,
    notes,
  } = req.body;

  if (
    !customerId ||
    !planName ||
    !startDate ||
    !endDate ||
    Number(durationMonths) <= 0 ||
    Number(totalVisits) < 0 ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const customers = readCustomers();
  const customer = customers.find(
    (item) => item.id === Number(customerId)
  );

  if (!customer) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const total = Number(totalVisits) || 0;
  const safeRemaining = Math.max(
    0,
    Math.min(
      total,
      Number(remainingVisits) || 0
    )
  );

  const updatedMembership = {
    ...memberships[index],
    customerId: Number(customerId),
    customerName: customer.name,
    customerPhone: customer.phone,
    planName: String(planName).trim(),
    durationMonths: Number(durationMonths),
    startDate: String(startDate),
    endDate: String(endDate),
    totalVisits: total,
    remainingVisits: safeRemaining,
    price: Number(price) || 0,
    status: status === "Ã™â€¦Ã™â€ Ã˜ÂªÃ™â€¡Ã™Å Ã˜Â©" ? "Ã™â€¦Ã™â€ Ã˜ÂªÃ™â€¡Ã™Å Ã˜Â©" : "Ã˜Â³Ã˜Â§Ã˜Â±Ã™Å Ã˜Â©",
    notes: notes ? String(notes).trim() : "",
  };

  memberships[index] = updatedMembership;
  writeMemberships(memberships);

  res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    membership: updatedMembership,
  });
});

app.delete("/api/memberships/:id", (req, res) => {
  const id = Number(req.params.id);
  const memberships = readMemberships();

  if (!memberships.some((membership) => membership.id === id)) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  writeMemberships(
    memberships.filter(
      (membership) => membership.id !== id
    )
  );

  res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

app.post("/api/memberships/:id/use-visit", (req, res) => {
  const id = Number(req.params.id);
  const memberships = readMemberships();
  const index = memberships.findIndex(
    (membership) => membership.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const membership = memberships[index];

  if (membership.status !== "Ã˜Â³Ã˜Â§Ã˜Â±Ã™Å Ã˜Â©") {
    return res.status(400).json({
      success: false,
      message: "Ã™â€¡Ã˜Â°Ã™â€¡ Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã™â€žÃ™Å Ã˜Â³Ã˜Âª Ã˜Â³Ã˜Â§Ã˜Â±Ã™Å Ã˜Â©",
    });
  }

  if (Number(membership.remainingVisits) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Ã™â€žÃ˜Â§ Ã˜ÂªÃ™Ë†Ã˜Â¬Ã˜Â¯ Ã˜Â²Ã™Å Ã˜Â§Ã˜Â±Ã˜Â§Ã˜Âª Ã™â€¦Ã˜ÂªÃ˜Â¨Ã™â€šÃ™Å Ã˜Â© Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â©",
    });
  }

  membership.remainingVisits =
    Number(membership.remainingVisits) - 1;

  if (membership.remainingVisits <= 0) {
    membership.remainingVisits = 0;
    membership.status = "Ã™â€¦Ã™â€ Ã˜ÂªÃ™â€¡Ã™Å Ã˜Â©";
  }

  memberships[index] = membership;
  writeMemberships(memberships);

  res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â³Ã˜Â¬Ã™Å Ã™â€ž Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â®Ã˜Â¯Ã˜Â§Ã™â€¦ Ã˜Â²Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã™â€¦Ã™â€  Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â©",
    membership,
  });
});

app.post("/api/memberships/:id/renew", (req, res) => {
  const id = Number(req.params.id);
  const memberships = readMemberships();
  const index = memberships.findIndex(
    (membership) => membership.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const {
    durationMonths,
    startDate,
    endDate,
    totalVisits,
    price,
  } = req.body;

  if (
    Number(durationMonths) <= 0 ||
    !startDate ||
    !endDate ||
    Number(totalVisits) < 0 ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¬Ã˜Â¯Ã™Å Ã˜Â¯ Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const updatedMembership = {
    ...memberships[index],
    durationMonths: Number(durationMonths),
    startDate: String(startDate),
    endDate: String(endDate),
    totalVisits: Number(totalVisits) || 0,
    remainingVisits: Number(totalVisits) || 0,
    price: Number(price) || 0,
    status: "Ã˜Â³Ã˜Â§Ã˜Â±Ã™Å Ã˜Â©",
    updatedAt: new Date().toISOString(),
  };

  memberships[index] = updatedMembership;
  writeMemberships(memberships);

  res.json({
    success: true,
    message: "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¬Ã˜Â¯Ã™Å Ã˜Â¯ Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¶Ã™Ë†Ã™Å Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    membership: updatedMembership,
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â® Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å  Ã™Ë†Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â³Ã˜ÂªÃ˜Â±Ã˜Â¬Ã˜Â§Ã˜Â¹
// =====================================================

app.get("/api/backup", (req, res) => {
  try {
    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      data: {
        customers: readCustomers(),
        cars: readCars(),
        invoices: readInvoices(),
        expenses: readExpenses(),
        carpets: readCarpets(),
        services: readServices(),
        settings: readSettings(),
        memberships: readMemberships(),
      },
    };

    return res.json({
      success: true,
      backup,
    });
  } catch (error) {
    console.error("Ã˜Â®Ã˜Â·Ã˜Â£ Ã˜Â£Ã˜Â«Ã™â€ Ã˜Â§Ã˜Â¡ Ã˜Â¥Ã™â€ Ã˜Â´Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â©:", error);

    return res.status(500).json({
      success: false,
      message: "Ã˜ÂªÃ˜Â¹Ã˜Â°Ã˜Â± Ã˜Â¥Ã™â€ Ã˜Â´Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â©",
    });
  }
});

app.post("/api/backup/restore", (req, res) => {
  try {
    const backup = req.body?.backup || req.body;

    if (!backup || typeof backup !== "object" || !backup.data) {
      return res.status(400).json({
        success: false,
        message: "Ã™â€¦Ã™â€žÃ™Â Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â§Ã™â€žÃ˜Â­",
      });
    }

    const data = backup.data;

    const requiredArrays = [
      "customers",
      "cars",
      "invoices",
      "expenses",
      "carpets",
      "services",
    ];

    for (const key of requiredArrays) {
      if (!Array.isArray(data[key])) {
        return res.status(400).json({
          success: false,
          message: `Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª ${key} Ã˜Â¯Ã˜Â§Ã˜Â®Ã™â€ž Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â§Ã™â€žÃ˜Â­Ã˜Â©`,
        });
      }
    }

    if (
      !data.settings ||
      typeof data.settings !== "object" ||
      Array.isArray(data.settings)
    ) {
      return res.status(400).json({
        success: false,
        message: "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â¥Ã˜Â¹Ã˜Â¯Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª Ã˜Â¯Ã˜Â§Ã˜Â®Ã™â€ž Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â§Ã™â€žÃ˜Â­Ã˜Â©",
      });
    }

    writeCustomers(data.customers);
    writeCars(data.cars);
    writeInvoices(data.invoices);
    writeExpenses(data.expenses);
    writeCarpets(data.carpets);
    writeServices(data.services);
    writeSettings(data.settings);
    writeMemberships(data.memberships || []);

    return res.json({
      success: true,
      message: "Ã˜ÂªÃ™â€¦ Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â±Ã˜Â¬Ã˜Â§Ã˜Â¹ Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    });
  } catch (error) {
    console.error("Ã˜Â®Ã˜Â·Ã˜Â£ Ã˜Â£Ã˜Â«Ã™â€ Ã˜Â§Ã˜Â¡ Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â±Ã˜Â¬Ã˜Â§Ã˜Â¹ Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â©:", error);

    return res.status(500).json({
      success: false,
      message: "Ã˜ÂªÃ˜Â¹Ã˜Â°Ã˜Â± Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â±Ã˜Â¬Ã˜Â§Ã˜Â¹ Ã˜Â§Ã™â€žÃ™â€ Ã˜Â³Ã˜Â®Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â­Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â·Ã™Å Ã˜Â©",
    });
  }
});

// =====================================================
// Ã˜Â§Ã™â€žÃ™ÂÃ™Ë†Ã˜Â§Ã˜ÂªÃ™Å Ã˜Â±
// =====================================================

app.get("/api/invoices", (req, res) => {
  res.json({
    success: true,
    invoices: readInvoices(),
  });
});

app.post("/api/invoices", (req, res) => {
  const {
    invoiceNumber,
    date,
    customerId,
    customerName,
    customerPhone,
    assetType,
    carId,
    carpetId,
    carInfo,
    assetInfo,
    items,
    total,
    paymentMethod,
    paymentStatus,
    paidAmount,
    remainingAmount,
    notes,
  } = req.body;

  if (
    !customerId ||
    !assetType ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  if (
    assetType !== "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©" &&
    assetType !== "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™â€ Ã™Ë†Ã˜Â¹ Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â¨Ã˜Â· Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â­Ã™Å Ã˜Â­",
    });
  }

  if (
    assetType === "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©" &&
    !carId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™Å Ã˜Â¬Ã˜Â¨ Ã˜Â§Ã˜Â®Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©",
    });
  }

  if (
    assetType === "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©" &&
    !carpetId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™Å Ã˜Â¬Ã˜Â¨ Ã˜Â§Ã˜Â®Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©",
    });
  }

  const customers =
    readCustomers();

  const cars =
    readCars();

  const carpets =
    readCarpets();

  const invoices =
    readInvoices();

  const customer =
    customers.find(
      (item) =>
        item.id ===
        Number(customerId)
    );

  if (!customer) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  let finalAssetInfo =
    String(
      assetInfo ||
      carInfo ||
      ""
    ).trim();

  let normalizedCarId =
    null;

  let normalizedCarpetId =
    null;

  if (
    assetType === "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©"
  ) {
    const car =
      cars.find(
        (item) =>
          item.id ===
          Number(carId)
      );

    if (!car) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
      });
    }

    if (
      car.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã™â€žÃ™Å Ã˜Â³Ã˜Âª Ã˜ÂªÃ˜Â§Ã˜Â¨Ã˜Â¹Ã˜Â© Ã™â€žÃ™â€¡Ã˜Â°Ã˜Â§ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž",
      });
    }

    normalizedCarId =
      Number(carId);

    finalAssetInfo =
      finalAssetInfo ||
      `${car.brand} ${car.model} - ${car.plateNumber}`;
  }

  if (
    assetType === "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©"
  ) {
    const carpet =
      carpets.find(
        (item) =>
          item.id ===
          Number(carpetId)
      );

    if (!carpet) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
      });
    }

    if (
      carpet.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã™â€žÃ™Å Ã˜Â³Ã˜Âª Ã˜ÂªÃ˜Â§Ã˜Â¨Ã˜Â¹Ã˜Â© Ã™â€žÃ™â€¡Ã˜Â°Ã˜Â§ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž",
      });
    }

    normalizedCarpetId =
      Number(carpetId);

    finalAssetInfo =
      finalAssetInfo ||
      `${carpet.name} - ${carpet.type} - ${Number(
        carpet.area || 0
      ).toFixed(2)} Ã™â€¦Ã‚Â²`;
  }

  const newInvoice = {
    id: Date.now(),

    invoiceNumber:
      invoiceNumber ||
      `INV-${String(
        invoices.length + 1
      ).padStart(4, "0")}`,

    date:
      date ||
      new Date().toLocaleDateString(
        "ar-EG"
      ),

    customerId:
      Number(customerId),

    customerName:
      customerName ||
      customer.name,

    customerPhone:
      customerPhone ||
      customer.phone,

    assetType,

    carId:
      normalizedCarId,

    carpetId:
      normalizedCarpetId,

    carInfo:
      finalAssetInfo,

    assetInfo:
      finalAssetInfo,

    items,

    total:
      Number(total) || 0,

    paymentMethod:
      paymentMethod ||
      "Ã™â€ Ã™â€šÃ˜Â¯Ã™Å ",

    paymentStatus:
      paymentStatus ||
      "Ã™â€¦Ã˜Â¯Ã™ÂÃ™Ë†Ã˜Â¹Ã˜Â©",

    paidAmount:
      Number(paidAmount) || 0,

    remainingAmount:
      Number(remainingAmount) ||
      0,

    notes:
      notes
        ? String(notes).trim()
        : "",
  };

  invoices.unshift(
    newInvoice
  );

  writeInvoices(
    invoices
  );

  return res.status(201).json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã™ÂÃ˜Â¸ Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    invoice:
      newInvoice,
  });
});

app.put("/api/invoices/:id", (req, res) => {
  const invoiceId =
    Number(req.params.id);

  const invoices =
    readInvoices();

  const index =
    invoices.findIndex(
      (invoice) =>
        invoice.id ===
        invoiceId
    );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const {
    customerId,
    customerName,
    customerPhone,
    assetType,
    carId,
    carpetId,
    carInfo,
    assetInfo,
    items,
    total,
    paymentMethod,
    paymentStatus,
    paidAmount,
    remainingAmount,
    notes,
  } = req.body;

  if (
    !customerId ||
    !assetType ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  if (
    assetType !== "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©" &&
    assetType !== "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™â€ Ã™Ë†Ã˜Â¹ Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â¨Ã˜Â· Ã˜ÂºÃ™Å Ã˜Â± Ã˜ÂµÃ˜Â­Ã™Å Ã˜Â­",
    });
  }

  if (
    assetType === "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©" &&
    !carId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™Å Ã˜Â¬Ã˜Â¨ Ã˜Â§Ã˜Â®Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©",
    });
  }

  if (
    assetType === "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©" &&
    !carpetId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã™Å Ã˜Â¬Ã˜Â¨ Ã˜Â§Ã˜Â®Ã˜ÂªÃ™Å Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©",
    });
  }

  const customers =
    readCustomers();

  const cars =
    readCars();

  const carpets =
    readCarpets();

  const customer =
    customers.find(
      (item) =>
        item.id ===
        Number(customerId)
    );

  if (!customer) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  let finalAssetInfo =
    String(
      assetInfo ||
      carInfo ||
      ""
    ).trim();

  let normalizedCarId =
    null;

  let normalizedCarpetId =
    null;

  if (
    assetType ===
    "Ã˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â©"
  ) {
    const car =
      cars.find(
        (item) =>
          item.id ===
          Number(carId)
      );

    if (!car) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
      });
    }

    if (
      car.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â§Ã˜Â±Ã˜Â© Ã™â€žÃ™Å Ã˜Â³Ã˜Âª Ã˜ÂªÃ˜Â§Ã˜Â¨Ã˜Â¹Ã˜Â© Ã™â€žÃ™â€¡Ã˜Â°Ã˜Â§ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž",
      });
    }

    normalizedCarId =
      Number(carId);

    finalAssetInfo =
      finalAssetInfo ||
      `${car.brand} ${car.model} - ${car.plateNumber}`;
  }

  if (
    assetType ===
    "Ã˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â©"
  ) {
    const carpet =
      carpets.find(
        (item) =>
          item.id ===
          Number(carpetId)
      );

    if (!carpet) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
      });
    }

    if (
      carpet.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã™â€žÃ™Å Ã˜Â³Ã˜Âª Ã˜ÂªÃ˜Â§Ã˜Â¨Ã˜Â¹Ã˜Â© Ã™â€žÃ™â€¡Ã˜Â°Ã˜Â§ Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž",
      });
    }

    normalizedCarpetId =
      Number(carpetId);

    finalAssetInfo =
      finalAssetInfo ||
      `${carpet.name} - ${carpet.type} - ${Number(
        carpet.area || 0
      ).toFixed(2)} Ã™â€¦Ã‚Â²`;
  }

  const updatedInvoice = {
    ...invoices[index],

    customerId:
      Number(customerId),

    customerName:
      customerName ||
      customer.name,

    customerPhone:
      customerPhone ||
      customer.phone,

    assetType,

    carId:
      normalizedCarId,

    carpetId:
      normalizedCarpetId,

    carInfo:
      finalAssetInfo,

    assetInfo:
      finalAssetInfo,

    items,

    total:
      Number(total) || 0,

    paymentMethod:
      paymentMethod ||
      "Ã™â€ Ã™â€šÃ˜Â¯Ã™Å ",

    paymentStatus:
      paymentStatus ||
      "Ã™â€¦Ã˜Â¯Ã™ÂÃ™Ë†Ã˜Â¹Ã˜Â©",

    paidAmount:
      Number(paidAmount) || 0,

    remainingAmount:
      Number(remainingAmount) ||
      0,

    notes:
      notes
        ? String(notes).trim()
        : "",
  };

  invoices[index] =
    updatedInvoice;

  writeInvoices(
    invoices
  );

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    invoice:
      updatedInvoice,
  });
});

app.delete("/api/invoices/:id", (req, res) => {
  const invoiceId =
    Number(req.params.id);

  const invoices =
    readInvoices();

  const exists =
    invoices.some(
      (invoice) =>
        invoice.id ===
        invoiceId
    );

  if (!exists) {
    return res.status(404).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const updatedInvoices =
    invoices.filter(
      (invoice) =>
        invoice.id !==
        invoiceId
    );

  writeInvoices(
    updatedInvoices
  );

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ™ÂÃ˜Â§Ã˜ÂªÃ™Ë†Ã˜Â±Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™ÂÃ˜Â§Ã˜Âª
// =====================================================

app.get("/api/expenses", (req, res) => {
  res.json({
    success: true,
    expenses:
      readExpenses(),
  });
});

app.post("/api/expenses", (req, res) => {
  const {
    date,
    category,
    title,
    amount,
    paymentMethod,
    notes,
  } = req.body;

  if (
    !category ||
    !title ||
    amount === undefined ||
    Number(amount) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const expenses =
    readExpenses();

  const newExpense = {
    id: Date.now(),

    date:
      date ||
      new Date().toLocaleDateString(
        "ar-EG"
      ),

    category:
      String(category).trim(),

    title:
      String(title).trim(),

    amount:
      Number(amount),

    paymentMethod:
      paymentMethod ||
      "Ã™â€ Ã™â€šÃ˜Â¯Ã™Å ",

    notes:
      notes
        ? String(notes).trim()
        : "",
  };

  expenses.unshift(
    newExpense
  );

  writeExpenses(
    expenses
  );

  return res.status(201).json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    expense:
      newExpense,
  });
});

app.put("/api/expenses/:id", (req, res) => {
  const expenseId =
    Number(req.params.id);

  const expenses =
    readExpenses();

  const index =
    expenses.findIndex(
      (expense) =>
        expense.id ===
        expenseId
    );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const {
    date,
    category,
    title,
    amount,
    paymentMethod,
    notes,
  } = req.body;

  if (
    !category ||
    !title ||
    amount === undefined ||
    Number(amount) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const updatedExpense = {
    ...expenses[index],

    date:
      date ||
      expenses[index].date,

    category:
      String(category).trim(),

    title:
      String(title).trim(),

    amount:
      Number(amount),

    paymentMethod:
      paymentMethod ||
      "Ã™â€ Ã™â€šÃ˜Â¯Ã™Å ",

    notes:
      notes
        ? String(notes).trim()
        : "",
  };

  expenses[index] =
    updatedExpense;

  writeExpenses(
    expenses
  );

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    expense:
      updatedExpense,
  });
});

app.delete("/api/expenses/:id", (req, res) => {
  const expenseId =
    Number(req.params.id);

  const expenses =
    readExpenses();

  const exists =
    expenses.some(
      (expense) =>
        expense.id ===
        expenseId
    );

  if (!exists) {
    return res.status(404).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const updatedExpenses =
    expenses.filter(
      (expense) =>
        expense.id !==
        expenseId
    );

  writeExpenses(
    updatedExpenses
  );

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ™â€¦Ã˜ÂµÃ˜Â±Ã™Ë†Ã™Â Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

// =====================================================
// Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯
// =====================================================

app.get("/api/carpets", (req, res) => {
  res.json({
    success: true,
    carpets:
      readCarpets(),
  });
});

app.post("/api/carpets", (req, res) => {
  const {
    customerId,
    name,
    type,
    length,
    width,
    area,
    serviceName,
    servicePrice,
    status,
    notes,
  } = req.body;

  if (
    !customerId ||
    !name ||
    !type
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const customers =
    readCustomers();

  const customerExists =
    customers.some(
      (customer) =>
        customer.id ===
        Number(customerId)
    );

  if (!customerExists) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const carpets =
    readCarpets();

  const newCarpet = {
    id: Date.now(),

    customerId:
      Number(customerId),

    name:
      String(name).trim(),

    type:
      String(type).trim(),

    length:
      Number(length) || 0,

    width:
      Number(width) || 0,

    area:
      Number(area) || 0,

    serviceName:
      serviceName
        ? String(
          serviceName
        ).trim()
        : "",

    servicePrice:
      Number(servicePrice) || 0,

    status:
      status ||
      "Ã˜ÂªÃ™â€¦ Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â³Ã˜ÂªÃ™â€žÃ˜Â§Ã™â€¦",

    notes:
      notes
        ? String(notes).trim()
        : "",

    createdAt:
      new Date().toISOString(),
  };

  carpets.unshift(
    newCarpet
  );

  writeCarpets(
    carpets
  );

  return res.status(201).json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦Ã˜Âª Ã˜Â¥Ã˜Â¶Ã˜Â§Ã™ÂÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    carpet:
      newCarpet,
  });
});

app.put("/api/carpets/:id", (req, res) => {
  const carpetId =
    Number(req.params.id);

  const carpets =
    readCarpets();

  const index =
    carpets.findIndex(
      (carpet) =>
        carpet.id ===
        carpetId
    );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const {
    customerId,
    name,
    type,
    length,
    width,
    area,
    serviceName,
    servicePrice,
    status,
    notes,
  } = req.body;

  if (
    !customerId ||
    !name ||
    !type
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â¨Ã™Å Ã˜Â§Ã™â€ Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Æ’Ã˜ÂªÃ™â€¦Ã™â€žÃ˜Â©",
    });
  }

  const customers =
    readCustomers();

  const customerExists =
    customers.some(
      (customer) =>
        customer.id ===
        Number(customerId)
    );

  if (!customerExists) {
    return res.status(400).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯",
    });
  }

  const updatedCarpet = {
    ...carpets[index],

    customerId:
      Number(customerId),

    name:
      String(name).trim(),

    type:
      String(type).trim(),

    length:
      Number(length) || 0,

    width:
      Number(width) || 0,

    area:
      Number(area) || 0,

    serviceName:
      serviceName
        ? String(
          serviceName
        ).trim()
        : "",

    servicePrice:
      Number(servicePrice) || 0,

    status:
      status ||
      "Ã˜ÂªÃ™â€¦ Ã˜Â§Ã™â€žÃ˜Â§Ã˜Â³Ã˜ÂªÃ™â€žÃ˜Â§Ã™â€¦",

    notes:
      notes
        ? String(notes).trim()
        : "",
  };

  carpets[index] =
    updatedCarpet;

  writeCarpets(
    carpets
  );

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜ÂªÃ˜Â¹Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
    carpet:
      updatedCarpet,
  });
});

app.delete("/api/carpets/:id", (req, res) => {
  const carpetId =
    Number(req.params.id);

  const carpets =
    readCarpets();

  const exists =
    carpets.some(
      (carpet) =>
        carpet.id ===
        carpetId
    );

  if (!exists) {
    return res.status(404).json({
      success: false,
      message:
        "Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã™Ë†Ã˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â©",
    });
  }

  const updatedCarpets =
    carpets.filter(
      (carpet) =>
        carpet.id !==
        carpetId
    );

  writeCarpets(
    updatedCarpets
  );

  return res.json({
    success: true,
    message:
      "Ã˜ÂªÃ™â€¦ Ã˜Â­Ã˜Â°Ã™Â Ã˜Â§Ã™â€žÃ˜Â³Ã˜Â¬Ã˜Â§Ã˜Â¯Ã˜Â© Ã˜Â¨Ã™â€ Ã˜Â¬Ã˜Â§Ã˜Â­",
  });
});

// =========================
// Ã˜ÂªÃ˜Â¬Ã™â€¡Ã™Å Ã˜Â² Ã˜Â§Ã™â€žÃ™â€¦Ã™â€žÃ™ÂÃ˜Â§Ã˜Âª Ã™Ë†Ã˜ÂªÃ˜Â´Ã˜ÂºÃ™Å Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â³Ã™Å Ã˜Â±Ã™ÂÃ˜Â±
// =========================

ensureDataDirectory();

ensureJsonFile(
  customersFile,
  initialCustomers
);

ensureJsonFile(
  carsFile,
  initialCars
);

ensureJsonFile(
  invoicesFile,
  initialInvoices
);

ensureJsonFile(
  expensesFile,
  initialExpenses
);

ensureJsonFile(
  membershipsFile,
  initialMemberships
);

ensureJsonFile(
  carpetsFile,
  initialCarpets
);

ensureJsonFile(
  servicesFile,
  initialServices
);

ensureJsonFile(
  settingsFile,
  initialSettings
);

ensureJsonFile(
  usersFile,
  initialUsers
);

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});

process.on("exit", (code) => {
  console.log("Process exit code:", code);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Leave this window open. Do not close it.");
});

server.on("error", (err) => {
  console.error("Server error:", err);
  if (err.code === "EADDRINUSE") {
    console.error("Port 3000 is already in use. Close the other program using it.");
  }
});