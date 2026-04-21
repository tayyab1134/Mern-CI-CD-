import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    doctorId: '',
    date: '',
    time: '',
    note: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsRes, appointmentsRes] = await Promise.all([
          fetch(`${API_BASE}/api/doctors`),
          fetch(`${API_BASE}/api/appointments`)
        ]);

        if (!doctorsRes.ok || !appointmentsRes.ok) {
          throw new Error('Failed to load data from server');
        }

        const [doctorsData, appointmentsData] = await Promise.all([
          doctorsRes.json(),
          appointmentsRes.json()
        ]);

        setDoctors(doctorsData);
        setAppointments(appointmentsData);
      } catch (error) {
        setSubmitState({ status: 'error', message: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredDoctors = useMemo(() => doctors.slice(0, 3), [doctors]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'loading', message: 'Booking your appointment...' });

    try {
      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to book appointment');
      }

      setAppointments((prev) => [data, ...prev]);
      setSubmitState({ status: 'success', message: 'Appointment booked successfully.' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        doctorId: '',
        date: '',
        time: '',
        note: ''
      });
    } catch (error) {
      setSubmitState({ status: 'error', message: error.message });
    }
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#home">MedCare</a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#doctors">Doctors</a>
          <a href="#book">Appointments</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="cta-link" href="tel:+923001234567">Call: +92 300 1234567</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">Trusted Care, Beautifully Delivered</p>
          <h1>Find The Right Doctor And Book In Seconds</h1>
          <p className="hero-copy">
            Modern appointment management for families, professionals, and everyone who values
            stress-free healthcare.
          </p>
          <a className="primary-btn" href="#book">Schedule Appointment</a>
        </div>
      </section>

      <main>
        <section className="section doctors-section" id="doctors">
          <div className="section-head">
            <h2>Featured Specialists</h2>
            <p>Carefully selected experts across major specialties.</p>
          </div>

          {loading ? (
            <p>Loading doctors...</p>
          ) : (
            <div className="doctor-grid">
              {featuredDoctors.map((doctor) => (
                <article className="doctor-card" key={doctor.id}>
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                  <div className="doctor-meta">
                    <h3>{doctor.name}</h3>
                    <p>{doctor.speciality}</p>
                    <span>{doctor.experience} experience</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section spotlight">
          <div className="spotlight-image">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
              alt="Professional doctor team"
            />
          </div>
          <div className="spotlight-content">
            <h2>Human-Focused Healthcare</h2>
            <p>
              From routine checkups to specialist consults, our doctors combine medical excellence
              with compassionate communication. Your health journey deserves both precision and care.
            </p>
          </div>
        </section>

        <section className="section booking" id="book">
          <div className="section-head">
            <h2>Book Your Appointment</h2>
            <p>Complete the form and reserve your preferred slot.</p>
          </div>

          <form onSubmit={onSubmit} className="booking-form">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={onChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={onChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={onChange}
              required
            />
            <select name="doctorId" value={formData.doctorId} onChange={onChange} required>
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.speciality}
                </option>
              ))}
            </select>
            <input type="date" name="date" value={formData.date} onChange={onChange} required />
            <input type="time" name="time" value={formData.time} onChange={onChange} required />
            <textarea
              name="note"
              placeholder="Additional Note"
              value={formData.note}
              onChange={onChange}
              rows={4}
            />
            <button className="primary-btn" type="submit" disabled={submitState.status === 'loading'}>
              {submitState.status === 'loading' ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>

          {submitState.message && (
            <p className={`form-feedback ${submitState.status}`}>{submitState.message}</p>
          )}
        </section>

        <section className="section appointments">
          <div className="section-head">
            <h2>Recent Bookings</h2>
            <p>See latest confirmed appointments from the system.</p>
          </div>

          {appointments.length === 0 ? (
            <p>No appointments yet. Be the first to book.</p>
          ) : (
            <div className="appointment-list">
              {appointments.slice(0, 5).map((appointment) => (
                <article className="appointment-item" key={appointment.id}>
                  <h3>{appointment.name}</h3>
                  <p>
                    {appointment.doctorName} | {appointment.date} at {appointment.time}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-grid">
          <div>
            <h3>MedCare</h3>
            <p>
              Personalized healthcare access with trusted doctors, smooth scheduling, and a
              patient-first support team.
            </p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#doctors">Doctors</a>
              <a href="#book">Book Appointment</a>
            </div>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Email: support@medcare.com</p>
            <p>Phone: +92 300 1234567</p>
            <p>Hours: Mon - Sat, 9:00 AM - 8:00 PM</p>
          </div>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} MedCare. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
