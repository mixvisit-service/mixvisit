# MixVisitJS

> Fingerprint library for generating client fingerprint

## Demo

You can visit [mixvisit.com](https://mixvisit.com) for check our demo example

## Usage

```javascript
import { MixVisit } from '@mix-visit/light';

const mixvisit = new MixVisit();
await mixvisit.load();

console.log('time on miliseconds:>> ', mixvisit.loadTime);
console.log('fingerprintHash :>> ', mixvisit.fingerprintHash);
console.log('allResults :>> ', mixvisit.get());
console.log('platform :>> ', mixvisit.get('platform'));
```
