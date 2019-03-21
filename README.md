# lingerjs

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8fe05c390a2f4415865527c48465e61e)](https://www.codacy.com/app/risadams/lingerjs)

Linger is a Javascript library that will examine a browser and build a visitor fingerprint.
This will not include any personally identifiable information, while this can be used to uniquely identify a browser--it cannot identify individual users that may be using multiple browsers.

## Usage

Include the file in your HTML page

```html
<!doctype html>
<head>
  <meta charset="utf-8">
  <title>LingerJS Test page</title>
</head>
<body>
  <script src="dist/linger.js"></script>
</body>
</html>
```

```javascript
const fingerprint = new Linger();
setTimeout(() => {
  console.info(fingerprint.Fingerprint);
}, 10);
```