
import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "../services/productService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const API_ORIGIN = /^https?:\/\//i.test(API_BASE_URL)
  ? API_BASE_URL.replace(/\/api\/?$/, "")
  : window.location.origin;

const getImageSrc = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function ProductForm({
  product = null,
  onSaved,
  onCancel,
}) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(
    product?.category || ""
  );
  const [description, setDescription] = useState(
    product?.description || ""
  );
  const [price, setPrice] = useState(
    product?.price ?? ""
  );
  const [stock, setStock] = useState(
    product?.stock ?? ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    getImageSrc(product?.image_url)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!preview.startsWith("blob:")) {
      return undefined;
    }

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const validImage =
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
      ["jpg", "jpeg", "png", "webp"].includes(extension);

    if (!validImage) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !category.trim() ||
      !description.trim() ||
      (!imageFile && !product?.image_url) ||
      price === "" ||
      stock === ""
    ) {
      setError("Fill all required fields and choose a product image.");
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setError("Enter a valid price and stock quantity");
      return;
    }

    try {
      setSaving(true);
      const imageUrl = imageFile
        ? await uploadProductImage(imageFile)
        : product.image_url;

      const payload = {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        image_url: imageUrl,
        price: numericPrice,
        stock: numericStock,
      };

      let savedProduct;
      if (product?.id) {
        savedProduct = await updateProduct(product.id, payload);
      } else {
        savedProduct = await createProduct(payload);
      }

      onSaved?.(savedProduct);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6"
    >
      <h2 className="text-xl font-bold">
        {product ? "Edit Product" : "Add New Product"}
      </h2>

      {error && (
        <p className="rounded bg-red-50 p-3 text-red-600">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block font-medium">
          Product Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={150}
          required
          className="w-full rounded-lg border p-3"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select Category</option>
          <option value="Grocery">Grocery</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Dairy">Dairy</option>
          <option value="Staples">Staples</option>
          <option value="Snacks">Snacks</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Product Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          required
          rows={3}
          className="w-full rounded-lg border p-3"
          placeholder="Enter product description"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Product Image *
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-emerald-50 file:px-4 file:py-3 file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          Select a JPG, PNG, or WebP image up to 5 MB.
        </p>

        {preview && (
          <img
            src={preview}
            alt={`${name || "Product"} preview`}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
            onLoad={(event) => {
              event.currentTarget.hidden = false;
            }}
            className="mt-3 h-32 w-32 rounded-lg object-cover"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-medium">
            Price (₹) *
          </label>
          <input
            type="number"
            min="0"
            max="99999999.99"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            max="2147483647"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : product
              ? "Update Product"
              : "Save Product"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-5 py-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
