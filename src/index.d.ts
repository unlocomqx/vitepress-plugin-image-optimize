declare module 'vitepress-plugin-image-optimize' {
  type ImageOptimizeOptions = {
    srcDir: string
    quality: number
  }

  export function optimizeImages(options?: ImageOptimizeOptions): any
}
