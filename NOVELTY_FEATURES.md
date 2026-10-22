# EstateHUB — Final Demo Novelty Features

## 1. Ideal Home Finder
Route: `/match`

A preference-based property matching wizard. The user selects:
- Buy / Rent / Invest
- Preferred city
- Property type
- Minimum bedrooms
- Maximum budget
- Ranking priority: Budget / Space / Location / Bedrooms

The engine filters the live property catalogue returned by the existing Node.js API, calculates a deterministic 0–99 match score, ranks the strongest matches, and displays the reasons behind each result.

No new database collection or MongoDB configuration is required.

## 2. Property Comparison Engine
Route: `/compare`

The user can select up to three properties from the existing catalogue. Properties are restricted to the same listing category for meaningful price comparison. The comparison displays:
- Price
- Property type
- City
- Community
- Bedrooms
- Bathrooms
- Area
- Transparent overall decision score

The decision score weights price (35%), area (30%), bedrooms (20%) and bathrooms (15%). The best value in each comparable metric is highlighted and the highest overall score is labelled as the recommended option.

This is a decision aid based only on EstateHUB listing facts; it is not a valuation or investment guarantee.

## Existing functionality preserved
- Authentication/JWT
- MongoDB/Mongoose connection and models
- Property catalogue/API
- Search, filter and sort
- Communities
- Favourites
- Property details
- Existing match score on catalogue cards
- Bookings and cancellation
- Login/Register UI
- Existing community stock imagery and card styling
