declare module 'vitepress-plugin-image-optimize' {
  type ImageOptimizeOptions = {
    quality: number
  }

  export function optimizeImages(options?: ImageOptimizeOptions): any
}
