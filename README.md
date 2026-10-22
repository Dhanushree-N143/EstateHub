# EstateHUB — Angular + Node.js

This version migrates the original HTML/CSS/JavaScript EstateHUB prototype to:

- **Frontend:** Angular standalone components
- **Backend:** Node.js + Express
- **Authentication:** JWT-based demo login
- **Home data:** REST API served by Node/Express
- **Styling:** Preserved from the original EstateHUB design

## Project structure

```text
estatehub-angular-node/
├── client/                 # Angular application
│   ├── src/app/
│   │   ├── pages/login/
│   │   ├── pages/home/
│   │   ├── services/
│   │   └── models/
│   └── package.json
├── server/                 # Express REST API
│   ├── src/server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20+
- npm 10+

## Run the backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux use `cp .env.example .env`.

The API runs on `http://localhost:3000`.

## Run the Angular frontend

Open another terminal:

```bash
cd client
npm install
npm start
```

Angular runs on `http://localhost:4200`.

The Angular dev server proxies `/api` requests to the Node server.

## Demo login

```text
Username: dhanu.shree
Password: Estate@123
```

These are demo credentials only. Change them through the server environment before using this as a real application.

## Current scope

The Angular migration now includes **Login, Home, About Us, Properties, Communities and Bookings**. The Node/Express API provides login, protected property listings and in-memory booking CRUD for the current session. The supplied `estate.mp4` is included as the Home hero background video.

## Production note

For a production application, replace the demo in-memory user with a database, hash stored passwords with bcrypt/Argon2, rotate JWT secrets, add refresh-token/session handling, validate all API input, and configure CORS/HTTPS appropriately.

The Login page slogan is styled in gold for contrast against the navy visual panel.
