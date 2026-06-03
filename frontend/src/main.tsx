import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

// StrictMode intentionally NOT used — causes double-renders in dev that
// confuse the wallet connection + MetaMask event listeners.
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
