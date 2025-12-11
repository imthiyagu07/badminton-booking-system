import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <div className="container">
            <nav className="navbar">
              <h1>Badminton Booking</h1>
              <div className='nav-links'>
                <Link to="/">Home</Link>
                <Link to="/booking">Book Now</Link>
                <Link to="/my-bookings">My Bookings</Link>
                <Link to="/admin">Admin</Link>
              </div>
            </nav>
          </div>
        </header>

        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </main>

        <footer>
          <div className="container">
            <p>&copy; 2025 Badminton Court Booking System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;