import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { SanityProvider } from './context/SanityContext'
import App from './App'
import './styles/theme.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <SanityProvider>
        <App />
      </SanityProvider>
    </HashRouter>
  </StrictMode>
)
