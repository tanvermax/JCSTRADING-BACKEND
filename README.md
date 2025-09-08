# Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system, built with Express.js and Mongoose. This project facilitates core financial operations like sending, adding, and withdrawing money, with distinct roles for users, agents, and administrators.

<hr>

## 🚀 Features

* **JWT-based Authentication**: Secure user login with JSON Web Tokens.
* **Role-based Authorization**: Differentiated access for `admin`, `user`, and `agent` roles.
* **Secure Password Hashing**: Passwords are securely stored using `bcrypt`.
* **Automated Wallet Creation**: A wallet is automatically created for each user and agent upon registration, with an initial balance of ৳50.
* **Transactional Logic**:
    * **Users**: Can send money, withdraw funds, and view their transaction history.
    * **Agents**: Can add money (cash-in) to user wallets and view their own transaction history.
    * **Admins**: Have full visibility and control, able to view all users, agents, wallets, and transactions. They can also block user wallets and approve agents.
* **Robust API Endpoints**: RESTful and well-defined endpoints for all functionalities.
* **Modular Architecture**: The codebase is organized into modules (`auth`, `user`, `agent`, `transaction`, `admin`), ensuring clarity and scalability.

<hr>

## 🛠️ Technology Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB, Mongoose
* **Security**: JSON Web Tokens (JWT), `bcrypt.js`

<hr>

## 📂 Project Structure

The project follows a clean, modular architecture to promote maintainability and separation of concerns.

```plaintext
digital-wallet-api/
├── src/
│   ├── modules/
│   │   ├── admin/
│   │   ├── agent/
│   │   ├── auth/
│   │   ├── transaction/
│   │   └── user/
│   ├── middlewares/
│   ├── config/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json