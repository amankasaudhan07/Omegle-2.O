import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { ThemeProvider } from "./components/layout/ThemeProvider.jsx";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
      </Provider>
    </ThemeProvider>
  // </StrictMode>,
)
