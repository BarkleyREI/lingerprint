# Lingerprint

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8fe05c390a2f4415865527c48465e61e)](https://www.codacy.com/app/risadams/lingerprintjs)

lingerprint is a Javascript library that will examine a browser and build a visitor fingerprint.
This will not include any personally identifiable information, while this can be used to uniquely identify a browser--it cannot identify individual users that may be using multiple browsers.

## Usage

Include the file in your HTML page

```html
<!doctype html>
<head>
  <meta charset="utf-8">
  <title>lingerprintJS Test page</title>
</head>
<body>
  <script src="dist/lingerprint.js"></script>
</body>
</html>
```

```javascript
const fingerprint = new lingerprint();
setTimeout(() => {
  console.info(fingerprint.Fingerprint);
}, 10);
```