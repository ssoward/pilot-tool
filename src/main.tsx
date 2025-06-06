import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { calculateScrollbarWidth } from './utils/scrollbarUtils'

// Calculate scrollbar width on app initialization
calculateScrollbarWidth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
