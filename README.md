# Beaded Bliss - Handmade Bracelet E-commerce Website

## Overview
Beaded Bliss is a colorful, playful e-commerce website for a bracelet brand run by a 9th-grade student. The website showcases handmade bracelets, allows customers to add items to their cart, write reviews, and complete the checkout process.

## Features
- **Product Gallery**: Displays 12 different bracelet designs, each priced at ₹40.
- **Shopping Cart**: Add/remove items, update quantity, view total, and checkout.
- **Ratings & Reviews**: Star ratings under products and customer review submission (stored in browser local storage).
- **Checkout Process**: UPI QR code for payment and a payment confirmation form.
- **Responsive Design**: Mobile-friendly layout with a cute, girly aesthetic.

## Technical Details
- **Frontend Only**: Built with HTML, CSS, and JavaScript with Bootstrap.
- **Local Storage**: Cart and reviews are saved in the browser's local storage.
- **No Backend Required**: Can be hosted on GitHub Pages.

## How to Use
1. Open `index.html` in your web browser to view the website.
2. Browse the bracelet collection and click "Add to Cart" for items you want to purchase.
3. Click the cart icon in the navigation bar to view your cart.
4. Click "Proceed to Checkout" to complete your purchase.
5. Scan the UPI QR code to make payment and fill out the order form.

## Google Sheet Integration
To connect the order form to a Google Sheet:

1. Create a new Google Sheet with columns for: Name, Address, UPI Reference, Message, Order Details, Total, Date.
2. Go to Extensions > Apps Script in your Google Sheet.
3. Replace the code with the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Format the order items into a readable string
  var orderItems = "";
  data.items.forEach(function(item) {
    orderItems += item.name + " (" + item.quantity + "), ";
  });
  
  // Add the order to the sheet
  sheet.appendRow([
    data.name,
    data.address,
    data.upiRef,
    data.message,
    orderItems,
    "₹" + data.total,
    new Date(data.date)
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy the script as a web app:
   - Click Deploy > New deployment
   - Select type: Web app
   - Set "Who has access" to "Anyone"
   - Click Deploy
   - Copy the web app URL

5. Update the `sendOrderToGoogleSheet` function in `script.js` with your web app URL:

```javascript
function sendOrderToGoogleSheet(order) {
  fetch('YOUR_GOOGLE_SCRIPT_WEB_APP_URL', {
    method: 'POST',
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(data => console.log('Order sent successfully'))
  .catch(error => console.error('Error sending order:', error));
}
```

## Customization
- **Images**: Replace the placeholder SVG images in the `images` folder with actual bracelet photos.
- **Colors**: Modify the color variables in the `:root` section of `styles.css` to change the color scheme.
- **Content**: Update the "Meet the Maker" section and contact information in `index.html`.

## Credits
- Built with [Bootstrap](https://getbootstrap.com/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)