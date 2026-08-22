const rtlText = {
  direction: "rtl",
  unicodeBidi: "plaintext",
}

const sectionStyle = {
  background: "#fff",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 3px 15px rgba(0,0,0,.06)",
}

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "25px",
  flexWrap: "wrap",
}

const sectionTitleStyle = {
  ...rtlText,
  margin: 0,
  color: "#111827",
  textAlign: "right",
}

const sectionSubtitleStyle = {
  ...rtlText,
  color: "#64748b",
  margin: "7px 0 0",
  textAlign: "right",
}

const statCardStyle = {
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "18px",
}

const statLabelStyle = {
  ...rtlText,
  color: "#64748b",
  fontSize: "13px",
}

const statValueStyle = {
  fontSize: "25px",
  fontWeight: "700",
  color: "#111827",
  marginTop: "7px",
}

const reportBoxStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid #e2e8f0",
  marginTop: "20px",
}

const miniReportCardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  color: "#475569",
  border: "1px solid #e2e8f0",
}

const tableHeaderStyle = {
  padding: "15px",
  textAlign: "right",
  color: "#475569",
}

const tableHeaderCenterStyle = {
  padding: "15px",
  textAlign: "center",
  color: "#475569",
}

const tableCellStyle = {
  padding: "15px",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "right",
}

const tableCellCenterStyle = {
  padding: "15px",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "center",
}

const labelStyle = {
  ...rtlText,
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontWeight: "600",
  textAlign: "right",
}

const smallLabelStyle = {
  ...rtlText,
  display: "block",
  marginBottom: "6px",
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "600",
  textAlign: "right",
}

const inputStyle = {
  width: "100%",
  height: "48px",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  padding: "0 14px",
  fontSize: "15px",
  marginBottom: "18px",
  background: "#fff",
  fontFamily: "Tahoma, Arial, sans-serif",
  outline: "none",
}

const primaryButtonStyle = {
  ...rtlText,
  border: "none",
  borderRadius: "10px",
  padding: "12px 22px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontFamily: "Tahoma, Arial, sans-serif",
}

const secondaryButtonStyle = {
  ...rtlText,
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  padding: "12px 22px",
  background: "#fff",
  color: "#334155",
  cursor: "pointer",
  fontWeight: "600",
  fontFamily: "Tahoma, Arial, sans-serif",
}

const secondaryButtonSmallStyle = {
  ...secondaryButtonStyle,
  padding: "8px 12px",
}

const dangerButtonStyle = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontFamily: "Tahoma, Arial, sans-serif",
}

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, .65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 9999,
}

const modalStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "#fff",
  borderRadius: "22px",
  padding: "28px",
  boxSizing: "border-box",
  boxShadow: "0 25px 70px rgba(0,0,0,.25)",
  maxHeight: "90vh",
  overflowY: "auto",
}

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  gap: "15px",
}

const modalTitleStyle = {
  ...rtlText,
  margin: 0,
  color: "#111827",
}

const closeButtonStyle = {
  width: "36px",
  height: "36px",
  flexShrink: 0,
  border: "none",
  borderRadius: "10px",
  background: "#f1f5f9",
  color: "#475569",
  cursor: "pointer",
  fontSize: "20px",
}

export {
  rtlText,
  sectionStyle,
  sectionHeaderStyle,
  sectionTitleStyle,
  sectionSubtitleStyle,
  statCardStyle,
  statLabelStyle,
  statValueStyle,
  reportBoxStyle,
  miniReportCardStyle,
  tableHeaderStyle,
  tableHeaderCenterStyle,
  tableCellStyle,
  tableCellCenterStyle,
  labelStyle,
  smallLabelStyle,
  inputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  secondaryButtonSmallStyle,
  dangerButtonStyle,
  modalOverlayStyle,
  modalStyle,
  modalHeaderStyle,
  modalTitleStyle,
  closeButtonStyle,
}