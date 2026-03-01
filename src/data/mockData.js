export const clients = [
  { id: 1, name: "Acme Corp", email: "billing@acme.com", phone: "(555) 123-4567", totalPaid: 45200, invoiceCount: 12, lastPayment: "2026-02-15" },
  { id: 2, name: "TechFlow Inc", email: "ap@techflow.io", phone: "(555) 234-5678", totalPaid: 38750, invoiceCount: 8, lastPayment: "2026-02-20" },
  { id: 3, name: "StartupXYZ", email: "finance@startupxyz.com", phone: "(555) 345-6789", totalPaid: 22100, invoiceCount: 6, lastPayment: "2026-01-30" },
  { id: 4, name: "GlobalMedia", email: "accounts@globalmedia.com", phone: "(555) 456-7890", totalPaid: 67800, invoiceCount: 15, lastPayment: "2026-02-25" },
  { id: 5, name: "DataVault LLC", email: "pay@datavault.co", phone: "(555) 567-8901", totalPaid: 19500, invoiceCount: 4, lastPayment: "2026-02-10" },
];

export const invoices = [
  { id: "INV-001", client: "Acme Corp", amount: 4500, status: "Paid", date: "2026-02-15", due: "2026-03-15" },
  { id: "INV-002", client: "TechFlow Inc", amount: 7200, status: "Pending", date: "2026-02-20", due: "2026-03-20" },
  { id: "INV-003", client: "StartupXYZ", amount: 3100, status: "Overdue", date: "2026-01-10", due: "2026-02-10" },
  { id: "INV-004", client: "GlobalMedia", amount: 12000, status: "Paid", date: "2026-02-25", due: "2026-03-25" },
  { id: "INV-005", client: "DataVault LLC", amount: 5500, status: "Draft", date: "2026-03-01", due: "2026-03-31" },
  { id: "INV-006", client: "Acme Corp", amount: 3800, status: "Paid", date: "2026-01-15", due: "2026-02-15" },
  { id: "INV-007", client: "TechFlow Inc", amount: 6400, status: "Pending", date: "2026-02-28", due: "2026-03-28" },
  { id: "INV-008", client: "GlobalMedia", amount: 8900, status: "Paid", date: "2026-01-20", due: "2026-02-20" },
  { id: "INV-009", client: "StartupXYZ", amount: 2200, status: "Overdue", date: "2025-12-15", due: "2026-01-15" },
  { id: "INV-010", client: "DataVault LLC", amount: 4100, status: "Pending", date: "2026-02-18", due: "2026-03-18" },
];

export const revenueData = [
  { month: "Sep", revenue: 28400 },
  { month: "Oct", revenue: 35200 },
  { month: "Nov", revenue: 31800 },
  { month: "Dec", revenue: 42100 },
  { month: "Jan", revenue: 38900 },
  { month: "Feb", revenue: 47600 },
];

export const timelineEvents = [
  { id: 1, type: "payment", text: "Acme Corp paid INV-001", amount: 4500, date: "Feb 15, 2026", time: "2:30 PM" },
  { id: 2, type: "invoice", text: "Invoice INV-005 created for DataVault LLC", amount: 5500, date: "Mar 1, 2026", time: "9:00 AM" },
  { id: 3, type: "payment", text: "GlobalMedia paid INV-004", amount: 12000, date: "Feb 25, 2026", time: "11:15 AM" },
  { id: 4, type: "overdue", text: "INV-003 from StartupXYZ is overdue", amount: 3100, date: "Feb 10, 2026", time: "12:00 AM" },
  { id: 5, type: "payment", text: "GlobalMedia paid INV-008", amount: 8900, date: "Jan 20, 2026", time: "3:45 PM" },
  { id: 6, type: "invoice", text: "Invoice INV-007 sent to TechFlow Inc", amount: 6400, date: "Feb 28, 2026", time: "10:00 AM" },
];
