import { Routes, Route } from "react-router-dom"
import { Header } from "./components/layout/Header"
import { Home } from "./pages/Home"
import { Pitch } from "./pages/Pitch"
import { Result } from "./pages/Result"
import { MyPitches } from "./pages/MyPitches"

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pitch" element={<Pitch />} />
          <Route path="/result/:resultId" element={<Result />} />
<Route path="/my" element={<MyPitches />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
