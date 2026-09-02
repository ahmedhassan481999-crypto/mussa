const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));

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
// تسجيل الدخول
// =========================

const OWNER_USERNAME = "admin";
const OWNER_PASSWORD = "123456";

// =========================
// ملفات البيانات
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
const inventoryFile = path.join(dataDirectory, "inventory.json");
const treasuryFile = path.join(dataDirectory, "treasury.json");

// =========================
// بيانات افتراضية
// =========================

const initialCustomers = [
  {
    id: 1,
    name: "أحمد حسن",
    phone: "01000000000",
    address: "القاهرة",
    notes: "عميل تجريبي",
    cars: 1,
    carpets: 2,
  },
  {
    id: 2,
    name: "محمد علي",
    phone: "01111111111",
    address: "الجيزة",
    notes: "",
    cars: 2,
    carpets: 0,
  },
  {
    id: 3,
    name: "محمود إبراهيم",
    phone: "01222222222",
    address: "مدينة نصر",
    notes: "يفضل التواصل قبل الاستلام",
    cars: 0,
    carpets: 3,
  },
];

const initialCars = [
  {
    id: 1,
    customerId: 1,
    plateNumber: "أ ب ج 1234",
    brand: "Toyota",
    model: "Corolla",
    color: "أبيض",
    year: 2022,
    notes: "غسيل أسبوعي",
    active: true,
  },
  {
    id: 2,
    customerId: 2,
    plateNumber: "د هـ و 5678",
    brand: "Hyundai",
    model: "Elantra",
    color: "أسود",
    year: 2021,
    notes: "",
    active: true,
  },
  {
    id: 3,
    customerId: 2,
    plateNumber: "س ص ع 9012",
    brand: "Kia",
    model: "Sportage",
    color: "رمادي",
    year: 2023,
    notes: "تنظيف داخلي فقط",
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
    name: "المدير",
    username: "admin",
    password: "123456",
    role: "مالك",
    active: true,
  },
];

const initialInventory = [
  { id: 1, name: "شامبو سيارات مركز (جالون)", category: "كيماويات", quantity: 15, minLimit: 5, price: 350 },
  { id: 2, name: "منظف جنوط وفوانيس", category: "كيماويات", quantity: 3, minLimit: 5, price: 120 },
  { id: 3, name: "فوط ميكروفايبر (قطعة)", category: "أدوات", quantity: 45, minLimit: 10, price: 25 },
  { id: 4, name: "معطر جو برائحة الفانيليا", category: "معطرات", quantity: 8, minLimit: 10, price: 60 },
];


const initialServices = [
  {
    id: 1,
    name: "غسيل خارجي",
    type: "سيارات",
    price: 80,
    unit: "ثابت",
    count: 12,
    description: "غسيل وتنظيف الهيكل الخارجي للسيارة",
    active: true,
  },
  {
    id: 2,
    name: "غسيل داخلي وخارجي",
    type: "سيارات",
    price: 120,
    unit: "ثابت",
    count: 8,
    description: "تنظيف كامل للسيارة من الداخل والخارج",
    active: true,
  },
  {
    id: 3,
    name: "تلميع كامل",
    type: "سيارات",
    price: 250,
    unit: "ثابت",
    count: 4,
    description: "تلميع كامل للسيارة",
    active: true,
  },
  {
    id: 4,
    name: "غسيل سجاد",
    type: "سجاد",
    price: 30,
    unit: "متر",
    count: 0,
    description: "غسيل وتنظيف السجاد",
    active: true,
  },
  {
    id: 5,
    name: "تنظيف سجاد فاخر",
    type: "سجاد",
    price: 45,
    unit: "متر",
    count: 0,
    description: "تنظيف عميق للسجاد الفاخر",
    active: true,
  },
];

const initialSettings = {
  businessName: "Mussa Wash & Clean",
  phone: "",
  address: "",
  invoiceFooter: "شكرًا لزيارتكم",
  defaultPaymentMethod: "نقدي",
  showPhoneOnInvoice: true,
  showAddressOnInvoice: true,
  showFooterOnInvoice: true,
  logoData: "",
  qrText: "",
  showLogoOnInvoice: true,
  showQrOnInvoice: true,
};

// =========================
// المجلد والملفات
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
    console.error(`خطأ في قراءة الملف: ${filePath}`);
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
// العملاء
// =========================

function readCustomers() {
  return readJsonFile(customersFile, initialCustomers);
}

function writeCustomers(customers) {
  writeJsonFile(customersFile, customers);
}

// =========================
// السيارات
// =========================

function readCars() {
  return readJsonFile(carsFile, initialCars);
}

function writeCars(cars) {
  writeJsonFile(carsFile, cars);
}

// =========================
// الفواتير
// =========================

function readInvoices() {
  return readJsonFile(invoicesFile, initialInvoices);
}

function writeInvoices(invoices) {
  writeJsonFile(invoicesFile, invoices);
}

// =========================
// المصروفات
// =========================

function readExpenses() {
  return readJsonFile(expensesFile, initialExpenses);
}

function writeExpenses(expenses) {
  writeJsonFile(expensesFile, expenses);
}

// =========================
// السجاد
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
// الخدمات
// =========================

function readServices() {
  return readJsonFile(servicesFile, initialServices);
}

function writeServices(services) {
  writeJsonFile(servicesFile, services);
}

// =========================
// الإعدادات
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
      `خطأ في قراءة ملف الإعدادات: ${settingsFile}`
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
// الصفحة الرئيسية
// =========================


function readUsers() {
  return readJsonFile(usersFile, initialUsers);
}

function writeUsers(users) {
  writeJsonFile(usersFile, users);
}

function readInventory() {
  return readJsonFile(inventoryFile, initialInventory);
}

function writeInventory(items) {
  writeJsonFile(inventoryFile, items);
}

function createInventoryExpense(title, amount, notes) {
  if (!amount || Number(amount) <= 0) return null;
  const expenses = readExpenses();
  const expense = {
    id: Date.now(),
    date: new Date().toLocaleDateString("ar-EG"),
    category: "مشتريات مخزون",
    title: String(title).trim(),
    amount: Number(amount),
    paymentMethod: "نقدي",
    notes: notes ? String(notes).trim() : "تلقائي من المخزون",
  };
  const expNow = getNowParts();
  expense.time = expNow.time;
  expense.createdAt = expNow.createdAt;

  expenses.unshift(expense);
  writeExpenses(expenses);

  addTreasuryMovement({
    type: "out",
    amount: Number(expense.amount),
    title: "مصروف: " + expense.title,
    notes: expense.category || "",
    source: "expense",
    sourceId: expense.id,
    date: expense.date,
    time: expense.time,
    createdAt: expense.createdAt,
  });

  return expense;
}

function deductInventoryUsage(usageList) {
  if (!Array.isArray(usageList) || usageList.length === 0) {
    return { ok: true };
  }
  const items = readInventory();
  for (const row of usageList) {
    const id = Number(row.inventoryId || row.id);
    const qty = Number(row.quantity) || 0;
    if (!id || qty <= 0) continue;
    const index = items.findIndex((x) => x.id === id);
    if (index === -1) {
      return { ok: false, message: "صنف مخزون غير موجود" };
    }
    if (Number(items[index].quantity) < qty) {
      return {
        ok: false,
        message: "الكمية غير كافية للصنف: " + items[index].name,
      };
    }
  }
  for (const row of usageList) {
    const id = Number(row.inventoryId || row.id);
    const qty = Number(row.quantity) || 0;
    if (!id || qty <= 0) continue;
    const index = items.findIndex((x) => x.id === id);
    items[index].quantity = Number(items[index].quantity) - qty;
  }
  writeInventory(items);
  return { ok: true };
}

function restoreInventoryUsage(usageList) {
  if (!Array.isArray(usageList) || usageList.length === 0) {
    return { ok: true };
  }
  const items = readInventory();
  for (const row of usageList) {
    const id = Number(row.inventoryId || row.id);
    const qty = Number(row.quantity) || 0;
    if (!id || qty <= 0) continue;
    const index = items.findIndex((x) => x.id === id);
    if (index === -1) continue;
    items[index].quantity = Number(items[index].quantity || 0) + qty;
  }
  writeInventory(items);
  return { ok: true };
}

function extractUsageFromInvoice(invoice) {
  if (!invoice) return [];
  if (Array.isArray(invoice.inventoryUsage) && invoice.inventoryUsage.length > 0) {
    return invoice.inventoryUsage;
  }
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  return items
    .filter((it) => it && (it.fromInventory || it.inventoryId))
    .map((it) => ({
      inventoryId: Number(it.inventoryId),
      quantity: Number(it.quantity) || 0,
    }))
    .filter((it) => it.inventoryId && it.quantity > 0);
}


// =========================
// الخزينة + الوقت
// =========================

const initialTreasury = {
  openingBalance: 0,
  openingSet: false,
  movements: [],
  closures: [],
};

function ensureTreasuryFile() {
  ensureJsonFile(treasuryFile, initialTreasury);
}

function readTreasury() {
  ensureTreasuryFile();
  try {
    const content = fs.readFileSync(treasuryFile, "utf8");
    const data = JSON.parse(content || "{}");
    return {
      openingBalance: Number(data.openingBalance) || 0,
      openingSet: data.openingSet === true,
      movements: Array.isArray(data.movements) ? data.movements : [],
      closures: Array.isArray(data.closures) ? data.closures : [],
    };
  } catch (e) {
    return {
      openingBalance: 0,
      openingSet: false,
      movements: [],
      closures: [],
    };
  }
}

function writeTreasury(data) {
  writeJsonFile(treasuryFile, {
    openingBalance: Number(data.openingBalance) || 0,
    openingSet: data.openingSet === true,
    movements: Array.isArray(data.movements) ? data.movements : [],
    closures: Array.isArray(data.closures) ? data.closures : [],
  });
}

function getNowParts() {
  const now = new Date();
  const date = now.toLocaleDateString("ar-EG");
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const isPM = hours >= 12;
  const suffix = isPM ? "م" : "ص";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const time = hours + ":" + minutes + " " + suffix;
  const createdAt = now.toISOString();
  return { date, time, createdAt };
}

function isCashMethod(method) {
  const m = String(method || "نقدي").trim();
  return m === "نقدي" || m === "كاش" || m.toLowerCase() === "cash";
}

function getMovementTimestamp(mv) {
  const parsed = Date.parse(mv && mv.createdAt ? mv.createdAt : "");
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getDateKeyFromCreatedAt(createdAt) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTreasuryBalance(treasury) {
  const t = treasury || readTreasury();
  let balance = Number(t.openingBalance) || 0;
  const movements = [...(t.movements || [])].sort(
    (a, b) => getMovementTimestamp(a) - getMovementTimestamp(b)
  );

  for (const mv of movements) {
    const amount = Number(mv.amount) || 0;
    if (mv.type === "in") balance += amount;
    else if (mv.type === "out") balance -= amount;
  }

  return balance;
}

function getTreasurySummary(treasury, dateKey) {
  const t = treasury || readTreasury();
  const key = dateKey || getTodayKey();

  const movements = [...(t.movements || [])].sort(
    (a, b) => getMovementTimestamp(a) - getMovementTimestamp(b)
  );

  let opening = Number(t.openingBalance) || 0;
  let totalIn = 0;
  let totalOut = 0;

  for (const mv of movements) {
    const mvDate = getDateKeyFromCreatedAt(mv.createdAt);
    const amount = Number(mv.amount) || 0;

    if (mvDate && mvDate < key) {
      if (mv.type === "in") opening += amount;
      else if (mv.type === "out") opening -= amount;
    }

    if (mvDate === key) {
      if (mv.type === "in") totalIn += amount;
      else if (mv.type === "out") totalOut += amount;
    }
  }

  return {
    date: key,
    openingBalance: opening,
    totalIn,
    totalOut,
    expectedBalance: opening + totalIn - totalOut,
    currentBalance: getTreasuryBalance(t),
  };
}

function addTreasuryMovement(movement) {
  const treasury = readTreasury();
  const parts = getNowParts();

  const entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    type: movement.type,
    amount: Number(movement.amount) || 0,
    title: String(movement.title || "").trim(),
    notes: movement.notes ? String(movement.notes).trim() : "",
    source: movement.source || "manual",
    sourceId: movement.sourceId || null,
    date: movement.date || parts.date,
    time: movement.time || parts.time,
    createdAt: movement.createdAt || parts.createdAt,
  };

  if (entry.amount <= 0) return null;

  treasury.movements.unshift(entry);
  writeTreasury(treasury);
  return entry;
}

function removeTreasuryBySource(source, sourceId) {
  const treasury = readTreasury();
  const before = treasury.movements.length;

  treasury.movements = treasury.movements.filter(function (mv) {
    return !(mv.source === source && Number(mv.sourceId) === Number(sourceId));
  });

  if (treasury.movements.length !== before) {
    writeTreasury(treasury);
  }
}

function getTreasurySourceLabel(mv) {
  if (!mv) return "غير معروف";
  if (mv.source === "invoice") return "فاتورة";
  if (mv.source === "expense") return "مصروف";
  if (mv.source === "invoice_return") return "مرتجع";
  if (mv.source === "reconciliation") return "تسوية";
  if (mv.source === "manual") {
    return mv.type === "in" ? "إيداع" : "سحب";
  }
  if (mv.source === "opening") return "رصيد افتتاح";
  return "غير معروف";
}


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mussa Car Wash System is running!",
  });
});

// =========================
// تسجيل الدخول
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
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: found.id,
        name: found.name,
        username: found.username,
        role: found.role || "موظف",
      },
    });
  }

  if (cleanUser === OWNER_USERNAME && cleanPass === OWNER_PASSWORD) {
    return res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: 1,
        name: "المدير",
        username: "admin",
        role: "مالك",
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: "اسم المستخدم أو كلمة المرور غير صحيحة",
  });
});


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
      message: "اسم العميل ورقم الهاتف مطلوبان",
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
      message: "رقم الهاتف موجود بالفعل",
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
    message: "تمت إضافة العميل بنجاح",
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
      message: "العميل غير موجود",
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
      message: "اسم العميل ورقم الهاتف مطلوبان",
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
      message: "رقم الهاتف مستخدم لدى عميل آخر",
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
    message: "تم تعديل العميل بنجاح",
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
      message: "العميل غير موجود",
    });
  }

  const hasCars = cars.some(
    (car) => car.customerId === customerId
  );

  if (hasCars) {
    return res.status(400).json({
      success: false,
      message:
        "لا يمكن حذف العميل قبل حذف سياراته المرتبطة",
    });
  }

  const updatedCustomers = customers.filter(
    (customer) => customer.id !== customerId
  );

  writeCustomers(updatedCustomers);

  return res.json({
    success: true,
    message: "تم حذف العميل بنجاح",
  });
});

// =====================================================
// السيارات
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
      message: "بيانات السيارة غير مكتملة",
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
      message: "العميل غير موجود",
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
      message: "رقم اللوحة موجود بالفعل",
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
    message: "تمت إضافة السيارة بنجاح",
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
      message: "السيارة غير موجودة",
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
      message: "بيانات السيارة غير مكتملة",
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
      message: "العميل غير موجود",
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
        "رقم اللوحة مستخدم في سيارة أخرى",
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
    message: "تم تعديل السيارة بنجاح",
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
      message: "السيارة غير موجودة",
    });
  }

  const updatedCars = cars.filter(
    (car) => car.id !== carId
  );

  writeCars(updatedCars);

  return res.json({
    success: true,
    message: "تم حذف السيارة بنجاح",
  });
});

// =====================================================
// الخدمات
// =====================================================

app.get("/api/services", (req, res) => {
  const { type, active } = req.query;

  let services = readServices();

  if (type && type !== "الكل") {
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
      message: "بيانات الخدمة غير مكتملة",
    });
  }

  if (
    type !== "سيارات" &&
    type !== "سجاد"
  ) {
    return res.status(400).json({
      success: false,
      message: "نوع الخدمة غير صحيح",
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
      message: "اسم الخدمة موجود بالفعل",
    });
  }

  const newService = {
    id: Date.now(),
    name: cleanName,
    type,
    price: Number(price),
    unit: unit || "ثابت",
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
    message: "تمت إضافة الخدمة بنجاح",
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
      message: "الخدمة غير موجودة",
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
      message: "بيانات الخدمة غير مكتملة",
    });
  }

  if (
    type !== "سيارات" &&
    type !== "سجاد"
  ) {
    return res.status(400).json({
      success: false,
      message: "نوع الخدمة غير صحيح",
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
      message: "اسم الخدمة مستخدم بالفعل",
    });
  }

  const updatedService = {
    ...services[index],
    name: cleanName,
    type,
    price: Number(price),
    unit: unit || "ثابت",
    description: description
      ? String(description).trim()
      : "",
    active: active !== false,
  };

  services[index] = updatedService;

  writeServices(services);

  return res.json({
    success: true,
    message: "تم تعديل الخدمة بنجاح",
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
      message: "الخدمة غير موجودة",
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
    message: "تم حذف الخدمة بنجاح",
  });
});

// =====================================================
// الإعدادات
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
    logoData,
    qrText,
    showLogoOnInvoice,
    showQrOnInvoice,
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
        "نقدي",
        "بطاقة",
        "تحويل",
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

    logoData:
      typeof logoData === "string" ? logoData : "",

    qrText:
      String(qrText || "").trim(),

    showLogoOnInvoice:
      showLogoOnInvoice !== false,

    showQrOnInvoice:
      showQrOnInvoice !== false,
  };
  try {
    writeSettings(cleanSettings);
    return res.json({
      success: true,
      message: "تم حفظ الإعدادات بنجاح",
      settings: readSettings(),
    });
  } catch (error) {
    console.error("خطأ حفظ الإعدادات:", error);
    return res.status(500).json({
      success: false,
      message: "تعذر حفظ الإعدادات على السيرفر",
    });
  }
});

app.post("/api/settings/reset", (req, res) => {
  writeSettings(initialSettings);

  return res.json({
    success: true,
    message:
      "تم استعادة الإعدادات الافتراضية",
    settings: readSettings(),
  });
});

// =====================================================
// العضويات
// =====================================================

app.get("/api/memberships", (req, res) => {
  try {
    res.json({
      success: true,
      memberships: readMemberships(),
        inventory: readInventory(),
    });
  } catch (error) {
    console.error("تعذر تحميل العضويات:", error);

    res.status(500).json({
      success: false,
      message: "تعذر تحميل العضويات",
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
      message: "بيانات العضوية غير مكتملة",
    });
  }

  const customers = readCustomers();
  const customer = customers.find(
    (item) => item.id === Number(customerId)
  );

  if (!customer) {
    return res.status(400).json({
      success: false,
      message: "العميل غير موجود",
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
    status: status === "منتهية" ? "منتهية" : "سارية",
    notes: notes ? String(notes).trim() : "",
    createdAt: new Date().toISOString(),
  };

  memberships.unshift(newMembership);
  writeMemberships(memberships);

  res.status(201).json({
    success: true,
    message: "تمت إضافة العضوية بنجاح",
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
      message: "العضوية غير موجودة",
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
      message: "بيانات العضوية غير مكتملة",
    });
  }

  const customers = readCustomers();
  const customer = customers.find(
    (item) => item.id === Number(customerId)
  );

  if (!customer) {
    return res.status(400).json({
      success: false,
      message: "العميل غير موجود",
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
    status: status === "منتهية" ? "منتهية" : "سارية",
    notes: notes ? String(notes).trim() : "",
  };

  memberships[index] = updatedMembership;
  writeMemberships(memberships);

  res.json({
    success: true,
    message: "تم تعديل العضوية بنجاح",
    membership: updatedMembership,
  });
});

app.delete("/api/memberships/:id", (req, res) => {
  const id = Number(req.params.id);
  const memberships = readMemberships();

  if (!memberships.some((membership) => membership.id === id)) {
    return res.status(404).json({
      success: false,
      message: "العضوية غير موجودة",
    });
  }

  writeMemberships(
    memberships.filter(
      (membership) => membership.id !== id
    )
  );

  res.json({
    success: true,
    message: "تم حذف العضوية بنجاح",
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
      message: "العضوية غير موجودة",
    });
  }

  const membership = memberships[index];

  if (membership.status !== "سارية") {
    return res.status(400).json({
      success: false,
      message: "هذه العضوية ليست سارية",
    });
  }

  if (Number(membership.remainingVisits) <= 0) {
    return res.status(400).json({
      success: false,
      message: "لا توجد زيارات متبقية في العضوية",
    });
  }

  membership.remainingVisits =
    Number(membership.remainingVisits) - 1;

  if (membership.remainingVisits <= 0) {
    membership.remainingVisits = 0;
    membership.status = "منتهية";
  }

  memberships[index] = membership;
  writeMemberships(memberships);

  res.json({
    success: true,
    message: "تم تسجيل استخدام زيارة من العضوية",
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
      message: "العضوية غير موجودة",
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
      message: "بيانات التجديد غير مكتملة",
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
    status: "سارية",
    updatedAt: new Date().toISOString(),
  };

  memberships[index] = updatedMembership;
  writeMemberships(memberships);

  res.json({
    success: true,
    message: "تم تجديد العضوية بنجاح",
    membership: updatedMembership,
  });
});

// =====================================================
// النسخ الاحتياطي والاسترجاع
// =====================================================


// =====================================================
// المستخدمين (الموظفين)
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
    return res.status(400).json({ success: false, message: "الاسم واسم المستخدم وكلمة المرور مطلوبة" });
  }
  const users = readUsers();
  const cleanUsername = String(username).trim();
  if (users.some((u) => String(u.username).trim() === cleanUsername)) {
    return res.status(400).json({ success: false, message: "اسم المستخدم موجود بالفعل" });
  }
  const newUser = {
    id: Date.now(),
    name: String(name).trim(),
    username: cleanUsername,
    password: String(password),
    role: role || "موظف",
    active: active !== false,
  };
  users.push(newUser);
  writeUsers(users);
  const { password: _, ...safe } = newUser;
  return res.status(201).json({ success: true, message: "تمت إضافة المستخدم بنجاح", user: safe });
});

app.put("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
  }
  const { name, username, password, role, active } = req.body;
  if (!String(name || "").trim() || !String(username || "").trim()) {
    return res.status(400).json({ success: false, message: "الاسم واسم المستخدم مطلوبان" });
  }
  const cleanUsername = String(username).trim();
  if (users.some((u) => u.id !== userId && String(u.username).trim() === cleanUsername)) {
    return res.status(400).json({ success: false, message: "اسم المستخدم مستخدم بالفعل" });
  }
  const updated = {
    ...users[index],
    name: String(name).trim(),
    username: cleanUsername,
    role: role || users[index].role || "موظف",
    active: active !== false,
  };
  if (password && String(password).trim()) {
    updated.password = String(password).trim();
  }
  users[index] = updated;
  writeUsers(users);
  const { password: _, ...safe } = updated;
  return res.json({ success: true, message: "تم تعديل المستخدم بنجاح", user: safe });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
  }
  if (user.username === "admin") {
    return res.status(400).json({ success: false, message: "لا يمكن حذف حساب المدير الرئيسي" });
  }
  writeUsers(users.filter((u) => u.id !== userId));
  return res.json({ success: true, message: "تم حذف المستخدم بنجاح" });
});

app.post("/api/users/change-password", (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "بيانات غير مكتملة" });
  }
  if (String(newPassword).length < 4) {
    return res.status(400).json({ success: false, message: "كلمة المرور الجديدة قصيرة جدا" });
  }
  const users = readUsers();
  const index = users.findIndex((u) => String(u.username).trim() === String(username).trim());
  if (index === -1 || String(users[index].password) !== String(currentPassword)) {
    return res.status(400).json({ success: false, message: "كلمة المرور الحالية غير صحيحة" });
  }
  users[index].password = String(newPassword);
  writeUsers(users);
  return res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
});

// =====================================================
// المخزون
// =====================================================

app.get("/api/inventory", (req, res) => {
  return res.json({ success: true, items: readInventory() });
});

app.post("/api/inventory", (req, res) => {
  const { name, category, quantity, minLimit, price, createExpense } = req.body;
  if (!String(name || "").trim()) {
    return res.status(400).json({ success: false, message: "اسم الصنف مطلوب" });
  }
  const qty = Number(quantity) || 0;
  if (qty < 0) {
    return res.status(400).json({ success: false, message: "الكمية غير صحيحة" });
  }
  const items = readInventory();
  const unitPrice = Number(price) || 0;
  const newItem = {
    id: Date.now(),
    name: String(name).trim(),
    category: String(category || "أخرى").trim(),
    quantity: qty,
    minLimit: Number(minLimit) || 0,
    price: unitPrice,
  };
  items.unshift(newItem);
  writeInventory(items);
  let expense = null;
  if (createExpense !== false && qty > 0 && unitPrice > 0) {
    expense = createInventoryExpense(
      "شراء مخزون: " + newItem.name,
      qty * unitPrice,
      "كمية " + qty + " × " + unitPrice + " جنيه"
    );
  }
  return res.status(201).json({ success: true, message: "تمت إضافة الصنف بنجاح", item: newItem, expense });
});

app.put("/api/inventory/:id", (req, res) => {
  const itemId = Number(req.params.id);
  const items = readInventory();
  const index = items.findIndex((x) => x.id === itemId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "الصنف غير موجود" });
  }
  const { name, category, quantity, minLimit, price } = req.body;
  if (!String(name || "").trim()) {
    return res.status(400).json({ success: false, message: "اسم الصنف مطلوب" });
  }
  items[index] = {
    ...items[index],
    name: String(name).trim(),
    category: String(category || items[index].category || "أخرى").trim(),
    quantity: Number(quantity) >= 0 ? Number(quantity) : items[index].quantity,
    minLimit: Number(minLimit) >= 0 ? Number(minLimit) : items[index].minLimit,
    price: Number(price) >= 0 ? Number(price) : items[index].price,
  };
  writeInventory(items);
  return res.json({ success: true, message: "تم تعديل الصنف بنجاح", item: items[index] });
});

app.delete("/api/inventory/:id", (req, res) => {
  const itemId = Number(req.params.id);
  const items = readInventory();
  if (!items.some((x) => x.id === itemId)) {
    return res.status(404).json({ success: false, message: "الصنف غير موجود" });
  }
  writeInventory(items.filter((x) => x.id !== itemId));
  return res.json({ success: true, message: "تم حذف الصنف بنجاح" });
});

app.post("/api/inventory/:id/adjust", (req, res) => {
  const itemId = Number(req.params.id);
  const { mode, quantity, createExpense } = req.body;
  const qty = Number(quantity) || 0;
  if (!qty || qty <= 0) {
    return res.status(400).json({ success: false, message: "أدخل كمية صحيحة" });
  }
  if (mode !== "add" && mode !== "subtract") {
    return res.status(400).json({ success: false, message: "نوع العملية غير صحيح" });
  }
  const items = readInventory();
  const index = items.findIndex((x) => x.id === itemId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "الصنف غير موجود" });
  }
  const current = Number(items[index].quantity) || 0;
  if (mode === "subtract" && current < qty) {
    return res.status(400).json({ success: false, message: "الكمية المتاحة غير كافية" });
  }
  items[index].quantity = mode === "add" ? current + qty : current - qty;
  writeInventory(items);
  let expense = null;
  if (mode === "add" && createExpense !== false) {
    const unitPrice = Number(items[index].price) || 0;
    if (unitPrice > 0) {
      expense = createInventoryExpense(
        "شراء مخزون: " + items[index].name,
        qty * unitPrice,
        "زيادة كمية " + qty + " × " + unitPrice + " جنيه"
      );
    }
  }
  return res.json({
    success: true,
    message: mode === "add" ? "تمت إضافة الكمية" : "تم خصم الكمية",
    item: items[index],
    expense,
  });
});


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
    console.error("خطأ أثناء إنشاء النسخة الاحتياطية:", error);

    return res.status(500).json({
      success: false,
      message: "تعذر إنشاء النسخة الاحتياطية",
    });
  }
});

app.post("/api/backup/restore", (req, res) => {
  try {
    const backup = req.body?.backup || req.body;

    if (!backup || typeof backup !== "object" || !backup.data) {
      return res.status(400).json({
        success: false,
        message: "ملف النسخة الاحتياطية غير صالح",
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
          message: `بيانات ${key} داخل النسخة الاحتياطية غير صالحة`,
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
        message: "بيانات الإعدادات داخل النسخة الاحتياطية غير صالحة",
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
    if (Array.isArray(data.inventory)) {
      writeInventory(data.inventory);
    }

    return res.json({
      success: true,
      message: "تم استرجاع النسخة الاحتياطية بنجاح",
    });
  } catch (error) {
    console.error("خطأ أثناء استرجاع النسخة الاحتياطية:", error);

    return res.status(500).json({
      success: false,
      message: "تعذر استرجاع النسخة الاحتياطية",
    });
  }
});

// =====================================================
// الفواتير
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
    inventoryUsage,
  } = req.body;

  const usageCheck = deductInventoryUsage(inventoryUsage);
  if (!usageCheck.ok) {
    return res.status(400).json({
      success: false,
      message: usageCheck.message,
    });
  }

  if (
    !customerId ||
    !assetType ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "بيانات الفاتورة غير مكتملة",
    });
  }

  if (
    assetType !== "سيارة" &&
    assetType !== "سجادة"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "نوع الربط غير صحيح",
    });
  }

  if (
    assetType === "سيارة" &&
    !carId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "يجب اختيار السيارة",
    });
  }

  if (
    assetType === "سجادة" &&
    !carpetId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "يجب اختيار السجادة",
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
        "العميل غير موجود",
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
    assetType === "سيارة"
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
          "السيارة غير موجودة",
      });
    }

    if (
      car.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "السيارة ليست تابعة لهذا العميل",
      });
    }

    normalizedCarId =
      Number(carId);

    finalAssetInfo =
      finalAssetInfo ||
      `${car.brand} ${car.model} - ${car.plateNumber}`;
  }

  if (
    assetType === "سجادة"
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
          "السجادة غير موجودة",
      });
    }

    if (
      carpet.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "السجادة ليست تابعة لهذا العميل",
      });
    }

    normalizedCarpetId =
      Number(carpetId);

    finalAssetInfo =
      finalAssetInfo ||
      `${carpet.name} - ${carpet.type} - ${Number(
        carpet.area || 0
      ).toFixed(2)} م²`;
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
      "نقدي",

    paymentStatus:
      paymentStatus ||
      "مدفوعة",

    paidAmount:
      Number(paidAmount) || 0,

    remainingAmount:
      Number(remainingAmount) ||
      0,

    notes:
      notes
        ? String(notes).trim()
        : "",

    inventoryUsage: Array.isArray(inventoryUsage)
      ? inventoryUsage
          .filter((row) => Number(row.inventoryId || row.id) && Number(row.quantity) > 0)
          .map((row) => ({
            inventoryId: Number(row.inventoryId || row.id),
            quantity: Number(row.quantity) || 0,
          }))
      : extractUsageFromInvoice({ items }),
  };

  const nowParts = getNowParts();
  if (!newInvoice.date) newInvoice.date = nowParts.date;
  newInvoice.time = nowParts.time;
  newInvoice.createdAt = nowParts.createdAt;

  invoices.unshift(
    newInvoice
  );

  writeInvoices(
    invoices
  );

  if (
    isCashMethod(newInvoice.paymentMethod) &&
    Number(newInvoice.paidAmount) > 0
  ) {
    addTreasuryMovement({
      type: "in",
      amount: Number(newInvoice.paidAmount),
      title: "تحصيل فاتورة " + (newInvoice.invoiceNumber || ""),
      notes: newInvoice.customerName || "",
      source: "invoice",
      sourceId: newInvoice.id,
      date: newInvoice.date,
      time: newInvoice.time,
      createdAt: newInvoice.createdAt,
    });
  }

  return res.status(201).json({
    success: true,
    message:
      "تم حفظ الفاتورة بنجاح",
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
        "الفاتورة غير موجودة",
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
        "بيانات الفاتورة غير مكتملة",
    });
  }

  if (
    assetType !== "سيارة" &&
    assetType !== "سجادة"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "نوع الربط غير صحيح",
    });
  }

  if (
    assetType === "سيارة" &&
    !carId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "يجب اختيار السيارة",
    });
  }

  if (
    assetType === "سجادة" &&
    !carpetId
  ) {
    return res.status(400).json({
      success: false,
      message:
        "يجب اختيار السجادة",
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
        "العميل غير موجود",
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
    "سيارة"
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
          "السيارة غير موجودة",
      });
    }

    if (
      car.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "السيارة ليست تابعة لهذا العميل",
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
    "سجادة"
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
          "السجادة غير موجودة",
      });
    }

    if (
      carpet.customerId !==
      Number(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "السجادة ليست تابعة لهذا العميل",
      });
    }

    normalizedCarpetId =
      Number(carpetId);

    finalAssetInfo =
      finalAssetInfo ||
      `${carpet.name} - ${carpet.type} - ${Number(
        carpet.area || 0
      ).toFixed(2)} م²`;
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
      "نقدي",

    paymentStatus:
      paymentStatus ||
      "مدفوعة",

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

  // مزامنة الخزينة مع الفاتورة بعد التعديل:
  // نحذف التأثير النقدي القديم ثم نعيد بناءه حسب وسيلة الدفع والمبلغ الجديد.
  removeTreasuryBySource("invoice", invoiceId);

  if (
    isCashMethod(updatedInvoice.paymentMethod) &&
    Number(updatedInvoice.paidAmount) > 0
  ) {
    addTreasuryMovement({
      type: "in",
      amount: Number(updatedInvoice.paidAmount),
      title: "تحصيل فاتورة " + (updatedInvoice.invoiceNumber || ""),
      notes: updatedInvoice.customerName || "",
      source: "invoice",
      sourceId: updatedInvoice.id,
      date: updatedInvoice.date,
      time: updatedInvoice.time,
      createdAt: updatedInvoice.createdAt,
    });
  }

  return res.json({
    success: true,
    message:
      "تم تعديل الفاتورة بنجاح وتحديث تأثيرها على الخزينة",
    invoice:
      updatedInvoice,
  });
});


app.post("/api/invoices/:id/return", (req, res) => {
  const invoiceId = Number(req.params.id);
  const invoices = readInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoiceId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "الفاتورة غير موجودة",
    });
  }

  const invoice = invoices[index];

  if (invoice.returned === true || invoice.status === "مرتجعة") {
    return res.status(400).json({
      success: false,
      message: "الفاتورة مرتجعة بالفعل",
    });
  }

  // إرجاع المخزون
  const usage = extractUsageFromInvoice(invoice);
  restoreInventoryUsage(usage);

  // مرتجع الخزينة: حركة خروج جديدة (السجل القديم يفضل)
  if (
    isCashMethod(invoice.paymentMethod) &&
    Number(invoice.paidAmount) > 0
  ) {
    const parts = getNowParts();
    addTreasuryMovement({
      type: "out",
      amount: Number(invoice.paidAmount),
      title: "مرتجع فاتورة " + (invoice.invoiceNumber || ""),
      notes: (invoice.customerName || "") + " — خصم من الصندوق بسبب المرتجع",
      source: "invoice_return",
      sourceId: invoiceId,
      date: parts.date,
      time: parts.time,
      createdAt: parts.createdAt,
    });
  }

  // إرجاع زيارة العضوية إن وجدت
  if (invoice.coveredByMembership && invoice.membershipId) {
    const memberships = readMemberships();
    const mIndex = memberships.findIndex(
      (m) => Number(m.id) === Number(invoice.membershipId)
    );
    if (mIndex !== -1) {
      memberships[mIndex] = {
        ...memberships[mIndex],
        remainingVisits:
          Number(memberships[mIndex].remainingVisits || 0) + 1,
        status: "سارية",
      };
      writeMemberships(memberships);
    }
  }

  const nowParts = getNowParts();
  const updated = {
    ...invoice,
    returned: true,
    status: "مرتجعة",
    paymentStatus: "مرتجعة",
    returnedAt: nowParts.createdAt,
    returnedDate: nowParts.date,
    returnedTime: nowParts.time,
  };

  invoices[index] = updated;
  writeInvoices(invoices);

  return res.json({
    success: true,
    message: "تم مرتجع الفاتورة — ما زالت ظاهرة في القائمة",
    invoice: updated,
    restoredInventory: usage,
  });
});

app.delete("/api/invoices/:id", (req, res) => {
  const invoiceId = Number(req.params.id);
  const invoices = readInvoices();
  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: "الفاتورة غير موجودة",
    });
  }

  // إرجاع كميات المخزون عند حذف/مرتجع الفاتورة
  const usage = extractUsageFromInvoice(invoice);
  restoreInventoryUsage(usage);

  removeTreasuryBySource("invoice", invoiceId);
  removeTreasuryBySource("invoice_return", invoiceId);

  const updatedInvoices = invoices.filter((inv) => inv.id !== invoiceId);
  writeInvoices(updatedInvoices);

  return res.json({
    success: true,
    message:
      usage.length > 0
        ? "تم حذف الفاتورة وإرجاع كميات المخزون"
        : "تم حذف الفاتورة بنجاح",
    restoredInventory: usage,
  });
});

// =====================================================
// المصروفات
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
        "بيانات المصروف غير مكتملة",
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
      "نقدي",

    notes:
      notes
        ? String(notes).trim()
        : "",
  };

  const expNow = getNowParts();
  if (!newExpense.date) newExpense.date = expNow.date;
  newExpense.time = expNow.time;
  newExpense.createdAt = expNow.createdAt;

  expenses.unshift(
    newExpense
  );

  writeExpenses(
    expenses
  );

  if (isCashMethod(newExpense.paymentMethod) && Number(newExpense.amount) > 0) {
    addTreasuryMovement({
      type: "out",
      amount: Number(newExpense.amount),
      title: "مصروف: " + newExpense.title,
      notes: newExpense.category || "",
      source: "expense",
      sourceId: newExpense.id,
      date: newExpense.date,
      time: newExpense.time,
      createdAt: newExpense.createdAt,
    });
  }

  return res.status(201).json({
    success: true,
    message:
      "تمت إضافة المصروف بنجاح",
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
        "المصروف غير موجود",
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
        "بيانات المصروف غير مكتملة",
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
      "نقدي",

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

  // مزامنة الخزينة مع المصروف بعد التعديل.
  removeTreasuryBySource("expense", expenseId);

  if (
    isCashMethod(updatedExpense.paymentMethod) &&
    Number(updatedExpense.amount) > 0
  ) {
    const expNow = getNowParts();
    addTreasuryMovement({
      type: "out",
      amount: Number(updatedExpense.amount),
      title: "مصروف: " + updatedExpense.title,
      notes: updatedExpense.category || "",
      source: "expense",
      sourceId: updatedExpense.id,
      date: updatedExpense.date,
      time: updatedExpense.time || expNow.time,
      createdAt: updatedExpense.createdAt || expNow.createdAt,
    });
  }

  return res.json({
    success: true,
    message:
      "تم تعديل المصروف بنجاح وتحديث تأثيره على الخزينة",
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
        "المصروف غير موجود",
    });
  }

  removeTreasuryBySource("expense", expenseId);

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
      "تم حذف المصروف وإرجاع تأثيره على الخزينة",
  });
});

// =====================================================
// السجاد
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
        "بيانات السجادة غير مكتملة",
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
        "العميل غير موجود",
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
      "تم الاستلام",

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
      "تمت إضافة السجادة بنجاح",
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
        "السجادة غير موجودة",
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
        "بيانات السجادة غير مكتملة",
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
        "العميل غير موجود",
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
      "تم الاستلام",

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
      "تم تعديل السجادة بنجاح",
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
        "السجادة غير موجودة",
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
      "تم حذف السجادة بنجاح",
  });
});

// =========================
// تجهيز الملفات وتشغيل السيرفر
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
  treasuryFile,
  { openingBalance: 0, openingSet: false, movements: [], closures: [] }
);

ensureJsonFile(
  settingsFile,
  initialSettings
);


ensureJsonFile(usersFile, initialUsers);
ensureJsonFile(inventoryFile, initialInventory);


// =====================================================
// الخزينة
// =====================================================

app.get("/api/treasury", (req, res) => {
  const treasury = readTreasury();
  const today = getTodayKey();
  const summaryToday = getTreasurySummary(treasury, today);

  return res.json({
    success: true,
    openingBalance: treasury.openingBalance,
    openingSet: treasury.openingSet,
    balance: getTreasuryBalance(treasury),
    movements: treasury.movements,
    closures: treasury.closures,
    today: summaryToday,
  });
});

app.post("/api/treasury/opening", (req, res) => {
  const amount = Number(req.body.amount);

  if (isNaN(amount) || amount < 0) {
    return res.status(400).json({
      success: false,
      message: "رصيد الافتتاح غير صحيح",
    });
  }

  const treasury = readTreasury();
  treasury.openingBalance = amount;
  treasury.openingSet = true;
  writeTreasury(treasury);

  return res.json({
    success: true,
    message: "تم حفظ رصيد الافتتاح",
    openingBalance: treasury.openingBalance,
    openingSet: true,
    balance: getTreasuryBalance(treasury),
  });
});

app.delete("/api/treasury/movement/:id", (req, res) => {
  const id = Number(req.params.id);
  const treasury = readTreasury();
  const movement = treasury.movements.find((mv) => Number(mv.id) === id);

  if (!movement) {
    return res.status(404).json({
      success: false,
      message: "الحركة غير موجودة",
    });
  }

  if (movement.source !== "manual") {
    return res.status(400).json({
      success: false,
      message:
        movement.source === "invoice"
          ? "حركة الفاتورة تتعدل من الفاتورة نفسها"
          : movement.source === "expense"
            ? "حركة المصروف تتعدل من المصروف نفسه"
            : movement.source === "invoice_return"
              ? "حركة المرتجع مرتبطة بالفاتورة المرتجعة"
              : "لا يمكن إلغاء هذه الحركة من الخزينة مباشرة",
    });
  }

  treasury.movements = treasury.movements.filter(
    (mv) => Number(mv.id) !== id
  );
  writeTreasury(treasury);

  return res.json({
    success: true,
    message: "تم إلغاء الحركة وإرجاع تأثيرها على الرصيد",
    balance: getTreasuryBalance(treasury),
  });
});

app.post("/api/treasury/movement", (req, res) => {
  const type = String(req.body.type || "").trim();
  const amount = Number(req.body.amount);
  const title = String(req.body.title || "").trim();
  const notes = String(req.body.notes || "").trim();

  if (type !== "in" && type !== "out") {
    return res.status(400).json({
      success: false,
      message: "نوع الحركة غير صحيح",
    });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "المبلغ يجب أن يكون أكبر من صفر",
    });
  }

  const entry = addTreasuryMovement({
    type,
    amount,
    title: title || (type === "in" ? "إيداع يدوي" : "سحب يدوي"),
    notes,
    source: "manual",
  });

  const treasury = readTreasury();

  return res.status(201).json({
    success: true,
    message: type === "in" ? "تم تسجيل الإيداع" : "تم تسجيل السحب",
    movement: entry,
    balance: getTreasuryBalance(treasury),
  });
});

app.post("/api/treasury/reconcile", (req, res) => {
  const actualBalance = Number(req.body.actualBalance);
  const notes = String(req.body.notes || "").trim();

  if (!Number.isFinite(actualBalance) || actualBalance < 0) {
    return res.status(400).json({
      success: false,
      message: "المبلغ الفعلي غير صحيح",
    });
  }

  const treasury = readTreasury();
  const expectedBalance = getTreasuryBalance(treasury);
  const difference = actualBalance - expectedBalance;

  if (Math.abs(difference) < 0.005) {
    return res.json({
      success: true,
      message: "الخزينة متطابقة بالفعل ولا تحتاج تسوية",
      balance: expectedBalance,
      difference: 0,
      movement: null,
    });
  }

  const movement = addTreasuryMovement({
    type: difference > 0 ? "in" : "out",
    amount: Math.abs(difference),
    title: difference > 0 ? "تسوية زيادة بالخزينة" : "تسوية عجز بالخزينة",
    notes: notes || "تسوية رصيد الخزينة",
    source: "reconciliation",
  });

  const updatedTreasury = readTreasury();

  return res.status(201).json({
    success: true,
    message: "تم تسجيل تسوية الخزينة",
    balance: getTreasuryBalance(updatedTreasury),
    difference,
    movement,
  });
});

app.post("/api/treasury/close", (req, res) => {
  const dateKey = String(req.body.date || getTodayKey()).trim();
  const actualBalance = Number(req.body.actualBalance);
  const notes = String(req.body.notes || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return res.status(400).json({
      success: false,
      message: "تاريخ الإقفال غير صحيح",
    });
  }

  if (!Number.isFinite(actualBalance) || actualBalance < 0) {
    return res.status(400).json({
      success: false,
      message: "المبلغ الفعلي غير صحيح",
    });
  }

  const treasury = readTreasury();
  const existing = treasury.closures.find((c) => c.date === dateKey);

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "هذا اليوم تم إقفاله بالفعل",
    });
  }

  const summary = getTreasurySummary(treasury, dateKey);
  const difference = actualBalance - summary.expectedBalance;
  const parts = getNowParts();

  const closure = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    date: dateKey,
    openingBalance: summary.openingBalance,
    totalIn: summary.totalIn,
    totalOut: summary.totalOut,
    expectedBalance: summary.expectedBalance,
    actualBalance,
    difference,
    notes,
    closedAt: parts.createdAt,
    closedTime: parts.time,
  };

  treasury.closures.unshift(closure);
  writeTreasury(treasury);

  return res.status(201).json({
    success: true,
    message: "تم إقفال اليوم بنجاح",
    closure,
  });
});


app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});