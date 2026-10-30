import api from "./api.js";

function getResponseData(response) {
  const body = response.data;

  if (body && typeof body === "object" && body.success === false) {
    throw new Error(body.message || body.error || "The products API returned an error.");
  }

  return body && typeof body === "object" && "data" in body
    ? body.data
    : body;
}

function normalizeProduct(product) {
  if (
    !product ||
    typeof product !== "object" ||
    product.id === undefined ||
    typeof product.name !== "string" ||
    typeof product.category !== "string"
  ) {
    throw new Error("The products API returned an invalid product.");
  }

  const price = Number(product.price);
  const stock = Number(product.stock);

  if (!Number.isFinite(price) || !Number.isSafeInteger(stock)) {
    throw new Error("The products API returned an invalid price or stock quantity.");
  }

  return {
    ...product,
    price,
    stock,
  };
}

export async function getProducts() {
  const response = await api.get("/products");
  const data = getResponseData(response);

  if (!Array.isArray(data)) {
    throw new Error("The products API did not return a product list.");
  }

  return data.map(normalizeProduct);
}

export async function createProduct(productInput) {
  const response = await api.post("/products", productInput);
  const data = getResponseData(response);

  if (!data) {
    throw new Error("The products API did not return the created product.");
  }

  return normalizeProduct(data);
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/products/upload-image", formData);
  const imageUrl =
    response.data?.image_url ?? response.data?.data?.image_url;

  if (typeof imageUrl !== "string" || imageUrl.length === 0) {
    throw new Error("The image upload API did not return an image URL.");
  }

  return imageUrl;
}

export async function updateProduct(id, productInput) {
  const response = await api.put(
    `/products/${encodeURIComponent(id)}`,
    productInput
  );
  const data = getResponseData(response);

  if (!data) {
    return normalizeProduct({ id, ...productInput });
  }

  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  await api.delete(`/products/${encodeURIComponent(id)}`);
}
