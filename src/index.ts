import  {PluginWithOptions, Token} from 'markdown-it'
import  type MarkdownIt from 'markdown-it'
import * as path from 'node:path'
import * as fs from "node:fs"
import { imageSize } from 'image-size'

export const optimizeImages: () => PluginWithOptions = () => {
  return (md: MarkdownIt) => {
    const imageRule = md.renderer.rules.image!

    md.renderer.rules.image = (tokens: Token[], idx, options, env, self) => {
      const token = tokens[idx]
      let img_alt = md.utils.escapeHtml(token.content)
      let img_src = md.utils.escapeHtml(token.attrGet('src'))
      let img_title = md.utils.escapeHtml(token.attrGet('title'))
      let local = !/^https?:\/\//.test(img_src)
      if (!local) {
        return imageRule(tokens, idx, options, env, self)
      }

      const public_path = path.resolve('public')
      let img_path = path.join(public_path, img_src)
      if (img_src.startsWith('.')) {
        console.log(path.dirname(env.path))
        img_path = path.join(path.dirname(env.path), img_src)
      }

      if(!fs.existsSync(img_path)) {
        console.warn(`VitePress Image Optimize: Image not found: ${img_src}`)
        return imageRule(tokens, idx, options, env, self)
      }

      const {width, height, type} = imageSize(img_path)

      console.log(size)

      return imageRule(tokens, idx, options, env, self)
    }
  }
}
