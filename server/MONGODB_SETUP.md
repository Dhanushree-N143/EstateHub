# MongoDB setup for EstateHUB

## 1. Create a MongoDB database
Use MongoDB Atlas or a local MongoDB server.

For Atlas:
- Create a cluster.
- Create a database user.
- Allow your IP address in Network Access.
- Copy the Node.js connection string.

## 2. Create the environment file
From `server/`:

```bash
copy .env.example .env
```

Then edit `.env` and replace `MONGODB_URI` with your real connection string.

Example:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/estatehub?retryWrites=true&w=majority
```

Do not commit `.env` to GitHub.

## 3. Install dependencies

```bash
cd server
npm install
```

## 4. Start the backend

```bash
npm run dev
```

You should see:

```text
MongoDB connected: estatehub
Seeded 9 properties.
Seeded demo user: dhanu.shree
EstateHUB API running on http://localhost:3000
```

The seed runs only when the relevant collection is empty, so restarting the server does not duplicate the initial properties or user.

## 5. Collections created

MongoDB will contain:
- `users` — login users with hashed passwords
- `properties` — EstateHUB property data
- `bookings` — bookings linked to the logged-in username

The Angular frontend does not need to change because the existing REST endpoints remain `/api/auth/login`, `/api/properties`, and `/api/bookings`.
