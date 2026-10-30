
function InventoryPage({ products, setProducts, search }) {
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
      window.alert("Enter a valid non-negative whole number.");
      return;
    }

    try {
      setError("");
      setUpdatingId(product.id);

      const updatedProduct = await updateProduct(product.id, {
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock,
      });

      setProducts((current) =>
        current.map((p) =>
          p.id === product.id ? updatedProduct : p
        )
      );
    } catch (err) {
      console.error("Stock update failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update stock in PostgreSQL."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and update product stock levels.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
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
          title="Low stock items"
          value={products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          icon={AlertTriangle}
        />
        <SmallSummary
          title="Out of stock"
          value={products.filter((p) => p.stock === 0).length}
          icon={Package}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-bold">Stock overview</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Available stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold">
                    {p.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {p.category}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 font-semibold">
                        {p.stock}
                      </span>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            p.stock === 0
                              ? "bg-red-500"
                              : p.stock <= 10
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min(p.stock, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

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
                      disabled={updatingId === p.id}
                      onClick={() => handleUpdateStock(p)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 disabled:opacity-50"
                    >
                      {updatingId === p.id
                        ? "Updating..."
                        : "Update stock"}
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
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
