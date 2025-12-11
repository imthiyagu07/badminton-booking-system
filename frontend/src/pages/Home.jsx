import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <h1>Welcome to Badminton Court Booking</h1>
                <p>Book your court, rent equipment, and get professional coaching - all in one place!</p>
                <Link to="/booking" className="btn btn-primary btn-lg">
                    Book a Court Now
                </Link>
            </section>

            <section className="features">
                <div className="grid grid-3">
                    <div className="feature-card card">
                        <div className="feature-icon">🏟️</div>
                        <h3>4 Premium Courts</h3>
                        <p>2 indoor and 2 outdoor courts with top-notch facilities</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">🎾</div>
                        <h3>Equipment Rental</h3>
                        <p>Quality rackets and shoes available for rent</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">👨‍🏫</div>
                        <h3>Professional Coaches</h3>
                        <p>3 experienced coaches to improve your game</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="grid grid-3">
                    <div className="step card">
                        <div className="step-number">1</div>
                        <h3>Select Court & Time</h3>
                        <p>Choose your preferred court and time slot</p>
                    </div>
                    <div className="step card">
                        <div className="step-number">2</div>
                        <h3>Add Extras</h3>
                        <p>Optionally add equipment rental or coaching</p>
                    </div>
                    <div className="step card">
                        <div className="step-number">3</div>
                        <h3>Confirm Booking</h3>
                        <p>Review pricing and complete your booking</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;