# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Backend API

Product data and product create, update, and delete operations use the `/api/products` REST endpoints through `src/services/productService.js`. Product images are selected from the device and uploaded as multipart form data to `/api/products/upload-image`; the returned URL is saved with the product. JPG, PNG, and WebP images up to 5 MB are supported.

For local development, Vite proxies `/api` to `http://localhost:5000`. Set `VITE_API_PROXY_TARGET` in a local `.env` file to use a different backend URL. For a direct frontend-to-backend connection, set `VITE_API_BASE_URL` to the API root URL, including `/api` (for example, `http://localhost:5000/api`).

The current backend does not expose `/api/orders`; the order data and the other dashboard modules remain demonstration content until those API endpoints are available.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
