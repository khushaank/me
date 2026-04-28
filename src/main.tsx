import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import { QueryProvider } from "@/providers/query-provider"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <QueryProvider>
      <App />
    </QueryProvider>
  </HashRouter>,
)
