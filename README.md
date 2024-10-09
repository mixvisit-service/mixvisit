# MixVisitJS

> Fingerprint library for generating client fingerprint

## Demo

You can visit [mixvisit.com](https://mixvisit.com) for check our demo example

## Usage

```javascript
import { MixVisit } from '@mix-visit/lite';

const mixvisit = new MixVisit();
await mixvisit.load();

console.log('time on miliseconds:>> ', mixvisit.loadTime);
console.log('fingerprintHash :>> ', mixvisit.fingerprintHash);
console.log('allResults :>> ', mixvisit.get());
console.log('platform :>> ', mixvisit.get('platform'));
```

## Project info

The project uses [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage all projects, share code between them, and other capabilities.

Current workspace names for projects:
- packages/lite - @mix-visit/lite
- example - @mix-visit/example

## Commands

`yarn install` - installs all project dependencies <br>
`yarn build` - builds all projects <br>
`yarn build:example` - build only example playground site <br>
`yarn build:lite` - build only MixVisit lib <br>
`yarn dev:example` - running vite dev with enabling HMR for example playground site <br>
`yarn dev:lite` - running vite dev with enabling HMR for MixVisit lib

The build results are stored mainly in the `./dist` folder.

For commands specific to a project, use `yarn workspace`:

- `yarn workspace <workspace_name> add <package_name>` - installs a package for the specified project
- `yarn workspace <workspace_name> run <script_name>` - runs a script for the specified project

Example of installing the vite package for package/lite:
`yarn workspace @mix-visit/lite add vite`
