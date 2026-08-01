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
