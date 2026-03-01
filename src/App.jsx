import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { invoices as rawInvoices, clients, revenueData, timelineEvents } from "./data/mockData";

const statusColors = {
  Paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Overdue: "bg-red-500/20 text-red-400 border-red-500/30",
  Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const timelineIcons = {
  payment: "\u2705",
  invoice: "\uD83D\uDCC4",
  overdue: "\u26A0\uFE0F",
};

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function Badge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
      {status}
    </span>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState(rawInvoices);
  const [lineItems, setLineItems] = useState([{ desc: "", qty: 1, price: 0 }]);
  const [formClient, setFormClient] = useState("");
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== "All" && inv.status !== statusFilter) return false;
    if (dateFrom && inv.date < dateFrom) return false;
    if (dateTo && inv.date > dateTo) return false;
    return true;
  });

  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const mrr = Math.round(totalRevenue / 6);
  const arr = mrr * 12;

  const handleExport = () => {
    const csv = ["ID,Client,Amount,Status,Date,Due", ...invoices.map((i) => `${i.id},${i.client},${i.amount},${i.status},${i.date},${i.due}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateInvoice = () => {
    const subtotal = lineItems.reduce((s, li) => s + li.qty * li.price, 0);
    const total = subtotal * (1 + tax / 100) * (1 - discount / 100);
    const newInv = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      client: formClient || "New Client",
      amount: Math.round(total * 100) / 100,
      status: "Draft",
      date: new Date().toISOString().split("T")[0],
      due: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    };
    setInvoices([newInv, ...invoices]);
    setShowForm(false);
    setLineItems([{ desc: "", qty: 1, price: 0 }]);
    setFormClient("");
    setTax(0);
    setDiscount(0);
  };

  const tabs = ["dashboard", "invoices", "clients"];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">IN</div>
          <h1 className="text-lg font-semibold">Invoice Dashboard</h1>
        </div>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm capitalize transition ${tab === t ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Dashboard Tab */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Monthly Recurring Revenue" value={`$${mrr.toLocaleString()}`} sub="+12% from last month" />
              <StatCard label="Annual Recurring Revenue" value={`$${arr.toLocaleString()}`} sub="Projected" />
              <StatCard label="Churn Rate" value="2.4%" sub="Industry avg: 5%" />
              <StatCard label="Customer LTV" value="$18,720" sub="Avg over 24 months" />
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Timeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-4">Payment Timeline</h2>
              <div className="space-y-4">
                {timelineEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 pl-2">
                    <span className="text-lg">{timelineIcons[ev.type]}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{ev.text}</p>
                      <p className="text-xs text-gray-500">{ev.date} at {ev.time}</p>
                    </div>
                    <span className={`text-sm font-medium ${ev.type === "overdue" ? "text-red-400" : "text-emerald-400"}`}>
                      ${ev.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {tab === "invoices" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500">
                {["All", "Paid", "Pending", "Overdue", "Draft"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500" />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500" />
              <div className="flex-1" />
              <button onClick={handleExport} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition">Export CSV</button>
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition">+ New Invoice</button>
            </div>

            {/* Create Invoice Form */}
            {showForm && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold">Create Invoice</h3>
                <input placeholder="Client name" value={formClient} onChange={(e) => setFormClient(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                {lineItems.map((li, i) => (
                  <div key={i} className="flex gap-2">
                    <input placeholder="Description" value={li.desc} onChange={(e) => { const n = [...lineItems]; n[i].desc = e.target.value; setLineItems(n); }} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                    <input type="number" placeholder="Qty" value={li.qty} onChange={(e) => { const n = [...lineItems]; n[i].qty = +e.target.value; setLineItems(n); }} className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                    <input type="number" placeholder="Price" value={li.price} onChange={(e) => { const n = [...lineItems]; n[i].price = +e.target.value; setLineItems(n); }} className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                ))}
                <button onClick={() => setLineItems([...lineItems, { desc: "", qty: 1, price: 0 }])} className="text-sm text-indigo-400 hover:text-indigo-300">+ Add line item</button>
                <div className="flex gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Tax %</label>
                    <input type="number" value={tax} onChange={(e) => setTax(+e.target.value)} className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 block" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Discount %</label>
                    <input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 block" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCreateInvoice} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition">Create</button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition">Cancel</button>
                </div>
              </div>
            )}

            {/* Invoice Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                </tr></thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-5 py-3 font-medium text-indigo-400">{inv.id}</td>
                      <td className="px-5 py-3">{inv.client}</td>
                      <td className="px-5 py-3">${inv.amount.toLocaleString()}</td>
                      <td className="px-5 py-3"><Badge status={inv.status} /></td>
                      <td className="px-5 py-3 text-gray-400">{inv.date}</td>
                      <td className="px-5 py-3 text-gray-400">{inv.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {tab === "clients" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((c) => (
              <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{c.phone}</div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                  <div><p className="text-xs text-gray-500">Total Paid</p><p className="text-sm font-medium text-emerald-400">${c.totalPaid.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Invoices</p><p className="text-sm font-medium">{c.invoiceCount}</p></div>
                  <div><p className="text-xs text-gray-500">Last Payment</p><p className="text-sm font-medium text-gray-300">{c.lastPayment}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
