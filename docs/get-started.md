# Get started

## Installation

```bash
pnpm add -D vitepress-plugin-image-optimize
```

## Usage

```js
// .vitepress/config.ts

import {optimizeImages} from "vitepress-plugin-image-optimize";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // ..... your existing VitePress config

  markdown: {
    config: (md) => {
      md.use(optimizeImages({
        quality: 90 // Default: 90
      }))
    }
  }
})
```
