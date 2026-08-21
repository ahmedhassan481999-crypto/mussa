const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

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
const servicesFile = path.join(dataDirectory, "services.json");
const settingsFile = path.join(dataDirectory, "settings.json");

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

  if (
    username === OWNER_USERNAME &&
    password === OWNER_PASSWORD
  ) {
    return res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      user: {
        username: "admin",
        role: "owner",
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: "اسم المستخدم أو كلمة المرور غير صحيحة",
  });
});

// =====================================================
// العملاء
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
  };

  writeSettings(cleanSettings);

  return res.json({
    success: true,
    message: "تم حفظ الإعدادات بنجاح",
    settings: readSettings(),
  });
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

  return res.json({
    success: true,
    message:
      "تم تعديل الفاتورة بنجاح",
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
        "الفاتورة غير موجودة",
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
      "تم حذف الفاتورة بنجاح",
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

  expenses.unshift(
    newExpense
  );

  writeExpenses(
    expenses
  );

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

  return res.json({
    success: true,
    message:
      "تم تعديل المصروف بنجاح",
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
      "تم حذف المصروف بنجاح",
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

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});