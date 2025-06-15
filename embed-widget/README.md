# Beat Store Widget

This widget displays beats from the local server and provides PayPal buttons for purchases. A simple Node.js server (`server.js`) handles beat uploads and serves the API.

## Files

- `beat-store.js` – Client code that loads beats from `/api/beats`.
- `style.css` – Styles for the beat list.
- `demo.html` – Example page that loads the widget and PayPal SDK.
- `admin.html` – Page for uploading new beats.

## Usage

1. Start the server with `node server.js`.
2. Open `http://localhost:3000/admin` to upload beats.
3. Embed the widget in any page:

```html
<link rel="stylesheet" href="/embed-widget/style.css">
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
<div id="beat-store"></div>
<script src="/embed-widget/beat-store.js"></script>
<script>
  renderBeatStore('beat-store');
</script>
```

Uploaded audio files will be served from `/uploads` and stored in `beats.json`.
