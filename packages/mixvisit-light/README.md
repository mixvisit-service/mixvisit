# MixVisitJS

> Fingerprint library for generating client fingerprint

## Demo

You can visit [mixvisit.com](https://mixvisit.com) for check our demo example

## Usage

```javascript
import { FPClient } from '@mix-visit/light';

const fpClient = new FPClient();
await fpClient.load();

console.log('time on miliseconds:>> ', fpClient.loadTime);
console.log('fingerprintHash :>> ', fpClient.fingerprintHash);
console.log('allResults :>> ', fpClient.get());
console.log('platform :>> ', fpClient.get('platform'));
```
