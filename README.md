# E-Commerce Backend API

A scalable REST API backend for an e-commerce application built using Node.js, Express.js, MongoDB, and JWT authentication.

## Features

* User Authentication (Register/Login/Logout)
* Role-based Authorization (Admin/User)
* Product Management
* Category Management
* Product Search
* Image Upload Support
* Cloud Image Storage
* Protected Routes
* Input Validation
* Error Handling Middleware
* Cookie-based Authentication
* CRUD Operations for Products and Categories

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT Authentication
* Cookies
* Protected Middleware
* Role-based Authorization

### File Upload

* Multer
* Cloudinary

### Validation

* Joi

---

## Project Structure

```txt
backend/
│── config/
│── controllers/
│── middleware/
│── models/
│── routes/
│── uploads/
│── utils/
│── validation/
│── .env
│── .gitignore
│── app.js
│── server.js
│── package.json
```

---

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Go to the project folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your environment variables.

Example:

```env
PORT=3001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:

```bash
npm run dev
```

Server running on:

```txt
http://localhost:3001
```

---

## API Endpoints

### Authentication Routes

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |
| POST   | `/api/auth/logout`   | Logout user   |

---

### Product Routes

| Method | Endpoint                        | Description            |
| ------ | ------------------------------- | ---------------------- |
| GET    | `/api/products`                 | Get all products       |
| GET    | `/api/products/:id`             | Get single product     |
| GET    | `/api/products/search?keyword=` | Search products        |
| POST   | `/api/products`                 | Add product (Admin)    |
| PUT    | `/api/products/:id`             | Update product (Admin) |
| DELETE | `/api/products/:id`             | Delete product (Admin) |

---

### Category Routes

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/categories`     | Get all categories      |
| GET    | `/api/categories/:id` | Get single category     |
| POST   | `/api/categories`     | Create category (Admin) |
| PUT    | `/api/categories/:id` | Update category (Admin) |
| DELETE | `/api/categories/:id` | Delete category (Admin) |

---

## Authentication

This API uses JWT authentication with cookies.

Protected routes require login.

Admin-only routes are protected using authorization middleware.

---

## Validation

Request validation is handled using Joi.

Example validations:

* Product Validation
* Category Validation
* User Validation

---

## Future Improvements

* Cart System
* Order Management
* Payment Integration
* Wishlist Feature
* Product Reviews & Ratings
* Dashboard Analytics

---

## Author

Developed by Bibek Tamang

---


