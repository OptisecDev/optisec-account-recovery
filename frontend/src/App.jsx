import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Track from './pages/Track'
import BreachCheck from './pages/BreachCheck'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/track" element={<Track />} />
        <Route path="/breach-check" element={<BreachCheck />} />
      </Routes>
    </BrowserRouter>
  )
}
