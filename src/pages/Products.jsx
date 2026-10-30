
function ProductsPage({ products, setProducts, search }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Grocery",
    price: "",
    stock: "",
  });

  const filtered = products.filter((product) =>
    `${product.id} ${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function handleAddProduct(event) {
    event.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isSafeInteger(stock) ||
      stock < 0
    ) {
      setError("Please enter valid product details.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newProduct = await createProduct({
        name: form.name.trim(),
        category: form.category,
        price,
        stock,
      });

      setProducts((current) => [...current, newProduct]);

      setForm({
        name: "",
        category: "Grocery",
        price: "",
        stock: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Create product failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save product in PostgreSQL."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Delete this product permanently?")) {
      return;
    }

    try {
      setError("");

      await deleteProductApi(id);

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );
    } catch (err) {
      console.error("Delete product failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete product."
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalogue.
          </p>
        </div>

        <button
          onClick={() => setShowForm((open) => !open)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          {showForm ? <X size={17} /> : <Plus size={17} />}
          {showForm ? "Cancel" : "Add product"}
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2 xl:grid-cols-5"
        >
          <label className="text-sm font-medium text-gray-700">
            Product name
            <input
              required
              maxLength={150}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="e.g. Fresh apples"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Category
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              {[
                "Grocery",
                "Dairy",
                "Fruits",
                "Vegetables",
                "Snacks",
                "Beverages",
                "Staples",
              ].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Price (₹)
            <input
              required
              type="number"
              min="0"
              max="99999999.99"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
              placeholder="0.00"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Stock quantity
            <input
              required
              type="number"
              min="0"
              max="2147483647"
              step="1"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5"
              placeholder="0"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SmallSummary
          title="Total products"
          value={products.length}
          icon={Package}
        />
        <SmallSummary
          title="Low stock"
          value={products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          icon={AlertTriangle}
        />
        <SmallSummary
          title="Out of stock"
          value={products.filter((p) => p.stock === 0).length}
          icon={Boxes}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-bold text-gray-900">
            Product catalogue
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">
                      {p.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PRD-{String(p.id).padStart(3, "0")}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {p.category}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {money(p.price)}
                  </td>

                  <td className="px-5 py-4">{p.stock}</td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={
                        p.stock === 0
                          ? "Out of Stock"
                          : p.stock <= 10
                          ? "Low Stock"
                          : "In Stock"
                      }
                    />
                  </td>

                  <td className="px-5 py-4">
                    <button
                      title="Delete product"
                      onClick={() => handleDeleteProduct(p.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
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
