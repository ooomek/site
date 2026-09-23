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
  {
    name: 'safe boundary fold',
    count: 1,
    before: 'fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}',
    after: 'fold(t){if(null===this.calc&&!this.start(t)){this.setState("read");return}this.setState("user_fold"),this.do(this.render.convertToPage(t))}',
  },
  {
    name: 'position-aware next-page corner',
    count: 1,
    before: 'flipNext(t){this.flip({x:this.render.getRect().left+2*this.render.getRect().pageWidth-10,y:"top"===t?1:this.render.getRect().height-2})}',
    after: 'flipNext(t){const e=this.render.getRect();this.flip({x:e.left+2*e.pageWidth-10,y:"top"===t?e.top+1:e.top+e.height-2})}',
  },
  {
    name: 'position-aware previous-page corner',
    count: 1,
    before: 'flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}',
    after: 'flipPrev(t){const e=this.render.getRect();this.flip({x:e.left+10,y:"top"===t?e.top+1:e.top+e.height-2})}',
  },
]

const occurrences = (source, snippet) => source.split(snippet).length - 1
const outputs = []

// Validate both shipped entry points before writing either. Each replacement
// may already be patched or still be original, which lets this script safely
// gain a new fix without requiring node_modules to be reinstalled first.
for (const filename of ['page-flip.browser.js', 'page-flip.module.js']) {
  const path = new URL(`dist/js/${filename}`, packageRoot)
  const original = await readFile(path, 'utf8')
  const unexpected = replacements.filter(({ before, after, count }) => {
    const originalCount = occurrences(original, before)
    const patchedCount = occurrences(original, after)
    return !(
      (originalCount === count && patchedCount === 0) ||
      (originalCount === 0 && patchedCount === count)
    )
  }).map(({ name }) => name)
  if (unexpected.length) {
    throw new Error(`Unexpected page-flip build in ${filename}: ${unexpected.join(', ')}. Refusing a partial patch.`)
  }

  let patched = original
  for (const { before, after } of replacements) patched = patched.replaceAll(before, after)
  if (patched !== original) outputs.push({ path, patched })
}

for (const { path, patched } of outputs) await writeFile(path, patched, 'utf8')
console.log(outputs.length ? 'Applied page-flip React lifecycle cleanup.' : 'page-flip lifecycle cleanup is already applied.')
