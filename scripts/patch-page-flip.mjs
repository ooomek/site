import { readFile, writeFile } from 'node:fs/promises'

// page-flip 2.0.7 leaves a recursive animation frame running after destroy().
// Keep this narrowly scoped patch here so npm ci restores the React lifecycle
// fix without replacing browser globals or adding a second dependency.
const packageRoot = new URL('../node_modules/page-flip/', import.meta.url)
const { version } = JSON.parse(await readFile(new URL('package.json', packageRoot), 'utf8'))
if (version !== '2.0.7') {
  throw new Error(`The page-flip lifecycle patch requires 2.0.7; found ${version}. Review the patch before upgrading.`)
}

const replacements = [
  {
    name: 'cancellable animation frame',
    count: 1,
    before: 'start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}',
    after: 'start(){this.ebookRenderStopped=false;this.update();const t=e=>{if(this.ebookRenderStopped)return;this.render(e);if(!this.ebookRenderStopped)this.ebookAnimationFrame=requestAnimationFrame(t)};this.ebookAnimationFrame=requestAnimationFrame(t)}stop(){this.ebookRenderStopped=true;cancelAnimationFrame(this.ebookAnimationFrame);this.animation=null}',
  },
  {
    name: 'page-flip destruction',
    count: 1,
    before: 'destroy(){this.ui.destroy(),this.block.remove()}',
    after: 'destroy(){this.ebookDestroyed=true;clearTimeout(this.ebookInitTimer);if(this.render)this.render.stop();if(this.ui)this.ui.destroy();this.block.remove()}',
  },
  {
    name: 'UI destruction and resize cleanup',
    count: 1,
    before: 'destroy(){this.app.getSettings().useMouseEvents&&this.removeHandlers(),this.distElement.remove(),this.wrapper.remove()}',
    after: 'destroy(){this.ebookDestroyed=true;this.touchPoint=null;clearTimeout(this.ebookTouchTimer);this.removeHandlers();this.distElement.remove();this.wrapper.remove()}',
  },
  {
    name: 'delayed touch guard',
    count: 1,
    before: 'setTimeout(()=>{null!==this.touchPoint&&this.app.startUserTouch(i)},this.swipeTimeout)',
    after: 'this.ebookTouchTimer=setTimeout(()=>{null!==this.touchPoint&&!this.ebookDestroyed&&this.app.startUserTouch(i)},this.swipeTimeout)',
  },
  {
    name: 'delayed initialization guard',
    count: 2,
    before: 'setTimeout(()=>{this.ui.update(),this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)',
    after: 'this.ebookInitTimer=setTimeout(()=>{if(!this.ebookDestroyed){this.ui.update();this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})}},1)',
  },
]

const occurrences = (source, snippet) => source.split(snippet).length - 1
const outputs = []

// Validate both shipped entry points before writing either. A partial patch or
// an unexpected package build must fail installation instead of silently losing
// cleanup. Fully patched files are accepted so repeated installs are harmless.
for (const filename of ['page-flip.browser.js', 'page-flip.module.js']) {
  const path = new URL(`dist/js/${filename}`, packageRoot)
  const original = await readFile(path, 'utf8')
  const originalMatches = replacements.every(({ before, after, count }) =>
    occurrences(original, before) === count && occurrences(original, after) === 0,
  )
  const patchedMatches = replacements.every(({ before, after, count }) =>
    occurrences(original, before) === 0 && occurrences(original, after) === count,
  )

  if (patchedMatches) continue
  if (!originalMatches) {
    const unexpected = replacements.filter(({ before, after, count }) =>
      occurrences(original, before) !== count || occurrences(original, after) !== 0,
    ).map(({ name }) => name)
    throw new Error(`Unexpected page-flip build in ${filename}: ${unexpected.join(', ')}. Refusing a partial patch.`)
  }

  let patched = original
  for (const { before, after } of replacements) patched = patched.replaceAll(before, after)
  outputs.push({ path, patched })
}

for (const { path, patched } of outputs) await writeFile(path, patched, 'utf8')
console.log(outputs.length ? 'Applied page-flip React lifecycle cleanup.' : 'page-flip lifecycle cleanup is already applied.')
