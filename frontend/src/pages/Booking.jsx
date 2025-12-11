import { useState, useEffect } from 'react';
import { courtAPI, equipmentAPI, coachAPI, bookingAPI } from '../services/api';
import './Booking.css';

function Booking() {
    const [step, setStep] = useState(1);
    const [courts, setCourts] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        courtId: '',
        date: '',
        startTime: '',
        endTime: '',
        equipment: [],
        coachId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: ''
    });

    const [selectedEquipment, setSelectedEquipment] = useState({});
    const [priceBreakdown, setPriceBreakdown] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [courtsRes, equipmentRes, coachesRes] = await Promise.all([
                courtAPI.getAll(),
                equipmentAPI.getAll(),
                coachAPI.getAll()
            ]);

            setCourts(courtsRes.data.data);
            setEquipment(equipmentRes.data.data);
            setCoaches(coachesRes.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load data');
            setLoading(false);
        }
    };

    const validateStep1 = () => {
        if (!formData.courtId || !formData.date || !formData.startTime || !formData.endTime) {
            setError('Please fill in all required fields');
            return false;
        }
        if (formData.startTime >= formData.endTime) {
            setError('End time must be after start time');
            return false;
        }
        setError('');
        return true;
    };

    const handleEquipmentChange = (equipId, quantity) => {
        const qty = parseInt(quantity) || 0;
        if (qty > 0) {
            setSelectedEquipment({ ...selectedEquipment, [equipId]: qty });
        } else {
            const newSelected = { ...selectedEquipment };
            delete newSelected[equipId];
            setSelectedEquipment(newSelected);
        }
    };

    const goToStep2 = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const goToStep3 = () => {
        const equipmentArray = Object.entries(selectedEquipment).map(([item, quantity]) => ({
            item,
            quantity
        }));
        setFormData({ ...formData, equipment: equipmentArray });
        setStep(3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await bookingAPI.create(formData);
            setSuccess('Booking created successfully!');
            setPriceBreakdown(response.data.data.pricing);
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    if (loading && courts.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="booking-page">
            <h1>Book Your Court</h1>

            <div className="booking-steps">
                <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Court & Time</div>
                <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Add-ons</div>
                <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3. Your Details</div>
                <div className={`step-indicator ${step >= 4 ? 'active' : ''}`}>4. Confirmation</div>
            </div>

            {error && <div className="error card">{error}</div>}
            {success && <div className="success card">{success}</div>}

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="card">
                        <h2>Select Court and Time</h2>

                        <div className="input-group">
                            <label>Court *</label>
                            <select
                                value={formData.courtId}
                                onChange={(e) => setFormData({ ...formData, courtId: e.target.value })}
                                required
                            >
                                <option value="">Select a court</option>
                                {courts.map(court => (
                                    <option key={court._id} value={court._id}>
                                        {court.name} - {court.type} (₹{court.basePrice}/hour)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="grid grid-2">
                            <div className="input-group">
                                <label>Start Time *</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>End Time *</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button type="button" className="btn btn-primary" onClick={goToStep2}>
                            Next: Add-ons
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="card">
                        <h2>Add Equipment or Coach (Optional)</h2>

                        <div className="input-group">
                            <label>Equipment (Optional)</label>
                            <div className="equipment-list">
                                {equipment.map(equip => (
                                    <div key={equip._id} className="equipment-item">
                                        <div className="equipment-info">
                                            <strong>{equip.name}</strong>
                                            <span className="equipment-price">₹{equip.pricePerUnit}/hour</span>
                                            <span className="equipment-stock">Available: {equip.totalQuantity}</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            max={equip.totalQuantity}
                                            placeholder="Qty"
                                            value={selectedEquipment[equip._id] || ''}
                                            onChange={(e) => handleEquipmentChange(equip._id, e.target.value)}
                                            className="equipment-quantity"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Coach (Optional)</label>
                            <select
                                value={formData.coachId}
                                onChange={(e) => setFormData({ ...formData, coachId: e.target.value })}
                            >
                                <option value="">No coach needed</option>
                                {coaches.map(coach => (
                                    <option key={coach._id} value={coach._id}>
                                        {coach.name} - ₹{coach.pricePerHour}/hour
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="btn-group">
                            <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button type="button" className="btn btn-primary" onClick={goToStep3}>
                                Next: Your Details
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="card">
                        <h2>Your Contact Information</h2>

                        <div className="input-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Phone *</label>
                            <input
                                type="tel"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any special requests?"
                            />
                        </div>

                        <div className="btn-group">
                            <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && priceBreakdown && (
                    <div className="card success-card">
                        <h2>Booking Confirmed!</h2>
                        <div className="price-breakdown">
                            <h3>Price Breakdown</h3>
                            <div className="price-item">
                                <span>Court Price:</span>
                                <span>₹{priceBreakdown.courtPrice}</span>
                            </div>
                            {priceBreakdown.equipmentPrice > 0 && (
                                <div className="price-item">
                                    <span>Equipment:</span>
                                    <span>₹{priceBreakdown.equipmentPrice}</span>
                                </div>
                            )}
                            {priceBreakdown.coachPrice > 0 && (
                                <div className="price-item">
                                    <span>Coach:</span>
                                    <span>₹{priceBreakdown.coachPrice}</span>
                                </div>
                            )}
                            <div className="price-item total">
                                <span>Total:</span>
                                <span>₹{priceBreakdown.totalPrice}</span>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => window.location.href = '/'}>
                            Back to Home
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Booking;