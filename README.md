# The Chakna Point Customer App

This is the customer-side PWA version of The Chakna Point.

Features:
- Firebase real phone OTP
- Menu/cart
- Delivery charge ₹30
- Address + current location
- COD/UPI selection
- Orders written to Firestore `orders`

Firebase web phone auth requires the site's domain to be added under Firebase Authentication > Settings > Authorized domains. For local testing, serve this folder through a local web server; opening `index.html` directly can break Firebase/reCAPTCHA.

Important: Firestore Security Rules must be configured before production use. The customer app should only be allowed to create/read its own orders.
