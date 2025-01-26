# Furniro Server

A backend server application for managing an e-commerce platform. This application handles user operations, product management, order processing, and administrative tasks.

## Features
- User authentication and authorization
- Product and category management
- Order and cart handling
- Payment gateway integration
- Admin reports and user analytics

---



### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Urvish-Asodariya/furniro_server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd furniro_server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

### Configuration
 Create a `.env` file in the root directory and provide the following variables:
   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/furniro
   CLOUDINARY_URL=your_cloudinary_url
   JWT_SECRET=your_jwt_secret
   ```

### Usage

#### Run the development server:
```bash
npm start
```

#### Run the server in watch mode:
```bash
npm run dev
```

#### Access the server:
Open your browser and go to `http://localhost:8080`.

---

## Folder Structure
```
furniro_server/
├── controller/
│   ├── admin/            # Admin-specific controllers
│   └── user/             # User-specific controllers
├── middleware/           # Middleware for authentication
├── models/               # MongoDB schemas
├── router/               # API routes
├── utils/                # Helper functions and integrations
├── validators/           # Validation logic
├── server.js             # Application entry point
├── package.json          # Project configuration
├── .env                  # Environment variables
└── .gitignore            # Ignored files

