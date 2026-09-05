import React, { useState, useEffect } from "react";
import { API_BASE_URL, apiFetch as apiFetchRaw } from "../api/client";

async function apiFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  try {
    const raw = localStorage.getItem("mussa_current_user");
    const u = raw ? JSON.parse(raw) : null;
    if (u) {
      if (u.id != null) headers["X-User-Id"] = String(u.id);
      headers["X-User-Name"] = encodeURIComponent(String(u.name || u.username || ""));
      headers["X-User-Role"] = encodeURIComponent(String(u.role || ""));
      headers["X-User-Username"] = encodeURIComponent(String(u.username || ""));
    }
  } catch (e) {}
  return apiFetchRaw(url, { ...options, headers });
}

const categories = ["كيماويات", "أدوات", "معطرات", "مستهلكات", "أخرى"];

const typeLabel = {
  purchase: "شراء / إضافة",
  subtract: "خصم يدوي",
  damage: "تلف",
  invoice: "صرف فاتورة",
  return: "مرتجع فاتورة",
  count_adjust: "تسوية جرد",
  adjust: "تعديل",
};

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("items");
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
  const [qtyModal, setQtyModal] = useState(null);
  const [qtyValue, setQtyValue] = useState("");
  const [qtyMode, setQtyMode] = useState("add");
  const [qtyReason, setQtyReason] = useState("");
  const [createExpense, setCreateExpense] = useState(true);
  const [message, setMessage] = useState("");
  const [countMap, setCountMap] = useState({});

  async function loadItems() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inventory`);
      const data = await response.json();
      if (data.success) setItems(data.items || []);
    } catch (error) {
      console.error(error);
      setMessage("تعذر تحميل المخزون من السيرفر");
    } finally {
      setLoading(false);
    }
  }

  async function loadMovements() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inventory/movements`);
      const data = await response.json();
      if (data.success) setMovements(data.movements || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadItems();
    loadMovements();
    function onFocus() {
      loadItems();
      loadMovements();
    }
    function onInvUpdated() {
      loadItems();
      loadMovements();
    }
    window.addEventListener("focus", onFocus);
    window.addEventListener("mussa-inventory-updated", onInvUpdated);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("mussa-inventory-updated", onInvUpdated);
    };
  }, []);

  const lowCount = items.filter(
    (i) => Number(i.quantity) <= Number(i.minLimit)
  ).length;

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
    setForm({
      name: "",
      category: "كيماويات",
      quantity: "",
      minLimit: "5",
      price: "",
    });
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

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("من فضلك أدخل اسم الصنف");
    if (form.quantity === "" || Number(form.quantity) < 0)
      return alert("من فضلك أدخل كمية صحيحة");
    const payload = {
      name: form.name.trim(),
      category: form.category || "أخرى",
      quantity: Number(form.quantity) || 0,
      minLimit: Number(form.minLimit) || 0,
      price: Number(form.price) || 0,
      createExpense: !editingItem,
    };
    try {
      const url = editingItem
        ? `${API_BASE_URL}/api/inventory/${editingItem.id}`
        : `${API_BASE_URL}/api/inventory`;
      const response = await apiFetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        return alert(data.message || "تعذر حفظ الصنف");
      if (editingItem)
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? data.item : i))
        );
      else {
        setItems((prev) => [data.item, ...prev]);
        if (data.expense) setMessage("تم حفظ الصنف وتسجيل مصروف شراء تلقائي");
      }
      closeModal();
      loadMovements();
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالسيرفر");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inventory/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        return alert(data.message || "تعذر الحذف");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالسيرفر");
    }
  }

  function openQty(item, mode) {
    setQtyModal(item);
    setQtyMode(mode);
    setQtyValue("");
    setCreateExpense(mode === "add");
    if (mode === "add") setQtyReason("شراء / توريد");
    else if (mode === "damage") setQtyReason("تلف / هالك");
    else setQtyReason("استخدام / خصم يدوي");
  }

  async function handleQty(e) {
    e.preventDefault();
    if (!qtyModal) return;
    const qty = Number(qtyValue);
    if (!qty || qty <= 0) return alert("أدخل كمية صحيحة");
    if (!qtyReason.trim()) return alert("اكتب سبب الحركة");
    try {
      const response = await apiFetch(
        `${API_BASE_URL}/api/inventory/${qtyModal.id}/adjust`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: qtyMode,
            quantity: qty,
            reason: qtyReason.trim(),
            createExpense: qtyMode === "add" && createExpense,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success)
        return alert(data.message || "تعذر تعديل الكمية");
      setItems((prev) =>
        prev.map((i) => (i.id === qtyModal.id ? data.item : i))
      );
      setQtyModal(null);
      if (data.expense) setMessage("تم تسجيل مصروف شراء مع زيادة الكمية");
      loadMovements();
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالسيرفر");
    }
  }

  function startCount() {
    const map = {};
    items.forEach((i) => {
      map[i.id] = String(i.quantity ?? 0);
    });
    setCountMap(map);
    setTab("count");
  }

  async function saveCount() {
    const counts = items.map((i) => ({
      inventoryId: i.id,
      actualQty: Number(countMap[i.id]),
      reason: "جرد مخزون",
    }));
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inventory/count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counts }),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        return alert(data.message || "تعذر حفظ الجرد");
      if (data.items) setItems(data.items);
      alert(data.message || "تم حفظ الجرد");
      loadMovements();
      setTab("items");
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالسيرفر");
    }
  }

  const card = {
    background: "var(--mussa-card, #1e293b)",
    border: "1px solid var(--mussa-border, #334155)",
    borderRadius: "16px",
    padding: "16px",
  };

  if (loading) {
    return (
      <div style={{ padding: 24, color: "#94a3b8" }}>جاري تحميل المخزون...</div>
    );
  }

  return (
    <div style={{ padding: "8px 4px", fontFamily: "Tahoma, Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>إدارة المخزون</h1>
          <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 13 }}>
            أصناف · حركات · جرد —{lowCount > 0 ? ` تحذير: ${lowCount} تحت الحد` : " كل الأصناف ضمن الحد"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={startCount} style={btn("#0f766e", "#fff")}>
            جرد المخزون
          </button>
          <button type="button" onClick={openAdd} style={btn("#2563eb", "#fff")}>
            + صنف جديد
          </button>
        </div>
      </div>

      {message ? (
        <div
          style={{
            ...card,
            marginBottom: 12,
            background: "#064e3b",
            borderColor: "#059669",
            color: "#a7f3d0",
          }}
        >
          {message}
          <button
            type="button"
            onClick={() => setMessage("")}
            style={{ marginRight: 10, border: "none", background: "transparent", cursor: "pointer", color: "#a7f3d0" }}
          >
            X
          </button>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { k: "items", l: "الأصناف" },
          { k: "movements", l: "سجل الحركات" },
          { k: "count", l: "الجرد" },
        ].map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => (t.k === "count" ? startCount() : setTab(t.k))}
            style={{
              border: "1px solid " + (tab === t.k ? "#3b82f6" : "#475569"),
              background: tab === t.k ? "#1d4ed8" : "transparent",
              color: tab === t.k ? "#fff" : "#cbd5e1",
              borderRadius: 999,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "Tahoma, Arial, sans-serif",
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === "items" && (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو التصنيف..."
            style={{
              width: "100%",
              maxWidth: 360,
              marginBottom: 14,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #475569",
              background: "transparent",
              color: "inherit",
              fontFamily: "Tahoma, Arial, sans-serif",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {filtered.map((item) => {
              const low = Number(item.quantity) <= Number(item.minLimit);
              return (
                <div
                  key={item.id}
                  style={{
                    ...card,
                    borderColor: low ? "#f87171" : "#334155",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{item.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                    {item.category}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span>
                      الكمية:{" "}
                      <b style={{ color: low ? "#f87171" : "#34d399" }}>
                        {item.quantity}
                      </b>
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>
                      حد: {item.minLimit}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 12 }}>
                    سعر: {Number(item.price || 0).toLocaleString("en-US")} ج
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => openQty(item, "add")} style={btn("#059669", "#fff", true)}>
                      + شراء
                    </button>
                    <button type="button" onClick={() => openQty(item, "subtract")} style={btn("#d97706", "#fff", true)}>
                      خصم
                    </button>
                    <button type="button" onClick={() => openQty(item, "damage")} style={btn("#dc2626", "#fff", true)}>
                      تلف
                    </button>
                    <button type="button" onClick={() => openEdit(item)} style={btn("#475569", "#e2e8f0", true)}>
                      تعديل
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} style={btn("#7f1d1d", "#fecaca", true)}>
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "movements" && (
        <div style={{ ...card, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: "right", color: "#94a3b8", fontSize: 12 }}>
                <th style={th}>التاريخ</th>
                <th style={th}>الصنف</th>
                <th style={th}>النوع</th>
                <th style={th}>الكمية</th>
                <th style={th}>قبل - بعد</th>
                <th style={th}>السبب</th>
                <th style={th}>بواسطة</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                    لا توجد حركات بعد
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} style={{ borderTop: "1px solid #334155" }}>
                    <td style={td}>
                      <div>{m.date}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{m.time}</div>
                    </td>
                    <td style={{ ...td, fontWeight: 700 }}>{m.itemName}</td>
                    <td style={td}>{typeLabel[m.type] || m.type}</td>
                    <td
                      style={{
                        ...td,
                        fontWeight: 800,
                        color: Number(m.quantity) >= 0 ? "#34d399" : "#f87171",
                      }}
                    >
                      {Number(m.quantity) > 0 ? "+" : ""}
                      {m.quantity}
                    </td>
                    <td style={td}>
                      {m.before} → {m.after}
                    </td>
                    <td style={td}>{m.reason || "—"}</td>
                    <td style={{ ...td, color: "#94a3b8", fontSize: 12 }}>
                      {m.createdByName || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "count" && (
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>جرد المخزون</h3>
          <p style={{ color: "#94a3b8", fontSize: 13 }}>
            اكتب الكمية الفعلية الموجودة. النظام يسجل الفرق تلقائياً.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => {
              const sys = Number(item.quantity) || 0;
              const actual = Number(countMap[item.id]);
              const diff = Number.isFinite(actual) ? actual - sys : 0;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 0.7fr 0.7fr 0.6fr",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.category}</div>
                  </div>
                  <div style={{ color: "#94a3b8" }}>نظام: {sys}</div>
                  <input
                    type="number"
                    min="0"
                    value={countMap[item.id] ?? ""}
                    onChange={(e) =>
                      setCountMap((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #475569",
                      background: "transparent",
                      color: "inherit",
                      fontFamily: "Tahoma, Arial, sans-serif",
                    }}
                  />
                  <div
                    style={{
                      fontWeight: 800,
                      color: diff === 0 ? "#94a3b8" : diff > 0 ? "#34d399" : "#f87171",
                    }}
                  >
                    {diff > 0 ? "+" : ""}
                    {Number.isFinite(actual) ? diff : "—"}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="button" onClick={saveCount} style={btn("#2563eb", "#fff")}>
              حفظ الجرد
            </button>
            <button type="button" onClick={() => setTab("items")} style={btn("#475569", "#e2e8f0")}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div style={overlay}>
          <form onSubmit={handleSave} style={modalBox}>
            <h3 style={{ marginTop: 0 }}>{editingItem ? "تعديل صنف" : "صنف جديد"}</h3>
            <input
              placeholder="اسم الصنف"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={input}
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={input}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="الكمية"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              style={input}
              required
            />
            <input
              type="number"
              placeholder="حد التنبيه"
              value={form.minLimit}
              onChange={(e) => setForm({ ...form, minLimit: e.target.value })}
              style={input}
            />
            <input
              type="number"
              placeholder="السعر"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={input}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ ...btn("#2563eb", "#fff"), flex: 1 }}>
                حفظ
              </button>
              <button type="button" onClick={closeModal} style={{ ...btn("#e2e8f0", "#334155"), flex: 1 }}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {qtyModal && (
        <div style={overlay}>
          <form onSubmit={handleQty} style={modalBox}>
            <h3 style={{ marginTop: 0 }}>
              {qtyMode === "add"
                ? "إضافة / شراء"
                : qtyMode === "damage"
                  ? "تسجيل تلف"
                  : "خصم كمية"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>
              {qtyModal.name} — المتاح: {qtyModal.quantity}
            </p>
            <input
              type="number"
              min="1"
              placeholder="الكمية"
              value={qtyValue}
              onChange={(e) => setQtyValue(e.target.value)}
              style={input}
              required
            />
            <input
              placeholder="سبب الحركة (إجباري)"
              value={qtyReason}
              onChange={(e) => setQtyReason(e.target.value)}
              style={input}
              required
            />
            {qtyMode === "add" && (
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={createExpense}
                  onChange={(e) => setCreateExpense(e.target.checked)}
                />
                تسجيل مصروف شراء تلقائي
              </label>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ ...btn("#2563eb", "#fff"), flex: 1 }}>
                تأكيد
              </button>
              <button
                type="button"
                onClick={() => setQtyModal(null)}
                style={{ ...btn("#e2e8f0", "#334155"), flex: 1 }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function btn(bg, color, small) {
  return {
    border: "none",
    background: bg,
    color,
    borderRadius: 8,
    padding: small ? "6px 10px" : "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: small ? 12 : 13,
    fontFamily: "Tahoma, Arial, sans-serif",
  };
}

const th = { padding: "8px 6px", fontWeight: 700 };
const td = { padding: "10px 6px", fontSize: 13 };

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 6, 23, 0.72)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 16,
};

const modalBox = {
  background: "#1e293b",
  color: "#e2e8f0",
  padding: 22,
  borderRadius: 16,
  width: "100%",
  maxWidth: 420,
  border: "1px solid #334155",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: 10,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#e2e8f0",
  fontFamily: "Tahoma, Arial, sans-serif",
};
