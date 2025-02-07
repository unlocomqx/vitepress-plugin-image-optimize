import {defineConfig} from 'vitepress'
import {optimizeImages} from "../src"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress Image Optimization",
  description: "A plugin to optimize images on a VitePress site",
  base: '/vitepress-plugin-image-optimize/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/markdown-examples'}
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          {text: 'Markdown Examples', link: '/markdown-examples'},
          {text: 'Runtime API Examples', link: '/api-examples'}
        ]
      }
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ]
  },

  markdown: {
    config: (md) => {
      md.use(optimizeImages({
        quality: 90
      }))
    }
  }
})
