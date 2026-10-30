
import ProductForm from "./components/ProductForm";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Tags,
  Truck,
  Store,
  ChartNoAxesCombined,
  Search,
  Bell,
  Menu,
  Plus,
  IndianRupee,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  X,
  Pencil,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "./services/productService.js";

// ---------------- SAMPLE ORDERS ----------------
// Orders backend integration will be added separately.

const initialOrders = [
  {
    id: "ORD-1052",
    customer: "Rahul Sharma",
    items: 4,
    amount: 486,
    time: "10:42 AM",
    status: "Delivered",
  },
  {
    id: "ORD-1051",
    customer: "Priya Singh",
    items: 6,
    amount: 728,
    time: "10:39 AM",
    status: "Out for Delivery",
  },
  {
    id: "ORD-1050",
    customer: "Amit Kumar",
    items: 3,
    amount: 249,
    time: "10:31 AM",
    status: "Packing",
  },
  {
    id: "ORD-1049",
    customer: "Sneha Patel",
    items: 8,
    amount: 915,
    time: "10:25 AM",
    status: "Confirmed",
  },
  {
    id: "ORD-1048",
    customer: "Mohammed Ali",
    items: 2,
    amount: 175,
    time: "10:18 AM",
    status: "Delivered",
  },
];

// ---------------- NAVIGATION ----------------

const navigation = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CATALOG",
    items: [
      { label: "Products", icon: Package },
      { label: "Categories", icon: Tags },
      { label: "Inventory", icon: Boxes },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Orders", icon: ShoppingCart },
      { label: "Delivery Partners", icon: Truck },
      { label: "Stores", icon: Store },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { label: "Reports", icon: ChartNoAxesCombined },
    ],
  },
];

// ---------------- HELPERS ----------------

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function getProductImageSrc(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  const apiOrigin = /^https?:\/\//i.test(apiBaseUrl)
    ? apiBaseUrl.replace(/\/api\/?$/, "")
    : window.location.origin;

  return `${apiOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function getStockStatus(stock) {
  if (Number(stock) === 0) return "Out of Stock";
  if (Number(stock) <= 10) return "Low Stock";
  return "In Stock";
}

function getApiError(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

// ---------------- STATUS BADGE ----------------

function StatusBadge({ status }) {
  const styles = {
    "In Stock": "bg-emerald-50 text-emerald-700",
    "Low Stock": "bg-amber-50 text-amber-700",
    "Out of Stock": "bg-red-50 text-red-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Confirmed: "bg-violet-50 text-violet-700",
    Packing: "bg-blue-50 text-blue-700",
    "Out for Delivery": "bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

// ---------------- SIDEBAR ----------------

function Sidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
}) {
  function navigate(page) {
    setActivePage(page);
    setMobileOpen(false);
  }

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-gray-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Store size={22} />
          </div>

          <div>
            <h1 className="text-lg font-extrabold">
              QuickMart
            </h1>
            <p className="text-xs text-gray-500">
              RMS Admin Portal
            </p>
          </div>

          <button
            className="ml-auto lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-gray-400">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => navigate(label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                      activePage === label
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
              QA
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                Admin User
              </p>
              <p className="text-xs text-gray-500">
                Store administrator
              </p>
            </div>

            <ChevronDown size={16} />
          </div>
        </div>
      </aside>
    </>
  );
}

// ---------------- HEADER ----------------

function Header({
  activePage,
  search,
  setSearch,
  setMobileOpen,
  onRefresh,
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-gray-200 bg-white/95 px-4 sm:px-6 xl:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-bold">
            {activePage}
          </h2>
          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your QuickMart operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this page..."
            className="w-48 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 xl:w-64"
          />
        </div>

        <button
          onClick={onRefresh}
          title="Refresh products"
          aria-label="Refresh products"
          className="rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={19} />
        </button>

        <button
          aria-label="Notifications"
          className="rounded-xl border border-gray-200 p-2.5 text-gray-600"
        >
          <Bell size={19} />
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800">
            A
          </div>
          <span className="text-sm font-semibold">
            Administrator
          </span>
        </div>
      </div>
    </header>
  );
}

// ---------------- SUMMARY CARD ----------------

function SmallSummary({ title, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <p className="mt-1 text-2xl font-extrabold">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  color,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        {note}
      </p>
    </div>
  );
}

// ---------------- ORDERS TABLE ----------------

function OrdersTable({
  orders,
  title = "Orders",
  onViewAll,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="font-bold">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Sample order activity
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            View all
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-semibold text-emerald-700">
                  {order.id}
                </td>

                <td className="px-5 py-4">
                  {order.customer}
                </td>

                <td className="px-5 py-4">
                  {order.items}
                </td>

                <td className="px-5 py-4 font-semibold">
                  {money(order.amount)}
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {order.time}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------- DASHBOARD ----------------

function Dashboard({
  products,
  orders,
  setActivePage,
}) {
  const lowStock = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= 10
  );

  const outOfStock = products.filter(
    (p) => Number(p.stock) === 0
  );

  const delivered = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const revenueData = [
    { day: "Mon", height: 42, value: "₹28k" },
    { day: "Tue", height: 62, value: "₹41k" },
    { day: "Wed", height: 50, value: "₹34k" },
    { day: "Thu", height: 78, value: "₹52k" },
    { day: "Fri", height: 57, value: "₹38k" },
    { day: "Sat", height: 94, value: "₹64k" },
    { day: "Sun", height: 70, value: "₹48k" },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold">
            Good morning, Admin 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm">
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={money(48250)}
          note="Demo revenue"
          icon={IndianRupee}
          color="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Total Orders"
          value="1,284"
          note="Demo order count"
          icon={ShoppingCart}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Active Customers"
          value="864"
          note="Demo customer count"
          icon={Users}
          color="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Avg. Delivery Time"
          value="12.5 min"
          note="Demo delivery time"
          icon={Clock}
          color="bg-orange-50 text-orange-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h3 className="font-bold">
            Revenue Overview
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Illustrative weekly revenue — sample data
          </p>

          <div className="mt-5 flex h-56 items-end gap-3 sm:gap-5">
            {revenueData.map((bar) => (
              <div
                key={bar.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] text-gray-400">
                  {bar.value}
                </span>

                <div className="flex h-[78%] w-full items-end">
                  <div
                    title={`${bar.day}: ${bar.value}`}
                    style={{
                      height: `${bar.height}%`,
                    }}
                    className="w-full rounded-t-lg bg-emerald-500 hover:bg-emerald-600"
                  />
                </div>

                <span className="text-xs text-gray-500">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold">
              Inventory Alerts
            </h3>

            <button
              onClick={() => setActivePage("Inventory")}
              className="text-xs font-semibold text-emerald-700"
            >
              View inventory
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3">
              <AlertTriangle
                size={20}
                className="text-amber-700"
              />

              <span className="flex-1 text-sm font-semibold">
                Low Stock
              </span>

              <strong>{lowStock.length}</strong>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
              <Package
                size={20}
                className="text-red-700"
              />

              <span className="flex-1 text-sm font-semibold">
                Out of Stock
              </span>

              <strong>{outOfStock.length}</strong>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
              <CheckCircle2
                size={20}
                className="text-emerald-700"
              />

              <span className="flex-1 text-sm font-semibold">
                Delivered (Demo)
              </span>

              <strong>{delivered}</strong>
            </div>
          </div>
        </section>
      </div>

      <OrdersTable
        orders={orders.slice(0, 5)}
        title="Recent Orders"
        onViewAll={() => setActivePage("Orders")}
      />
    </div>
  );
}

// ---------------- PRODUCTS PAGE ----------------

function ProductsPage({
  products,
  setProducts,
  search,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const filtered = products.filter((p) =>
    `${p.id} ${p.name} ${p.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function resetForm() {
    setEditingProduct(null);
    setShowForm(false);
    setError("");
  }

  function openAddForm() {
    setEditingProduct(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setError("");
    setShowForm(true);
  }

  function handleProductSaved(savedProduct) {
    setProducts((current) =>
      editingProduct
        ? current.map((product) =>
            product.id === editingProduct.id
              ? savedProduct
              : product
          )
        : [savedProduct, ...current]
    );
    resetForm();
  }

  async function handleDeleteProduct(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteProduct(id);

      setProducts((current) =>
        current.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.error("Delete product failed:", err);

      setError(
        getApiError(err, "Unable to delete product.")
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalogue.
          </p>
        </div>

        <button
          onClick={() =>
            showForm ? resetForm() : openAddForm()
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {showForm ? <X size={17} /> : <Plus size={17} />}

          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {showForm && (
        <ProductForm
          key={editingProduct?.id ?? "new-product"}
          product={editingProduct}
          onSaved={handleProductSaved}
          onCancel={resetForm}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SmallSummary
          title="Total Products"
          value={products.length}
          icon={Package}
        />

        <SmallSummary
          title="Low Stock"
          value={
            products.filter(
              (p) => p.stock > 0 && p.stock <= 10
            ).length
          }
          icon={AlertTriangle}
        />

        <SmallSummary
          title="Out of Stock"
          value={
            products.filter((p) => p.stock === 0).length
          }
          icon={Boxes}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-bold">
            Product Catalogue
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {p.name}
                    </p>

                    {p.description && (
                      <p className="mt-1 max-w-xs truncate text-xs text-gray-500" title={p.description}>
                        {p.description}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-400">
                      PRD-{String(p.id).padStart(3, "0")}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {p.image_url ? (
                      <img
                        src={getProductImageSrc(p.image_url)}
                        alt={p.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {p.category}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {money(p.price)}
                  </td>

                  <td className="px-5 py-4">
                    {p.stock}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={getStockStatus(p.stock)}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        title="Edit Product"
                        onClick={() => openEditForm(p)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete Product"
                        disabled={deletingId === p.id}
                        onClick={() =>
                          handleDeleteProduct(p.id)
                        }
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ---------------- INVENTORY PAGE ----------------

function InventoryPage({
  products,
  setProducts,
  search,
}) {
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = products.filter((p) =>
    `${p.name} ${p.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function handleUpdateStock(product) {
    const answer = window.prompt(
      `Enter new stock quantity for ${product.name}:`,
      String(product.stock)
    );

    if (answer === null) return;

    const stock = Number(answer);

    if (
      answer.trim() === "" ||
      !Number.isSafeInteger(stock) ||
      stock < 0 ||
      stock > 2147483647
    ) {
      window.alert(
        "Enter a valid non-negative whole number."
      );
      return;
    }

    try {
      setError("");
      setUpdatingId(product.id);

      const updated = await updateProduct(
        product.id,
        {
          name: product.name,
          category: product.category,
          description: product.description || "",
          image_url: product.image_url || null,
          price: Number(product.price),
          stock,
        }
      );

      setProducts((current) =>
        current.map((p) =>
          p.id === product.id ? updated : p
        )
      );
    } catch (err) {
      console.error("Stock update failed:", err);

      setError(
        getApiError(
          err,
          "Unable to update stock in PostgreSQL."
        )
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor and update product stock levels.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SmallSummary
          title="Total SKUs"
          value={products.length}
          icon={Boxes}
        />

        <SmallSummary
          title="Low Stock"
          value={
            products.filter(
              (p) => p.stock > 0 && p.stock <= 10
            ).length
          }
          icon={AlertTriangle}
        />

        <SmallSummary
          title="Out of Stock"
          value={
            products.filter((p) => p.stock === 0).length
          }
          icon={Package}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-bold">
            Stock Overview
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-semibold">
                    {p.name}
                  </td>

                  <td className="px-5 py-4">
                    {p.category}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-12 font-semibold">
                        {p.stock}
                      </span>

                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          style={{
                            width: `${Math.min(
                              Number(p.stock),
                              100
                            )}%`,
                          }}
                          className={`h-full rounded-full ${
                            p.stock === 0
                              ? "bg-red-500"
                              : p.stock <= 10
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={getStockStatus(p.stock)}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <button
                      disabled={updatingId === p.id}
                      onClick={() =>
                        handleUpdateStock(p)
                      }
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 disabled:opacity-50"
                    >
                      {updatingId === p.id
                        ? "Updating..."
                        : "Update Stock"}
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No inventory products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ---------------- ORDERS PAGE ----------------

function OrdersPage({ orders, search }) {
  const filtered = orders.filter((o) =>
    `${o.id} ${o.customer} ${o.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track orders from confirmation to delivery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SmallSummary
          title="Sample Orders"
          value={orders.length}
          icon={ShoppingCart}
        />

        <SmallSummary
          title="Delivered"
          value={
            orders.filter(
              (o) => o.status === "Delivered"
            ).length
          }
          icon={CheckCircle2}
        />

        <SmallSummary
          title="In Progress"
          value={
            orders.filter(
              (o) => o.status !== "Delivered"
            ).length
          }
          icon={Clock}
        />
      </div>

      <OrdersTable
        orders={filtered}
        title="All Sample Orders"
      />

      <p className="text-xs text-gray-400">
        Orders are demonstration data, not live orders.
      </p>
    </div>
  );
}

// ---------------- OTHER MODULES ----------------

function GenericPage({ page, search }) {
  const config = {
    Categories: {
      icon: Tags,
      title: "Product Categories",
      description: "Organize products into categories.",
      items: [
        "Fruits & Vegetables",
        "Dairy & Breakfast",
        "Atta, Rice & Dal",
        "Snacks & Munchies",
        "Cold Drinks & Juices",
        "Personal Care",
      ],
    },

    "Delivery Partners": {
      icon: Truck,
      title: "Delivery Partners",
      description: "Manage delivery operations.",
      items: [
        "Available Partners",
        "Assigned Deliveries",
        "Completed Deliveries",
        "Partner Performance",
      ],
    },

    Stores: {
      icon: Store,
      title: "Store Management",
      description: "Manage fulfilment locations.",
      items: [
        "QuickMart Central",
        "QuickMart North",
        "QuickMart South",
      ],
    },

    Reports: {
      icon: ChartNoAxesCombined,
      title: "Reports & Analytics",
      description: "Review business performance.",
      items: [
        "Daily Sales Report",
        "Order Fulfilment Report",
        "Inventory Movement Report",
        "Delivery Performance Report",
      ],
    },
  };

  const details = config[page] || config.Categories;
  const Icon = details.icon;

  const items = details.items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">
          {page}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {details.description}
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={27} />
        </div>

        <h2 className="mt-4 text-lg font-bold">
          {details.title}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          This module is ready for future backend integration.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="w-fit rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Icon size={20} />
            </div>

            <h3 className="mt-4 font-bold">
              {item}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Demo module
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- MAIN APP ----------------

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [orders] = useState(initialOrders);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch products from PostgreSQL backend.
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (!Array.isArray(data)) {
          throw new Error("Invalid products API response.");
        }

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Load products failed:", err);

        if (active) {
          setError(
            getApiError(
              err,
              "Unable to load products from PostgreSQL."
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  function refreshProducts() {
    setRefreshKey((value) => value + 1);
  }

  let page;

  if (activePage === "Dashboard") {
    page = (
      <Dashboard
        products={products}
        orders={orders}
        setActivePage={setActivePage}
      />
    );
  } else if (activePage === "Products") {
    page = (
      <ProductsPage
        products={products}
        setProducts={setProducts}
        search={search}
      />
    );
  } else if (activePage === "Inventory") {
    page = (
      <InventoryPage
        products={products}
        setProducts={setProducts}
        search={search}
      />
    );
  } else if (activePage === "Orders") {
    page = (
      <OrdersPage
        orders={orders}
        search={search}
      />
    );
  } else {
    page = (
      <GenericPage
        page={activePage}
        search={search}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-gray-900">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          activePage={activePage}
          search={search}
          setSearch={setSearch}
          setMobileOpen={setMobileOpen}
          onRefresh={refreshProducts}
        />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 xl:p-8">
          {loading && (
            <div className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
              Loading products from PostgreSQL...
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {!loading && page}

          <footer className="mt-10 border-t border-gray-200 py-5 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} QuickMart RMS Admin
            {" · "}
            Products & Inventory API Integration
          </footer>
        </main>
      </div>
    </div>
  );
}
