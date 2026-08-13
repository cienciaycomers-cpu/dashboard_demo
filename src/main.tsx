import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { ExperienceSelector } from './app/ExperienceSelector'
import { SignalShell } from './app/SignalShell'

const path = window.location.pathname
const view = path === '/select' ? <ExperienceSelector /> : path === '/signal' ? <SignalShell /> : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {view}
  </StrictMode>,
)

// Keeps public text readable if an upstream deployment layer misreads UTF-8 as Latin-1.
const mojibakePairs: Array<[string, string]> = [
  ['\u00c3\u00a1', '\u00e1'], ['\u00c3\u00a9', '\u00e9'], ['\u00c3\u00ad', '\u00ed'],
  ['\u00c3\u00b3', '\u00f3'], ['\u00c3\u00ba', '\u00fa'], ['\u00c3\u00b1', '\u00f1'],
  ['\u00c3\u00bc', '\u00fc'], ['\u00c2\u00b7', '\u00b7'], ['\u00e2\u2020\u2017', '\u2197'],
  ['\u00e2\u2020\u2013', '\u2193'], ['\u00e2\u2020\u2018', '\u2191'], ['\u00e2\u0080\u0094', '\u2014'],
]

const repairText = (value: string) => mojibakePairs.reduce((result, [broken, correct]) => result.split(broken).join(correct), value)
const repairVisibleText = () => {
  const root = document.getElementById('root')
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeValue) node.nodeValue = repairText(node.nodeValue)
  }
}

queueMicrotask(repairVisibleText)
new MutationObserver(repairVisibleText).observe(document.getElementById('root')!, { childList: true, subtree: true, characterData: true })
