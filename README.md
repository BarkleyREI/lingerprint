# Lingerprint

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8fe05c390a2f4415865527c48465e61e)](https://www.codacy.com/app/risadams/lingerprintjs)

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=risadams/lingerprint)](https://dependabot.com)

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

Build the fingerprint
```javascript
const fingerprint = new lingerprint();
setTimeout(() => {
  console.info(fingerprint.Fingerprint);
}, 10);
```

Get Individual values
```javascript
const fingerprint = new lingerprint();
setTimeout(() => {
  console.info(fingerprint.Components);
}, 10);
```

Example output
```
136724f40ce66116891d46d8d737ae417105243d6b2d4972b13649fc4442cf55e76075691c9c9ff695387c8447c7dfdf60fd270d3378a1a865862301b63e968f47ef22482af9847c186e0a062df9d7c99ad03e5d89c29db042c9610c551512208ad898b4bac8f020fafcf2a450e872876a75add73ff4b99fb529de4ee495f3f031e6bad65742f913d44d4fe9444bad25a53d0c4d9902cfd518feaab5c09a66429888e4b2cb58bf8f6f551b1f32d4547a3a2348d4c2adf88f68fed222074f1581132f9c5292b8b72777d9eb223ef6cf75222ad409fc61a00f3468e4cc66bfa015a0df669137f0f1aeee78e776e031d9151bd31c60aa3dabe085218ea52d072174d4cba005e23fbad9e233889425d6d7a58c000b31d629a34e313bdc89dbba0a302820700d671ecb9573c5ab0ebbb43979e5bf47932a842c678a4e1076aa0543518e8a64e19e3d593d280669054465765cb39392a1c6f4c06822c753a63243e81d7d17a9bd280c546a2b501336b5d48c422036e495f0b5d37b48fc98881d176d679cf4e4c7539e438e3251082cd9dadf3916e080b0840a9371a1d7f257d3580f40f2d96a181a2dc9bd3fb5072f056a815d9fed0378cfdcf8d280a138cdc8bd178b071350854144b8f2cc28e99078b3544b860fb08dae7543dfeff8e2886d80fedf816c5d0a2953199791ae128d8b6f36476e7733bcb29fe2e5cde88a9f2e5f1b7419e01b5e539cf7ac996a9b66ebb5e305
```
