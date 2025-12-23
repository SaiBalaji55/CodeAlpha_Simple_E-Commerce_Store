# CodeAlpha Simple E-Commerce Store

A full-stack **MERN e-commerce web application** that allows users to browse products, add items to a cart, and place orders, while admins can manage products securely.

---

##  Features

###  User Features
- User registration & login
- View products with images
- Add products to cart
- Update cart quantities
- Place orders
- Order data stored in MongoDB

### Admin Features
- Admin-only product management
- Add products with name, price, image, and description
- Admin panel visible only for admin users

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage (cart & session)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Project Structure

CodeAlpha_SIMPLE E-COMMERCE STORE
│
├── backend
│ ├── models
│ │ ├── User.js
│ │ ├── Product.js
│ │ └── Order.js
│ ├── routes
│ │ ├── userRoutes.js
│ │ ├── productRoutes.js
│ │ └── orderRoutes.js
│ └── server.js
│
├── frontend
│ ├── css
│ │ └── style.css
│ ├── js
│ │ └── script.js
│ ├── index.html
│ ├── cart.html
│ ├── login.html
│ └── register.html
│
└── README.md



---

##  Order Flow (Important)

- Products are added to cart with **MongoDB `_id`**
- Orders store:
  - `userId` (ObjectId)
  - `productId` (ObjectId)
  - quantity & price
- Backend validates all ObjectIds before saving

---

##  Setup Instructions

###  Clone the repository
```bash
git clone https://github.com/your-username/CodeAlpha-Simple-Ecommerce-Store.git

## Install backend dependencies
```
cd backend

npm install
```

```
npm start
```
