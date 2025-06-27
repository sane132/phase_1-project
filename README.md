# Jengakit Shop - E-Commerce Web Application
## 📌 Overview
Jengakit Shop is a modern, responsive e-commerce web application built with HTML, CSS, and JavaScript. It features product listings, shopping cart functionality, wishlist capabilities, and product management tools.

## ✨ Key Features
Product Catalog with search and category filtering

Shopping Cart with quantity adjustment

Wishlist functionality with local storage persistence

Product Management (Add/Edit/Delete products)

Dark Mode toggle

Responsive Design works on all devices

Interactive UI with notifications and modals

## 🛠️ Technologies Used
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: CSS Flexbox, Grid, Animations

Icons: Font Awesome

Backend: JSON Server (mock API)

Deployment: Render (for backend API)

## 🚀 Getting Started
Prerequisites
Modern web browser (Chrome, Firefox, Safari)

Node.js (for local development)

Git (for version control)

Installation
Clone the repository:

bash
git clone https://github.com/yourusername/jengakit-shop.git
cd jengakit-shop
For local development with JSON Server:

bash
npm install -g json-server
json-server --watch db.json --port 3000
Open index.html in your browser.

## 🌐 API Endpoints
The application uses a mock API with these endpoints:

GET /products - Fetch all products

POST /products - Add new product

PUT /products/:id - Update product

DELETE /products/:id - Remove product

## 🖥️ Project Structure
text
jengakit-shop/
├── index.html          # Main HTML file
├── style.css           # All CSS styles
├── script.js           # Main JavaScript file
├── db.json             # Mock database
├── README.md           # This file
└── assets/             # Image assets
🔧 Customization
To customize the products, edit the db.json file:

json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "price": "$19.99",
      "category": "electronics",
      "image": "image-url.jpg"
    }
  ]
}


## 🙏 Acknowledgments
Font Awesome for icons

Unsplash for sample product images

JSON Server for mock API functionality

## Happy Shopping! 🛍️
