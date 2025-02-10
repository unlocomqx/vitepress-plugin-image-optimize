import * as path from 'node:path';
import * as fs from 'node:fs';
import sharp from 'sharp';
import {imageSize} from 'image-size';
import Queue from 'queue'

const q = new Queue({results: []})
q.autostart = true
q.concurrency = 1

q.addEventListener('success', e => {
    const [detail] = e.detail.result;
    console.info(detail.message)
})

export const optimizeImages = (user_options = {}) => {
    const options = Object.assign({
        srcDir: 'docs',
        quality: 90,
        lazyLoading: false
    }, user_options);

    const {srcDir, quality, lazyLoading} = options;

    function success(img_path, img_src, cb) {
        return (err, res) => {
            if (res) {
                const original_size = fs.statSync(img_path).size;
                const smaller = 100 - (res.size / original_size) * 100;
                res.message = `Image Optimizer: Converted ${img_src} (${smaller.toFixed(2)}% smaller)`;
            }
            cb(err, res)
        };
    }

    /**
     * @type {import('markdown-it').MarkdownIt}
     */
    return (md) => {
        const imageRule = md.renderer.rules.image;

        md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            let img_alt = md.utils.escapeHtml(token.content);
            let img_src = md.utils.escapeHtml(token.attrGet('src') || '');
            let img_title = md.utils.escapeHtml(token.attrGet('title') || '');
            let local = !/^https?:\/\//.test(img_src);
            if (!local) {
                return imageRule(tokens, idx, options, env, self);
            }

            const public_path = path.resolve(path.join(srcDir, 'public'));
            let img_path = path.join(public_path, img_src);
            if (img_src.startsWith('.')) {
                img_path = path.join(path.dirname(env.path), img_src);
            }

            if (!fs.existsSync(img_path)) {
                console.warn(`VitePress Image Optimize: Image not found: ${img_path}`);
                return imageRule(tokens, idx, options, env, self);
            }

            const {width, height, type} = imageSize(img_path);
            let scale = 1;
            if (img_src.includes('@2x')) {
                scale = 2;
            }

            if (!width || !height || !type) {
                console.warn(`VitePress Image Optimize: Image size could not be determined: ${img_src}`);
                return imageRule(tokens, idx, options, env, self);
            }

            const dist = path.resolve(path.join(public_path, 'webp'));
            fs.mkdirSync(dist, {recursive: true});

            const mtime = fs.statSync(img_path).mtime;
            const dist_webp = `${path.join(dist, img_src)}-${quality}-${mtime.getTime()}.webp`;

            if (!fs.existsSync(dist_webp)) {
                // hacky way to make the file available immediately
                // md.renderer.rules.image won't work with async
                fs.copyFileSync(img_path, dist_webp);
                // noinspection JSIgnoredPromiseFromCall
                q.push((cb) => {
                    console.log('Image Optimizer: Converting', img_src)
                    sharp(img_path)
                        .webp({quality})
                        .toFile(dist_webp, success(img_path, img_src, cb))
                });
            }

            const dist_webp_1x = dist_webp.replace('@2x', '');
            if (scale === 2) {
                if (!fs.existsSync(dist_webp_1x)) {
                    // hacky way to make the file available immediately
                    // md.renderer.rules.image won't work with async
                    fs.copyFileSync(dist_webp, dist_webp_1x);
                    // noinspection JSIgnoredPromiseFromCall
                    q.push((cb) => {
                        console.log('Image Optimizer: Converting to 1x', img_src)
                        sharp(img_path)
                            .resize({
                                width: Math.ceil(width / 2)
                            })
                            .webp({quality})
                            .toFile(dist_webp_1x, success(img_path, img_src, cb))
                    });
                }
            }

            let style_width = `${width}px;`;
            if (scale === 2) {
                style_width = `${width / 2}px;`;
            }

            return `
                <img 
                  src="${scale === 1 ? dist_webp.replace(public_path, '') : dist_webp_1x.replace(public_path, '')}" 
                  ${scale === 2 ? `srcset="${dist_webp_1x.replace(public_path, '')} 1x, ${dist_webp.replace(public_path, '')} 2x"` : ''}
                  alt="${img_alt}" 
                  title="${img_title}" 
                  width="${width}" 
                  height="${height}" 
                  ${lazyLoading ? 'loading="lazy"' : ''}
                  style="width: ${style_width};" 
                />
              `;
        };
    };
};
