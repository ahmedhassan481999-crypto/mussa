import React, { useState, useEffect } from "react";
import { API_BASE_URL, apiFetch as apiFetchRaw } from "../api/client";

async function apiFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  try {
    const raw = localStorage.getItem("mussa_current_user");
    const u = raw ? JSON.parse(raw) : null;
    if (u) {
      if (u.id != null) headers["X-User-Id"] = String(u.id);
      headers["X-User-Name"] = String(u.name || u.username || "");
      headers["X-User-Role"] = String(u.role || "");
      headers["X-User-Username"] = String(u.username || "");
    }
  } catch (e) {}
  return apiFetchRaw(url, { ...options, headers });
}


const categories = ["كيماويات", "أدوات", "معطرات", "مستهلكات", "أخرى"];

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: "", category: "كيماويات", quantity: "", minLimit: "5", price: "" });
  const [search, setSearch] = useState("");
  const [qtyModal, setQtyModal] = useState(null);
  const [qtyValue, setQtyValue] = useState("");
  const [qtyMode, setQtyMode] = useState("add");
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    loadItems();
    function onFocus() {
      loadItems();
    }
    function onInvUpdated() {
      loadItems();
    }
    window.addEventListener("focus", onFocus);
    window.addEventListener("mussa-inventory-updated", onInvUpdated);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("mussa-inventory-updated", onInvUpdated);
    };
  }, []);

  const lowCount = items.filter((i) => Number(i.quantity) <= Number(i.minLimit)).length;
  const filtered = items.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return String(item.name).toLowerCase().includes(q) || String(item.category).toLowerCase().includes(q);
  });

  function openAdd() {
    setEditingItem(null);
    setForm({ name: "", category: "كيماويات", quantity: "", minLimit: "5", price: "" });
    setShowModal(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setForm({ name: item.name, category: item.category || "كيماويات", quantity: String(item.quantity), minLimit: String(item.minLimit ?? 5), price: String(item.price ?? 0) });
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setEditingItem(null); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("من فضلك أدخل اسم الصنف");
    if (form.quantity === "" || Number(form.quantity) < 0) return alert("من فضلك أدخل كمية صحيحة");
    const payload = { name: form.name.trim(), category: form.category || "أخرى", quantity: Number(form.quantity) || 0, minLimit: Number(form.minLimit) || 0, price: Number(form.price) || 0, createExpense: !editingItem };
    try {
      const url = editingItem ? `${API_BASE_URL}/api/inventory/${editingItem.id}` : `${API_BASE_URL}/api/inventory`;
      const response = await apiFetch(url, { method: editingItem ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || !data.success) return alert(data.message || "تعذر حفظ الصنف");
      if (editingItem) setItems((prev) => prev.map((i) => (i.id === editingItem.id ? data.item : i)));
      else { setItems((prev) => [data.item, ...prev]); if (data.expense) setMessage("تم حفظ الصنف وتسجيل مصروف شراء تلقائي"); }
      closeModal();
    } catch (error) { console.error(error); alert("تعذر الاتصال بالسيرفر"); }
  }

  async function handleDelete(id) {
    if (!window.confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inventory/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) return alert(data.message || "تعذر الحذف");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) { console.error(error); alert("تعذر الاتصال بالسيرفر"); }
  }

  function openQty(item, mode) { setQtyModal(item); setQtyMode(mode); setQtyValue(""); }

  async function applyQty(e) {
    e.preventDefault();
    const n = Number(qtyValue);
    if (!n || n <= 0) return alert("أدخل كمية صحيحة");
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inventory/${qtyModal.id}/adjust`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: qtyMode, quantity: n, createExpense: qtyMode === "add" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) return alert(data.message || "تعذر تعديل الكمية");
      setItems((prev) => prev.map((i) => (i.id === qtyModal.id ? data.item : i)));
      if (data.expense) setMessage("تم تسجيل مصروف شراء تلقائي في المصروفات");
      setQtyModal(null); setQtyValue("");
    } catch (error) { console.error(error); alert("تعذر الاتصال بالسيرفر"); }
  }

  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", fontFamily: "Tahoma, Arial, sans-serif", boxSizing: "border-box" };
  const labelStyle = { display: "block", marginBottom: "6px", color: "#334155", fontWeight: "600", fontSize: "13px" };
  const actionBtn = (bg, color) => ({ background: bg, color, border: "none", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tahoma, Arial, sans-serif" });
  const overlayStyle = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" };
  const modalStyle = { background: "#fff", borderRadius: "16px", padding: "22px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" };

  if (loading) return <div dir="rtl" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>جاري تحميل المخزون...</div>;

  return (
    <div dir="rtl" style={{ padding: "24px", fontFamily: "Tahoma, Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>إدارة المخزون</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>شراء المواد يسجل مصروف تلقائي - الخصم يقلل الكمية</p>
        </div>
        <button onClick={openAdd} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Tahoma, Arial, sans-serif" }}>+ إضافة صنف جديد</button>
      </div>
      {message && (
        <div style={{ marginBottom: "14px", padding: "12px 14px", borderRadius: "10px", background: "#ecfdf5", color: "#047857", fontSize: "14px" }}>
          {message}
          <button onClick={() => setMessage("")} style={{ marginRight: "12px", border: "none", background: "transparent", cursor: "pointer", color: "#047857", fontWeight: "700" }}>إغلاق</button>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        <div style={{ background: "#fff", padding: "18px 20px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}>
          <span style={{ color: "#64748b", fontSize: "13px" }}>إجمالي الأصناف</span>
          <h2 style={{ color: "#1e293b", margin: "8px 0 0 0", fontSize: "26px" }}>{items.length}</h2>
        </div>
        <div style={{ background: "#fff", padding: "18px 20px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}>
          <span style={{ color: "#ef4444", fontSize: "13px" }}>أصناف وشيكة على النفاذ</span>
          <h2 style={{ color: "#ef4444", margin: "8px 0 0 0", fontSize: "26px" }}>{lowCount}</h2>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <input type="text" placeholder="بحث باسم الصنف أو التصنيف..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: "360px", background: "#fff" }} />
      </div>
      <div style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", overflow: "auto" }}>
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
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>لا توجد أصناف</td></tr>
            ) : filtered.map((item) => {
              const isLow = Number(item.quantity) <= Number(item.minLimit);
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px", color: "#334155" }}>
                  <td style={{ padding: "14px 16px", fontWeight: "600" }}>{item.name}</td>
                  <td style={{ padding: "14px 16px" }}>{item.category || "عام"}</td>
                  <td style={{ padding: "14px 16px", fontWeight: "700" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 16px" }}>{item.minLimit}</td>
                  <td style={{ padding: "14px 16px" }}>{item.price} ج.م</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: isLow ? "#fee2e2" : "#dcfce7", color: isLow ? "#991b1b" : "#166534" }}>{isLow ? "تنبيه نقص" : "متوفر"}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button onClick={() => openQty(item, "add")} style={actionBtn("#ecfdf5", "#047857")}>+</button>
                      <button onClick={() => openQty(item, "subtract")} style={actionBtn("#fff7ed", "#c2410c")}>-</button>
                      <button onClick={() => openEdit(item)} style={actionBtn("#eff6ff", "#1d4ed8")}>تعديل</button>
                      <button onClick={() => handleDelete(item.id)} style={actionBtn("#fef2f2", "#b91c1c")}>حذف</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 18px 0", color: "#1e293b", fontSize: "18px" }}>{editingItem ? "تعديل الصنف" : "إضافة صنف جديد"}</h3>
            {!editingItem && <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: "13px" }}>عند الإضافة بالكمية والسعر سيتم تسجيل مصروف شراء تلقائي</p>}
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div><label style={labelStyle}>اسم الصنف</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required /></div>
              <div><label style={labelStyle}>التصنيف</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label style={labelStyle}>الكمية</label><input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={inputStyle} required /></div>
                <div><label style={labelStyle}>حد تنبيه النقص</label><input type="number" min="0" value={form.minLimit} onChange={(e) => setForm({ ...form, minLimit: e.target.value })} style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>سعر الوحدة (جنيه)</label><input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} /></div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button type="submit" style={{ flex: 1, background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tahoma, Arial, sans-serif" }}>حفظ</button>
                <button type="button" onClick={closeModal} style={{ flex: 1, background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "10px", padding: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tahoma, Arial, sans-serif" }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {qtyModal && (
        <div style={overlayStyle} onClick={() => setQtyModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "18px" }}>{qtyMode === "add" ? "إضافة كمية (شراء)" : "خصم كمية (صرف)"}</h3>
            <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "13px" }}>{qtyModal.name} - المتاح: {qtyModal.quantity}{qtyMode === "add" ? " - سيتم تسجيل مصروف تلقائي" : ""}</p>
            <form onSubmit={applyQty} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="number" min="1" placeholder="الكمية" value={qtyValue} onChange={(e) => setQtyValue(e.target.value)} style={inputStyle} required />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, background: qtyMode === "add" ? "#059669" : "#ea580c", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tahoma, Arial, sans-serif" }}>تأكيد</button>
                <button type="button" onClick={() => setQtyModal(null)} style={{ flex: 1, background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "10px", padding: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tahoma, Arial, sans-serif" }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
