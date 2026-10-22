# Auth Viewport Fix

Login and Register were redesigned around the viewport rather than a tall
full-page promotional layout.

Desktop/laptop:
- Uses a compact two-column layout.
- Designed to fit a 1366x768-style viewport without unnecessary page scrolling.
- The form card is vertically centered and uses compact spacing.
- Register is compact enough for its additional fields.

Mobile/small screens:
- The promotional panel is hidden.
- The form becomes a centered single-column card.
- Scrolling is allowed only when the device viewport genuinely requires it.

No authentication logic, backend API, MongoDB connection, or database configuration
was changed.
