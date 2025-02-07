import {defineConfig} from 'vitepress'
import {optimizeImages} from "../../src/index.mjs"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress Image Optimization",
  description: "A plugin to optimize images on a VitePress site",
  base: '/vitepress-plugin-image-optimize/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/images-examples'}
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          {text: 'Get started', link: '/get-started'},
          {text: 'Images Examples', link: '/images-examples'},
        ]
      }
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/unlocomqx/vitepress-plugin-image-optimize'}
    ]
  },

  markdown: {
    config: (md) => {
      md.use(optimizeImages({
        srcDir: 'docs',
        quality: 90,
      }))
    }
  }
})
