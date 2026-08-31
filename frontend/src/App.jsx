import { useState, useEffect, useMemo } from "react"
import Inventory from "./pages/Inventory";
import { API_BASE_URL, apiFetch } from "./api/client"
import useDebouncedValue from "./hooks/useDebouncedValue"
import {
  initialServices,
  initialCustomers,
  initialCars,
  initialInvoices,
  initialExpenses,
} from "./initialData"
import {
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
} from "./styles/commonStyles"


// تأخير بسيط للبحث عشان يبقى أسرع وأسلس

function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(
    () =>
      localStorage.getItem("mussa_logged_in") === "true"
  )
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("mussa_current_user")
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })
  const [activePage, setActivePage] =
    useState("الرئيسية")
  const [message, setMessage] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])
  const [invoiceInventoryUsage, setInvoiceInventoryUsage] = useState([])

  // =========================
  // الاشتراكات
  // =========================

  const [memberships, setMemberships] = useState([])
  const [showMembershipModal, setShowMembershipModal] = useState(false)
  const [editingMembership, setEditingMembership] = useState(null)
  const [membershipCustomerId, setMembershipCustomerId] = useState("")
  const [membershipPlanName, setMembershipPlanName] = useState("اشتراك شهري")
  const [membershipDurationMonths, setMembershipDurationMonths] = useState(1)
  const [membershipStartDate, setMembershipStartDate] = useState("")
  const [membershipEndDate, setMembershipEndDate] = useState("")
  const [membershipTotalVisits, setMembershipTotalVisits] = useState(4)
  const [membershipRemainingVisits, setMembershipRemainingVisits] = useState(4)
  const [membershipPrice, setMembershipPrice] = useState("")
  const [membershipStatus, setMembershipStatus] = useState("سارية")
  const [membershipNotes, setMembershipNotes] = useState("")
  const [membershipSearch, setMembershipSearch] = useState("")
  const debouncedMembershipSearch = useDebouncedValue(membershipSearch)

  useEffect(() => {
    async function loadMemberships() {
      try {
        const response = await apiFetch(
          `${API_BASE_URL}/api/memberships`
        )
        const data = await response.json()

        if (data.success) {
          setMemberships(data.memberships)
        }
      } catch (error) {
        console.error("تعذر تحميل الاشتراكات:", error)
      }
    }

    loadMemberships()
  }, [])

  useEffect(() => {
    async function loadInventory() {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/inventory`)
        const data = await response.json()
        if (data.success) {
          setInventoryItems(data.items || [])
        }
      } catch (error) {
        console.error("تعذر تحميل المخزون:", error)
      }
    }
    loadInventory()
  }, [])

  // =========================
  // النسخ الاحتياطي
  // =========================

  const [backupMessage, setBackupMessage] = useState("")
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoringBackup, setIsRestoringBackup] = useState(false)

  // =========================
  // الإعدادات
  // =========================

  const defaultSettings = {
    businessName: "Mussa Wash & Clean",
    phone: "",
    address: "",
    invoiceFooter: "شكرًا لزيارتكم",
    defaultPaymentMethod: "نقدي",
    showPhoneOnInvoice: true,
    showAddressOnInvoice: true,
    showFooterOnInvoice: true,
    paperSize: "حراري 80mm",
    whatsappTemplate: "شكرًا لزيارتكم! يمكنكم الاحتفاظ بالفاتورة للمراجعة.",
    ownerPassword: "123456",
  }

  const [settings, setSettings] = useState(defaultSettings)
  const [settingsMessage, setSettingsMessage] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  // الموظفين والصلاحيات
  const [employees, setEmployees] = useState([])
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [empName, setEmpName] = useState("")
  const [empUsername, setEmpUsername] = useState("")
  const [empPassword, setEmpPassword] = useState("")
  const [empRole, setEmpRole] = useState("موظف")
  const [empActive, setEmpActive] = useState(true)

  // تغيير كلمة السر
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/users`)
        const data = await response.json()
        if (data.success) {
          setEmployees(data.users || [])
        }
      } catch (error) {
        console.error("تعذر تحميل المستخدمين:", error)
      }
    }
    if (loggedIn) loadUsers()
  }, [loggedIn])

  function openAddEmployee() {
    setEditingEmployee(null)
    setEmpName("")
    setEmpUsername("")
    setEmpPassword("")
    setEmpRole("موظف")
    setEmpActive(true)
    setShowEmployeeModal(true)
  }

  function openEditEmployee(emp) {
    setEditingEmployee(emp)
    setEmpName(emp.name || "")
    setEmpUsername(emp.username || "")
    setEmpPassword("")
    setEmpRole(emp.role || "موظف")
    setEmpActive(emp.active !== false)
    setShowEmployeeModal(true)
  }

  async function saveEmployee(e) {
    e.preventDefault()
    if (!empName.trim() || !empUsername.trim()) {
      alert("الاسم واسم المستخدم مطلوبان")
      return
    }
    if (!editingEmployee && !empPassword.trim()) {
      alert("كلمة المرور مطلوبة للموظف الجديد")
      return
    }

    const payload = {
      name: empName.trim(),
      username: empUsername.trim(),
      role: empRole,
      active: empActive,
    }
    if (empPassword.trim()) {
      payload.password = empPassword.trim()
    }

    try {
      const url = editingEmployee
        ? `${API_BASE_URL}/api/users/${editingEmployee.id}`
        : `${API_BASE_URL}/api/users`
      const response = await apiFetch(url, {
        method: editingEmployee ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        alert(data.message || "حدث خطأ أثناء حفظ الموظف")
        return
      }
      if (editingEmployee) {
        setEmployees((prev) =>
          prev.map((x) => (x.id === editingEmployee.id ? data.user : x))
        )
      } else {
        setEmployees((prev) => [...prev, data.user])
      }
      setShowEmployeeModal(false)
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function deleteEmployee(id) {
    const emp = employees.find((x) => x.id === id)
    if (emp && emp.username === "admin") {
      alert("لا يمكن حذف حساب المدير الرئيسي")
      return
    }
    if (!window.confirm("هل تريد حذف هذا الموظف؟")) return
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        alert(data.message || "تعذر حذف الموظف")
        return
      }
      setEmployees((prev) => prev.filter((x) => x.id !== id))
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function changePassword(e) {
    e.preventDefault()
    setPasswordMessage("")
    if (!newPassword || newPassword.length < 4) {
      setPasswordMessage("كلمة المرور الجديدة قصيرة جدًا")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("تأكيد كلمة المرور غير متطابق")
      return
    }
    const username = currentUser?.username || "admin"
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setPasswordMessage(data.message || "تعذر تغيير كلمة المرور")
        return
      }
      setPasswordMessage("تم تغيير كلمة المرور بنجاح")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error(error)
      setPasswordMessage("تعذر الاتصال بالسيرفر")
    }
  }

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/settings`)
        const data = await response.json()

        if (data.success) {
          setSettings({
            ...defaultSettings,
            ...data.settings,

          })
        }
      } catch (error) {
        console.error("تعذر تحميل الإعدادات:", error)
      }
    }

    loadSettings()
  }, [])

  // =========================
  // نسخ احتياطي تلقائي (مرة كل 24 ساعة)
  // =========================
 // =========================
  // دالة طباعة الفاتورة الحرارية (80mm)
  // =========================
  function printThermalInvoice(invoice) {
    if (!invoice) return;
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;

    const itemsHtml = (invoice.items || [])
      .map(
        (item) => `
        <tr>
          <td style="text-align:right;">${item.name || item.serviceName || ""}</td>
          <td style="text-align:center;">${item.quantity || 1}</td>
          <td style="text-align:left;">${item.price || 0} ج</td>
        </tr>`
      )
      .join("");

    const remainingHtml = invoice.remainingAmount > 0 
      ? `<div><b>المتبقي:</b> ${invoice.remainingAmount} جنيه</div>` 
      : "";

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <title>فاتورة ${invoice.invoiceNumber || invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; width: 75mm; margin: 0 auto; padding: 5px; font-size: 12px; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
          .title { font-size: 16px; font-weight: bold; }
          .info { margin-bottom: 5px; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; margin-top: 5px; }
          th { border-bottom: 1px solid #000; font-size: 11px; }
          td { padding: 3px 0; font-size: 11px; }
          .totals { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
          .footer { text-align: center; margin-top: 10px; font-size: 10px; border-top: 1px solid #000; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Mussa Wash & Clean</div>
          <div>مغسلة سيارات وسجاد</div>
        </div>
        <div class="info">
          <div><b>رقم الفاتورة:</b> ${invoice.invoiceNumber || invoice.id}</div>
          <div><b>التاريخ:</b> ${invoice.date || ""}</div>
          <div><b>العميل:</b> ${invoice.customerName || ""}</div>
          <div><b>المرتبط:</b> ${invoice.assetInfo || ""}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="text-align:right;">الخدمة</th>
              <th style="text-align:center;">العدد</th>
              <th style="text-align:left;">السعر</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div class="totals">
          <div><b>الإجمالي:</b> ${invoice.total} جنيه</div>
          <div><b>المدفوع:</b> ${invoice.paidAmount || invoice.total} جنيه</div>
          ${remainingHtml}
        </div>
        <div class="footer">
          شكرًا لزيارتكم! 🌹<br/>الرجاء الاحتفاظ بالفاتورة
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
printWindow.document.close();
  }
// =========================
  // دالة إرسال الفاتورة عبر الواتساب
  // =========================
  function sendWhatsAppInvoice(invoice) {
    if (!invoice) return;

    const rawPhone = invoice.customerPhone || invoice.phone || "";

    if (!rawPhone) {
      alert("رقم هاتف العميل غير متوفر في هذه الفاتورة!");
      return;
    }

    let phone = String(rawPhone).trim().replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) {
      phone = "20" + phone.slice(1);
    }

    const businessName = settings?.businessName || "Mussa Wash & Clean";
    const customerName = invoice.customerName || "العميل";
    const invoiceNum = invoice.invoiceNumber || invoice.id || "";
    const total = invoice.total || 0;
    const paid = invoice.paidAmount !== undefined ? invoice.paidAmount : total;
    const remaining = invoice.remainingAmount || 0;
    const asset = invoice.assetInfo || "خدمات المغسلة";

    const message = `أهلاً بك أ/ *${customerName}* 🌹
شكرًا لزيارتك *${businessName}* 🚗✨

تفاصيل الفاتورة:
📄 رقم الفاتورة: ${invoiceNum}
🚘 البيانات: ${asset}
💰 الإجمالي: ${total} جنيه
✅ المدفوع: ${paid} جنيه
${remaining > 0 ? `⚠️ المتبقي: ${remaining} جنيه` : ""}

تعد زيارتكم شرفاً لنا، وننتظر رؤيتكم قريباً! 👋`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  }
  useEffect(() => {    if (!loggedIn) return

    const AUTO_BACKUP_KEY = "mussa_last_auto_backup"
    const ONE_DAY_MS = 24 * 60 * 60 * 1000

    async function runAutoBackup() {
      try {
        const last = localStorage.getItem(AUTO_BACKUP_KEY)
        const now = Date.now()

        if (last && now - Number(last) < ONE_DAY_MS) {
          return // لسه بدري
        }

        const response = await fetch(`${API_BASE_URL}/api/backup`)
        const contentType = response.headers.get("content-type") || ""

        if (!contentType.includes("application/json")) return

        const data = await response.json()
        if (!response.ok || !data.success) return

        const blob = new Blob(
          [JSON.stringify(data.backup, null, 2)],
          { type: "application/json;charset=utf-8" }
        )

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        const date = new Date().toLocaleDateString("en-CA")

        link.href = url
        link.download = `mussa-auto-backup-${date}.json`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)

        localStorage.setItem(AUTO_BACKUP_KEY, String(now))
        console.log("تم عمل نسخة احتياطية تلقائية")
      } catch (error) {
        console.error("فشل النسخ الاحتياطي التلقائي:", error)
      }
    }

    // انتظر شوية بعد فتح البرنامج ثم نفّذ
    const timer = setTimeout(runAutoBackup, 5000)
    return () => clearTimeout(timer)
  }, [loggedIn])

  async function downloadBackup() {
    setIsBackingUp(true)
    setBackupMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/backup`)
      const contentType =
        response.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        throw new Error(
          "السيرفر لا يحتوي على خدمة النسخ الاحتياطي. شغّل آخر نسخة من server.js."
        )
      }

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر إنشاء النسخة الاحتياطية"
        )
      }

      const blob = new Blob(
        [JSON.stringify(data.backup, null, 2)],
        {
          type: "application/json;charset=utf-8",
        }
      )

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      const date = new Date()
        .toISOString()
        .slice(0, 10)

      link.href = url
      link.download = `mussa-backup-${date}.json`

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(url)

      setBackupMessage(
        "تم إنشاء النسخة الاحتياطية وتحميلها بنجاح"
      )
    } catch (error) {
      console.error(error)

      setBackupMessage(
        error.message ||
          "تعذر إنشاء النسخة الاحتياطية"
      )
    } finally {
      setIsBackingUp(false)
    }
  }

  async function restoreBackup(event) {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    const confirmed = window.confirm(
      "تحذير: استرجاع النسخة الاحتياطية سيستبدل بيانات العملاء والسيارات والسجاد والخدمات والاشتراكات والفواتير والمصروفات والإعدادات الحالية. هل تريد المتابعة؟"
    )

    if (!confirmed) return

    setIsRestoringBackup(true)
    setBackupMessage("")

    try {
      const text = await file.text()
      const backup = JSON.parse(text)

      if (
        !backup ||
        typeof backup !== "object" ||
        !backup.data
      ) {
        throw new Error(
          "ملف النسخة الاحتياطية غير صالح"
        )
      }

      const response = await fetch(
        `${API_BASE_URL}/api/backup/restore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            backup,
          }),
        }
      )

      const contentType =
        response.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        throw new Error(
          "السيرفر لا يحتوي على خدمة استرجاع النسخة الاحتياطية. شغّل آخر نسخة من server.js."
        )
      }

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر استرجاع النسخة الاحتياطية"
        )
      }

      setBackupMessage(
        "تم استرجاع النسخة الاحتياطية بنجاح. سيتم تحديث النظام الآن."
      )

      window.setTimeout(() => {
        window.location.reload()
      }, 900)
    } catch (error) {
      console.error(error)

      setBackupMessage(
        error.message ||
          "تعذر قراءة ملف النسخة الاحتياطية"
      )
    } finally {
      setIsRestoringBackup(false)
    }
  }

  // =========================
  // الاشتراكات
  // =========================

  function getDateInputValue(value) {
    return value ? String(value).slice(0, 10) : ""
  }

  function addMonthsToDate(dateValue, months) {
    const date = new Date(`${dateValue}T00:00:00`)
    date.setMonth(date.getMonth() + Number(months || 0))
    return date.toISOString().slice(0, 10)
  }

  function openAddMembership() {
    const today = new Date().toISOString().slice(0, 10)

    setEditingMembership(null)
    setMembershipCustomerId("")
    setMembershipPlanName("اشتراك شهري")
    setMembershipDurationMonths(1)
    setMembershipStartDate(today)
    setMembershipEndDate(addMonthsToDate(today, 1))
    setMembershipTotalVisits(4)
    setMembershipRemainingVisits(4)
    setMembershipPrice("")
    setMembershipStatus("سارية")
    setMembershipNotes("")
    setShowMembershipModal(true)
  }

  function openEditMembership(membership) {
    setEditingMembership(membership)
    setMembershipCustomerId(String(membership.customerId))
    setMembershipPlanName(membership.planName)
    setMembershipDurationMonths(membership.durationMonths)
    setMembershipStartDate(getDateInputValue(membership.startDate))
    setMembershipEndDate(getDateInputValue(membership.endDate))
    setMembershipTotalVisits(membership.totalVisits)
    setMembershipRemainingVisits(membership.remainingVisits)
    setMembershipPrice(membership.price)
    setMembershipStatus(membership.status)
    setMembershipNotes(membership.notes || "")
    setShowMembershipModal(true)
  }

  function closeMembershipModal() {
    setShowMembershipModal(false)
    setEditingMembership(null)
    setMembershipCustomerId("")
    setMembershipPlanName("اشتراك شهري")
    setMembershipDurationMonths(1)
    setMembershipStartDate("")
    setMembershipEndDate("")
    setMembershipTotalVisits(4)
    setMembershipRemainingVisits(4)
    setMembershipPrice("")
    setMembershipStatus("سارية")
    setMembershipNotes("")
  }

  async function saveMembership(e) {
    e.preventDefault()

    if (!membershipCustomerId) {
      alert("من فضلك اختر العميل")
      return
    }

    if (!membershipPlanName.trim()) {
      alert("من فضلك أدخل اسم الباقة")
      return
    }

    if (Number(membershipDurationMonths) <= 0) {
      alert("مدة الاشتراك غير صحيحة")
      return
    }

    if (!membershipStartDate || !membershipEndDate) {
      alert("من فضلك أدخل تاريخ البداية والنهاية")
      return
    }

    if (Number(membershipTotalVisits) < 0) {
      alert("عدد الزيارات غير صحيح")
      return
    }

    if (Number(membershipPrice) < 0) {
      alert("سعر الاشتراك غير صحيح")
      return
    }

    const totalVisits = Number(membershipTotalVisits) || 0

    const payload = {
      customerId: Number(membershipCustomerId),
      planName: membershipPlanName.trim(),
      durationMonths: Number(membershipDurationMonths),
      startDate: membershipStartDate,
      endDate: membershipEndDate,
      totalVisits,
      remainingVisits: Math.max(
        0,
        Math.min(
          totalVisits,
          Number(membershipRemainingVisits) || 0
        )
      ),
      price: Number(membershipPrice) || 0,
      status: membershipStatus === "منتهية" ? "منتهية" : "سارية",
      notes: membershipNotes.trim(),
    }

    try {
      const url = editingMembership
        ? `${API_BASE_URL}/api/memberships/${editingMembership.id}`
        : `${API_BASE_URL}/api/memberships`

      const response = await apiFetch(url, {
        method: editingMembership ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(data.message || "حدث خطأ أثناء حفظ العضوية")
        return
      }

      if (editingMembership) {
        setMemberships((current) =>
          current.map((item) =>
            item.id === editingMembership.id
              ? data.membership
              : item
          )
        )
      } else {
        setMemberships((current) => [
          data.membership,
          ...current,
        ])
      }

      closeMembershipModal()
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function deleteMembership(id) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذه العضوية؟"
    )

    if (!confirmed) return

    try {
      const response = await apiFetch(
        `${API_BASE_URL}/api/memberships/${id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(data.message || "حدث خطأ أثناء حذف العضوية")
        return
      }

      setMemberships((current) =>
        current.filter(
          (item) => item.id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function useMembershipVisit(membership) {
    const confirmed = window.confirm(
      "هل تريد تسجيل زيارة واحدة على هذه العضوية؟"
    )

    if (!confirmed) return

    try {
      const response = await apiFetch(
        `${API_BASE_URL}/api/memberships/${membership.id}/use-visit`,
        {
          method: "POST",
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(data.message || "تعذر تسجيل الزيارة")
        return
      }

      setMemberships((current) =>
        current.map((item) =>
          item.id === membership.id
            ? data.membership
            : item
        )
      )
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  function renewMembership(membership) {
    const today = new Date().toISOString().slice(0, 10)

    setEditingMembership(membership)
    setMembershipCustomerId(String(membership.customerId))
    setMembershipPlanName(membership.planName)
    setMembershipDurationMonths(membership.durationMonths)
    setMembershipStartDate(today)
    setMembershipEndDate(
      addMonthsToDate(
        today,
        membership.durationMonths
      )
    )
    setMembershipTotalVisits(membership.totalVisits)
    setMembershipRemainingVisits(membership.totalVisits)
    setMembershipPrice(membership.price)
    setMembershipStatus("سارية")
    setMembershipNotes(membership.notes || "")
    setShowMembershipModal(true)
  }

  const filteredMemberships = memberships.filter(
    (membership) => {
      const search =
        debouncedMembershipSearch.trim().toLowerCase()

      if (!search) return true

      return (
        String(membership.customerName || "")
          .toLowerCase()
          .includes(search) ||
        String(membership.planName || "")
          .toLowerCase()
          .includes(search) ||
        String(membership.status || "")
          .toLowerCase()
          .includes(search)
      )
    }
  )

  const activeMembershipsCount =
    memberships.filter(
      (membership) =>
        membership.status === "سارية"
    ).length

  const expiredMembershipsCount =
    memberships.filter(
      (membership) =>
        membership.status === "منتهية"
    ).length

  const membershipRevenue =
    memberships.reduce(
      (sum, membership) =>
        sum + Number(membership.price || 0),
      0
    )

  const todayForMembership = new Date().toISOString().slice(0, 10)

  const expiredMembershipsList = memberships.filter(
    (m) =>
      m.status === "منتهية" ||
      (m.endDate && String(m.endDate).slice(0, 10) < todayForMembership)
  )

  const soonExpiringMemberships = memberships.filter((m) => {
    if (!m.endDate || m.status === "منتهية") return false
    const endStr = String(m.endDate).slice(0, 10)
    if (endStr < todayForMembership) return false
    const end = new Date(endStr)
    const today = new Date(todayForMembership)
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  })

  // =========================
  // الخدمات
  // =========================

  const [services, setServices] =
    useState(initialServices)

  const [showServiceModal, setShowServiceModal] =
    useState(false)
  const [editingService, setEditingService] =
    useState(null)

  const [serviceName, setServiceName] =
    useState("")
  const [serviceType, setServiceType] =
    useState("سيارات")
  const [servicePrice, setServicePrice] =
    useState("")
  const [serviceUnit, setServiceUnit] =
    useState("ثابت")
  const [serviceDescription, setServiceDescription] =
    useState("")
  const [serviceActive, setServiceActive] =
    useState(true)
  const [serviceFilter, setServiceFilter] =
    useState("الكل")

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/services`)
        const data = await response.json()

        if (data.success) {
          setServices(data.services)
        }
      } catch (error) {
        console.error(
          "تعذر تحميل الخدمات:",
          error
        )
      }
    }

    loadServices()
  }, [])

  // =========================
  // العملاء
  // =========================

  const [customers, setCustomers] =
    useState(initialCustomers)

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await apiFetch(
          "/api/customers"
        )
        const data = await response.json()

        if (data.success) {
          setCustomers(data.customers)
        }
      } catch (error) {
        console.error(
          "تعذر تحميل العملاء:",
          error
        )
      }
    }

    loadCustomers()
  }, [])

  const [showCustomerModal, setShowCustomerModal] =
    useState(false)
  const [editingCustomer, setEditingCustomer] =
    useState(null)

  const [customerName, setCustomerName] =
    useState("")
  const [customerPhone, setCustomerPhone] =
    useState("")
  const [customerAddress, setCustomerAddress] =
    useState("")
  const [customerNotes, setCustomerNotes] =
    useState("")
  const [customerCars, setCustomerCars] =
    useState(0)
  const [customerCarpets, setCustomerCarpets] =
    useState(0)
  const [customerSearch, setCustomerSearch] =
    useState("")
  const debouncedCustomerSearch = useDebouncedValue(customerSearch)

  // =========================
  // السيارات
  // =========================

  const [cars, setCars] =
    useState(initialCars)

  useEffect(() => {
    async function loadCars() {
      try {
        const response = await apiFetch(
          "/api/cars"
        )
        const data = await response.json()

        if (data.success) {
          setCars(data.cars)
        }
      } catch (error) {
        console.error(
          "تعذر تحميل السيارات:",
          error
        )
      }
    }

    loadCars()
  }, [])

  const [showCarModal, setShowCarModal] =
    useState(false)
  const [editingCar, setEditingCar] =
    useState(null)

  const [carCustomerId, setCarCustomerId] =
    useState("")
  const [carPlateNumber, setCarPlateNumber] =
    useState("")
  const [carBrand, setCarBrand] =
    useState("")
  const [carModel, setCarModel] =
    useState("")
  const [carColor, setCarColor] =
    useState("")
  const [carYear, setCarYear] =
    useState("")
  const [carNotes, setCarNotes] =
    useState("")
  const [carActive, setCarActive] =
    useState(true)
  const [carSearch, setCarSearch] =
    useState("")
  const debouncedCarSearch = useDebouncedValue(carSearch)

  // =========================
  // الفواتير
  // =========================

  const [invoices, setInvoices] =
    useState(initialInvoices)

  useEffect(() => {
    async function loadInvoices() {
      try {
        const response = await apiFetch(
          "/api/invoices"
        )
        const data = await response.json()

        if (data.success) {
          setInvoices(data.invoices)
        }
      } catch (error) {
        console.error(
          "تعذر تحميل الفواتير:",
          error
        )
      }
    }

    loadInvoices()
  }, [])

  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false)
  const [editingInvoice, setEditingInvoice] =
    useState(null)
  const [viewingInvoice, setViewingInvoice] =
    useState(null)

  const [invoiceCustomerId, setInvoiceCustomerId] =
    useState("")
  const [invoiceTargetType, setInvoiceTargetType] =
    useState("سيارة")
  const [invoiceCarId, setInvoiceCarId] =
    useState("")
  const [invoiceCarpetId, setInvoiceCarpetId] =
    useState("")
  const [invoiceUseMembership, setInvoiceUseMembership] =
    useState(false)
  const [invoiceMembershipId, setInvoiceMembershipId] =
    useState("")
  const [invoicePaymentMethod, setInvoicePaymentMethod] =
    useState("نقدي")
  const [invoicePaymentStatus, setInvoicePaymentStatus] =
    useState("مدفوعة")
  const [invoicePaidAmount, setInvoicePaidAmount] =
    useState("")
  const [invoiceNotes, setInvoiceNotes] =
    useState("")
  const [invoiceSearch, setInvoiceSearch] =
    useState("")
  const debouncedInvoiceSearch = useDebouncedValue(invoiceSearch)

  const [invoiceItems, setInvoiceItems] =
    useState([])

  // =========================
  // السجاد
  // =========================

  const [carpets, setCarpets] = useState([])

  useEffect(() => {
    async function loadCarpets() {
      try {
        const response = await apiFetch(
          "/api/carpets"
        )
        const data = await response.json()

        if (data.success) {
          setCarpets(data.carpets)
        }
      } catch (error) {
        console.error(
          "تعذر تحميل السجاد:",
          error
        )
      }
    }

    loadCarpets()
  }, [])

  const [showCarpetModal, setShowCarpetModal] =
    useState(false)
  const [editingCarpet, setEditingCarpet] =
    useState(null)
  const [carpetCustomerId, setCarpetCustomerId] =
    useState("")
  const [carpetName, setCarpetName] =
    useState("")
  const [carpetType, setCarpetType] =
    useState("سجاد عادي")
  const [carpetLength, setCarpetLength] =
    useState("")
  const [carpetWidth, setCarpetWidth] =
    useState("")
  const [carpetServiceName, setCarpetServiceName] =
    useState("")
  const [carpetServicePrice, setCarpetServicePrice] =
    useState("")
  const [carpetStatus, setCarpetStatus] =
    useState("تم الاستلام")
  const [carpetNotes, setCarpetNotes] =
    useState("")
  const [carpetSearch, setCarpetSearch] =
    useState("")
  const debouncedCarpetSearch = useDebouncedValue(carpetSearch)

  // =========================
  // المصروفات
  // =========================

  const [expenses, setExpenses] =
    useState(initialExpenses)

  const [showExpenseModal, setShowExpenseModal] =
    useState(false)
  const [editingExpense, setEditingExpense] =
    useState(null)

  const [expenseDate, setExpenseDate] =
    useState("")
  const [expenseCategory, setExpenseCategory] =
    useState("تشغيل")
  const [expenseTitle, setExpenseTitle] =
    useState("")
  const [expenseAmount, setExpenseAmount] =
    useState("")
  const [expensePaymentMethod, setExpensePaymentMethod] =
    useState("نقدي")
  const [expenseNotes, setExpenseNotes] =
    useState("")
  const [expenseSearch, setExpenseSearch] =
    useState("")
  const debouncedExpenseSearch = useDebouncedValue(expenseSearch)

  // =========================
  // فلترة التقارير بالتاريخ
  // =========================

  const [reportFromDate, setReportFromDate] =
    useState("")
  const [reportToDate, setReportToDate] =
    useState("")

  useEffect(() => {
    async function loadExpenses() {
      try {
        const response = await apiFetch(
          "/api/expenses"
        )
        const data = await response.json()

        if (data.success) {
          setExpenses(data.expenses)
        }
      } catch (error) {
        console.error(
          "تعذر تحميل المصروفات:",
          error
        )
      }
    }

    loadExpenses()
  }, [])


  function updateSetting(field, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }))
    setSettingsMessage("")
  }

  async function saveSettings() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "فشل حفظ الإعدادات")
      }

      const savedSettings = {
        ...defaultSettings,
        ...data.settings,
      }

      setSettings(savedSettings)
      localStorage.setItem("mussa_settings", JSON.stringify(savedSettings))
      setSettingsMessage("تم حفظ الإعدادات بنجاح")
    } catch (error) {
      console.error(error)
      setSettingsMessage("تعذر حفظ الإعدادات")
    }
  }

  async function resetSettings() {
    const confirmed = window.confirm("هل تريد استعادة الإعدادات الافتراضية؟")
    if (!confirmed) return

    try {
      const response = await apiFetch(`${API_BASE_URL}/api/settings/reset`, {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "فشل استعادة الإعدادات")
      }

      const savedSettings = {
        ...defaultSettings,
        ...data.settings,
      }

      setSettings(savedSettings)
      localStorage.setItem("mussa_settings", JSON.stringify(savedSettings))
      setSettingsMessage("تم استعادة الإعدادات الافتراضية")
    } catch (error) {
      console.error(error)
      setSettingsMessage("تعذر استعادة الإعدادات")
    }
  }

  // =========================
  // تسجيل الدخول
  // =========================

  async function handleLogin(e) {
    e.preventDefault()

    setLoading(true)
    setMessage("")

    try {
      const response = await apiFetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      const data =
        await response.json()

      if (data.success) {
        setLoggedIn(true)
        const user = data.user || { username, role: "مالك", name: username }
        setCurrentUser(user)
        localStorage.setItem("mussa_logged_in", "true")
        localStorage.setItem("mussa_current_user", JSON.stringify(user))
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage(
        "تعذر الاتصال بالسيرفر"
      )
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("mussa_logged_in")
    localStorage.removeItem("mussa_current_user")
    setLoggedIn(false)
    setCurrentUser(null)
    setUsername("")
    setPassword("")
    setMessage("")
  }

  function getUserRole() {
    return currentUser?.role || "مالك"
  }

  function canAccessSettings() {
    return getUserRole() === "مالك"
  }

  function canManageEmployees() {
    return getUserRole() === "مالك"
  }

  function canAccessPage(page) {
    const role = getUserRole()

    if (role === "مالك") return true

    if (role === "مدير") {
      // المدير: كل شيء ما عدا الإعدادات (الموظفين داخل الإعدادات)
      return page !== "الإعدادات"
    }

    // موظف: صفحات التشغيل اليومية فقط
    const allowed = [
      "الرئيسية",
      "العملاء",
      "السيارات",
      "السجاد",
      "الفواتير",
    ]
    return allowed.includes(page)
  }

  useEffect(() => {
    if (!loggedIn) return
    if (!canAccessPage(activePage)) {
      setActivePage("الرئيسية")
    }
  }, [activePage, currentUser, loggedIn])

  // =========================
  // الخدمات
  // =========================

  function openAddService() {
    setEditingService(null)
    setServiceName("")
    setServiceType("سيارات")
    setServicePrice("")
    setServiceUnit("ثابت")
    setServiceDescription("")
    setServiceActive(true)
    setShowServiceModal(true)
  }

  function openEditService(service) {
    setEditingService(service)
    setServiceName(service.name)
    setServiceType(service.type)
    setServicePrice(service.price)
    setServiceUnit(service.unit)
    setServiceDescription(
      service.description
    )
    setServiceActive(service.active)
    setShowServiceModal(true)
  }

  async function saveService(e) {
    e.preventDefault()

    if (!serviceName.trim()) {
      alert(
        "من فضلك أدخل اسم الخدمة"
      )
      return
    }

    if (
      !servicePrice ||
      Number(servicePrice) <= 0
    ) {
      alert(
        "من فضلك أدخل سعر صحيح"
      )
      return
    }

    const serviceData = {
      name: serviceName.trim(),
      type: serviceType,
      price: Number(servicePrice),
      unit: serviceUnit,
      description: serviceDescription.trim(),
      active: serviceActive,
    }

    try {
      const response = await apiFetch(
        editingService
          ? `/api/services/${editingService.id}`
          : "/api/services",
        {
          method: editingService ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "حدث خطأ أثناء حفظ الخدمة"
        )
        return
      }

      if (editingService) {
        setServices((currentServices) =>
          currentServices.map((service) =>
            service.id === editingService.id
              ? data.service
              : service
          )
        )
      } else {
        setServices((currentServices) => [
          ...currentServices,
          data.service,
        ])
      }

      closeServiceModal()
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function deleteService(id) {
    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف هذه الخدمة؟"
      )

    if (!confirmed) return

    try {
      const response = await apiFetch(
        `/api/services/${id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "حدث خطأ أثناء حذف الخدمة"
        )
        return
      }

      setServices((currentServices) =>
        currentServices.filter(
          (service) => service.id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  function closeServiceModal() {
    setShowServiceModal(false)
    setEditingService(null)
    setServiceName("")
    setServiceType("سيارات")
    setServicePrice("")
    setServiceUnit("ثابت")
    setServiceDescription("")
    setServiceActive(true)
  }

  const filteredServices =
    services.filter(
      (service) => {
        if (
          serviceFilter === "الكل"
        ) {
          return true
        }

        return (
          service.type ===
          serviceFilter
        )
      }
    )

  const carServices =
    services.filter(
      (service) =>
        service.type ===
        "سيارات"
    )

  const carpetServices =
    services.filter(
      (service) =>
        service.type ===
        "سجاد"
    )

  // =========================
  // العملاء
  // =========================

  function openAddCustomer() {
    setEditingCustomer(null)
    setCustomerName("")
    setCustomerPhone("")
    setCustomerAddress("")
    setCustomerNotes("")
    setCustomerCars(0)
    setCustomerCarpets(0)
    setShowCustomerModal(true)
  }

  function openEditCustomer(
    customer
  ) {
    setEditingCustomer(
      customer
    )

    setCustomerName(
      customer.name
    )
    setCustomerPhone(
      customer.phone
    )
    setCustomerAddress(
      customer.address
    )
    setCustomerNotes(
      customer.notes
    )
    setCustomerCars(
      customer.cars
    )
    setCustomerCarpets(
      customer.carpets
    )

    setShowCustomerModal(true)
  }

  async function saveCustomer(e) {
    e.preventDefault()

    if (!customerName.trim()) {
      alert(
        "من فضلك أدخل اسم العميل"
      )
      return
    }

    if (!customerPhone.trim()) {
      alert(
        "من فضلك أدخل رقم الهاتف"
      )
      return
    }

    const customerData = {
      name:
        customerName.trim(),
      phone:
        customerPhone.trim(),
      address:
        customerAddress.trim(),
      notes:
        customerNotes.trim(),
      cars:
        Number(customerCars) ||
        0,
      carpets:
        Number(customerCarpets) ||
        0,
    }

    try {
      const response =
        await apiFetch(
          editingCustomer
            ? `/api/customers/${editingCustomer.id}`
            : "/api/customers",
          {
            method:
              editingCustomer
                ? "PUT"
                : "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                customerData
              ),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "حدث خطأ أثناء حفظ بيانات العميل"
        )
        return
      }

      if (editingCustomer) {
        setCustomers(
          (currentCustomers) =>
            currentCustomers.map(
              (customer) =>
                customer.id ===
                editingCustomer.id
                  ? data.customer
                  : customer
            )
        )
      } else {
        setCustomers(
          (currentCustomers) => [
            ...currentCustomers,
            data.customer,
          ]
        )
      }

      closeCustomerModal()
    } catch (error) {
      console.error(error)

      alert(
        "تعذر الاتصال بالسيرفر"
      )
    }
  }

  async function deleteCustomer(id) {
    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف هذا العميل؟"
      )

    if (!confirmed) return

    try {
      const response =
        await apiFetch(
          `/api/customers/${id}`,
          {
            method: "DELETE",
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "حدث خطأ أثناء حذف العميل"
        )
        return
      }

      setCustomers(
        (currentCustomers) =>
          currentCustomers.filter(
            (customer) =>
              customer.id !== id
          )
      )
    } catch (error) {
      console.error(error)

      alert(
        "تعذر الاتصال بالسيرفر"
      )
    }
  }

  function closeCustomerModal() {
    setShowCustomerModal(false)
    setEditingCustomer(null)
    setCustomerName("")
    setCustomerPhone("")
    setCustomerAddress("")
    setCustomerNotes("")
    setCustomerCars(0)
    setCustomerCarpets(0)
  }

  const filteredCustomers =
    customers.filter(
      (customer) => {
        const search =
          debouncedCustomerSearch
            .trim()
            .toLowerCase()

        if (!search) {
          return true
        }

        return (
          customer.name
            .toLowerCase()
            .includes(search) ||
          customer.phone
            .toLowerCase()
            .includes(search) ||
          customer.address
            .toLowerCase()
            .includes(search)
        )
      }
    )

  // =========================
  // السيارات
  // =========================

  function openAddCar() {
    setEditingCar(null)
    setCarCustomerId("")
    setCarPlateNumber("")
    setCarBrand("")
    setCarModel("")
    setCarColor("")
    setCarYear("")
    setCarNotes("")
    setCarActive(true)
    setShowCarModal(true)
  }

  function openEditCar(car) {
    setEditingCar(car)

    setCarCustomerId(
      String(car.customerId)
    )
    setCarPlateNumber(
      car.plateNumber
    )
    setCarBrand(car.brand)
    setCarModel(car.model)
    setCarColor(car.color)
    setCarYear(car.year)
    setCarNotes(car.notes)
    setCarActive(car.active)

    setShowCarModal(true)
  }

  async function saveCar(e) {
    e.preventDefault()

    if (!carCustomerId) {
      alert(
        "من فضلك اختر العميل"
      )
      return
    }

    if (!carPlateNumber.trim()) {
      alert(
        "من فضلك أدخل رقم اللوحة"
      )
      return
    }

    if (!carBrand.trim()) {
      alert(
        "من فضلك أدخل ماركة السيارة"
      )
      return
    }

    if (!carModel.trim()) {
      alert(
        "من فضلك أدخل موديل السيارة"
      )
      return
    }

    if (!carColor.trim()) {
      alert(
        "من فضلك أدخل لون السيارة"
      )
      return
    }

    if (
      !carYear ||
      Number(carYear) <
        1900 ||
      Number(carYear) >
        new Date().getFullYear() +
          1
    ) {
      alert(
        "من فضلك أدخل سنة صنع صحيحة"
      )
      return
    }

    const carData = {
      customerId:
        Number(carCustomerId),
      plateNumber:
        carPlateNumber.trim(),
      brand:
        carBrand.trim(),
      model:
        carModel.trim(),
      color:
        carColor.trim(),
      year:
        Number(carYear),
      notes:
        carNotes.trim(),
      active:
        carActive,
    }

    try {
      const response =
        await apiFetch(
          editingCar
            ? `/api/cars/${editingCar.id}`
            : "/api/cars",
          {
            method:
              editingCar
                ? "PUT"
                : "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                carData
              ),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "حدث خطأ أثناء حفظ السيارة"
        )
        return
      }

      if (editingCar) {
        setCars(
          (currentCars) =>
            currentCars.map(
              (car) =>
                car.id ===
                editingCar.id
                  ? data.car
                  : car
            )
        )
      } else {
        setCars(
          (currentCars) => [
            ...currentCars,
            data.car,
          ]
        )
      }

      closeCarModal()
    } catch (error) {
      console.error(error)

      alert(
        "تعذر الاتصال بالسيرفر"
      )
    }
  }

  async function deleteCar(id) {
    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف هذه السيارة؟"
      )

    if (!confirmed) return

    try {
      const response =
        await apiFetch(
          `/api/cars/${id}`,
          {
            method: "DELETE",
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "حدث خطأ أثناء حذف السيارة"
        )
        return
      }

      setCars(
        (currentCars) =>
          currentCars.filter(
            (car) =>
              car.id !== id
          )
      )
    } catch (error) {
      console.error(error)

      alert(
        "تعذر الاتصال بالسيرفر"
      )
    }
  }

  function closeCarModal() {
    setShowCarModal(false)
    setEditingCar(null)
    setCarCustomerId("")
    setCarPlateNumber("")
    setCarBrand("")
    setCarModel("")
    setCarColor("")
    setCarYear("")
    setCarNotes("")
    setCarActive(true)
  }

  function getCustomerName(
    customerId
  ) {
    const customer =
      customers.find(
        (item) =>
          item.id ===
          Number(customerId)
      )

    return customer
      ? customer.name
      : "عميل غير معروف"
  }

  const filteredCars =
    cars.filter((car) => {
      const search =
        debouncedCarSearch
          .trim()
          .toLowerCase()

      if (!search) {
        return true
      }

      const customerName =
        getCustomerName(
          car.customerId
        ).toLowerCase()

      return (
        car.plateNumber
          .toLowerCase()
          .includes(search) ||
        car.brand
          .toLowerCase()
          .includes(search) ||
        car.model
          .toLowerCase()
          .includes(search) ||
        car.color
          .toLowerCase()
          .includes(search) ||
        customerName.includes(
          search
        )
      )
    })

  const activeCarsCount =
    cars.filter(
      (car) => car.active
    ).length

  const inactiveCarsCount =
    cars.filter(
      (car) => !car.active
    ).length

  // =========================
  // الفواتير
  // =========================

  function generateInvoiceNumber() {
    const nextNumber =
      invoices.length + 1

    return `INV-${String(
      nextNumber
    ).padStart(4, "0")}`
  }

  function getTodayDate() {
    return new Date().toLocaleDateString(
      "ar-EG"
    )
  }

  function openAddInvoice() {
    setEditingInvoice(null)
    setInvoiceCustomerId("")
    setInvoiceTargetType("سيارة")
    setInvoiceCarId("")
    setInvoiceCarpetId("")
    setInvoiceUseMembership(false)
    setInvoiceMembershipId("")
    setInvoicePaymentMethod(
      settings.defaultPaymentMethod ||
        "نقدي"
    )
    setInvoicePaymentStatus(
      "مدفوعة"
    )
    setInvoicePaidAmount("")
    setInvoiceNotes("")
    setInvoiceItems([])
    setInvoiceInventoryUsage([])
    setShowInvoiceModal(true)
  }

  function openEditInvoice(
    invoice
  ) {
    setEditingInvoice(invoice)

    setInvoiceCustomerId(
      String(invoice.customerId)
    )

    const targetType =
      invoice.assetType ||
      (invoice.carpetId
        ? "سجادة"
        : "سيارة")

    setInvoiceTargetType(
      targetType
    )

    setInvoiceCarId(
      targetType === "سيارة" &&
        invoice.carId
        ? String(invoice.carId)
        : ""
    )

    setInvoiceCarpetId(
      targetType === "سجادة" &&
        invoice.carpetId
        ? String(invoice.carpetId)
        : ""
    )

    setInvoiceUseMembership(
      Boolean(invoice.coveredByMembership)
    )
    setInvoiceMembershipId(
      invoice.membershipId
        ? String(invoice.membershipId)
        : ""
    )

    setInvoicePaymentMethod(
      invoice.paymentMethod
    )
    setInvoicePaymentStatus(
      invoice.paymentStatus
    )
    setInvoicePaidAmount(
      invoice.paidAmount !==
        undefined
        ? invoice.paidAmount
        : invoice.total
    )
    setInvoiceNotes(
      invoice.notes || ""
    )

    setInvoiceItems(
      invoice.items.map(
        (item) => ({
          serviceId:
            item.serviceId,
          quantity:
            item.quantity,
        })
      )
    )

    setShowInvoiceModal(
      true
    )
  }

  function closeInvoiceModal() {
    setShowInvoiceModal(false)
    setEditingInvoice(null)
    setInvoiceCustomerId("")
    setInvoiceTargetType("سيارة")
    setInvoiceCarId("")
    setInvoiceCarpetId("")
    setInvoiceUseMembership(false)
    setInvoiceMembershipId("")
    setInvoicePaymentMethod(
      "نقدي"
    )
    setInvoicePaymentStatus(
      "مدفوعة"
    )
    setInvoicePaidAmount("")
    setInvoiceNotes("")
    setInvoiceItems([])
    setInvoiceInventoryUsage([])
  }

  function addInvoiceItem() {
    const firstAvailableService =
      services.find(
        (service) =>
          service.active
      )

    if (!firstAvailableService) {
      alert(
        "لا توجد خدمات مفعلة لإضافتها"
      )
      return
    }

    setInvoiceItems(
      (currentItems) => [
        ...currentItems,
        {
          serviceId:
            firstAvailableService.id,
          quantity: 1,
        },
      ]
    )
  }

  function updateInvoiceItem(
    index,
    field,
    value
  ) {
    setInvoiceItems(
      (currentItems) =>
        currentItems.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex ===
            index
              ? {
                  ...item,
                  [field]:
                    field ===
                    "quantity"
                      ? Math.max(
                          1,
                          Number(
                            value
                          )
                        )
                      : Number(
                          value
                        ),
                }
              : item
        )
    )
  }

  function removeInvoiceItem(
    index
  ) {
    setInvoiceItems(
      (currentItems) =>
        currentItems.filter(
          (_, itemIndex) =>
            itemIndex !==
            index
        )
    )
  }

  function getInvoiceItemDetails(
    item
  ) {
    const service =
      services.find(
        (serviceItem) =>
          serviceItem.id ===
          Number(
            item.serviceId
          )
      )

    if (!service) {
      return {
        name: "خدمة غير موجودة",
        price: 0,
        unit: "ثابت",
        total: 0,
      }
    }

    const quantity =
      Math.max(
        1,
        Number(
          item.quantity
        ) || 1
      )

    return {
      name: service.name,
      price: Number(
        service.price
      ),
      unit: service.unit,
      total:
        Number(
          service.price
        ) * quantity,
    }
  }

  const invoiceTotal =
    invoiceItems.reduce(
      (sum, item) =>
        sum +
        getInvoiceItemDetails(
          item
        ).total,
      0
    )

  const invoiceRemainingAmount =
    Math.max(
      0,
      invoiceTotal -
        (Number(
          invoicePaidAmount
        ) || 0)
    )

  async function saveInvoice(e) {
    e.preventDefault()

    if (!invoiceCustomerId) {
      alert(
        "من فضلك اختر العميل"
      )
      return
    }

    if (
      invoiceTargetType ===
      "سيارة" &&
      !invoiceCarId
    ) {
      alert(
        "من فضلك اختر السيارة"
      )
      return
    }

    if (
      invoiceTargetType ===
      "سجادة" &&
      !invoiceCarpetId
    ) {
      alert(
        "من فضلك اختر السجادة"
      )
      return
    }

    const hasServices = invoiceItems.length > 0
    const hasMaterials = invoiceInventoryUsage.some(
      (row) => Number(row.inventoryId) && Number(row.quantity) > 0
    )

    if (!hasServices && !hasMaterials) {
      alert(
        "من فضلك أضف خدمة أو مادة من المخزون على الأقل"
      )
      return
    }

    const materialsTotal = invoiceInventoryUsage.reduce((sum, row) => {
      if (!Number(row.inventoryId) || !Number(row.quantity)) return sum
      const inv = inventoryItems.find((x) => x.id === Number(row.inventoryId))
      const unit = inv ? Number(inv.price) || 0 : 0
      return sum + unit * Number(row.quantity)
    }, 0)

    const servicesTotal = hasServices ? Number(invoiceTotal) || 0 : 0
    const combinedTotal = servicesTotal + materialsTotal

    if (combinedTotal <= 0) {
      alert(
        "إجمالي الفاتورة يجب أن يكون أكبر من صفر"
      )
      return
    }

    if (
      invoiceUseMembership &&
      invoiceTargetType !== "سيارة"
    ) {
      alert(
        "العضوية حاليًا مخصصة لفواتير السيارات فقط"
      )
      return
    }

    if (
      invoiceUseMembership &&
      !editingInvoice &&
      (!selectedMembership ||
        selectedMembership.status !== "سارية" ||
        Number(selectedMembership.remainingVisits) <= 0)
    ) {
      alert(
        "العضوية المختارة غير متاحة أو لا توجد زيارات متبقية"
      )
      return
    }

    let paidAmount =
      Number(
        invoicePaidAmount
      ) || 0

    if (
      invoicePaymentStatus ===
      "مدفوعة"
    ) {
      paidAmount =
        combinedTotal
    }

    if (
      invoicePaymentStatus ===
      "غير مدفوعة"
    ) {
      paidAmount = 0
    }

    if (
      paidAmount >
      combinedTotal
    ) {
      paidAmount =
        combinedTotal
    }

    if (invoiceUseMembership) {
      paidAmount = 0
    }

    const selectedCustomer =
      customers.find(
        (customer) =>
          customer.id ===
          Number(
            invoiceCustomerId
          )
      )

    const selectedCar =
      cars.find(
        (car) =>
          car.id ===
          Number(
            invoiceCarId
          )
      )

    const selectedCarpet =
      carpets.find(
        (carpet) =>
          carpet.id ===
          Number(
            invoiceCarpetId
          )
      )

    if (
      invoiceTargetType ===
      "سيارة" &&
      !selectedCar
    ) {
      alert(
        "السيارة المختارة غير موجودة"
      )
      return
    }

    if (
      invoiceTargetType ===
      "سجادة" &&
      !selectedCarpet
    ) {
      alert(
        "السجادة المختارة غير موجودة"
      )
      return
    }

    const finalPaymentStatus =
      invoiceUseMembership
        ? "مغطاة بالعضوية"
        : paidAmount ===
          combinedTotal
        ? "مدفوعة"
        : paidAmount > 0
        ? "مدفوعة جزئيًا"
        : "غير مدفوعة"

    const serviceItems =
      invoiceItems.map(
        (item) => {
          const details =
            getInvoiceItemDetails(
              item
            )

          return {
            serviceId:
              Number(
                item.serviceId
              ),
            serviceName:
              details.name,
            quantity:
              Number(
                item.quantity
              ),
            price:
              details.price,
            unit:
              details.unit,
            total:
              details.total,
          }
        }
      )

    const materialItems =
      invoiceInventoryUsage
        .filter(
          (row) =>
            Number(row.inventoryId) &&
            Number(row.quantity) > 0
        )
        .map((row) => {
          const inv = inventoryItems.find(
            (x) => x.id === Number(row.inventoryId)
          )
          const qty = Number(row.quantity) || 0
          const price = inv ? Number(inv.price) || 0 : 0
          return {
            serviceId: null,
            serviceName: inv
              ? inv.name + " (من المخزون)"
              : "مادة مخزون",
            quantity: qty,
            price: price,
            unit: "ثابت",
            total: price * qty,
            inventoryId: Number(row.inventoryId),
            fromInventory: true,
          }
        })

    const finalItems = [...serviceItems, ...materialItems]

    const assetInfo =
      invoiceTargetType ===
      "سيارة"
        ? `${selectedCar.brand} ${selectedCar.model} - ${selectedCar.plateNumber}`
        : `${selectedCarpet.name} - ${selectedCarpet.type} - ${Number(
            selectedCarpet.area || 0
          ).toFixed(2)} م²`

    const invoiceData = {
      customerId:
        Number(
          invoiceCustomerId
        ),
      customerName:
        selectedCustomer?.name ||
        "",
      customerPhone:
        selectedCustomer?.phone ||
        "",

      assetType:
        invoiceTargetType,

      carId:
        invoiceTargetType ===
        "سيارة"
          ? Number(
              invoiceCarId
            )
          : null,

      carpetId:
        invoiceTargetType ===
        "سجادة"
          ? Number(
              invoiceCarpetId
            )
          : null,

      carInfo:
        assetInfo,

      assetInfo:
        assetInfo,

      items:
        finalItems,
      total:
        combinedTotal,
      paymentMethod:
        invoicePaymentMethod,
      paymentStatus:
        finalPaymentStatus,
      paidAmount:
        paidAmount,
      remainingAmount:
        invoiceUseMembership
          ? 0
          : combinedTotal -
            paidAmount,
      coveredByMembership:
        invoiceUseMembership,
      membershipId:
        invoiceUseMembership
          ? Number(invoiceMembershipId)
          : null,
      membershipPlanName:
        invoiceUseMembership
          ? selectedMembership?.planName || ""
          : "",
      notes:
        invoiceNotes.trim(),
      inventoryUsage:
        !editingInvoice
          ? invoiceInventoryUsage
              .filter(
                (row) =>
                  Number(row.inventoryId) &&
                  Number(row.quantity) > 0
              )
              .map((row) => ({
                inventoryId: Number(row.inventoryId),
                quantity: Number(row.quantity),
              }))
          : [],
    }

    try {
      const response =
        await apiFetch(
          editingInvoice
            ? `/api/invoices/${editingInvoice.id}`
            : "/api/invoices",
          {
            method:
              editingInvoice
                ? "PUT"
                : "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                invoiceData
              ),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "حدث خطأ أثناء حفظ الفاتورة"
        )
        return
      }

      if (editingInvoice) {
        setInvoices(
          (currentInvoices) =>
            currentInvoices.map(
              (invoice) =>
                invoice.id ===
                editingInvoice.id
                  ? data.invoice
                  : invoice
            )
        )
      } else {
        setInvoices(
          (currentInvoices) => [
            data.invoice,
            ...currentInvoices,
          ]
        )

        if (invoiceInventoryUsage.length > 0) {
          try {
            const invRes = await apiFetch(`${API_BASE_URL}/api/inventory`)
            const invData = await invRes.json()
            if (invData.success) setInventoryItems(invData.items || [])
          } catch (e) {}
        }
        if (invoiceInventoryUsage.length > 0) {
          window.dispatchEvent(new Event("mussa-inventory-updated"))
        }

        setServices(
          (currentServices) =>
            currentServices.map(
              (service) => {
                const usedQuantity =
                  finalItems
                    .filter(
                      (item) =>
                        item.serviceId ===
                        service.id
                    )
                    .reduce(
                      (
                        sum,
                        item
                      ) =>
                        sum +
                        Number(
                          item.quantity
                        ),
                      0
                    )

                if (!usedQuantity) {
                  return service
                }

                return {
                  ...service,
                  count:
                    Number(
                      service.count ||
                        0
                    ) +
                    usedQuantity,
                }
              }
            )
        )
      }

      // تحديث رصيد الاشتراكات فورًا على الشاشة بدون انتظار Refresh.
      const oldMembershipId =
        editingInvoice?.coveredByMembership &&
        editingInvoice?.membershipId
          ? Number(editingInvoice.membershipId)
          : null

      const newMembershipId =
        data.invoice?.coveredByMembership &&
        data.invoice?.membershipId
          ? Number(data.invoice.membershipId)
          : null

      if (oldMembershipId !== newMembershipId) {
        setMemberships((current) =>
          current.map((membership) => {
            if (
              oldMembershipId &&
              membership.id === oldMembershipId
            ) {
              return {
                ...membership,
                remainingVisits:
                  Number(
                    membership.remainingVisits ||
                      0
                  ) + 1,
                status: "سارية",
              }
            }

            if (
              newMembershipId &&
              membership.id === newMembershipId
            ) {
              return {
                ...membership,
                remainingVisits: Math.max(
                  0,
                  Number(
                    membership.remainingVisits ||
                      0
                  ) - 1
                ),
                status:
                  Number(
                    membership.remainingVisits ||
                      0
                  ) - 1 <= 0
                    ? "منتهية"
                    : membership.status,
              }
            }

            return membership
          })
        )
      }

      closeInvoiceModal()
    } catch (error) {
      console.error(error)

      alert(
        "تعذر الاتصال بالسيرفر"
      )
    }
  }

  function escapePrintHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  function printThermalInvoice(invoice) {
    if (!invoice) return

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    )

    if (!printWindow) {
      alert("المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.")
      return
    }

    const itemsHtml = (invoice.items || [])
      .map(
        (item) => `
          <tr>
            <td>${escapePrintHtml(item.serviceName)}</td>
            <td>${escapePrintHtml(item.quantity)}${item.unit === "متر" ? " م²" : ""}</td>
            <td>${escapePrintHtml(item.price)} جنيه</td>
            <td>${escapePrintHtml(item.total)} جنيه</td>
          </tr>
        `
      )
      .join("")

    const businessPhone =
      settings.showPhoneOnInvoice && settings.phone
        ? `<div>${escapePrintHtml(settings.phone)}</div>`
        : ""

    const businessAddress =
      settings.showAddressOnInvoice && settings.address
        ? `<div>${escapePrintHtml(settings.address)}</div>`
        : ""

    const footer =
      settings.showFooterOnInvoice && settings.invoiceFooter
        ? `<div class="footer-note">${escapePrintHtml(settings.invoiceFooter)}</div>`
        : ""

    const paymentStatusClass =
      invoice.paymentStatus === "مدفوعة"
        ? "paid"
        : invoice.paymentStatus === "مدفوعة جزئيًا"
        ? "partial"
        : invoice.paymentStatus === "مغطاة بالعضوية"
        ? "membership"
        : "unpaid"

    const assetLabel =
      invoice.assetType === "سجادة"
        ? "السجادة"
        : "السيارة"

    printWindow.document.open()
    printWindow.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(invoice.invoiceNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: Tahoma, Arial, sans-serif;
      color: #111827;
      background: #fff;
    }
    .invoice {
      max-width: 820px;
      margin: 0 auto;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      border-bottom: 2px solid #111827;
      padding-bottom: 18px;
      margin-bottom: 20px;
    }
    .business h1 {
      margin: 0 0 8px;
      font-size: 25px;
    }
    .muted { color: #64748b; line-height: 1.8; }
    .invoice-no {
      text-align: left;
      direction: ltr;
    }
    .invoice-no strong {
      font-size: 22px;
    }
    .cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 20px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      background: #f8fafc;
    }
    .label {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: right;
    }
    th { background: #f8fafc; }
    .summary {
      margin-top: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 9px;
    }
    .row:last-child { margin-bottom: 0; }
    .total {
      font-size: 20px;
      font-weight: 700;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      margin-top: 10px;
    }
    .paid { color: #166534; }
    .partial { color: #92400e; }
    .membership { color: #1d4ed8; }
    .unpaid { color: #991b1b; }
    .notes {
      margin-top: 16px;
      padding: 13px;
      border-radius: 10px;
      background: #fffbeb;
      color: #78350f;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      line-height: 1.8;
    }
    .footer .business-name {
      color: #111827;
      font-size: 17px;
      font-weight: 700;
    }
    .footer-note { margin-top: 6px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="top">
      <div class="business">
        <h1>${escapePrintHtml(settings.businessName)}</h1>
        ${businessPhone}
        ${businessAddress}
      </div>
      <div class="invoice-no">
        <div class="muted">رقم الفاتورة</div>
        <strong>${escapePrintHtml(invoice.invoiceNumber)}</strong>
        <div class="muted">${escapePrintHtml(invoice.date)}</div>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="label">العميل</div>
        <strong>${escapePrintHtml(invoice.customerName)}</strong>
        <div class="muted">${escapePrintHtml(invoice.customerPhone)}</div>
      </div>
      <div class="card">
        <div class="label">${assetLabel}</div>
        <strong>${escapePrintHtml(invoice.assetInfo || invoice.carInfo)}</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>الخدمة</th>
          <th>الكمية</th>
          <th>سعر الوحدة</th>
          <th>الإجمالي</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="summary">
      <div class="row total">
        <span>إجمالي الفاتورة</span>
        <strong>${escapePrintHtml(invoice.total)} جنيه</strong>
      </div>
      <div class="row">
        <span>المبلغ المدفوع</span>
        <strong class="paid">${escapePrintHtml(invoice.paidAmount)} جنيه</strong>
      </div>
      <div class="row">
        <span>المتبقي</span>
        <strong class="${invoice.remainingAmount > 0 ? "unpaid" : "paid"}">${escapePrintHtml(invoice.remainingAmount)} جنيه</strong>
      </div>
      <div class="row">
        <span>طريقة الدفع</span>
        <strong>${escapePrintHtml(invoice.paymentMethod)}</strong>
      </div>
      <div class="row">
        <span>حالة الدفع</span>
        <strong class="${paymentStatusClass}">${escapePrintHtml(invoice.paymentStatus)}</strong>
      </div>
    </div>

    ${invoice.coveredByMembership ? `<div class="notes" style="background:#eff6ff;color:#1d4ed8"><strong>العضوية:</strong> ${escapePrintHtml(invoice.membershipPlanName || "عضوية العميل")}</div>` : ""}

    ${invoice.notes ? `<div class="notes"><strong>ملاحظات:</strong> ${escapePrintHtml(invoice.notes)}</div>` : ""}

    <div class="footer">
      <div class="business-name">${escapePrintHtml(settings.businessName)}</div>
      ${businessPhone}
      ${businessAddress}
      ${footer}
    </div>
  </div>

  <script>
    window.onload = function () {
      window.focus();
      window.print();
    };
  <\/script>
</body>
</html>`)
    printWindow.document.close()
  }

  async function deleteInvoice(
    id
  ) {
    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف هذه الفاتورة؟"
      )

    if (!confirmed) return

    try {
      const response =
        await apiFetch(
          `/api/invoices/${id}`,
          {
            method: "DELETE",
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "حدث خطأ أثناء حذف الفاتورة"
        )
        return
      }

      const deletedInvoice = invoices.find(
        (invoice) => invoice.id === id
      )

      setInvoices(
        (currentInvoices) =>
          currentInvoices.filter(
            (invoice) =>
              invoice.id !== id
          )
      )

      if (
        deletedInvoice?.coveredByMembership &&
        deletedInvoice.membershipId
      ) {
        const membershipId =
          Number(deletedInvoice.membershipId)

        setMemberships((current) =>
          current.map((membership) =>
            membership.id === membershipId
              ? {
                  ...membership,
                  remainingVisits:
                    Number(
                      membership.remainingVisits ||
                        0
                    ) + 1,
                  status: "سارية",
                }
              : membership
          )
        )
      }
    } catch (error) {
      console.error(error)

      alert(
        "تعذر الاتصال بالسيرفر"
      )
    }
  }

  // =========================
  // السجاد
  // =========================

  const carpetArea = useMemo(() => {
    const length = Number(carpetLength) || 0
    const width = Number(carpetWidth) || 0
    return Number((length * width).toFixed(2))
  }, [carpetLength, carpetWidth])

  function openAddCarpet() {
    setEditingCarpet(null)
    setCarpetCustomerId("")
    setCarpetName("")
    setCarpetType("سجاد عادي")
    setCarpetLength("")
    setCarpetWidth("")
    setCarpetServiceName("")
    setCarpetServicePrice("")
    setCarpetStatus("تم الاستلام")
    setCarpetNotes("")
    setShowCarpetModal(true)
  }

  function openEditCarpet(carpet) {
    setEditingCarpet(carpet)
    setCarpetCustomerId(String(carpet.customerId))
    setCarpetName(carpet.name || "")
    setCarpetType(carpet.type || "سجاد عادي")
    setCarpetLength(carpet.length || "")
    setCarpetWidth(carpet.width || "")
    setCarpetServiceName(carpet.serviceName || "")
    setCarpetServicePrice(carpet.servicePrice ?? "")
    setCarpetStatus(carpet.status || "تم الاستلام")
    setCarpetNotes(carpet.notes || "")
    setShowCarpetModal(true)
  }

  function closeCarpetModal() {
    setShowCarpetModal(false)
    setEditingCarpet(null)
    setCarpetCustomerId("")
    setCarpetName("")
    setCarpetType("سجاد عادي")
    setCarpetLength("")
    setCarpetWidth("")
    setCarpetServiceName("")
    setCarpetServicePrice("")
    setCarpetStatus("تم الاستلام")
    setCarpetNotes("")
  }

  async function saveCarpet(e) {
    e.preventDefault()

    if (!carpetCustomerId) {
      alert("من فضلك اختر العميل")
      return
    }

    if (!carpetName.trim()) {
      alert("من فضلك أدخل اسم السجادة")
      return
    }

    if (carpetArea <= 0) {
      alert("من فضلك أدخل طول وعرض صحيحين")
      return
    }

    if (!carpetServiceName.trim()) {
      alert("من فضلك اختر خدمة السجاد")
      return
    }

    if (
      carpetServicePrice === "" ||
      Number(carpetServicePrice) <= 0
    ) {
      alert("من فضلك أدخل سعر الخدمة")
      return
    }

    const carpetData = {
      customerId: Number(carpetCustomerId),
      name: carpetName.trim(),
      type: carpetType,
      length: Number(carpetLength),
      width: Number(carpetWidth),
      area: carpetArea,
      serviceName: carpetServiceName.trim(),
      servicePrice: Number(carpetServicePrice),
      status: carpetStatus,
      notes: carpetNotes.trim(),
    }

    try {
      const response = await apiFetch(
        editingCarpet
          ? `/api/carpets/${editingCarpet.id}`
          : "/api/carpets",
        {
          method: editingCarpet ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carpetData),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "حدث خطأ أثناء حفظ السجادة"
        )
        return
      }

      if (editingCarpet) {
        setCarpets((currentCarpets) =>
          currentCarpets.map((carpet) =>
            carpet.id === editingCarpet.id
              ? data.carpet
              : carpet
          )
        )
      } else {
        setCarpets((currentCarpets) => [
          data.carpet,
          ...currentCarpets,
        ])
      }

      closeCarpetModal()
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function deleteCarpet(id) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذه السجادة؟"
    )

    if (!confirmed) return

    try {
      const response = await apiFetch(
        `/api/carpets/${id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "حدث خطأ أثناء حذف السجادة"
        )
        return
      }

      setCarpets((currentCarpets) =>
        currentCarpets.filter(
          (carpet) => carpet.id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  const filteredCarpets = carpets.filter((carpet) => {
    const search =
      debouncedCarpetSearch.trim().toLowerCase()

    if (!search) return true

    return (
      String(carpet.name || "")
        .toLowerCase()
        .includes(search) ||
      String(carpet.type || "")
        .toLowerCase()
        .includes(search) ||
      String(carpet.serviceName || "")
        .toLowerCase()
        .includes(search) ||
      String(getCustomerName(carpet.customerId))
        .toLowerCase()
        .includes(search) ||
      String(carpet.status || "")
        .toLowerCase()
        .includes(search)
    )
  })

  const carpetStatusCounts = useMemo(
    () => ({
      received: carpets.filter(
        (carpet) => carpet.status === "تم الاستلام"
      ).length,
      cleaning: carpets.filter(
        (carpet) => carpet.status === "تحت التنظيف"
      ).length,
      ready: carpets.filter(
        (carpet) => carpet.status === "جاهزة"
      ).length,
      delivered: carpets.filter(
        (carpet) => carpet.status === "تم التسليم"
      ).length,
    }),
    [carpets]
  )

  const totalCarpetArea = useMemo(
    () =>
      carpets.reduce(
        (sum, carpet) =>
          sum + Number(carpet.area || 0),
        0
      ),
    [carpets]
  )

  // =========================
  // المصروفات
  // =========================

  function openAddExpense() {
    setEditingExpense(null)
    setExpenseDate(getTodayDate())
    setExpenseCategory("تشغيل")
    setExpenseTitle("")
    setExpenseAmount("")
    setExpensePaymentMethod("نقدي")
    setExpenseNotes("")
    setShowExpenseModal(true)
  }

  function openEditExpense(expense) {
    setEditingExpense(expense)
    setExpenseDate(expense.date || getTodayDate())
    setExpenseCategory(expense.category || "تشغيل")
    setExpenseTitle(expense.title || "")
    setExpenseAmount(expense.amount ?? "")
    setExpensePaymentMethod(
      expense.paymentMethod || "نقدي"
    )
    setExpenseNotes(expense.notes || "")
    setShowExpenseModal(true)
  }

  function closeExpenseModal() {
    setShowExpenseModal(false)
    setEditingExpense(null)
    setExpenseDate("")
    setExpenseCategory("تشغيل")
    setExpenseTitle("")
    setExpenseAmount("")
    setExpensePaymentMethod("نقدي")
    setExpenseNotes("")
  }

  async function saveExpense(e) {
    e.preventDefault()

    if (!expenseCategory.trim()) {
      alert("من فضلك اختر تصنيف المصروف")
      return
    }

    if (!expenseTitle.trim()) {
      alert("من فضلك أدخل بيان المصروف")
      return
    }

    if (
      expenseAmount === "" ||
      Number(expenseAmount) <= 0
    ) {
      alert("من فضلك أدخل مبلغ صحيح")
      return
    }

    const expenseData = {
      date: expenseDate || getTodayDate(),
      category: expenseCategory.trim(),
      title: expenseTitle.trim(),
      amount: Number(expenseAmount),
      paymentMethod: expensePaymentMethod,
      notes: expenseNotes.trim(),
    }

    try {
      const response = await apiFetch(
        editingExpense
          ? `/api/expenses/${editingExpense.id}`
          : "/api/expenses",
        {
          method: editingExpense ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "حدث خطأ أثناء حفظ المصروف"
        )
        return
      }

      if (editingExpense) {
        setExpenses((currentExpenses) =>
          currentExpenses.map((expense) =>
            expense.id === editingExpense.id
              ? data.expense
              : expense
          )
        )
      } else {
        setExpenses((currentExpenses) => [
          data.expense,
          ...currentExpenses,
        ])
      }

      closeExpenseModal()
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  async function deleteExpense(id) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المصروف؟"
    )

    if (!confirmed) return

    try {
      const response = await apiFetch(
        `/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "حدث خطأ أثناء حذف المصروف"
        )
        return
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) => expense.id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert("تعذر الاتصال بالسيرفر")
    }
  }

  const filteredExpenses =
    expenses.filter((expense) => {
      const search =
        debouncedExpenseSearch.trim().toLowerCase()

      if (!search) {
        return true
      }

      return (
        String(expense.title || "")
          .toLowerCase()
          .includes(search) ||
        String(expense.category || "")
          .toLowerCase()
          .includes(search) ||
        String(expense.paymentMethod || "")
          .toLowerCase()
          .includes(search) ||
        String(expense.date || "")
          .toLowerCase()
          .includes(search)
      )
    })

  const filteredInvoices =
    invoices.filter(
      (invoice) => {
        const search =
          debouncedInvoiceSearch
            .trim()
            .toLowerCase()

        if (!search) {
          return true
        }

        return (
          invoice.invoiceNumber
            .toLowerCase()
            .includes(search) ||
          invoice.customerName
            .toLowerCase()
            .includes(search) ||
          String(
            invoice.assetInfo ||
              invoice.carInfo ||
              ""
          )
            .toLowerCase()
            .includes(search) ||
          invoice.paymentMethod
            .toLowerCase()
            .includes(search)
        )
      }
    )

  const selectedCustomerCars =
    cars.filter(
      (car) =>
        car.customerId ===
          Number(
            invoiceCustomerId
          ) &&
        car.active
    )

  const selectedCustomerCarpets =
    carpets.filter(
      (carpet) =>
        carpet.customerId ===
        Number(
          invoiceCustomerId
        ) &&
        carpet.status !==
        "تم التسليم"
    )

  const selectedCustomerMemberships =
    memberships.filter(
      (membership) =>
        membership.customerId ===
          Number(
            invoiceCustomerId
          ) &&
        (          (membership.status === "سارية" &&
            Number(membership.remainingVisits) > 0) ||
          membership.id === Number(invoiceMembershipId)
        )
    )

  const selectedMembership =
    memberships.find(
      (membership) =>
        membership.id ===
        Number(
          invoiceMembershipId
        )
    )

  // =========================
  // التقارير
  // =========================

  function normalizeDateForReport(value) {
    if (!value) return ""

    const raw = String(value)
      .replace(/[\u200e\u200f\u061c]/g, "")
      .trim()

    const arabicDigits = "٠١٢٣٤٥٦٧٨٩"
    const englishDigits = "0123456789"

    const converted = raw.replace(
      /[٠-٩]/g,
      (digit) =>
        englishDigits[
          arabicDigits.indexOf(digit)
        ]
    )

    if (/^\d{4}-\d{2}-\d{2}$/.test(converted)) {
      return converted
    }

    const parts = converted.split(/[\/\-.]/)

    if (parts.length === 3) {
      const first = parts[0]
      const second = parts[1]
      const third = parts[2]

      if (first.length === 4) {
        return `${first}-${second.padStart(2, "0")}-${third.padStart(2, "0")}`
      }

      if (third.length === 4) {
        return `${third}-${second.padStart(2, "0")}-${first.padStart(2, "0")}`
      }
    }

    return ""
  }

  const reportInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const date =
          normalizeDateForReport(invoice.date)

        if (
          reportFromDate &&
          (!date || date < reportFromDate)
        ) {
          return false
        }

        if (
          reportToDate &&
          (!date || date > reportToDate)
        ) {
          return false
        }

        return true
      }),
    [invoices, reportFromDate, reportToDate]
  )

  const reportExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const date =
          normalizeDateForReport(expense.date)

        if (
          reportFromDate &&
          (!date || date < reportFromDate)
        ) {
          return false
        }

        if (
          reportToDate &&
          (!date || date > reportToDate)
        ) {
          return false
        }

        return true
      }),
    [expenses, reportFromDate, reportToDate]
  )

  const totalSales = useMemo(
    () =>
      invoices.reduce(
        (sum, invoice) =>
          sum +
          Number(
            invoice.total || 0
          ),
        0
      ),
    [invoices]
  )

  const totalPaid = useMemo(
    () =>
      invoices.reduce(
        (sum, invoice) =>
          sum +
          Number(
            invoice.paidAmount ||
              0
          ),
        0
      ),
    [invoices]
  )

  const totalRemaining =
    useMemo(
      () =>
        reportInvoices.reduce(
          (
            sum,
            invoice
          ) =>
            sum +
            Number(
              invoice.remainingAmount ||
                0
            ),
          0
        ),
      [reportInvoices]
    )

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      ),
    [expenses]
  )

  const reportTotalExpenses = useMemo(
    () =>
      reportExpenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      ),
    [reportExpenses]
  )

  const netProfit = useMemo(
    () => totalSales - totalExpenses,
    [totalSales, totalExpenses]
  )

  const reportTotalSales = useMemo(
    () =>
      reportInvoices.reduce(
        (sum, invoice) => sum + Number(invoice.total || 0),
        0
      ),
    [reportInvoices]
  )

  const reportTotalPaid = useMemo(
    () =>
      reportInvoices.reduce(
        (sum, invoice) => sum + Number(invoice.paidAmount || 0),
        0
      ),
    [reportInvoices]
  )

  const reportNetProfit = useMemo(
    () => reportTotalSales - reportTotalExpenses,
    [reportTotalSales, reportTotalExpenses]
  )

  const totalServicesSold =
    useMemo(
      () =>
        reportInvoices.reduce(
          (
            sum,
            invoice
          ) =>
            sum +
            (invoice.items ||
              []).reduce(
              (
                itemSum,
                item
              ) =>
                itemSum +
                Number(
                  item.quantity ||
                    0
                ),
              0
            ),
          0
        ),
      [reportInvoices]
    )

  // بيانات الرسوم البيانية للتقارير
  const serviceChartData = useMemo(() => {
    const map = {}
    reportInvoices.forEach((inv) => {
      (inv.items || []).forEach((item) => {
        const name = item.serviceName || "خدمة"
        map[name] = (map[name] || 0) + Number(item.quantity || 0)
      })
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [reportInvoices])

  const paymentChartData = useMemo(() => {
    let paid = 0, partial = 0, unpaid = 0, membership = 0
    reportInvoices.forEach((inv) => {
      const s = inv.paymentStatus || ""
      if (s === "مدفوعة") paid++
      else if (s === "مدفوعة جزئيًا") partial++
      else if (s === "مغطاة بالعضوية") membership++
      else unpaid++
    })
    return [
      { name: "مدفوعة", value: paid, color: "#16a34a" },
      { name: "جزئيًا", value: partial, color: "#d97706" },
      { name: "غير مدفوعة", value: unpaid, color: "#dc2626" },
      { name: "عضوية", value: membership, color: "#2563eb" },
    ].filter((x) => x.value > 0)
  }, [reportInvoices])

  const expenseChartData = useMemo(() => {
    const map = {}
    reportExpenses.forEach((exp) => {
      const name = exp.category || "أخرى"
      map[name] = (map[name] || 0) + Number(exp.amount || 0)
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [reportExpenses])

  const maxServiceValue = Math.max(1, ...serviceChartData.map((x) => x.value))
  const maxPaymentValue = Math.max(1, ...paymentChartData.map((x) => x.value))
  const maxExpenseValue = Math.max(1, ...expenseChartData.map((x) => x.value))

  function setReportPeriod(period) {
    const today = new Date()
    const to = today.toISOString().slice(0, 10)
    if (period === "all") {
      setReportFromDate("")
      setReportToDate("")
      return
    }
    const from = new Date(today)
    if (period === "today") {
      setReportFromDate(to)
      setReportToDate(to)
      return
    }
    if (period === "week") {
      from.setDate(from.getDate() - 6)
    } else if (period === "month") {
      from.setDate(1)
    }
    setReportFromDate(from.toISOString().slice(0, 10))
    setReportToDate(to)
  }

  function printReports() {
    window.print()
  }

  const todayDate =
    getTodayDate()

  const todayInvoices =
    useMemo(
      () =>
        invoices.filter(
          (invoice) =>
            invoice.date ===
            todayDate
        ),
      [invoices, todayDate]
    )

  const todaySales =
    useMemo(
      () =>
        todayInvoices.reduce(
          (
            sum,
            invoice
          ) =>
            sum +
            Number(
              invoice.total || 0
            ),
          0
        ),
      [todayInvoices]
    )

  const todayPaid =
    useMemo(
      () =>
        todayInvoices.reduce(
          (
            sum,
            invoice
          ) =>
            sum +
            Number(
              invoice.paidAmount ||
                0
            ),
          0
        ),
      [todayInvoices]
    )

  const serviceReports =
    useMemo(
      () =>
        services
          .map(
            (service) => {
              const usage =
                reportInvoices.reduce(
                  (
                    sum,
                    invoice
                  ) =>
                    sum +
                    (
                      invoice.items ||
                      []
                    )
                      .filter(
                        (item) =>
                          Number(
                            item.serviceId
                          ) ===
                          Number(
                            service.id
                          )
                      )
                      .reduce(
                        (
                          itemSum,
                          item
                        ) =>
                          itemSum +
                          Number(
                            item.quantity ||
                              0
                          ),
                        0
                      ),
                  0
                )

              const revenue =
                reportInvoices.reduce(
                  (
                    sum,
                    invoice
                  ) =>
                    sum +
                    (
                      invoice.items ||
                      []
                    )
                      .filter(
                        (item) =>
                          Number(
                            item.serviceId
                          ) ===
                          Number(
                            service.id
                          )
                      )
                      .reduce(
                        (
                          itemSum,
                          item
                        ) =>
                          itemSum +
                          Number(
                            item.total ||
                              0
                          ),
                        0
                      ) * (invoice.coveredByMembership ? 0 : 1),
                  0
                )

              return {
                ...service,
                usage,
                revenue,
              }
            }
          )
          .sort(
            (a, b) =>
              b.usage -
              a.usage
          ),
      [services, reportInvoices]
    )

  const customerReports =
    useMemo(
      () =>
        customers
          .map(
            (customer) => {
              const customerInvoices =
                reportInvoices.filter(
                  (invoice) =>
                    Number(
                      invoice.customerId
                    ) ===
                    Number(
                      customer.id
                    )
                )

              const invoiceCount =
                customerInvoices.length

              const total =
                customerInvoices.reduce(
                  (
                    sum,
                    invoice
                  ) =>
                    sum +
                    Number(
                      invoice.total ||
                        0
                    ),
                  0
                )

              return {
                ...customer,
                invoiceCount,
                total,
              }
            }
          )
          .sort(
            (a, b) =>
              b.total -
              a.total
          ),
      [customers, reportInvoices]
    )

  // =========================
  // شاشة تسجيل الدخول
  // =========================

  if (!loggedIn) {
    return (
      <div
        dir="rtl"
        style={{
          ...rtlText,
          minHeight:
            "100vh",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          padding:
            "24px",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.68), rgba(0,0,0,.78)), url('/car-wash-bg.jpg')",
          backgroundSize:
            "cover",
          backgroundPosition:
            "center",
          fontFamily:
            "Tahoma, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width:
              "100%",
            maxWidth:
              "430px",
            background:
              "#fff",
            borderRadius:
              "28px",
            padding:
              "40px",
            boxShadow:
              "0 25px 60px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              textAlign:
                "center",
              marginBottom:
                "32px",
            }}
          >
            <div
              style={{
                width:
                  "76px",
                height:
                  "76px",
                margin:
                  "0 auto 18px",
                borderRadius:
                  "20px",
                background:
                  "#111827",
                color:
                  "#fff",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize:
                  "32px",
                fontWeight:
                  "700",
                direction:
                  "ltr",
              }}
            >
              M
            </div>

            <h1
              style={{
                margin: 0,
                fontSize:
                  "30px",
                color:
                  "#111827",
                direction:
                  "ltr",
              }}
            >
              Mussa Wash &
              Clean
            </h1>

            <p
              style={{
                ...rtlText,
                color:
                  "#64748b",
                marginTop:
                  "10px",
                textAlign:
                  "center",
              }}
            >
              نظام إدارة غسيل السيارات وتنظيف السجاد
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label
              style={
                labelStyle
              }
            >
              اسم المستخدم
            </label>

            <input
              value={
                username
              }
              onChange={(e) =>
                setUsername(
                  e.target
                    .value
                )
              }
              placeholder="أدخل اسم المستخدم"
              dir="rtl"
              style={
                inputStyle
              }
            />

            <label
              style={
                labelStyle
              }
            >
              كلمة المرور
            </label>

            <input
              type="password"
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target
                    .value
                )
              }
              placeholder="••••••••"
              dir="ltr"
              style={{
                ...inputStyle,
                textAlign:
                  "left",
                fontFamily:
                  "Arial, sans-serif",
              }}
            />

            <button
              type="submit"
              disabled={
                loading
              }
              style={{
                ...primaryButtonStyle,
                width:
                  "100%",
                height:
                  "52px",
              }}
            >
              {loading
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>

            {message && (
              <p
                style={{
                  ...rtlText,
                  textAlign:
                    "center",
                  color:
                    "#dc2626",
                  marginTop:
                    "16px",
                }}
              >
                {message}
              </p>
            )}
          </form>

          <p
            style={{
              direction:
                "ltr",
              textAlign:
                "center",
              color:
                "#94a3b8",
              fontSize:
                "12px",
              marginTop:
                "28px",
              paddingTop:
                "20px",
              borderTop:
                "1px solid #e2e8f0",
            }}
          >
            Mussa Wash &
            Clean © 2026
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      dir="rtl"
      style={{
        ...rtlText,
        minHeight:
          "100vh",
        background:
          "#f1f5f9",
        fontFamily:
          "Tahoma, Arial, sans-serif",
        display:
          "flex",
        width:
          "100%",
      }}
    >
      {/* =========================
          القائمة الجانبية
      ========================= */}

      <aside
        style={{
          width:
            "250px",
          flexShrink:
            0,
          background:
            "#111827",
          color:
            "#fff",
          padding:
            "25px 16px",
          boxSizing:
            "border-box",
          minHeight:
            "100vh",
        }}
      >
        <div
          style={{
            textAlign:
              "center",
            paddingBottom:
              "25px",
            borderBottom:
              "1px solid #374151",
          }}
        >
          <div
            style={{
              width:
                "52px",
              height:
                "52px",
              margin:
                "0 auto 10px",
              borderRadius:
                "14px",
              background:
                "#fff",
              color:
                "#111827",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              fontSize:
                "24px",
              fontWeight:
                "700",
              direction:
                "ltr",
            }}
          >
            M
          </div>

          <div
            style={{
              direction:
                "ltr",
              textAlign:
                "center",
              fontSize:
                "19px",
              fontWeight:
                "700",
            }}
          >
            Mussa Wash &
            Clean
          </div>

          <div
            style={{
              ...rtlText,
              color:
                "#9ca3af",
              fontSize:
                "12px",
              marginTop:
                "5px",
              textAlign:
                "center",
            }}
          >
            لوحة الإدارة
          </div>
        </div>

        <nav
          dir="rtl"
          style={{
            marginTop:
              "25px",
            direction:
              "rtl",
          }}
        >
          {[
            "الرئيسية",
            "العملاء",
            "المخزون",
            "السيارات",
            "السجاد",
            "الخدمات",
            "الفواتير",
            "الاشتراكات",
            "المصروفات",
            "التقارير",
            "الإعدادات",
            "النسخ الاحتياطي",
          ]
            .filter((item) => canAccessPage(item))
            .map(
            (item) => (
              <button
                key={
                  item
                }
                onClick={() =>
                  setActivePage(
                    item
                  )
                }
                dir="rtl"
                style={{
                  ...rtlText,
                  width:
                    "100%",
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  padding:
                    "14px",
                  marginBottom:
                    "7px",
                  textAlign:
                    "right",
                  background:
                    activePage ===
                    item
                      ? "#374151"
                      : "transparent",
                  color:
                    "#fff",
                  cursor:
                    "pointer",
                  fontSize:
                    "15px",
                  fontFamily:
                    "Tahoma, Arial, sans-serif",
                }}
              >
                {item}
              </button>
            )
          )}
        </nav>

        <button
          onClick={
            logout
          }
          dir="rtl"
          style={{
            ...rtlText,
            width:
              "100%",
            marginTop:
              "30px",
            padding:
              "13px",
            borderRadius:
              "10px",
            border:
              "1px solid #4b5563",
            background:
              "transparent",
            color:
              "#fff",
            cursor:
              "pointer",
            fontFamily:
              "Tahoma, Arial, sans-serif",
          }}
        >
          تسجيل الخروج
        </button>
      </aside>

      {/* =========================
          المحتوى
      ========================= */}
      <main
        dir="rtl"
        style={{
          ...rtlText,
          flex:
            1,
          padding:
            "30px",
          boxSizing:
            "border-box",
          overflow:
            "auto",
          minWidth:
            0,
        }}
      >
        {/* الهيدر */}

        {activePage !== "المخزون" && (
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap:
              "20px",
            marginBottom:
              "30px",
          }}
        >
          <div>
            <h1
              style={{
                ...rtlText,
                margin:
                  0,
                color:
                  "#111827",
                fontSize:
                  "28px",
                textAlign:
                  "right",
              }}
            >
              {activePage}
            </h1>

            <p
              style={{
                ...rtlText,
                color:
                  "#64748b",
                marginTop:
                  "8px",
                textAlign:
                  "right",
              }}
            >
              أهلاً بك في لوحة إدارة
              Mussa Wash &
              Clean
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* جرس الإشعارات */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,.05)",
                  cursor: "pointer",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                title="الإشعارات"
              >
                🔔
                {(expiredMembershipsList.length + soonExpiringMemberships.length) > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    left: "-4px",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "700",
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "99px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}>
                    {expiredMembershipsList.length + soonExpiringMemberships.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute",
                  top: "52px",
                  left: "0",
                  width: "320px",
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 10px 40px rgba(0,0,0,.15)",
                  zIndex: 1000,
                  overflow: "hidden",
                  direction: "rtl",
                }}>
                  <div style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #e2e8f0",
                    fontWeight: "700",
                    color: "#111827",
                    fontSize: "15px",
                  }}>
                    الإشعارات
                  </div>

                  {expiredMembershipsList.length === 0 && soonExpiringMemberships.length === 0 ? (
                    <div style={{ padding: "24px 16px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                      لا توجد إشعارات حاليًا
                    </div>
                  ) : (
                    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                      {expiredMembershipsList.map((m) => (
                        <div key={"exp-" + m.id} style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #f1f5f9",
                          background: "#fef2f2",
                        }}>
                          <div style={{ fontWeight: "700", color: "#991b1b", fontSize: "13px", marginBottom: "4px" }}>
                            عضوية منتهية
                          </div>
                          <div style={{ color: "#64748b", fontSize: "13px" }}>
                            {m.customerName || "عميل"} — {m.planName}
                          </div>
                        </div>
                      ))}
                      {soonExpiringMemberships.map((m) => (
                        <div key={"soon-" + m.id} style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #f1f5f9",
                          background: "#fffbeb",
                        }}>
                          <div style={{ fontWeight: "700", color: "#92400e", fontSize: "13px", marginBottom: "4px" }}>
                            قربت على الانتهاء
                          </div>
                          <div style={{ color: "#64748b", fontSize: "13px" }}>
                            {m.customerName || "عميل"} — {m.planName} (حتى {m.endDate})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowNotifications(false)
                      setActivePage("الاشتراكات")
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      borderTop: "1px solid #e2e8f0",
                      padding: "12px",
                      background: "#f8fafc",
                      color: "#1d4ed8",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontFamily: "Tahoma, Arial, sans-serif",
                    }}
                  >
                    عرض كل الاشتراكات
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                background: "#fff",
                padding: "10px 18px",
                borderRadius: "12px",
                color: "#475569",
                boxShadow: "0 2px 10px rgba(0,0,0,.05)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ direction: "rtl" }}>{currentUser?.role || "المدير"}: </span>
              <span style={{ direction: "ltr", display: "inline-block" }}>{currentUser?.name || currentUser?.username || username || "admin"}</span>
            </div>
          </div>
        </div>
        )}

        {/* =========================
            الرئيسية
        ========================= */}

        {activePage ===
          "الرئيسية" && (
          <>
            {/* بطاقات الملخص */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "22px",
              }}
            >
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>مبيعات اليوم</div>
                    <div style={{ fontSize: "26px", fontWeight: "700", color: "#111827" }}>{todaySales} <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>جنيه</span></div>
                  </div>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💰</div>
                </div>
              </div>

              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>المتبقي</div>
                    <div style={{ fontSize: "26px", fontWeight: "700", color: "#c2410c" }}>{totalRemaining} <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>جنيه</span></div>
                  </div>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🧾</div>
                </div>
              </div>

              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>الاشتراكات</div>
                    <div style={{ fontSize: "26px", fontWeight: "700", color: "#111827" }}>{activeMembershipsCount}</div>
                    <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px" }}>{activeMembershipsCount} سارية</div>
                  </div>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👑</div>
                </div>
              </div>

              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>العملاء</div>
                    <div style={{ fontSize: "26px", fontWeight: "700", color: "#111827" }}>{customers.length}</div>
                  </div>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👥</div>
                </div>
              </div>
            </div>

            {/* إجراءات سريعة */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", marginBottom: "12px", textAlign: "right" }}>
                إجراءات سريعة
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}>
                <button
                  onClick={() => {
                    setActivePage("الفواتير")
                    // will open add if function exists - fallback navigate
                  }}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📄</div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>فاتورة جديدة</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>إنشاء فاتورة غسيل</div>
                  </div>
                </button>

                <button
                  onClick={() => setActivePage("العملاء")}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👤</div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>عميل جديد</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>إضافة عميل للنظام</div>
                  </div>
                </button>
<button
                  onClick={() => setActivePage("المخزون")}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📦</div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>المخزون</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>إدارة الأصناف والكميات</div>
                  </div>
                </button>
                <button
                  onClick={() => setActivePage("الاشتراكات")}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fdf4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👑</div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>عضوية جديدة</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>إصدار عضوية جديدة</div>
                  </div>
                </button>
              </div>
            </div>

            {/* قسمين: تنبيهات + آخر الفواتير */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "18px",
            }}>
              {/* تنبيهات الاشتراكات */}
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#111827" }}>تنبيهات الاشتراكات</h3>
                  <button
                    onClick={() => setActivePage("الاشتراكات")}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#2563eb",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "Tahoma, Arial, sans-serif",
                    }}
                  >
                    عرض الكل
                  </button>
                </div>

                {expiredMembershipsList.length === 0 && soonExpiringMemberships.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "30px 10px", fontSize: "13px" }}>
                    لا توجد تنبيهات حاليًا ✓
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {expiredMembershipsList.slice(0, 4).map((m) => (
                      <div key={"h-exp-" + m.id} style={{
                        background: "#fef2f2",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid #fecaca",
                      }}>
                        <div style={{ fontWeight: "700", color: "#991b1b", fontSize: "13px" }}>عضوية منتهية</div>
                        <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                          {m.customerName || "عميل"} — {m.planName}
                        </div>
                      </div>
                    ))}
                    {soonExpiringMemberships.slice(0, 4).map((m) => (
                      <div key={"h-soon-" + m.id} style={{
                        background: "#fffbeb",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid #fde68a",
                      }}>
                        <div style={{ fontWeight: "700", color: "#92400e", fontSize: "13px" }}>قربت على الانتهاء</div>
                        <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                          {m.customerName || "عميل"} — {m.planName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* آخر الفواتير */}
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#111827" }}>آخر الفواتير</h3>
                  <button
                    onClick={() => setActivePage("الفواتير")}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#2563eb",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "Tahoma, Arial, sans-serif",
                    }}
                  >
                    عرض الكل
                  </button>
                </div>

                {invoices.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "30px 10px", fontSize: "13px" }}>
                    لا توجد فواتير بعد
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {invoices.slice(0, 5).map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => setViewingInvoice(inv)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          background: "#f8fafc",
                          cursor: "pointer",
                          direction: "rtl",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13px", color: "#111827" }}>
                            {inv.customerName || "عميل"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            {inv.invoiceNumber} — {inv.date}
                          </div>
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: "700", fontSize: "13px", color: "#111827" }}>
                            {inv.total} ج
                          </div>
                          <div style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color:
                              inv.paymentStatus === "مدفوعة" ? "#16a34a" :
                              inv.paymentStatus === "مدفوعة جزئيًا" ? "#d97706" :
                              inv.paymentStatus === "مغطاة بالعضوية" ? "#2563eb" : "#dc2626",
                          }}>
                            {inv.paymentStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}


        {/* =========================
            العملاء
        ========================= */}
{activePage === "المخزون" && <Inventory />}

        {activePage ===
          "العملاء" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  إدارة العملاء
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  جميع عملاء السيارات والسجاد في مكان واحد
                </p>
              </div>

              <button
                onClick={
                  openAddCustomer
                }
                style={
                  primaryButtonStyle
                }
              >
                + إضافة عميل
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي العملاء
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {
                    customers.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#eff6ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي السيارات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#1d4ed8",
                  }}
                >
                  {customers.reduce(
                    (
                      sum,
                      customer
                    ) =>
                      sum +
                      Number(
                        customer.cars
                      ),
                    0
                  )}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fdf4ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي السجاد
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#a21caf",
                  }}
                >
                  {customers.reduce(
                    (
                      sum,
                      customer
                    ) =>
                      sum +
                      Number(
                        customer.carpets
                      ),
                    0
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <input
                value={
                  customerSearch
                }
                onChange={(
                  e
                ) =>
                  setCustomerSearch(
                    e.target.value
                  )
                }
                placeholder="ابحث باسم العميل أو رقم الهاتف أو العنوان..."
                dir="rtl"
                style={
                  inputStyle
                }
              />
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "900px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      العميل
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      رقم الهاتف
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      العنوان
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      السيارات
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      السجاد
                    </th>

                    <th
                      style={
                        tableHeaderCenterStyle
                      }
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map(
                    (
                      customer
                    ) => (
                      <tr
                        key={
                          customer.id
                        }
                      >
                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                "700",
                              color:
                                "#111827",
                            }}
                          >
                            {
                              customer.name
                            }
                          </div>

                          {customer.notes && (
                            <div
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "12px",
                                marginTop:
                                  "4px",
                              }}
                            >
                              {
                                customer.notes
                              }
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            direction:
                              "ltr",
                          }}
                        >
                          {
                            customer.phone
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            customer.address ||
                            "—"
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            customer.cars
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            customer.carpets
                          }
                        </td>

                        <td
                          style={
                            tableCellCenterStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                              justifyContent:
                                "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                openEditCustomer(
                                  customer
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteCustomer(
                                  customer.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredCustomers.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding:
                            "50px",
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        لا يوجد عملاء مطابقون للبحث
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================
            السيارات
        ========================= */}

        {activePage ===
          "السيارات" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  إدارة السيارات
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  جميع سيارات العملاء المسجلة في النظام
                </p>
              </div>

              <button
                onClick={
                  openAddCar
                }
                style={
                  primaryButtonStyle
                }
              >
                + إضافة سيارة
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي السيارات
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {
                    cars.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#eff6ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  السيارات المفعلة
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#1d4ed8",
                  }}
                >
                  {
                    activeCarsCount
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fee2e2",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  السيارات غير المفعلة
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#b91c1c",
                  }}
                >
                  {
                    inactiveCarsCount
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#f0fdf4",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  العملاء الذين لديهم سيارات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#15803d",
                  }}
                >
                  {
                    new Set(
                      cars.map(
                        (car) =>
                          car.customerId
                      )
                    ).size
                  }
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <input
                value={
                  carSearch
                }
                onChange={(
                  e
                ) =>
                  setCarSearch(
                    e.target.value
                  )
                }
                placeholder="ابحث برقم اللوحة أو العميل أو الماركة أو الموديل أو اللون..."
                dir="rtl"
                style={
                  inputStyle
                }
              />
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "1150px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      العميل
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      رقم اللوحة
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الماركة
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الموديل
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      اللون
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      سنة الصنع
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الحالة
                    </th>

                    <th
                      style={
                        tableHeaderCenterStyle
                      }
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCars.map(
                    (car) => (
                      <tr
                        key={
                          car.id
                        }
                      >
                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                "700",
                              color:
                                "#111827",
                            }}
                          >
                            {
                              getCustomerName(
                                car.customerId
                              )
                            }
                          </div>

                          {car.notes && (
                            <div
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "12px",
                                marginTop:
                                  "4px",
                              }}
                            >
                              {
                                car.notes
                              }
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                          }}
                        >
                          {
                            car.plateNumber
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            car.brand
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            car.model
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            car.color
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            car.year
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                              background:
                                car.active
                                  ? "#dcfce7"
                                  : "#fee2e2",
                              color:
                                car.active
                                  ? "#166534"
                                  : "#991b1b",
                            }}
                          >
                            {car.active
                              ? "مفعلة"
                              : "غير مفعلة"}
                          </span>
                        </td>

                        <td
                          style={
                            tableCellCenterStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                              justifyContent:
                                "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                openEditCar(
                                  car
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteCar(
                                  car.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredCars.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          padding:
                            "50px",
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        لا توجد سيارات مطابقة للبحث
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================
            السجاد
        ========================= */}

        {activePage ===
          "السجاد" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  إدارة السجاد
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  متابعة السجاد من الاستلام حتى التسليم
                </p>
              </div>

              <button
                onClick={
                  openAddCarpet
                }
                style={
                  primaryButtonStyle
                }
              >
                + إضافة سجادة
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي السجاد
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {carpets.length}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#eff6ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  تحت التنظيف
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#1d4ed8",
                  }}
                >
                  {carpetStatusCounts.cleaning}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#f0fdf4",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  الجاهز
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#15803d",
                  }}
                >
                  {carpetStatusCounts.ready}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fdf4ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المساحة
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#a21caf",
                  }}
                >
                  {totalCarpetArea.toFixed(2)} م²
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <input
                value={
                  carpetSearch
                }
                onChange={(
                  e
                ) =>
                  setCarpetSearch(
                    e.target.value
                  )
                }
                placeholder="ابحث باسم السجادة أو العميل أو الخدمة أو الحالة..."
                dir="rtl"
                style={
                  inputStyle
                }
              />
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "1200px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      العميل
                    </th>
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      السجادة
                    </th>
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      المقاس
                    </th>
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      المساحة
                    </th>
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الخدمة
                    </th>
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      السعر
                    </th>
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الحالة
                    </th>
                    <th
                      style={
                        tableHeaderCenterStyle
                      }
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCarpets.map(
                    (
                      carpet
                    ) => (
                      <tr
                        key={
                          carpet.id
                        }
                      >
                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            getCustomerName(
                              carpet.customerId
                            )
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                "700",
                              color:
                                "#111827",
                            }}
                          >
                            {
                              carpet.name
                            }
                          </div>

                          <div
                            style={{
                              color:
                                "#94a3b8",
                              fontSize:
                                "12px",
                              marginTop:
                                "4px",
                            }}
                          >
                            {
                              carpet.type
                            }
                          </div>
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {carpet.length} ×{" "}
                          {carpet.width} م
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                          }}
                        >
                          {Number(
                            carpet.area || 0
                          ).toFixed(2)}{" "}
                          م²
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            carpet.serviceName
                          }
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                          }}
                        >
                          {
                            carpet.servicePrice
                          }{" "}
                          جنيه
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                              background:
                                carpet.status ===
                                "تم التسليم"
                                  ? "#dcfce7"
                                  : carpet.status ===
                                    "جاهزة"
                                  ? "#dbeafe"
                                  : carpet.status ===
                                    "تحت التنظيف"
                                  ? "#fef3c7"
                                  : "#f1f5f9",
                              color:
                                carpet.status ===
                                "تم التسليم"
                                  ? "#166534"
                                  : carpet.status ===
                                    "جاهزة"
                                  ? "#1d4ed8"
                                  : carpet.status ===
                                    "تحت التنظيف"
                                  ? "#92400e"
                                  : "#475569",
                            }}
                          >
                            {
                              carpet.status
                            }
                          </span>
                        </td>

                        <td
                          style={
                            tableCellCenterStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                              justifyContent:
                                "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                openEditCarpet(
                                  carpet
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteCarpet(
                                  carpet.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredCarpets.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          padding:
                            "60px",
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        لا توجد سجادات حتى الآن
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================
            الخدمات
        ========================= */}

        {activePage ===
          "الخدمات" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  إدارة الخدمات
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  خدمات السيارات والسجاد
                </p>
              </div>

              <button
                onClick={
                  openAddService
                }
                style={
                  primaryButtonStyle
                }
              >
                + إضافة خدمة
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(170px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي الخدمات
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {
                    services.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#eff6ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  خدمات السيارات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#1d4ed8",
                  }}
                >
                  {
                    carServices.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fdf4ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  خدمات السجاد
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#a21caf",
                  }}
                >
                  {
                    carpetServices.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#f0fdf4",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  الخدمات المفعلة
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#15803d",
                  }}
                >
                  {
                    services.filter(
                      (
                        service
                      ) =>
                        service.active
                    ).length
                  }
                </div>
              </div>
            </div>

            <div
              style={{
                display:
                  "flex",
                gap:
                  "10px",
                marginBottom:
                  "20px",
                flexWrap:
                  "wrap",
              }}
            >
              {[
                "الكل",
                "سيارات",
                "سجاد",
              ].map(
                (filter) => (
                  <button
                    key={
                      filter
                    }
                    onClick={() =>
                      setServiceFilter(
                        filter
                      )
                    }
                    style={{
                      ...secondaryButtonStyle,
                      background:
                        serviceFilter ===
                        filter
                          ? "#111827"
                          : "#f1f5f9",
                      color:
                        serviceFilter ===
                        filter
                          ? "#fff"
                          : "#475569",
                    }}
                  >
                    {filter ===
                    "الكل"
                      ? "كل الخدمات"
                      : filter ===
                        "سيارات"
                      ? "السيارات"
                      : "السجاد"}
                  </button>
                )
              )}
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "900px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الخدمة
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      النوع
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      السعر
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      طريقة الحساب
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الحالة
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الاستخدام
                    </th>

                    <th
                      style={
                        tableHeaderCenterStyle
                      }
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredServices.map(
                    (
                      service
                    ) => (
                      <tr
                        key={
                          service.id
                        }
                      >
                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                "700",
                              color:
                                "#111827",
                            }}
                          >
                            {
                              service.name
                            }
                          </div>

                          <div
                            style={{
                              color:
                                "#94a3b8",
                              fontSize:
                                "12px",
                              marginTop:
                                "4px",
                            }}
                          >
                            {
                              service.description ||
                              "لا يوجد وصف"
                            }
                          </div>
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            service.type
                          }
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                          }}
                        >
                          {
                            service.price
                          }{" "}
                          جنيه
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {service.unit ===
                          "متر"
                            ? "بالمتر المربع"
                            : "سعر ثابت"}
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                              background:
                                service.active
                                  ? "#dcfce7"
                                  : "#fee2e2",
                              color:
                                service.active
                                  ? "#166534"
                                  : "#991b1b",
                            }}
                          >
                            {service.active
                              ? "مفعلة"
                              : "غير مفعلة"}
                          </span>
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            service.count
                          }
                        </td>

                        <td
                          style={
                            tableCellCenterStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                              justifyContent:
                                "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                openEditService(
                                  service
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteService(
                                  service.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* =========================
            الإعدادات
        ========================= */}

        {activePage ===
          "الإعدادات" && (
          <div style={sectionStyle}>
            <div style={{ ...sectionHeaderStyle, marginBottom: "22px" }}>
              <div>
                <h2 style={sectionTitleStyle}>إعدادات النظام</h2>
                <p style={sectionSubtitleStyle}>
                  بيانات المغسلة · الفاتورة · الأمان · الموظفين
                </p>
              </div>
              <span style={{
                padding: "8px 12px",
                borderRadius: "20px",
                background: "#f0fdf4",
                color: "#15803d",
                fontWeight: "700",
                fontSize: "12px",
              }}>
                محفوظة على السيرفر
              </span>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              {/* 1) بيانات المغسلة */}
              <div style={reportBoxStyle}>
                <h3 style={{ ...sectionTitleStyle, marginBottom: "16px" }}>بيانات المغسلة</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>اسم النشاط</label>
                    <input
                      type="text"
                      value={settings.businessName || ""}
                      onChange={(e) => updateSetting("businessName", e.target.value)}
                      dir="rtl"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>رقم الهاتف</label>
                    <input
                      type="text"
                      value={settings.phone || ""}
                      onChange={(e) => updateSetting("phone", e.target.value)}
                      dir="ltr"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>العنوان</label>
                    <input
                      type="text"
                      value={settings.address || ""}
                      onChange={(e) => updateSetting("address", e.target.value)}
                      dir="rtl"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* 2) إعدادات الفاتورة */}
              <div style={reportBoxStyle}>
                <h3 style={{ ...sectionTitleStyle, marginBottom: "16px" }}>إعدادات الفاتورة</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>طريقة الدفع الافتراضية</label>
                    <select
                      value={settings.defaultPaymentMethod || "نقدي"}
                      onChange={(e) => updateSetting("defaultPaymentMethod", e.target.value)}
                      dir="rtl"
                      style={inputStyle}
                    >
                      <option value="نقدي">نقدي</option>
                      <option value="بطاقة">بطاقة</option>
                      <option value="تحويل">تحويل بنكي</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>حجم ورق الطباعة</label>
                    <select
                      value={settings.paperSize || "حراري 80mm"}
                      onChange={(e) => updateSetting("paperSize", e.target.value)}
                      dir="rtl"
                      style={inputStyle}
                    >
                      <option value="حراري 80mm">طابعة حرارية (80mm)</option>
                      <option value="A4">ورق A4</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <label style={labelStyle}>عبارة أسفل الفاتورة</label>
                  <textarea
                    value={settings.invoiceFooter || ""}
                    onChange={(e) => updateSetting("invoiceFooter", e.target.value)}
                    dir="rtl"
                    rows="2"
                    style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>قالب رسالة الواتساب</label>
                  <textarea
                    value={settings.whatsappTemplate || ""}
                    onChange={(e) => updateSetting("whatsappTemplate", e.target.value)}
                    dir="rtl"
                    rows="3"
                    style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical" }}
                  />
                </div>

                <div style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "6px",
                }}>
                  <div style={{ ...rtlText, fontWeight: "700", marginBottom: "12px", color: "#334155" }}>
                    ما الذي يظهر في الفاتورة؟
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!settings.showPhoneOnInvoice}
                        onChange={(e) => updateSetting("showPhoneOnInvoice", e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span>إظهار رقم الهاتف</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!settings.showAddressOnInvoice}
                        onChange={(e) => updateSetting("showAddressOnInvoice", e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span>إظهار العنوان</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!settings.showFooterOnInvoice}
                        onChange={(e) => updateSetting("showFooterOnInvoice", e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span>إظهار عبارة أسفل الفاتورة</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "18px" }}>
                  <button onClick={saveSettings} style={primaryButtonStyle}>حفظ الإعدادات</button>
                  <button onClick={resetSettings} style={secondaryButtonStyle}>استعادة الافتراضي</button>
                  {settingsMessage && (
                    <div style={{
                      ...rtlText,
                      color: settingsMessage.includes("تعذر") ? "#b91c1c" : "#15803d",
                      fontWeight: "700",
                      fontSize: "13px",
                    }}>
                      {settingsMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* 3) الأمان */}
              <div style={reportBoxStyle}>
                <h3 style={{ ...sectionTitleStyle, marginBottom: "16px" }}>الأمان · تغيير كلمة السر</h3>
                <form onSubmit={changePassword}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                    <div>
                      <label style={labelStyle}>كلمة المرور الحالية</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>تأكيد كلمة المرور</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "8px" }}>
                    <button type="submit" style={primaryButtonStyle}>تغيير كلمة السر</button>
                    {passwordMessage && (
                      <span style={{
                        color: passwordMessage.includes("نجاح") ? "#15803d" : "#b91c1c",
                        fontWeight: "700",
                        fontSize: "13px",
                      }}>
                        {passwordMessage}
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* 4) الموظفين والصلاحيات */}
              {canManageEmployees() && (
              <div style={reportBoxStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <h3 style={{ ...sectionTitleStyle, margin: 0 }}>الموظفين والصلاحيات</h3>
                  <button onClick={openAddEmployee} style={primaryButtonStyle}>+ إضافة موظف</button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table dir="rtl" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={tableHeaderStyle}>الاسم</th>
                        <th style={tableHeaderStyle}>اسم المستخدم</th>
                        <th style={tableHeaderStyle}>الصلاحية</th>
                        <th style={tableHeaderStyle}>الحالة</th>
                        <th style={{ ...tableHeaderStyle, textAlign: "center" }}>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id}>
                          <td style={tableCellStyle}>{emp.name}</td>
                          <td style={{ ...tableCellStyle, direction: "ltr", textAlign: "right" }}>{emp.username}</td>
                          <td style={tableCellStyle}>
                            <span style={{
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background:
                                emp.role === "مالك" ? "#eff6ff" :
                                emp.role === "مدير" ? "#f0fdf4" : "#f8fafc",
                              color:
                                emp.role === "مالك" ? "#1d4ed8" :
                                emp.role === "مدير" ? "#15803d" : "#475569",
                            }}>
                              {emp.role}
                            </span>
                          </td>
                          <td style={tableCellStyle}>
                            <span style={{
                              color: emp.active !== false ? "#15803d" : "#b91c1c",
                              fontWeight: "600",
                              fontSize: "13px",
                            }}>
                              {emp.active !== false ? "نشط" : "موقوف"}
                            </span>
                          </td>
                          <td style={{ ...tableCellStyle, textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                              <button onClick={() => openEditEmployee(emp)} style={secondaryButtonSmallStyle}>تعديل</button>
                              {emp.username !== "admin" && (
                                <button onClick={() => deleteEmployee(emp.id)} style={dangerButtonStyle}>حذف</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{
                  marginTop: "16px",
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "#64748b",
                  lineHeight: 1.7,
                }}>
                  <strong style={{ color: "#334155" }}>الصلاحيات:</strong>
                  <br />
                  • <strong>مالك</strong>: صلاحيات كاملة (إعدادات · موظفين · حذف)
                  <br />
                  • <strong>مدير</strong>: فواتير · عملاء · تقارير · مخزون (بدون إعدادات النظام)
                  <br />
                  • <strong>موظف</strong>: إنشاء فواتير ومتابعة العملاء فقط
                </div>
              </div>
              )}
            </div>

            {/* نافذة إضافة/تعديل موظف */}
            {showEmployeeModal && (
              <div style={modalOverlayStyle} onClick={() => setShowEmployeeModal(false)}>
                <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                  <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>
                      {editingEmployee ? "تعديل موظف" : "إضافة موظف"}
                    </h2>
                    <button onClick={() => setShowEmployeeModal(false)} style={closeButtonStyle}>×</button>
                  </div>
                  <form onSubmit={saveEmployee}>
                    <label style={labelStyle}>الاسم</label>
                    <input type="text" value={empName} onChange={(e) => setEmpName(e.target.value)} style={inputStyle} required />

                    <label style={labelStyle}>اسم المستخدم</label>
                    <input type="text" value={empUsername} onChange={(e) => setEmpUsername(e.target.value)} style={inputStyle} required dir="ltr" />

                    <label style={labelStyle}>
                      كلمة المرور {editingEmployee ? "(اتركها فارغة إن لم ترد التغيير)" : ""}
                    </label>
                    <input type="password" value={empPassword} onChange={(e) => setEmpPassword(e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>الصلاحية</label>
                    <select value={empRole} onChange={(e) => setEmpRole(e.target.value)} style={inputStyle} dir="rtl">
                      <option value="مالك">مالك</option>
                      <option value="مدير">مدير</option>
                      <option value="موظف">موظف</option>
                    </select>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={empActive}
                        onChange={(e) => setEmpActive(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span>الحساب نشط</span>
                    </label>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" style={primaryButtonStyle}>حفظ</button>
                      <button type="button" onClick={() => setShowEmployeeModal(false)} style={secondaryButtonStyle}>إلغاء</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================
            الفواتير
        ========================= */}

        {activePage ===
          "الفواتير" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  إدارة الفواتير
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  إنشاء ومتابعة فواتير العملاء والخدمات
                </p>
              </div>

              <button
                onClick={
                  openAddInvoice
                }
                style={
                  primaryButtonStyle
                }
              >
                + إنشاء فاتورة
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي الفواتير
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {
                    invoices.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#f0fdf4",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المبيعات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#15803d",
                    fontSize:
                      "22px",
                  }}
                >
                  {totalSales}{" "}
                  جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#eff6ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  المدفوع
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#1d4ed8",
                    fontSize:
                      "22px",
                  }}
                >
                  {totalPaid}{" "}
                  جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fff7ed",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  المتبقي
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#c2410c",
                    fontSize:
                      "22px",
                  }}
                >
                  {
                    totalRemaining
                  }{" "}
                  جنيه
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <input
                value={
                  invoiceSearch
                }
                onChange={(
                  e
                ) =>
                  setInvoiceSearch(
                    e.target.value
                  )
                }
                placeholder="ابحث برقم الفاتورة أو اسم العميل أو السيارة..."
                dir="rtl"
                style={
                  inputStyle
                }
              />
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "1100px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      رقم الفاتورة
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      التاريخ
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      العميل
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      المرتبط
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الخدمات
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الإجمالي
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الدفع
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الحالة
                    </th>

                    <th
                      style={
                        tableHeaderCenterStyle
                      }
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.map(
                    (
                      invoice
                    ) => (
                      <tr
                        key={
                          invoice.id
                        }
                      >
                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                            direction:
                              "ltr",
                          }}
                        >
                          {
                            invoice.invoiceNumber
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            invoice.date
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              invoice.customerName
                            }
                          </div>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#94a3b8",
                              direction:
                                "ltr",
                              marginTop:
                                "3px",
                            }}
                          >
                            {
                              invoice.customerPhone
                            }
                          </div>
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                "700",
                            }}
                          >
                            {invoice.assetType ===
                            "سجادة"
                              ? "سجادة"
                              : "سيارة"}
                          </div>

                          <div
                            style={{
                              color:
                                "#64748b",
                              fontSize:
                                "12px",
                              marginTop:
                                "3px",
                            }}
                          >
                            {
                              invoice.assetInfo ||
                              invoice.carInfo
                            }
                          </div>
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            invoice.items
                              .length
                          }{" "}
                          خدمة
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {
                            invoice.total
                          }{" "}
                          جنيه
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <div>
                            {
                              invoice.paymentMethod
                            }
                          </div>

                          <div
                            style={{
                              color:
                                "#64748b",
                              fontSize:
                                "12px",
                              marginTop:
                                "3px",
                            }}
                          >
                            مدفوع:{" "}
                            {
                              invoice.paidAmount
                            }{" "}
                            جنيه
                          </div>

                          {invoice.remainingAmount >
                            0 && (
                            <div
                              style={{
                                color:
                                  "#c2410c",
                                fontSize:
                                  "12px",
                              }}
                            >
                              متبقي:{" "}
                              {
                                invoice.remainingAmount
                              }{" "}
                              جنيه
                            </div>
                          )}
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                              background:
                                invoice.paymentStatus ===
                                "مدفوعة"
                                  ? "#dcfce7"
                                  : invoice.paymentStatus ===
                                    "مدفوعة جزئيًا"
                                  ? "#fef3c7"
                                  : invoice.paymentStatus ===
                                    "مغطاة بالعضوية"
                                  ? "#dbeafe"
                                  : "#fee2e2",
                              color:
                                invoice.paymentStatus ===
                                "مدفوعة"
                                  ? "#166534"
                                  : invoice.paymentStatus ===
                                    "مدفوعة جزئيًا"
                                  ? "#92400e"
                                  : invoice.paymentStatus ===
                                    "مغطاة بالعضوية"
                                  ? "#1d4ed8"
                                  : "#991b1b",
                            }}
                          >
                            {
                              invoice.paymentStatus
                            }
                          </span>
                        </td>

                        <td
                          style={
                            tableCellCenterStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "7px",
                              justifyContent:
                                "center",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <button
                              onClick={() =>
                                setViewingInvoice(
                                  invoice
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              عرض
                            </button>

<button
  style={{
    ...secondaryButtonSmallStyle,
    backgroundColor: "#17a2b8",
    color: "#fff",
    borderColor: "#17a2b8",
  }}
  onClick={() => printThermalInvoice(invoice)}
>
  طباعة
</button>

<button
  style={{
    ...secondaryButtonSmallStyle,
    backgroundColor: "#25D366",
    color: "#fff",
    borderColor: "#25D366",
  }}
  onClick={() => sendWhatsAppInvoice(invoice)}
>
  واتساب
</button>                            <button
                              onClick={() =>
                                openEditInvoice(
                                  invoice
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteInvoice(
                                  invoice.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredInvoices.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="9"
                        style={{
                          padding:
                            "60px",
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        لا توجد فواتير حتى الآن
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================
            المصروفات
        ========================= */}

        {activePage ===
          "المصروفات" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  إدارة المصروفات
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  تسجيل ومتابعة مصروفات المغسلة وحساب صافي الربح
                </p>
              </div>

              <button
                onClick={
                  openAddExpense
                }
                style={
                  primaryButtonStyle
                }
              >
                + إضافة مصروف
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fff7ed",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المصروفات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#c2410c",
                  }}
                >
                  {totalExpenses} جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#f0fdf4",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المبيعات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#15803d",
                  }}
                >
                  {totalSales} جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    netProfit >= 0
                      ? "#ecfdf5"
                      : "#fef2f2",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  صافي الربح
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      netProfit >= 0
                        ? "#047857"
                        : "#b91c1c",
                  }}
                >
                  {netProfit} جنيه
                </div>
              </div>

              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  عدد المصروفات
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {expenses.length}
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <input
                value={
                  expenseSearch
                }
                onChange={(
                  e
                ) =>
                  setExpenseSearch(
                    e.target.value
                  )
                }
                placeholder="ابحث باسم المصروف أو التصنيف أو طريقة الدفع..."
                dir="rtl"
                style={
                  inputStyle
                }
              />
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "950px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      التاريخ
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      التصنيف
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      البيان
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      المبلغ
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      طريقة الدفع
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الملاحظات
                    </th>

                    <th
                      style={
                        tableHeaderCenterStyle
                      }
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map(
                    (
                      expense
                    ) => (
                      <tr
                        key={
                          expense.id
                        }
                      >
                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            expense.date
                          }
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            expense.category
                          }
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                          }}
                        >
                          {
                            expense.title
                          }
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight:
                              "700",
                            color:
                              "#c2410c",
                          }}
                        >
                          {
                            expense.amount
                          }{" "}
                          جنيه
                        </td>

                        <td
                          style={
                            tableCellStyle
                          }
                        >
                          {
                            expense.paymentMethod
                          }
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            color:
                              "#64748b",
                          }}
                        >
                          {
                            expense.notes ||
                            "—"
                          }
                        </td>

                        <td
                          style={
                            tableCellCenterStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                              justifyContent:
                                "center",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <button
                              onClick={() =>
                                openEditExpense(
                                  expense
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteExpense(
                                  expense.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredExpenses.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          padding:
                            "60px",
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        لا توجد مصروفات حتى الآن
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================
            الاشتراكات
        ========================= */}

        {activePage ===
          "الاشتراكات" && (
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <h2 style={sectionTitleStyle}>
                  الاشتراكات والاشتراكات
                </h2>

                <p style={sectionSubtitleStyle}>
                  إدارة الباقات الشهرية والزيارات المتبقية لكل عميل
                </p>
              </div>

              <button
                onClick={openAddMembership}
                style={primaryButtonStyle}
              >
                + إضافة عضوية
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
                marginBottom: "25px",
              }}
            >
              <div style={statCardStyle}>
                <div style={statLabelStyle}>
                  إجمالي الاشتراكات
                </div>
                <div style={statValueStyle}>
                  {memberships.length}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background: "#f0fdf4",
                }}
              >
                <div style={statLabelStyle}>
                  الاشتراكات السارية
                </div>
                <div
                  style={{
                    ...statValueStyle,
                    color: "#15803d",
                  }}
                >
                  {activeMembershipsCount}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background: "#fee2e2",
                }}
              >
                <div style={statLabelStyle}>
                  الاشتراكات المنتهية
                </div>
                <div
                  style={{
                    ...statValueStyle,
                    color: "#b91c1c",
                  }}
                >
                  {expiredMembershipsCount}
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background: "#eff6ff",
                }}
              >
                <div style={statLabelStyle}>
                  قيمة الاشتراكات
                </div>
                <div
                  style={{
                    ...statValueStyle,
                    color: "#1d4ed8",
                    fontSize: "22px",
                  }}
                >
                  {membershipRevenue} جنيه
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <input
                value={membershipSearch}
                onChange={(e) =>
                  setMembershipSearch(e.target.value)
                }
                placeholder="ابحث باسم العميل أو الباقة أو الحالة..."
                dir="rtl"
                style={inputStyle}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                dir="rtl"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={tableHeaderStyle}>
                      العميل
                    </th>
                    <th style={tableHeaderStyle}>
                      الباقة
                    </th>
                    <th style={tableHeaderStyle}>
                      المدة
                    </th>
                    <th style={tableHeaderStyle}>
                      البداية
                    </th>
                    <th style={tableHeaderStyle}>
                      النهاية
                    </th>
                    <th style={tableHeaderStyle}>
                      الزيارات
                    </th>
                    <th style={tableHeaderStyle}>
                      السعر
                    </th>
                    <th style={tableHeaderStyle}>
                      الحالة
                    </th>
                    <th style={tableHeaderCenterStyle}>
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMemberships.map(
                    (membership) => (
                      <tr key={membership.id}>
                        <td style={tableCellStyle}>
                          <div
                            style={{
                              fontWeight: "700",
                              color: "#111827",
                            }}
                          >
                            {membership.customerName}
                          </div>

                          <div
                            style={{
                              direction: "ltr",
                              color: "#94a3b8",
                              fontSize: "12px",
                              marginTop: "3px",
                            }}
                          >
                            {membership.customerPhone}
                          </div>
                        </td>

                        <td style={tableCellStyle}>
                          {membership.planName}
                        </td>

                        <td style={tableCellStyle}>
                          {membership.durationMonths} شهر
                        </td>

                        <td style={tableCellStyle}>
                          {membership.startDate}
                        </td>

                        <td style={tableCellStyle}>
                          {membership.endDate}
                        </td>

                        <td style={tableCellStyle}>
                          <strong>
                            {membership.remainingVisits}
                          </strong>{" "}
                          /{" "}
                          {membership.totalVisits}
                        </td>

                        <td
                          style={{
                            ...tableCellStyle,
                            fontWeight: "700",
                          }}
                        >
                          {membership.price} جنيه
                        </td>

                        <td style={tableCellStyle}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "6px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background:
                                membership.status === "سارية"
                                  ? "#dcfce7"
                                  : "#fee2e2",
                              color:
                                membership.status === "سارية"
                                  ? "#166534"
                                  : "#991b1b",
                            }}
                          >
                            {membership.status}
                          </span>
                        </td>

                        <td style={tableCellCenterStyle}>
                          <div
                            style={{
                              display: "flex",
                              gap: "7px",
                              justifyContent: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            {membership.status === "سارية" &&
                              Number(
                                membership.remainingVisits
                              ) > 0 && (
                                <button
                                  onClick={() =>
                                    useMembershipVisit(
                                      membership
                                    )
                                  }
                                  style={
                                    secondaryButtonSmallStyle
                                  }
                                >
                                  استخدام زيارة
                                </button>
                              )}

                            <button
                              onClick={() =>
                                renewMembership(
                                  membership
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تجديد
                            </button>

                            <button
                              onClick={() =>
                                openEditMembership(
                                  membership
                                )
                              }
                              style={
                                secondaryButtonSmallStyle
                              }
                            >
                              تعديل
                            </button>

                            <button
                              onClick={() =>
                                deleteMembership(
                                  membership.id
                                )
                              }
                              style={
                                dangerButtonStyle
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredMemberships.length === 0 && (
                    <tr>
                      <td
                        colSpan="9"
                        style={{
                          padding: "60px",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        لا توجد عضويات حتى الآن
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================
            التقارير
        ========================= */}

        {activePage ===
          "التقارير" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  التقارير
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  ملخص احترافي للمبيعات والمصروفات والأرباح حسب الفترة
                </p>
              </div>
              <button
                type="button"
                onClick={printReports}
                style={{
                  ...secondaryButtonStyle,
                  whiteSpace: "nowrap",
                }}
              >
                طباعة التقرير
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {[
                { key: "today", label: "اليوم" },
                { key: "week", label: "آخر 7 أيام" },
                { key: "month", label: "هذا الشهر" },
                { key: "all", label: "الكل" },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setReportPeriod(p.key)}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#334155",
                    borderRadius: "999px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div
              style={{
                ...reportBoxStyle,
                background:
                  "#f8fafc",
                marginTop:
                  "0",
              }}
            >
              <h3
                style={
                  sectionTitleStyle
                }
              >
                فلترة التقارير بالتاريخ
              </h3>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr auto",
                  gap:
                    "12px",
                  alignItems:
                    "end",
                  marginTop:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    من تاريخ
                  </label>

                  <input
                    type="date"
                    value={
                      reportFromDate
                    }
                    onChange={(
                      e
                    ) =>
                      setReportFromDate(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={{
                      ...inputStyle,
                      marginBottom:
                        0,
                    }}
                  />
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    إلى تاريخ
                  </label>

                  <input
                    type="date"
                    value={
                      reportToDate
                    }
                    min={
                      reportFromDate ||
                      undefined
                    }
                    onChange={(
                      e
                    ) =>
                      setReportToDate(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={{
                      ...inputStyle,
                      marginBottom:
                        0,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReportFromDate("")
                    setReportToDate("")
                  }}
                  style={{
                    ...secondaryButtonStyle,
                    height:
                      "48px",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  عرض كل الفترة
                </button>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "8px",
                  flexWrap:
                    "wrap",
                  marginTop:
                    "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date()
                      .toISOString()
                      .split("T")[0]

                    setReportFromDate(today)
                    setReportToDate(today)
                  }}
                  style={{
                    ...secondaryButtonSmallStyle,
                  }}
                >
                  اليوم
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const now = new Date()
                    const year =
                      now.getFullYear()
                    const month = String(
                      now.getMonth() + 1
                    ).padStart(2, "0")

                    setReportFromDate(
                      `${year}-${month}-01`
                    )

                    setReportToDate(
                      now.toISOString().split("T")[0]
                    )
                  }}
                  style={{
                    ...secondaryButtonSmallStyle,
                  }}
                >
                  هذا الشهر
                </button>
              </div>
            </div>

            <div
              style={{
                ...reportBoxStyle,
                background:
                  "#f8fafc",
              }}
            >
              <h3
                style={
                  sectionTitleStyle
                }
              >
                ملخص الربحية
              </h3>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(190px, 1fr))",
                  gap:
                    "15px",
                  marginTop:
                    "15px",
                }}
              >
                <div
                  style={{
                    ...miniReportCardStyle,
                    background:
                      "#f0fdf4",
                  }}
                >
                  <span>
                    إجمالي المبيعات
                  </span>

                  <strong
                    style={{
                      color:
                        "#15803d",
                    }}
                  >
                    {totalSales} جنيه
                  </strong>
                </div>

                <div
                  style={{
                    ...miniReportCardStyle,
                    background:
                      "#fff7ed",
                  }}
                >
                  <span>
                    إجمالي المصروفات
                  </span>

                  <strong
                    style={{
                      color:
                        "#c2410c",
                    }}
                  >
                    {reportTotalExpenses} جنيه
                  </strong>
                </div>

                <div
                  style={{
                    ...miniReportCardStyle,
                    background:
                      reportNetProfit >= 0
                        ? "#ecfdf5"
                        : "#fef2f2",
                  }}
                >
                  <span>
                    صافي الربح
                  </span>

                  <strong
                    style={{
                      color:
                        reportNetProfit >= 0
                          ? "#047857"
                          : "#b91c1c",
                    }}
                  >
                    {reportNetProfit} جنيه
                  </strong>
                </div>
              </div>
            </div>

            {/* الإحصائيات العامة */}

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap:
                  "15px",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={
                  statCardStyle
                }
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المبيعات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#15803d",
                  }}
                >
                  {
                    totalSales
                  }{" "}
                  جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fff7ed",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المصروفات
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#c2410c",
                  }}
                >
                  {reportTotalExpenses} جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#eff6ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المدفوع
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#1d4ed8",
                  }}
                >
                  {
                    totalPaid
                  }{" "}
                  جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fff7ed",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  إجمالي المتبقي
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#c2410c",
                  }}
                >
                  {
                    totalRemaining
                  }{" "}
                  جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    reportNetProfit >= 0
                      ? "#ecfdf5"
                      : "#fef2f2",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  صافي الربح
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      reportNetProfit >= 0
                        ? "#047857"
                        : "#b91c1c",
                  }}
                >
                  {reportNetProfit} جنيه
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#f8fafc",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  عدد الفواتير
                </div>

                <div
                  style={
                    statValueStyle
                  }
                >
                  {
                    reportInvoices.length
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#fdf4ff",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  الخدمات المباعة
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#a21caf",
                  }}
                >
                  {
                    totalServicesSold
                  }
                </div>
              </div>

              <div
                style={{
                  ...statCardStyle,
                  background:
                    "#ecfdf5",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  مبيعات اليوم
                </div>

                <div
                  style={{
                    ...statValueStyle,
                    color:
                      "#047857",
                  }}
                >
                  {
                    todaySales
                  }{" "}
                  جنيه
                </div>
              </div>
            </div>

            {/* ملخص اليوم */}

            <div
              style={{
                ...reportBoxStyle,
                background:
                  "#f8fafc",
              }}
            >
              <h3
                style={
                  sectionTitleStyle
                }
              >
                ملخص اليوم
              </h3>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap:
                    "15px",
                }}
              >
                <div
                  style={
                    miniReportCardStyle
                  }
                >
                  <span>
                    عدد فواتير اليوم
                  </span>

                  <strong>
                    {
                      todayInvoices.length
                    }
                  </strong>
                </div>

                <div
                  style={
                    miniReportCardStyle
                  }
                >
                  <span>
                    مبيعات اليوم
                  </span>

                  <strong>
                    {
                      todaySales
                    }{" "}
                    جنيه
                  </strong>
                </div>

                <div
                  style={
                    miniReportCardStyle
                  }
                >
                  <span>
                    المدفوع اليوم
                  </span>

                  <strong>
                    {
                      todayPaid
                    }{" "}
                    جنيه
                  </strong>
                </div>

                <div
                  style={
                    miniReportCardStyle
                  }
                >
                  <span>
                    المتبقي اليوم
                  </span>

                  <strong>
                    {Math.max(
                      0,
                      todaySales -
                        todayPaid
                    )}{" "}
                    جنيه
                  </strong>
                </div>
              </div>
            </div>

            {/* رسوم بيانية */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {/* رسم الخدمات */}
              <div style={reportBoxStyle}>
                <h3 style={sectionTitleStyle}>الخدمات الأكثر مبيعًا</h3>
                {serviceChartData.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "30px" }}>
                    لا توجد بيانات في الفترة المحددة
                  </p>
                ) : (
                  <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {serviceChartData.map((item) => (
                      <div key={item.name}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                          fontSize: "13px",
                          color: "#475569",
                        }}>
                          <span style={{ fontWeight: "600" }}>{item.name}</span>
                          <span>{item.value}</span>
                        </div>
                        <div style={{
                          height: "12px",
                          background: "#e2e8f0",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${(item.value / maxServiceValue) * 100}%`,
                            background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                            borderRadius: "99px",
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* رسم حالات الدفع */}
              <div style={reportBoxStyle}>
                <h3 style={sectionTitleStyle}>توزيع حالات الدفع</h3>
                {paymentChartData.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "30px" }}>
                    لا توجد فواتير في الفترة المحددة
                  </p>
                ) : (
                  <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {paymentChartData.map((item) => (
                      <div key={item.name}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                          fontSize: "13px",
                          color: "#475569",
                        }}>
                          <span style={{ fontWeight: "600" }}>{item.name}</span>
                          <span>{item.value} فاتورة</span>
                        </div>
                        <div style={{
                          height: "12px",
                          background: "#e2e8f0",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${(item.value / maxPaymentValue) * 100}%`,
                            background: item.color,
                            borderRadius: "99px",
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* بطاقات ملخص الفترة */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "14px",
                marginTop: "20px",
              }}
            >
              <div style={{ ...statCardStyle, background: "#eff6ff" }}>
                <div style={statLabelStyle}>مبيعات الفترة</div>
                <div style={{ ...statValueStyle, color: "#1d4ed8", fontSize: "20px" }}>
                  {reportTotalSales} جنيه
                </div>
              </div>
              <div style={{ ...statCardStyle, background: "#ecfdf5" }}>
                <div style={statLabelStyle}>المدفوع</div>
                <div style={{ ...statValueStyle, color: "#047857", fontSize: "20px" }}>
                  {reportTotalPaid} جنيه
                </div>
              </div>
              <div style={{ ...statCardStyle, background: "#fff7ed" }}>
                <div style={statLabelStyle}>المتبقي</div>
                <div style={{ ...statValueStyle, color: "#c2410c", fontSize: "20px" }}>
                  {totalRemaining} جنيه
                </div>
              </div>
              <div style={{ ...statCardStyle, background: reportNetProfit >= 0 ? "#ecfdf5" : "#fef2f2" }}>
                <div style={statLabelStyle}>صافي الربح</div>
                <div style={{
                  ...statValueStyle,
                  color: reportNetProfit >= 0 ? "#047857" : "#b91c1c",
                  fontSize: "20px",
                }}>
                  {reportNetProfit} جنيه
                </div>
              </div>
            </div>


              {/* رسم المصروفات */}
              <div style={reportBoxStyle}>
                <h3 style={sectionTitleStyle}>المصروفات حسب التصنيف</h3>
                {expenseChartData.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "30px" }}>
                    لا توجد مصروفات في الفترة المحددة
                  </p>
                ) : (
                  <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {expenseChartData.map((item) => (
                      <div key={item.name}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                          fontSize: "13px",
                          color: "#475569",
                        }}>
                          <span style={{ fontWeight: "600" }}>{item.name}</span>
                          <span>{item.value} ج</span>
                        </div>
                        <div style={{
                          height: "12px",
                          background: "#e2e8f0",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${(item.value / maxExpenseValue) * 100}%`,
                            background: "linear-gradient(90deg, #f97316, #c2410c)",
                            borderRadius: "99px",
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* أكثر الخدمات */}

            <div
              style={
                reportBoxStyle
              }
            >
              <h3
                style={
                  sectionTitleStyle
                }
              >
                أكثر الخدمات استخدامًا
              </h3>

              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >
                <table
                  dir="rtl"
                  style={{
                    width:
                      "100%",
                    borderCollapse:
                      "collapse",
                    minWidth:
                      "700px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "#f8fafc",
                      }}
                    >
                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        الخدمة
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        النوع
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        عدد الاستخدامات
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        الإيراد
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {serviceReports.map(
                      (
                        service
                      ) => (
                        <tr
                          key={
                            service.id
                          }
                        >
                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              service.name
                            }
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              service.type
                            }
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              service.usage
                            }
                          </td>

                          <td
                            style={{
                              ...tableCellStyle,
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              service.revenue
                            }{" "}
                            جنيه
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* أكثر العملاء */}

            <div
              style={
                reportBoxStyle
              }
            >
              <h3
                style={
                  sectionTitleStyle
                }
              >
                أكثر العملاء تعاملًا
              </h3>

              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >
                <table
                  dir="rtl"
                  style={{
                    width:
                      "100%",
                    borderCollapse:
                      "collapse",
                    minWidth:
                      "650px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "#f8fafc",
                      }}
                    >
                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        العميل
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        عدد الفواتير
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        إجمالي المشتريات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {customerReports.map(
                      (
                        customer
                      ) => (
                        <tr
                          key={
                            customer.id
                          }
                        >
                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              customer.name
                            }
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              customer.invoiceCount
                            }
                          </td>

                          <td
                            style={{
                              ...tableCellStyle,
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              customer.total
                            }{" "}
                            جنيه
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            النسخ الاحتياطي
        ========================= */}

        {activePage ===
          "النسخ الاحتياطي" && (
          <div
            style={
              sectionStyle
            }
          >
            <div
              style={
                sectionHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    sectionTitleStyle
                  }
                >
                  النسخ الاحتياطي واسترجاع البيانات
                </h2>

                <p
                  style={
                    sectionSubtitleStyle
                  }
                >
                  احفظ نسخة كاملة من بيانات النظام واسترجعها عند الحاجة
                </p>
              </div>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap:
                  "18px",
              }}
            >
              <div
                style={{
                  ...reportBoxStyle,
                  marginTop: 0,
                  background: "#f0fdf4",
                }}
              >
                <div
                  style={{
                    ...rtlText,
                    textAlign: "right",
                  }}
                >
                  <h3
                    style={{
                      ...sectionTitleStyle,
                      marginBottom: "10px",
                    }}
                  >
                    إنشاء نسخة احتياطية
                  </h3>

                  <p
                    style={{
                      ...sectionSubtitleStyle,
                      lineHeight: 1.8,
                    }}
                  >
                    تحفظ نسخة واحدة تشمل العملاء والسيارات والسجاد والخدمات والاشتراكات والفواتير والمصروفات والإعدادات.
                  </p>

                  <button
                    onClick={
                      downloadBackup
                    }
                    disabled={
                      isBackingUp ||
                      isRestoringBackup
                    }
                    style={{
                      ...primaryButtonStyle,
                      marginTop: "10px",
                    }}
                  >
                    {isBackingUp
                      ? "جاري تجهيز النسخة..."
                      : "تحميل نسخة احتياطية"}
                  </button>
                </div>
              </div>

              <div
                style={{
                  ...reportBoxStyle,
                  marginTop: 0,
                  background: "#eff6ff",
                }}
              >
                <div
                  style={{
                    ...rtlText,
                    textAlign: "right",
                  }}
                >
                  <h3
                    style={{
                      ...sectionTitleStyle,
                      marginBottom: "10px",
                    }}
                  >
                    استرجاع نسخة احتياطية
                  </h3>

                  <p
                    style={{
                      ...sectionSubtitleStyle,
                      lineHeight: 1.8,
                    }}
                  >
                    اختر ملف النسخة الاحتياطية الذي سبق تحميله. سيتم استبدال البيانات الحالية بالبيانات الموجودة داخله.
                  </p>

                  <label
                    style={{
                      ...primaryButtonStyle,
                      display: "inline-block",
                      marginTop: "10px",
                      cursor:
                        isRestoringBackup ||
                        isBackingUp
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        isRestoringBackup ||
                        isBackingUp
                          ? 0.65
                          : 1,
                    }}
                  >
                    {isRestoringBackup
                      ? "جاري الاسترجاع..."
                      : "اختيار ملف واسترجاعه"}

                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={
                        restoreBackup
                      }
                      disabled={
                        isRestoringBackup ||
                        isBackingUp
                      }
                      style={{
                        display: "none",
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                ...reportBoxStyle,
                background: "#fffbeb",
              }}
            >
              <div
                style={{
                  ...rtlText,
                  textAlign: "right",
                  lineHeight: 1.9,
                  color: "#78350f",
                }}
              >
                <strong>مهم:</strong> يفضل عمل نسخة احتياطية بشكل دوري، خصوصًا قبل إجراء أي تعديل كبير على النظام.
              </div>
            </div>

            {backupMessage && (
              <div
                style={{
                  ...reportBoxStyle,
                  background:
                    backupMessage.includes("تعذر") ||
                    backupMessage.includes("غير صالح")
                      ? "#fef2f2"
                      : "#f0fdf4",
                  color:
                    backupMessage.includes("تعذر") ||
                    backupMessage.includes("غير صالح")
                      ? "#b91c1c"
                      : "#166534",
                }}
              >
                <div
                  style={{
                    ...rtlText,
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  {backupMessage}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================
            الصفحات غير المنفذة
        ========================= */}

        {activePage !==
          "الرئيسية" &&
          activePage !==
            "العملاء" &&
            activePage !== 
            "المخزون" &&
          activePage !==
            "السيارات" &&
          activePage !==
            "السجاد" &&
          activePage !==
            "الخدمات" &&
          activePage !==
            "الفواتير" &&
          activePage !==
            "المصروفات" &&
          activePage !==
            "التقارير" &&
          activePage !==
            "الاشتراكات" &&
          activePage !==
            "الإعدادات" &&
          activePage !==
            "النسخ الاحتياطي" && (
          <div
            style={{
              background:
                "#fff",
              borderRadius:
                "18px",
              padding:
                "50px",
              textAlign:
                "center",
              boxShadow:
                "0 3px 15px rgba(0,0,0,.06)",
            }}
          >
            <h2
              style={{
                ...rtlText,
                color:
                  "#111827",
                textAlign:
                  "center",
              }}
            >
              {
                activePage
              }
            </h2>

            <p
              style={{
                ...rtlText,
                color:
                  "#64748b",
                textAlign:
                  "center",
              }}
            >
              القسم جاهز للتطوير في الخطوة القادمة.
            </p>
          </div>
        )}
        
      </main>

      {/* =========================
          نافذة السجادة
      ========================= */}

      {showCarpetModal && (
        <div
          dir="rtl"
          onClick={
            closeCarpetModal
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              ...modalStyle,
              maxWidth:
                "650px",
            }}
          >
            <div
              style={
                modalHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    modalTitleStyle
                  }
                >
                  {editingCarpet
                    ? "تعديل بيانات السجادة"
                    : "إضافة سجادة جديدة"}
                </h2>

                <p
                  style={{
                    ...rtlText,
                    color:
                      "#64748b",
                    margin:
                      "7px 0 0",
                    fontSize:
                      "13px",
                  }}
                >
                  اربط السجادة بالعميل وتابع حالتها حتى التسليم
                </p>
              </div>

              <button
                onClick={
                  closeCarpetModal
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                saveCarpet
              }
            >
              <label
                style={
                  labelStyle
                }
              >
                العميل
              </label>

              <select
                value={
                  carpetCustomerId
                }
                onChange={(
                  e
                ) =>
                  setCarpetCustomerId(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="">
                  اختر العميل
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.id
                      }
                    >
                      {customer.name} -{" "}
                      {customer.phone}
                    </option>
                  )
                )}
              </select>

              <label
                style={
                  labelStyle
                }
              >
                اسم / وصف السجادة
              </label>

              <input
                value={
                  carpetName
                }
                onChange={(
                  e
                ) =>
                  setCarpetName(
                    e.target.value
                  )
                }
                placeholder="مثال: سجادة الصالة"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                نوع السجادة
              </label>

              <select
                value={
                  carpetType
                }
                onChange={(
                  e
                ) =>
                  setCarpetType(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="سجاد عادي">
                  سجاد عادي
                </option>
                <option value="سجاد فاخر">
                  سجاد فاخر
                </option>
                <option value="موكيت">
                  موكيت
                </option>
                <option value="مشاية">
                  مشاية
                </option>
                <option value="أخرى">
                  أخرى
                </option>
              </select>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    الطول بالمتر
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      carpetLength
                    }
                    onChange={(
                      e
                    ) =>
                      setCarpetLength(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    العرض بالمتر
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      carpetWidth
                    }
                    onChange={(
                      e
                    ) =>
                      setCarpetWidth(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    المساحة م²
                  </label>
                  <div
                    style={{
                      ...inputStyle,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      background:
                        "#f8fafc",
                      fontWeight:
                        "700",
                    }}
                  >
                    {carpetArea.toFixed(2)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    خدمة السجاد
                  </label>

                  <select
                    value={
                      carpetServiceName
                    }
                    onChange={(
                      e
                    ) =>
                      setCarpetServiceName(
                        e.target.value
                      )
                    }
                    dir="rtl"
                    style={
                      inputStyle
                    }
                  >
                    <option value="">
                      اختر الخدمة
                    </option>

                    {carpetServices
                      .filter(
                        (service) =>
                          service.active
                      )
                      .map(
                        (service) => (
                          <option
                            key={
                              service.id
                            }
                            value={
                              service.name
                            }
                          >
                            {
                              service.name
                            }
                          </option>
                        )
                      )}
                  </select>
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    سعر الخدمة
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      carpetServicePrice
                    }
                    onChange={(
                      e
                    ) =>
                      setCarpetServicePrice(
                        e.target.value
                      )
                    }
                    placeholder="مثال: 450"
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              <label
                style={
                  labelStyle
                }
              >
                حالة السجادة
              </label>

              <select
                value={
                  carpetStatus
                }
                onChange={(
                  e
                ) =>
                  setCarpetStatus(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="تم الاستلام">
                  تم الاستلام
                </option>
                <option value="تحت التنظيف">
                  تحت التنظيف
                </option>
                <option value="جاهزة">
                  جاهزة
                </option>
                <option value="تم التسليم">
                  تم التسليم
                </option>
              </select>

              <label
                style={
                  labelStyle
                }
              >
                ملاحظات
              </label>

              <textarea
                value={
                  carpetNotes
                }
                onChange={(
                  e
                ) =>
                  setCarpetNotes(
                    e.target.value
                  )
                }
                placeholder="أي ملاحظات خاصة بالسجادة..."
                dir="rtl"
                rows="3"
                style={{
                  ...inputStyle,
                  height:
                    "auto",
                  padding:
                    "12px 14px",
                  resize:
                    "vertical",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                  marginTop:
                    "8px",
                }}
              >
                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                >
                  {editingCarpet
                    ? "حفظ تعديلات السجادة"
                    : "إضافة السجادة"}
                </button>

                <button
                  type="button"
                  onClick={
                    closeCarpetModal
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          نافذة المصروف
      ========================= */}

      {showExpenseModal && (
        <div
          dir="rtl"
          onClick={
            closeExpenseModal
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={
              modalStyle
            }
          >
            <div
              style={
                modalHeaderStyle
              }
            >
              <h2
                style={
                  modalTitleStyle
                }
              >
                {editingExpense
                  ? "تعديل المصروف"
                  : "إضافة مصروف جديد"}
              </h2>

              <button
                onClick={
                  closeExpenseModal
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                saveExpense
              }
            >
              <label
                style={
                  labelStyle
                }
              >
                التاريخ
              </label>

              <input
                type="text"
                value={
                  expenseDate
                }
                onChange={(
                  e
                ) =>
                  setExpenseDate(
                    e.target.value
                  )
                }
                placeholder="مثال: 14/8/2026"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                التصنيف
              </label>

              <select
                value={
                  expenseCategory
                }
                onChange={(
                  e
                ) =>
                  setExpenseCategory(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="تشغيل">
                  تشغيل
                </option>
                <option value="مياه وكهرباء">
                  مياه وكهرباء
                </option>
                <option value="مرتبات">
                  مرتبات
                </option>
                <option value="صيانة">
                  صيانة
                </option>
                <option value="مستلزمات">
                  مستلزمات
                </option>
                <option value="إيجار">
                  إيجار
                </option>
                <option value="مواصلات">
                  مواصلات
                </option>
                <option value="تسويق">
                  تسويق
                </option>
                <option value="أخرى">
                  أخرى
                </option>
              </select>

              <label
                style={
                  labelStyle
                }
              >
                بيان المصروف
              </label>

              <input
                type="text"
                value={
                  expenseTitle
                }
                onChange={(
                  e
                ) =>
                  setExpenseTitle(
                    e.target.value
                  )
                }
                placeholder="مثال: شراء مواد تنظيف"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                المبلغ
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={
                  expenseAmount
                }
                onChange={(
                  e
                ) =>
                  setExpenseAmount(
                    e.target.value
                  )
                }
                placeholder="0"
                dir="ltr"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                طريقة الدفع
              </label>

              <select
                value={
                  expensePaymentMethod
                }
                onChange={(
                  e
                ) =>
                  setExpensePaymentMethod(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="نقدي">
                  نقدي
                </option>
                <option value="بطاقة">
                  بطاقة
                </option>
                <option value="تحويل بنكي">
                  تحويل بنكي
                </option>
                <option value="محفظة إلكترونية">
                  محفظة إلكترونية
                </option>
                <option value="آجل">
                  آجل
                </option>
              </select>

              <label
                style={
                  labelStyle
                }
              >
                الملاحظات
              </label>

              <textarea
                value={
                  expenseNotes
                }
                onChange={(
                  e
                ) =>
                  setExpenseNotes(
                    e.target.value
                  )
                }
                placeholder="ملاحظات إضافية..."
                dir="rtl"
                style={{
                  ...inputStyle,
                  height:
                    "100px",
                  padding:
                    "12px 14px",
                  resize:
                    "vertical",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-start",
                  gap:
                    "10px",
                  marginTop:
                    "5px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    closeExpenseModal
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                >
                  {editingExpense
                    ? "حفظ التعديل"
                    : "حفظ المصروف"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          نافذة العضوية
      ========================= */}

      {showMembershipModal && (
        <div
          dir="rtl"
          onClick={closeMembershipModal}
          style={modalOverlayStyle}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              ...modalStyle,
              maxWidth: "700px",
            }}
          >
            <div style={modalHeaderStyle}>
              <div>
                <h2 style={modalTitleStyle}>
                  {editingMembership
                    ? "تعديل العضوية"
                    : "إضافة عضوية جديدة"}
                </h2>

                <p
                  style={{
                    ...rtlText,
                    color: "#64748b",
                    margin: "7px 0 0",
                    fontSize: "13px",
                  }}
                >
                  الاشتراك الشهري منفصل عن العميل العادي بنظام الدفع لكل غسلة
                </p>
              </div>

              <button
                onClick={closeMembershipModal}
                style={closeButtonStyle}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveMembership}>
              <label style={labelStyle}>
                العميل
              </label>

              <select
                value={membershipCustomerId}
                onChange={(e) =>
                  setMembershipCustomerId(
                    e.target.value
                  )
                }
                dir="rtl"
                style={inputStyle}
              >
                <option value="">
                  اختر العميل
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name} -{" "}
                    {customer.phone}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    اسم الباقة
                  </label>

                  <input
                    value={membershipPlanName}
                    onChange={(e) =>
                      setMembershipPlanName(
                        e.target.value
                      )
                    }
                    placeholder="مثال: اشتراك شهري"
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    مدة الاشتراك بالشهور
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={membershipDurationMonths}
                    onChange={(e) => {
                      const value =
                        e.target.value

                      setMembershipDurationMonths(
                        value
                      )

                      if (membershipStartDate) {
                        setMembershipEndDate(
                          addMonthsToDate(
                            membershipStartDate,
                            value
                          )
                        )
                      }
                    }}
                    dir="ltr"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    تاريخ البداية
                  </label>

                  <input
                    type="date"
                    value={membershipStartDate}
                    onChange={(e) => {
                      const value =
                        e.target.value

                      setMembershipStartDate(
                        value
                      )

                      if (value) {
                        setMembershipEndDate(
                          addMonthsToDate(
                            value,
                            membershipDurationMonths
                          )
                        )
                      }
                    }}
                    dir="ltr"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    تاريخ النهاية
                  </label>

                  <input
                    type="date"
                    value={membershipEndDate}
                    onChange={(e) =>
                      setMembershipEndDate(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    إجمالي الزيارات
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={membershipTotalVisits}
                    onChange={(e) => {
                      const value =
                        e.target.value

                      setMembershipTotalVisits(
                        value
                      )

                      if (
                        Number(
                          membershipRemainingVisits
                        ) >
                        Number(value || 0)
                      ) {
                        setMembershipRemainingVisits(
                          Number(value || 0)
                        )
                      }
                    }}
                    dir="ltr"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    الزيارات المتبقية
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={
                      Number(
                        membershipTotalVisits
                      ) || 0
                    }
                    value={membershipRemainingVisits}
                    onChange={(e) =>
                      setMembershipRemainingVisits(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    سعر الاشتراك
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={membershipPrice}
                    onChange={(e) =>
                      setMembershipPrice(
                        e.target.value
                      )
                    }
                    placeholder="مثال: 500"
                    dir="ltr"
                    style={inputStyle}
                  />
                </div>
              </div>

              <label style={labelStyle}>
                الحالة
              </label>

              <select
                value={membershipStatus}
                onChange={(e) =>
                  setMembershipStatus(
                    e.target.value
                  )
                }
                dir="rtl"
                style={inputStyle}
              >
                <option value="سارية">
                  سارية
                </option>

                <option value="منتهية">
                  منتهية
                </option>
              </select>

              <label style={labelStyle}>
                ملاحظات
              </label>

              <textarea
                value={membershipNotes}
                onChange={(e) =>
                  setMembershipNotes(
                    e.target.value
                  )
                }
                placeholder="ملاحظات خاصة بالاشتراك..."
                dir="rtl"
                rows="3"
                style={{
                  ...inputStyle,
                  height: "auto",
                  padding: "12px 14px",
                  resize: "vertical",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="submit"
                  style={primaryButtonStyle}
                >
                  {editingMembership
                    ? "حفظ تعديلات العضوية"
                    : "إضافة العضوية"}
                </button>

                <button
                  type="button"
                  onClick={closeMembershipModal}
                  style={secondaryButtonStyle}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          نافذة الخدمة
      ========================= */}

      {showServiceModal && (
        <div
          dir="rtl"
          onClick={
            closeServiceModal
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={
              modalStyle
            }
          >
            <div
              style={
                modalHeaderStyle
              }
            >
              <h2
                style={
                  modalTitleStyle
                }
              >
                {editingService
                  ? "تعديل الخدمة"
                  : "إضافة خدمة جديدة"}
              </h2>

              <button
                onClick={
                  closeServiceModal
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                saveService
              }
            >
              <label
                style={
                  labelStyle
                }
              >
                نوع النشاط
              </label>

              <select
                value={
                  serviceType
                }
                onChange={(
                  e
                ) =>
                  setServiceType(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="سيارات">
                  سيارات
                </option>

                <option value="سجاد">
                  سجاد
                </option>
              </select>

              <label
                style={
                  labelStyle
                }
              >
                اسم الخدمة
              </label>

              <input
                value={
                  serviceName
                }
                onChange={(
                  e
                ) =>
                  setServiceName(
                    e.target.value
                  )
                }
                placeholder="مثال: غسيل خارجي"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                السعر
              </label>

              <input
                type="number"
                min="0"
                value={
                  servicePrice
                }
                onChange={(
                  e
                ) =>
                  setServicePrice(
                    e.target.value
                  )
                }
                placeholder="مثال: 150"
                dir="ltr"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                طريقة الحساب
              </label>

              <select
                value={
                  serviceUnit
                }
                onChange={(
                  e
                ) =>
                  setServiceUnit(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="ثابت">
                  سعر ثابت
                </option>

                <option value="متر">
                  بالمتر المربع
                </option>
              </select>

              <label
                style={
                  labelStyle
                }
              >
                وصف الخدمة
              </label>

              <textarea
                value={
                  serviceDescription
                }
                onChange={(
                  e
                ) =>
                  setServiceDescription(
                    e.target.value
                  )
                }
                placeholder="اكتب وصفًا مختصرًا للخدمة"
                dir="rtl"
                rows="3"
                style={{
                  ...inputStyle,
                  height:
                    "auto",
                  padding:
                    "12px 14px",
                  resize:
                    "vertical",
                }}
              />

              <label
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap:
                    "10px",
                  cursor:
                    "pointer",
                  marginBottom:
                    "25px",
                  color:
                    "#334155",
                  fontWeight:
                    "600",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    serviceActive
                  }
                  onChange={(
                    e
                  ) =>
                    setServiceActive(
                      e.target
                        .checked
                    )
                  }
                  style={{
                    width:
                      "18px",
                    height:
                      "18px",
                  }}
                />

                الخدمة مفعلة
              </label>

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                }}
              >
                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                >
                  {editingService
                    ? "حفظ التعديلات"
                    : "إضافة الخدمة"}
                </button>

                <button
                  type="button"
                  onClick={
                    closeServiceModal
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          نافذة العميل
      ========================= */}

      {showCustomerModal && (
        <div
          dir="rtl"
          onClick={
            closeCustomerModal
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              ...modalStyle,
              maxWidth:
                "560px",
            }}
          >
            <div
              style={
                modalHeaderStyle
              }
            >
              <h2
                style={
                  modalTitleStyle
                }
              >
                {editingCustomer
                  ? "تعديل بيانات العميل"
                  : "إضافة عميل جديد"}
              </h2>

              <button
                onClick={
                  closeCustomerModal
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                saveCustomer
              }
            >
              <label
                style={
                  labelStyle
                }
              >
                اسم العميل
              </label>

              <input
                value={
                  customerName
                }
                onChange={(
                  e
                ) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="مثال: أحمد حسن"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                رقم الهاتف
              </label>

              <input
                value={
                  customerPhone
                }
                onChange={(
                  e
                ) =>
                  setCustomerPhone(
                    e.target.value
                  )
                }
                placeholder="مثال: 01000000000"
                dir="ltr"
                style={
                  inputStyle
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                العنوان
              </label>

              <input
                value={
                  customerAddress
                }
                onChange={(
                  e
                ) =>
                  setCustomerAddress(
                    e.target.value
                  )
                }
                placeholder="مثال: القاهرة"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    عدد السيارات
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      customerCars
                    }
                    onChange={(
                      e
                    ) =>
                      setCustomerCars(
                        e.target
                          .value
                      )
                    }
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    عدد السجاد
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      customerCarpets
                    }
                    onChange={(
                      e
                    ) =>
                      setCustomerCarpets(
                        e.target
                          .value
                      )
                    }
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              <label
                style={
                  labelStyle
                }
              >
                ملاحظات
              </label>

              <textarea
                value={
                  customerNotes
                }
                onChange={(
                  e
                ) =>
                  setCustomerNotes(
                    e.target.value
                  )
                }
                placeholder="أي ملاحظات خاصة بالعميل"
                dir="rtl"
                rows="4"
                style={{
                  ...inputStyle,
                  height:
                    "auto",
                  padding:
                    "12px 14px",
                  resize:
                    "vertical",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                  marginTop:
                    "8px",
                }}
              >
                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                >
                  {editingCustomer
                    ? "حفظ التعديلات"
                    : "إضافة العميل"}
                </button>

                <button
                  type="button"
                  onClick={
                    closeCustomerModal
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          نافذة السيارة
      ========================= */}

      {showCarModal && (
        <div
          dir="rtl"
          onClick={
            closeCarModal
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              ...modalStyle,
              maxWidth:
                "600px",
            }}
          >
            <div
              style={
                modalHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    modalTitleStyle
                  }
                >
                  {editingCar
                    ? "تعديل بيانات السيارة"
                    : "إضافة سيارة جديدة"}
                </h2>

                <p
                  style={{
                    ...rtlText,
                    color:
                      "#64748b",
                    margin:
                      "7px 0 0",
                    fontSize:
                      "13px",
                  }}
                >
                  اربط السيارة بأحد العملاء المسجلين
                </p>
              </div>

              <button
                onClick={
                  closeCarModal
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                saveCar
              }
            >
              <label
                style={
                  labelStyle
                }
              >
                العميل
              </label>

              <select
                value={
                  carCustomerId
                }
                onChange={(
                  e
                ) =>
                  setCarCustomerId(
                    e.target.value
                  )
                }
                dir="rtl"
                style={
                  inputStyle
                }
              >
                <option value="">
                  اختر العميل
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.id
                      }
                    >
                      {
                        customer.name
                      }{" "}
                      -{" "}
                      {
                        customer.phone
                      }
                    </option>
                  )
                )}
              </select>

              <label
                style={
                  labelStyle
                }
              >
                رقم اللوحة
              </label>

              <input
                value={
                  carPlateNumber
                }
                onChange={(
                  e
                ) =>
                  setCarPlateNumber(
                    e.target.value
                  )
                }
                placeholder="مثال: أ ب ج 1234"
                dir="rtl"
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    الماركة
                  </label>

                  <input
                    value={
                      carBrand
                    }
                    onChange={(
                      e
                    ) =>
                      setCarBrand(
                        e.target.value
                      )
                    }
                    placeholder="مثال: Toyota"
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    الموديل
                  </label>

                  <input
                    value={
                      carModel
                    }
                    onChange={(
                      e
                    ) =>
                      setCarModel(
                        e.target.value
                      )
                    }
                    placeholder="مثال: Corolla"
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    اللون
                  </label>

                  <input
                    value={
                      carColor
                    }
                    onChange={(
                      e
                    ) =>
                      setCarColor(
                        e.target.value
                      )
                    }
                    placeholder="مثال: أبيض"
                    dir="rtl"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    سنة الصنع
                  </label>

                  <input
                    type="number"
                    min="1900"
                    max={
                      new Date().getFullYear() +
                      1
                    }
                    value={
                      carYear
                    }
                    onChange={(
                      e
                    ) =>
                      setCarYear(
                        e.target.value
                      )
                    }
                    placeholder="2024"
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              <label
                style={
                  labelStyle
                }
              >
                ملاحظات السيارة
              </label>

              <textarea
                value={
                  carNotes
                }
                onChange={(
                  e
                ) =>
                  setCarNotes(
                    e.target.value
                  )
                }
                placeholder="مثال: غسيل أسبوعي - العميل يفضل التنظيف الداخلي"
                dir="rtl"
                rows="4"
                style={{
                  ...inputStyle,
                  height:
                    "auto",
                  padding:
                    "12px 14px",
                  resize:
                    "vertical",
                }}
              />

              <label
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap:
                    "10px",
                  cursor:
                    "pointer",
                  marginBottom:
                    "25px",
                  color:
                    "#334155",
                  fontWeight:
                    "600",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    carActive
                  }
                  onChange={(
                    e
                  ) =>
                    setCarActive(
                      e.target
                        .checked
                    )
                  }
                  style={{
                    width:
                      "18px",
                    height:
                      "18px",
                  }}
                />

                السيارة مفعلة
              </label>

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                }}
              >
                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                >
                  {editingCar
                    ? "حفظ التعديلات"
                    : "إضافة السيارة"}
                </button>

                <button
                  type="button"
                  onClick={
                    closeCarModal
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          نافذة الفاتورة
      ========================= */}

      {showInvoiceModal && (
        <div
          dir="rtl"
          onClick={
            closeInvoiceModal
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              ...modalStyle,
              maxWidth:
                "900px",
            }}
          >
            <div
              style={
                modalHeaderStyle
              }
            >
              <div>
                <h2
                  style={
                    modalTitleStyle
                  }
                >
                  {editingInvoice
                    ? "تعديل الفاتورة"
                    : "إنشاء فاتورة جديدة"}
                </h2>

                {!editingInvoice && (
                  <p
                    style={{
                      ...rtlText,
                      color:
                        "#64748b",
                      margin:
                        "7px 0 0",
                      fontSize:
                        "13px",
                    }}
                  >
                    رقم الفاتورة سيتم إنشاؤه تلقائيًا
                  </p>
                )}
              </div>

              <button
                onClick={
                  closeInvoiceModal
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                saveInvoice
              }
            >
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap:
                    "15px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    العميل
                  </label>

                  <select
                    value={
                      invoiceCustomerId
                    }
                    onChange={(
                      e
                    ) => {
                      setInvoiceCustomerId(
                        e.target.value
                      )

                      setInvoiceCarId(
                        ""
                      )

                      setInvoiceCarpetId(
                        ""
                      )

                      setInvoiceUseMembership(false)
                      setInvoiceMembershipId("")
                    }}
                    dir="rtl"
                    style={
                      inputStyle
                    }
                  >
                    <option value="">
                      اختر العميل
                    </option>

                    {customers.map(
                      (
                        customer
                      ) => (
                        <option
                          key={
                            customer.id
                          }
                          value={
                            customer.id
                          }
                        >
                          {
                            customer.name
                          }{" "}
                          -{" "}
                          {
                            customer.phone
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    نوع الربط
                  </label>

                  <select
                    value={
                      invoiceTargetType
                    }
                    onChange={(
                      e
                    ) => {
                      const value =
                        e.target.value

                      setInvoiceTargetType(
                        value
                      )

                      setInvoiceCarId(
                        ""
                      )

                      setInvoiceCarpetId(
                        ""
                      )

                      setInvoiceUseMembership(false)
                      setInvoiceMembershipId("")
                    }}
                    disabled={
                      !invoiceCustomerId
                    }
                    dir="rtl"
                    style={{
                      ...inputStyle,
                      background:
                        !invoiceCustomerId
                          ? "#f8fafc"
                          : "#fff",
                    }}
                  >
                    <option value="سيارة">
                      فاتورة سيارة
                    </option>

                    <option value="سجادة">
                      فاتورة سجادة
                    </option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop:
                    "2px",
                }}
              >
                {invoiceTargetType ===
                "سيارة" ? (
                  <>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      السيارة
                    </label>

                    <select
                      value={
                        invoiceCarId
                      }
                      onChange={(
                        e
                      ) =>
                        setInvoiceCarId(
                          e.target.value
                        )
                      }
                      disabled={
                        !invoiceCustomerId
                      }
                      dir="rtl"
                      style={{
                        ...inputStyle,
                        background:
                          !invoiceCustomerId
                            ? "#f8fafc"
                            : "#fff",
                      }}
                    >
                      <option value="">
                        {!invoiceCustomerId
                          ? "اختر العميل أولاً"
                          : selectedCustomerCars.length ===
                            0
                          ? "لا توجد سيارات لهذا العميل"
                          : "اختر السيارة"}
                      </option>

                      {selectedCustomerCars.map(
                        (car) => (
                          <option
                            key={
                              car.id
                            }
                            value={
                              car.id
                            }
                          >
                            {
                              car.brand
                            }{" "}
                            {
                              car.model
                            }{" "}
                            -{" "}
                            {
                              car.plateNumber
                            }
                          </option>
                        )
                      )}
                    </select>
                  </>
                ) : (
                  <>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      السجادة
                    </label>

                    <select
                      value={
                        invoiceCarpetId
                      }
                      onChange={(
                        e
                      ) =>
                        setInvoiceCarpetId(
                          e.target.value
                        )
                      }
                      disabled={
                        !invoiceCustomerId
                      }
                      dir="rtl"
                      style={{
                        ...inputStyle,
                        background:
                          !invoiceCustomerId
                            ? "#f8fafc"
                            : "#fff",
                      }}
                    >
                      <option value="">
                        {!invoiceCustomerId
                          ? "اختر العميل أولاً"
                          : selectedCustomerCarpets.length ===
                            0
                          ? "لا توجد سجادات مفتوحة لهذا العميل"
                          : "اختر السجادة"}
                      </option>

                      {selectedCustomerCarpets.map(
                        (carpet) => (
                          <option
                            key={
                              carpet.id
                            }
                            value={
                              carpet.id
                            }
                          >
                            {
                              carpet.name
                            }{" "}
                            -{" "}
                            {Number(
                              carpet.area ||
                                0
                            ).toFixed(
                              2
                            )}{" "}
                            م² -{" "}
                            {
                              carpet.status
                            }
                          </option>
                        )
                      )}
                    </select>
                  </>
                )}
              </div>

              {invoiceTargetType === "سيارة" && (
                <div
                  style={{
                    marginTop: "12px",
                    border: "1px solid #bfdbfe",
                    borderRadius: "14px",
                    padding: "16px",
                    background: invoiceUseMembership
                      ? "#eff6ff"
                      : "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          ...rtlText,
                          margin: 0,
                          color: "#111827",
                          fontSize: "16px",
                        }}
                      >
                        استخدام عضوية العميل
                      </h3>

                      <p
                        style={{
                          ...rtlText,
                          margin: "5px 0 0",
                          color: "#64748b",
                          fontSize: "12px",
                        }}
                      >
                        عند التفعيل سيتم تسجيل زيارة من العضوية بدل تحميل الغسلة كمدفوعة.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (invoiceUseMembership) {
                          setInvoiceUseMembership(false)
                          setInvoiceMembershipId("")
                          return
                        }

                        if (selectedCustomerMemberships.length === 0) {
                          alert(
                            "لا توجد عضوية سارية بها زيارات متبقية لهذا العميل"
                          )
                          return
                        }

                        setInvoiceUseMembership(true)
                        setInvoiceMembershipId(
                          String(selectedCustomerMemberships[0].id)
                        )
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        padding: "9px 14px",
                        background: invoiceUseMembership
                          ? "#1d4ed8"
                          : "#fff",
                        color: invoiceUseMembership
                          ? "#fff"
                          : "#334155",
                        borderColor: invoiceUseMembership
                          ? "#1d4ed8"
                          : "#cbd5e1",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {invoiceUseMembership
                        ? "العضوية مفعلة"
                        : "تفعيل العضوية"}
                    </button>
                  </div>

                  {invoiceUseMembership && (
                    <div style={{ marginTop: "14px" }}>
                      <label style={labelStyle}>
                        العضوية المستخدمة
                      </label>

                      <select
                        value={invoiceMembershipId}
                        onChange={(e) =>
                          setInvoiceMembershipId(e.target.value)
                        }
                        dir="rtl"
                        style={inputStyle}
                      >
                        {selectedCustomerMemberships.map(
                          (membership) => (
                            <option
                              key={membership.id}
                              value={membership.id}
                            >
                              {membership.planName} - متبقي {membership.remainingVisits} من {membership.totalVisits} زيارة
                            </option>
                          )
                        )}
                      </select>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "#fff",
                          borderRadius: "10px",
                          padding: "10px 12px",
                        }}
                      >
                        <span
                          style={{
                            ...rtlText,
                            color: "#475569",
                            fontWeight: "600",
                          }}
                        >
                          حالة الدفع
                        </span>

                        <strong style={{ color: "#1d4ed8" }}>
                          مغطاة بالعضوية
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  marginTop:
                    "10px",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    "16px",
                  padding:
                    "18px",
                  background:
                    "#f8fafc",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "15px",
                    gap:
                      "10px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        ...rtlText,
                        margin:
                          0,
                        color:
                          "#111827",
                        fontSize:
                          "17px",
                      }}
                    >
                      خدمات الفاتورة
                    </h3>

                    <p
                      style={{
                        ...rtlText,
                        margin:
                          "5px 0 0",
                        color:
                          "#64748b",
                        fontSize:
                          "12px",
                      }}
                    >
                      أضف خدمة أو أكثر إلى الفاتورة
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addInvoiceItem
                    }
                    style={{
                      ...primaryButtonStyle,
                      padding:
                        "10px 16px",
                    }}
                  >
                    + إضافة خدمة
                  </button>
                </div>

                {invoiceItems.length ===
                  0 && (
                  <div
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "35px 10px",
                      color:
                        "#94a3b8",
                      background:
                        "#fff",
                      borderRadius:
                        "12px",
                    }}
                  >
                    لم تتم إضافة أي خدمة بعد
                  </div>
                )}

                {invoiceItems.map(
                  (
                    item,
                    index
                  ) => {
                    const details =
                      getInvoiceItemDetails(
                        item
                      )

                    return (
                      <div
                        key={`${index}-${item.serviceId}`}
                        style={{
                          background:
                            "#fff",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "12px",
                          padding:
                            "15px",
                          marginBottom:
                            "10px",
                          display:
                            "grid",
                          gridTemplateColumns:
                            "2fr 1fr 1fr 1fr auto",
                          gap:
                            "10px",
                          alignItems:
                            "end",
                        }}
                      >
                        <div>
                          <label
                            style={
                              smallLabelStyle
                            }
                          >
                            الخدمة
                          </label>

                          <select
                            value={
                              item.serviceId
                            }
                            onChange={(
                              e
                            ) =>
                              updateInvoiceItem(
                                index,
                                "serviceId",
                                e.target.value
                              )
                            }
                            dir="rtl"
                            style={{
                              ...inputStyle,
                              marginBottom:
                                0,
                            }}
                          >
                            {services
                              .filter(
                                (
                                  service
                                ) =>
                                  service.active
                              )
                              .map(
                                (
                                  service
                                ) => (
                                  <option
                                    key={
                                      service.id
                                    }
                                    value={
                                      service.id
                                    }
                                  >
                                    {
                                      service.name
                                    }
                                  </option>
                                )
                              )}
                          </select>
                        </div>

                        <div>
                          <label
                            style={
                              smallLabelStyle
                            }
                          >
                            الكمية
                          </label>

                          <input
                            type="number"
                            min="1"
                            step={
                              details.unit ===
                              "متر"
                                ? "0.01"
                                : "1"
                            }
                            value={
                              item.quantity
                            }
                            onChange={(
                              e
                            ) =>
                              updateInvoiceItem(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            dir="ltr"
                            style={{
                              ...inputStyle,
                              marginBottom:
                                0,
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={
                              smallLabelStyle
                            }
                          >
                            سعر الوحدة
                          </label>

                          <div
                            style={{
                              height:
                                "48px",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              padding:
                                "0 12px",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius:
                                "10px",
                              background:
                                "#f8fafc",
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              details.price
                            }{" "}
                            جنيه
                          </div>
                        </div>

                        <div>
                          <label
                            style={
                              smallLabelStyle
                            }
                          >
                            الإجمالي
                          </label>

                          <div
                            style={{
                              height:
                                "48px",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              padding:
                                "0 12px",
                              border:
                                "1px solid #dbeafe",
                              borderRadius:
                                "10px",
                              background:
                                "#eff6ff",
                              color:
                                "#1d4ed8",
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              details.total
                            }{" "}
                            جنيه
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeInvoiceItem(
                              index
                            )
                          }
                          style={{
                            height:
                              "48px",
                            border:
                              "none",
                            borderRadius:
                              "10px",
                            background:
                              "#fee2e2",
                            color:
                              "#b91c1c",
                            padding:
                              "0 14px",
                            cursor:
                              "pointer",
                            fontFamily:
                              "Tahoma, Arial, sans-serif",
                          }}
                        >
                          حذف
                        </button>
                      </div>
                    )
                  }
                )}

                <div
                  style={{
                    marginTop:
                      "15px",
                    paddingTop:
                      "15px",
                    borderTop:
                      "1px solid #e2e8f0",
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >
                  <span
                    style={{
                      ...rtlText,
                      fontWeight:
                        "700",
                      color:
                        "#334155",
                    }}
                  >
                    إجمالي الفاتورة
                  </span>

                  <strong
                    style={{
                      color:
                        "#111827",
                      fontSize:
                        "24px",
                    }}
                  >
                    {
                      invoiceTotal
                    }{" "}
                    جنيه
                  </strong>
                </div>
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap:
                    "15px",
                  marginTop:
                    "20px",
                }}
              >
                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    طريقة الدفع
                  </label>

                  <select
                    value={
                      invoicePaymentMethod
                    }
                    onChange={(
                      e
                    ) =>
                      setInvoicePaymentMethod(
                        e.target.value
                      )
                    }
                    dir="rtl"
                    style={
                      inputStyle
                    }
                  >
                    <option value="نقدي">
                      نقدي
                    </option>

                    <option value="بطاقة">
                      بطاقة
                    </option>

                    <option value="تحويل">
                      تحويل بنكي
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    حالة الدفع
                  </label>

                  <select
                    value={
                      invoiceUseMembership
                        ? "مغطاة بالعضوية"
                        : invoicePaymentStatus
                    }
                    onChange={(e) => {
                      if (invoiceUseMembership) return

                      setInvoicePaymentStatus(
                        e.target.value
                      )

                      if (e.target.value === "مدفوعة") {
                        setInvoicePaidAmount(invoiceTotal)
                      }

                      if (e.target.value === "غير مدفوعة") {
                        setInvoicePaidAmount(0)
                      }
                    }}
                    disabled={invoiceUseMembership}
                    dir="rtl"
                    style={{
                      ...inputStyle,
                      background: invoiceUseMembership
                        ? "#f8fafc"
                        : "#fff",
                    }}
                  >
                    {invoiceUseMembership && (
                      <option value="مغطاة بالعضوية">
                        مغطاة بالعضوية
                      </option>
                    )}

                    {!invoiceUseMembership && (
                      <>
                        <option value="مدفوعة">
                          مدفوعة
                        </option>
                        <option value="مدفوعة جزئيًا">
                          مدفوعة جزئيًا
                        </option>
                        <option value="غير مدفوعة">
                          غير مدفوعة
                        </option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    المبلغ المدفوع
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={
                      invoiceTotal
                    }
                    value={
                      invoiceUseMembership
                        ? 0
                        : invoicePaymentStatus ===
                          "مدفوعة"
                        ? invoiceTotal
                        : invoicePaymentStatus ===
                          "غير مدفوعة"
                        ? 0
                        : invoicePaidAmount
                    }
                    disabled={
                      invoiceUseMembership ||
                      invoicePaymentStatus !==
                      "مدفوعة جزئيًا"
                    }
                    onChange={(
                      e
                    ) =>
                      setInvoicePaidAmount(
                        e.target.value
                      )
                    }
                    dir="ltr"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  background:
                    invoiceRemainingAmount >
                    0
                      ? "#fff7ed"
                      : "#f0fdf4",
                  borderRadius:
                    "12px",
                  padding:
                    "14px 16px",
                  marginBottom:
                    "18px",
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                }}
              >
                <span
                  style={{
                    ...rtlText,
                    color:
                      "#475569",
                    fontWeight:
                      "600",
                  }}
                >
                  المبلغ المتبقي
                </span>

                <strong
                  style={{
                    color:
                      invoiceRemainingAmount >
                      0
                        ? "#c2410c"
                        : "#15803d",
                    fontSize:
                      "18px",
                  }}
                >
                  {
                    invoiceUseMembership
                      ? 0
                      : invoiceRemainingAmount
                  }{" "}
                  جنيه
                </strong>
              </div>

              <label
                style={
                  labelStyle
                }
              >

              {/* أصناف من المخزون */}
              {!editingInvoice && (
                <div
                  style={{
                    marginTop: "18px",
                    marginBottom: "18px",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <strong style={{ color: "#334155", fontSize: "14px" }}>
                      مواد من المخزون (اختياري)
                    </strong>
                    <button
                      type="button"
                      onClick={() => {
                        if (!inventoryItems.length) {
                          alert("لا توجد أصناف في المخزون")
                          return
                        }
                        setInvoiceInventoryUsage((prev) => [
                          ...prev,
                          {
                            inventoryId: inventoryItems[0].id,
                            quantity: 1,
                          },
                        ])
                      }}
                      style={{
                        border: "none",
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        fontFamily: "Tahoma, Arial, sans-serif",
                      }}
                    >
                      + إضافة مادة
                    </button>
                  </div>
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    عند حفظ الفاتورة يتم خصم الكميات من المخزون تلقائيًا
                  </p>
                  {invoiceInventoryUsage.map((row, index) => {
                    const inv = inventoryItems.find(
                      (x) => x.id === Number(row.inventoryId)
                    )
                    return (
                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr auto",
                          gap: "10px",
                          marginBottom: "10px",
                          alignItems: "end",
                        }}
                      >
                        <div>
                          <label style={{ ...smallLabelStyle }}>الصنف</label>
                          <select
                            value={row.inventoryId}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              setInvoiceInventoryUsage((prev) =>
                                prev.map((r, i) =>
                                  i === index
                                    ? { ...r, inventoryId: val }
                                    : r
                                )
                              )
                            }}
                            dir="rtl"
                            style={inputStyle}
                          >
                            {inventoryItems.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name} (متاح: {item.quantity})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ ...smallLabelStyle }}>الكمية</label>
                          <input
                            type="number"
                            min="1"
                            max={inv ? Number(inv.quantity) : undefined}
                            value={row.quantity}
                            onChange={(e) => {
                              const val = Math.max(1, Number(e.target.value) || 1)
                              setInvoiceInventoryUsage((prev) =>
                                prev.map((r, i) =>
                                  i === index ? { ...r, quantity: val } : r
                                )
                              )
                            }}
                            dir="ltr"
                            style={inputStyle}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setInvoiceInventoryUsage((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          style={{
                            height: "48px",
                            border: "none",
                            borderRadius: "10px",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "0 14px",
                            cursor: "pointer",
                            fontFamily: "Tahoma, Arial, sans-serif",
                          }}
                        >
                          حذف
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

                
ملاحظات الفاتورة
              </label>

              <textarea
                value={
                  invoiceNotes
                }
                onChange={(
                  e
                ) =>
                  setInvoiceNotes(
                    e.target.value
                  )
                }
                placeholder="أي ملاحظات خاصة بالفاتورة..."
                dir="rtl"
                rows="3"
                style={{
                  ...inputStyle,
                  height:
                    "auto",
                  padding:
                    "12px 14px",
                  resize:
                    "vertical",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                  marginTop:
                    "8px",
                }}
              >
                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                >
                  {editingInvoice
                    ? "حفظ تعديلات الفاتورة"
                    : "حفظ الفاتورة"}
                </button>

                <button
                  type="button"
                  onClick={
                    closeInvoiceModal
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          عرض تفاصيل الفاتورة
      ========================= */}

      {viewingInvoice && (
        <div
          dir="rtl"
          onClick={() =>
            setViewingInvoice(
              null
            )
          }
          style={
            modalOverlayStyle
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              ...modalStyle,
              maxWidth:
                "750px",
            }}
          >
            <div
              style={{
                ...modalHeaderStyle,
                borderBottom:
                  "1px solid #e2e8f0",
                paddingBottom:
                  "18px",
              }}
            >
              <div>
                <h2
                  style={{
                    ...modalTitleStyle,
                    direction:
                      "ltr",
                    textAlign:
                      "right",
                  }}
                >
                  {
                    viewingInvoice.invoiceNumber
                  }
                </h2>

                <p
                  style={{
                    ...rtlText,
                    margin:
                      "7px 0 0",
                    color:
                      "#64748b",
                    fontSize:
                      "13px",
                  }}
                >
                  {
                    viewingInvoice.date
                  }
                </p>
              </div>

              <button
                onClick={() =>
                  setViewingInvoice(
                    null
                  )
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:
                  "15px",
                marginBottom:
                  "20px",
              }}
            >
              <div
                style={{
                  background:
                    "#f8fafc",
                  borderRadius:
                    "12px",
                  padding:
                    "15px",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  العميل
                </div>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "6px",
                  }}
                >
                  {
                    viewingInvoice.customerName
                  }
                </strong>

                <div
                  style={{
                    direction:
                      "ltr",
                    marginTop:
                      "4px",
                    color:
                      "#64748b",
                  }}
                >
                  {
                    viewingInvoice.customerPhone
                  }
                </div>
              </div>

              <div
                style={{
                  background:
                    "#f8fafc",
                  borderRadius:
                    "12px",
                  padding:
                    "15px",
                }}
              >
                <div
                  style={
                    statLabelStyle
                  }
                >
                  {viewingInvoice.assetType ===
                  "سجادة"
                    ? "السجادة"
                    : "السيارة"}
                </div>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "6px",
                  }}
                >
                  {
                    viewingInvoice.carInfo
                  }
                </strong>
              </div>
            </div>

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >
              <table
                dir="rtl"
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الخدمة
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الكمية
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      السعر
                    </th>

                    <th
                      style={
                        tableHeaderStyle
                      }
                    >
                      الإجمالي
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    viewingInvoice.items.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={
                            index
                          }
                        >
                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              item.serviceName
                            }
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              item.quantity
                            }
                            {item.unit ===
                            "متر"
                              ? " م²"
                              : ""}
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              item.price
                            }{" "}
                            جنيه
                          </td>

                          <td
                            style={{
                              ...tableCellStyle,
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              item.total
                            }{" "}
                            جنيه
                          </td>
                        </tr>
                      )
                    )
                  }
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop:
                  "20px",
                background:
                  "#f8fafc",
                borderRadius:
                  "14px",
                padding:
                  "18px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  marginBottom:
                    "10px",
                }}
              >
                <span>
                  إجمالي الفاتورة
                </span>

                <strong>
                  {
                    viewingInvoice.total
                  }{" "}
                  جنيه
                </strong>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  marginBottom:
                    "10px",
                }}
              >
                <span>
                  المبلغ المدفوع
                </span>

                <strong
                  style={{
                    color:
                      "#15803d",
                  }}
                >
                  {
                    viewingInvoice.paidAmount
                  }{" "}
                  جنيه
                </strong>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <span>
                  المتبقي
                </span>

                <strong
                  style={{
                    color:
                      viewingInvoice.remainingAmount >
                      0
                        ? "#c2410c"
                        : "#15803d",
                  }}
                >
                  {
                    viewingInvoice.remainingAmount
                  }{" "}
                  جنيه
                </strong>
              </div>
            </div>

            <div
              style={{
                marginTop:
                  "15px",
                display:
                  "flex",
                gap:
                  "10px",
                flexWrap:
                  "wrap",
              }}
            >
              <span
                style={{
                  padding:
                    "7px 12px",
                  borderRadius:
                    "20px",
                  background:
                    "#eff6ff",
                  color:
                    "#1d4ed8",
                  fontWeight:
                    "700",
                  fontSize:
                    "13px",
                }}
              >
                الدفع:{" "}
                {
                  viewingInvoice.paymentMethod
                }
              </span>

              <span
                style={{
                  padding:
                    "7px 12px",
                  borderRadius:
                    "20px",
                  background:
                    viewingInvoice.paymentStatus ===
                    "مدفوعة"
                      ? "#dcfce7"
                      : viewingInvoice.paymentStatus ===
                        "مدفوعة جزئيًا"
                      ? "#fef3c7"
                      : "#fee2e2",
                  color:
                    viewingInvoice.paymentStatus ===
                    "مدفوعة"
                      ? "#166534"
                      : viewingInvoice.paymentStatus ===
                        "مدفوعة جزئيًا"
                      ? "#92400e"
                      : "#991b1b",
                  fontWeight:
                    "700",
                  fontSize:
                    "13px",
                }}
              >
                {
                  viewingInvoice.paymentStatus
                }
              </span>
            </div>

            {viewingInvoice.coveredByMembership && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: "700",
                }}
              >
                مغطاة بالعضوية: {viewingInvoice.membershipPlanName || "عضوية العميل"}
              </div>
            )}

            {viewingInvoice.notes && (
              <div
                style={{
                  marginTop:
                    "18px",
                  padding:
                    "15px",
                  borderRadius:
                    "12px",
                  background:
                    "#fffbeb",
                  color:
                    "#78350f",
                }}
              >
                <strong>
                  ملاحظات:
                </strong>{" "}
                {
                  viewingInvoice.notes
                }
              </div>
            )}

            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                borderTop: "1px solid #e2e8f0",
                textAlign: "center",
                color: "#64748b",
                lineHeight: 1.8,
              }}
            >
              <strong style={{ display: "block", color: "#111827", fontSize: "16px" }}>
                {settings.businessName}
              </strong>

              {settings.showPhoneOnInvoice && settings.phone && (
                <span style={{ display: "block", direction: "ltr" }}>
                  {settings.phone}
                </span>
              )}

              {settings.showAddressOnInvoice && settings.address && (
                <span style={{ display: "block" }}>
                  {settings.address}
                </span>
              )}

              {settings.showFooterOnInvoice && settings.invoiceFooter && (
                <span style={{ display: "block", marginTop: "6px" }}>
                  {settings.invoiceFooter}
                </span>
              )}
            </div>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap:
                  "10px",
                marginTop:
                  "25px",
              }}
            >
              <button
                onClick={() =>
                  printInvoice(
                    viewingInvoice
                  )
                }
                style={
                  secondaryButtonStyle
                }
              >
                طباعة الفاتورة
              </button>

              <button
                onClick={() => {
                  const invoice =
                    viewingInvoice

                  setViewingInvoice(
                    null
                  )

                  openEditInvoice(
                    invoice
                  )
                }}
                style={
                  secondaryButtonStyle
                }
              >
                تعديل الفاتورة
              </button>

              <button
                onClick={() =>
                  setViewingInvoice(
                    null
                  )
                }
                style={
                  primaryButtonStyle
                }
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =========================
// تنسيقات مشتركة
// =========================


export default App