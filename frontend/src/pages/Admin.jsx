import { useState, useEffect } from 'react';
import { courtAPI, equipmentAPI, coachAPI, pricingRuleAPI } from '../services/api';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('courts');
  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courtsRes, equipmentRes, coachesRes, rulesRes] = await Promise.all([
        courtAPI.getAll(),
        equipmentAPI.getAll(),
        coachAPI.getAll(),
        pricingRuleAPI.getAll()
      ]);

      setCourts(courtsRes.data.data);
      setEquipment(equipmentRes.data.data);
      setCoaches(coachesRes.data.data);
      setPricingRules(rulesRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data', err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'courts' ? 'active' : ''}`}
          onClick={() => setActiveTab('courts')}
        >
          Courts ({courts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment ({equipment.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'coaches' ? 'active' : ''}`}
          onClick={() => setActiveTab('coaches')}
        >
          Coaches ({coaches.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing Rules ({pricingRules.length})
        </button>
      </div>

      {activeTab === 'courts' && (
        <div className="grid grid-2">
          {courts.map(court => (
            <div key={court._id} className="card admin-card">
              <h3>{court.name}</h3>
              <p><strong>Type:</strong> {court.type}</p>
              <p><strong>Base Price:</strong> ₹{court.basePrice}/hour</p>
              <p><strong>Status:</strong> {court.isActive ? 'Active' : 'Inactive'}</p>
              {court.description && <p>{court.description}</p>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="grid grid-3">
          {equipment.map(equip => (
            <div key={equip._id} className="card admin-card">
              <h3>{equip.name}</h3>
              <p><strong>Type:</strong> {equip.type}</p>
              <p><strong>Price:</strong> ₹{equip.pricePerUnit}/hour</p>
              <p><strong>Quantity:</strong> {equip.totalQuantity}</p>
              <p><strong>Status:</strong> {equip.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'coaches' && (
        <div className="grid grid-2">
          {coaches.map(coach => (
            <div key={coach._id} className="card admin-card">
              <h3>{coach.name}</h3>
              <p><strong>Email:</strong> {coach.email}</p>
              <p><strong>Phone:</strong> {coach.phone}</p>
              <p><strong>Price:</strong> ₹{coach.pricePerHour}/hour</p>
              <p><strong>Specialization:</strong> {coach.specialization}</p>
              <p><strong>Status:</strong> {coach.isActive ? 'Active' : 'Inactive'}</p>
              {coach.bio && <p className="bio">{coach.bio}</p>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="pricing-rules-list">
          {pricingRules.map(rule => (
            <div key={rule._id} className="card admin-card">
              <div className="rule-header">
                <h3>{rule.name}</h3>
                <span className={`badge ${rule.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p>{rule.description}</p>
              <div className="rule-details">
                <p><strong>Priority:</strong> {rule.priority}</p>
                <p><strong>Modifier:</strong> {rule.modifier.type === 'percentage' ? `${rule.modifier.value}%` : `₹${rule.modifier.value}`} ({rule.modifier.operation})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;