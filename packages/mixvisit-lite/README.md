# MixVisitJS

> Fingerprint library for generating client fingerprint

## Demo

You can visit [mixvisit.com](https://mixvisit.com) for check our demo example

## Install

At first install MixvisitJS package

```bash 
# with npm package manager
npm install @mix-visit/lite

# with yarn package manager
yarn add @mix-visit/lite

# with pnpm package manager
pnpm add @mix-visit/lite
```

## Usage

After installation, you can use the module. Import the main `MixVisit` class and the `ClientData` type.

```typescript
import { MixVisit, type ClientData } from '@mix-visit/lite';
```

First, create an instance of `MixVisit` for usage.

```typescript
const mixvisit = new MixVisit();
```

For example, collect all data except `geolocation`, with a timeout of 700 ms for asynchronous parameters. Then, use `get` method to retrieve all collected client data and save it in the `data` variable.

```typescript
await mixvisit.load({ exclude: ['geolocation'], timeout: 700 });
const data: ClientData = mixvisit.get();
```

Suppose that after we need this `geolocation` parameter, we also need the `webrtc` parameter that was not loaded due to a timeout. The `load` method with the `only` option executes with a maximum timeout of 12 seconds. This option loads only the specified parameters. After that, when requesting all data, the `geolocation` and `webrtc` parameters will be included.

```typescript
await mixvisit.load({ only: ['geolocation', 'webrtc'] });
const extendedData = mixvisit.get();
```

After you have loaded the parameters using the `load` method, the properties `loadTime` and `fingerprintHash` become available. 
The `loadTime` property stores the time of the last `load` function execution. The `fingerprintHash` property contains the generated fingerprint hash.

```typescript
const loadTime = mixvisit.loadTime;
const hash = mixvisit.fingerprintHash;
```

You can also retrieve the loaded parameters using the `get()` method. If you want to retrieve all client data, call the `get()` method without options. If you need a specific parameter, pass its name as a string. To get multiple parameters, provide an array with the required parameters.

```typescript
const allClientData = mixvisit.get();
const platform = mixvisit.get('platform');
const { location, geolocation, webrtc } = mixvisit.get(['location', 'geolocation', 'webrtc']);
```
