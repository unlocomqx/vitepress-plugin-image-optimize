# vitepress-plugin-image-optimize

A plugin to convert and resize images in VitePress.

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
        srcDir: "docs", // Default: "docs"
        quality: 90 // Default: 90
      }))
    }
  }
})
```
