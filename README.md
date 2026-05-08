# De Origen Coffee Shop

A multi-template Node.js/Express web application for a coffee shop website.  
This repository includes the same website implemented in four variants:

- **`html/`**: static HTML version
- **`pug/`**: Express + Pug version
- **`hdb/`**: Express + Handlebars version
- **`ejs/`**: Express + EJS version (includes MongoDB-backed data endpoints)

## Features

- Multi-page coffee shop site:
  - Home
  - Categories
  - About Us
  - Contact
- Shared assets across variants (CSS, product images, icons, videos)
- Template engine comparisons (Pug, Handlebars, EJS)
- REST-style data endpoints in EJS version (`/data`) for products and categories

## Project Structure

```text
.
├── html/   # Static site
├── pug/    # Express app using Pug templates
├── hdb/    # Express app using Handlebars templates
└── ejs/    # Express app using EJS templates + MongoDB models/routes
```

## Requirements

- Node.js 18+ recommended
- npm
- For `ejs/` only: a MongoDB connection string in `.env`

## Running Each Version

Each implementation is self-contained and has its own `package.json`.

### 1) Static HTML

No server is required. Open `html/index.html` in your browser.

### 2) Pug version

```bash
cd pug
npm install
npm start
```

Default URL: `http://localhost:4040`

### 3) Handlebars version (`hdb`)

```bash
cd hdb
npm install
npm start
```

Default URL: `http://localhost:8080`

### 4) EJS version

```bash
cd ejs
npm install
npm start
```

Default URL: `http://localhost:3030`

#### EJS environment setup

Create `ejs/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3030
```

## EJS Data API

The EJS app exposes a `/data` route for MongoDB documents:

- `GET /data` → returns all products and categories
- `POST /data` → inserts products/categories from request body
- `PUT /data` → updates by `_id`
- `DELETE /data` → removes all products and categories

Expected body keys for write operations:

- `productData` (array)
- `categoryData` (array)

## Notes

- Ports can be overridden with environment variable `PORT`.
- Static files are served from each variant's `public/` folder (or `html/` for static files).
- The styles are already compiled to CSS (`main.css`) in each variant.

## License

This project does not currently specify a license.
