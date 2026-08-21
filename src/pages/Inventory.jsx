import React, { useState, useEffect } from "react";

const STORAGE_KEY = "mussa_inventory";

const defaultItems = [
  { id: 1, name: "شامبو سيارات مركز (جالون)", category: "كيماويات", quantity: 15, minLimit: 5, price: 350 },
  { id: 2, name: "منظف جنوط وفوانيس", category: "كيماويات", quantity: 3, minLimit: 5, price: 120 },
  { id: 3, name: "فوط ميكروفايبر (قطعة)", category: "أدوات", quantity: 45, minLimit: 10, price: 25 },
  { id: 4, name: "معطر جو برائحة الفانيليا", category: "معطرات", quantity: 8, minLimit: 10, price: 60 },
];

const categories = ["كيماويات", "أدوات", "معطرات", "مستهلكات", "أخرى"];

export default function Inventory() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultItems;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "كيماويات",
    quantity: "",
    minLimit: "5",
    price: "",
  });
  const [search, setSearch] = useState("");
  const [qtyModal, setQtyModal] = useState(null); // item for qty adjust
  const [qtyValue, setQtyValue] = useState("");
  const [qtyMode, setQtyMode] = useState("add"); // add | subtract

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const lowCount = items.filter((i) => Number(i.quantity) <= Number(i.minLimit)).length;

  const filtered = items.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(item.name).toLowerCase().includes(q) ||
      String(item.category).toLowerCase().includes(q)
    );
  });

  function openAdd() {
    setEditingItem(null);
    setForm({ name: "", category: "كيماويات", quantity: "", minLimit: "5", price: "" });
    setShowModal(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category || "كيماويات",
      quantity: String(item.quantity),
      minLimit: String(item.minLimit ?? 5),
      price: String(item.price ?? 0),
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("من فضلك أدخل اسم الصنف");
      return;
    }
    if (form.quantity === "" || Number(form.quantity) < 0) {
      alert("من فضلك أدخل كمية صحيحة");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category || "أخرى",
      quantity: Number(form.quantity) || 0,
      minLimit: Number(form.minLimit) || 0,
      price: Number(form.price) || 0,
    };

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...payload } : i))
      );
    } else {
      setItems((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    }
    closeModal();
  }

  function handleDelete(id) {
    const ok = window.confirm("هل أنت متأكد من حذف هذا الصنف؟");
    if (!ok) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function openQty(item, mode) {
    setQtyModal(item);
    setQtyMode(mode);
    setQtyValue("");
  }

  function applyQty(e) {
    e.preventDefault();
    const n = Number(qtyValue);
    if (!n || n <= 0) {
      alert("أدخل كمية صحيحة");
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== qtyModal.id) return i;
        const next =
          qtyMode === "add"
            ? Number(i.quantity) + n
            : Math.max(0, Number(i.quantity) - n);
        return { ...i, quantity: next };
      })
    );
    setQtyModal(null);
    setQtyValue("");
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    fontFamily: "Tahoma, Arial, sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#334155",
    fontWeight: "600",
    fontSize: "13px",
  };

  return (
    <div dir="rtl" style={{ padding: "24px", fontFamily: "Tahoma, Arial, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
            إدارة المخزون
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            متابعة المواد والكيماويات وأدوات الغسيل والنواقص
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "11px 20px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "Tahoma, Arial, sans-serif",
          }}
        >
          + إضافة صنف جديد
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #f1f5f9",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "13px" }}>إجمالي الأصناف</span>
          <h2 style={{ color: "#1e293b", margin: "8px 0 0 0", fontSize: "26px" }}>{items.length}</h2>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "18px 20px",
            borderRadius: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #f1f5f9",
          }}
        >
          <span style={{ color: "#ef4444", fontSize: "13px" }}>أصناف وشيكة على النفاذ</span>
          <h2 style={{ color: "#ef4444", margin: "8px 0 0 0", fontSize: "26px" }}>{lowCount}</h2>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="بحث باسم الصنف أو التصنيف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            maxWidth: "360px",
            background: "#fff",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontSize: "13px" }}>
              <th style={{ padding: "14px 16px" }}>اسم الصنف</th>
              <th style={{ padding: "14px 16px" }}>التصنيف</th>
              <th style={{ padding: "14px 16px" }}>الكمية</th>
              <th style={{ padding: "14px 16px" }}>حد التنبيه</th>
              <th style={{ padding: "14px 16px" }}>السعر</th>
              <th style={{ padding: "14px 16px" }}>الحالة</th>
              <th style={{ padding: "14px 16px", textAlign: "center" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                  لا توجد أصناف
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isLow = Number(item.quantity) <= Number(item.minLimit);
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px", color: "#334155" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "600" }}>{item.name}</td>
                    <td style={{ padding: "14px 16px" }}>{item.category || "عام"}</td>
                    <td style={{ padding: "14px 16px", fontWeight: "700" }}>{item.quantity}</td>
                    <td style={{ padding: "14px 16px" }}>{item.minLimit}</td>
                    <td style={{ padding: "14px 16px" }}>{item.price} ج.م</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: isLow ? "#fee2e2" : "#dcfce7",
                          color: isLow ? "#991b1b" : "#166534",
                        }}
                      >
                        {isLow ? "⚠️ تنبيه نقص" : "متوفر"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                        <button
                          onClick={() => openQty(item, "add")}
                          title="إضافة كمية"
                          style={actionBtn("#ecfdf5", "#047857")}
                        >
                          +
                        </button>
                        <button
                          onClick={() => openQty(item, "subtract")}
                          title="خصم كمية"
                          style={actionBtn("#fff7ed", "#c2410c")}
                        >
                          −
                        </button>
                        <button onClick={() => openEdit(item)} style={actionBtn("#eff6ff", "#1d4ed8")}>
                          تعديل
                        </button>
                        <button onClick={() => handleDelete(item.id)} style={actionBtn("#fef2f2", "#b91c1c")}>
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 18px 0", color: "#1e293b", fontSize: "18px" }}>
              {editingItem ? "تعديل الصنف" : "إضافة صنف جديد"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={labelStyle}>اسم الصنف</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>التصنيف</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={inputStyle}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>الكمية</label>
                  <input
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>حد تنبيه النقص</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minLimit}
                    onChange={(e) => setForm({ ...form, minLimit: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>السعر (جنيه)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: "#e2e8f0",
                    color: "#334155",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quantity Modal */}
      {qtyModal && (
        <div style={overlayStyle} onClick={() => setQtyModal(null)}>
          <div style={{ ...modalStyle, maxWidth: "380px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "17px" }}>
              {qtyMode === "add" ? "إضافة كمية" : "خصم كمية"}
            </h3>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 16px 0" }}>
              {qtyModal.name} — الكمية الحالية: <strong>{qtyModal.quantity}</strong>
            </p>
            <form onSubmit={applyQty}>
              <label style={labelStyle}>الكمية</label>
              <input
                type="number"
                min="1"
                value={qtyValue}
                onChange={(e) => setQtyValue(e.target.value)}
                style={{ ...inputStyle, marginBottom: "16px" }}
                autoFocus
                required
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: qtyMode === "add" ? "#047857" : "#c2410c",
                    color: "#fff",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setQtyModal(null)}
                  style={{
                    flex: 1,
                    background: "#e2e8f0",
                    color: "#334155",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function actionBtn(bg, color) {
  return {
    border: "none",
    background: bg,
    color,
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "Tahoma, Arial, sans-serif",
  };
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "16px",
};

const modalStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "440px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  direction: "rtl",
};
