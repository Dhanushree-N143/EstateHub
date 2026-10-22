# EstateHUB – Final Demo Update

## What was updated
- MongoDB connection/configuration was left unchanged.
- Added registration with bcrypt password hashing.
- Made Remember Me functional using localStorage/sessionStorage.
- Added global JWT 401 handling and automatic redirect to Login.
- Fixed Community → Properties city filtering.
- Added property detail pages.
- Added My Favourites view.
- Added future-date and duplicate-booking validation.
- Added preference-based Property Match Score.
- Expanded the catalogue to 30 properties across Madurai, Chennai, Bengaluru and Coimbatore.
- Added property images to the catalogue and detail pages.
- Added View Details and Book Viewing actions.
- Removed the non-functional Forgot Password action and replaced it with an administrator-support message.

## Run
### Backend
```powershell
cd server
npm install
npm start
```

### Frontend
Open a second terminal:
```powershell
cd client
npm install
npm start
```

Open `http://localhost:4200`.

## MongoDB
The original `server/.env` is intentionally not included in this updated archive because it contains credentials. Keep your existing working `server/.env` beside `server/.env.example` when running the project.

## Demo flow
Login/Register → Home → Search/Filter → Communities → Properties → Property Details → Favourite/Match → Book Viewing → My Bookings → Cancel Booking.

Property images use remote Unsplash CDN URLs, so the demo machine needs internet access for the images to load.
