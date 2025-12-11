import { useState } from 'react';
import { bookingAPI } from '../services/api';
import './MyBookings.css';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await bookingAPI.getAll();
      const allBookings = response.data.data;
      const userBookings = allBookings.filter(b => b.customerEmail.toLowerCase() === email.toLowerCase());
      setBookings(userBookings);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancel(bookingId);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      alert('Booking cancelled successfully');
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      cancelled: 'badge-danger',
      completed: 'badge-primary'
    };
    return `badge ${badges[status] || 'badge-primary'}`;
  };

  return (
    <div className="my-bookings-page">
      <h1>My Bookings</h1>

      <div className="card search-section">
        <h2>Search Your Bookings</h2>
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <label>Enter your email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search Bookings'}
          </button>
        </form>
      </div>

      {error && <div className="error card">{error}</div>}

      {searched && bookings.length === 0 && (
        <div className="card">
          <p>No bookings found for this email address.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="bookings-list">
          <h2>Your Bookings ({bookings.length})</h2>
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card card">
              <div className="booking-header">
                <h3>{booking.court.name}</h3>
                <span className={getStatusBadge(booking.status)}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <strong>Date:</strong> {formatDate(booking.date)}
                </div>
                <div className="detail-item">
                  <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                </div>
                <div className="detail-item">
                  <strong>Duration:</strong> {booking.duration} hour(s)
                </div>
                {booking.coach && (
                  <div className="detail-item">
                    <strong>Coach:</strong> {booking.coach.name}
                  </div>
                )}
                {booking.equipment.length > 0 && (
                  <div className="detail-item">
                    <strong>Equipment:</strong>
                    <ul>
                      {booking.equipment.map((eq, idx) => (
                        <li key={idx}>
                          {eq.item.name} x {eq.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="booking-pricing">
                <div className="price-row">
                  <span>Court:</span>
                  <span>₹{booking.pricing.courtPrice}</span>
                </div>
                {booking.pricing.equipmentPrice > 0 && (
                  <div className="price-row">
                    <span>Equipment:</span>
                    <span>₹{booking.pricing.equipmentPrice}</span>
                  </div>
                )}
                {booking.pricing.coachPrice > 0 && (
                  <div className="price-row">
                    <span>Coach:</span>
                    <span>₹{booking.pricing.coachPrice}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total:</span>
                  <span>₹{booking.pricing.totalPrice}</span>
                </div>
              </div>

              {booking.status === 'confirmed' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;