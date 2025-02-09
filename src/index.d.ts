declare module 'vitepress-plugin-image-optimize' {
  type ImageOptimizeOptions = {
    srcDir?: string
    quality?: number
    lazyLoading?: boolean
  }

  export function optimizeImages(options?: ImageOptimizeOptions): any
}
