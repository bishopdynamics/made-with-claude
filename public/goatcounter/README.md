# Self-hosted GoatCounter script

`count.v5.js` is a byte-identical copy of GoatCounter's versioned tracking script. Serving it from this site keeps the page free of third-party script origins; the only outbound analytics request is the count beacon to `https://bishopdynamics.goatcounter.com/count`. The file header releases it under the ISC license.

Versioned GoatCounter scripts never change, and GoatCounter guarantees the `/count` endpoint stays compatible with every existing version, so updates are manual and optional.

| File | Bytes | SHA-256 | SHA-384 (matches GoatCounter's published SRI) | Source |
| --- | ---: | --- | --- | --- |
| `count.v5.js` | 8996 | `9e4391f5c18cb24de433b6ef31d8b1f1c85ee41c6f0ad274b28664168063725a` | `sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ` | [Upstream](https://gc.zgo.at/count.v5.js), v5 released 2025-06-09 |

Verify after any refresh:

```sh
openssl dgst -sha384 -binary public/goatcounter/count.v5.js | openssl base64 -A
```
