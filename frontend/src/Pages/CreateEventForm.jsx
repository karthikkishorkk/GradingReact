import React, { useState } from 'react';

export default function CreateEventForm() {
  const [event, setEvent] = useState({
    event_name: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    event_description: '',
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8085/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Event created with ID: ' + data.event_id);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="event_name" placeholder="Event Name" value={event.event_name} onChange={handleChange} required />
        <input type="date" name="start_date" value={event.start_date} onChange={handleChange} required />
        <input type="time" name="start_time" value={event.start_time} onChange={handleChange} required />
        <input type="date" name="end_date" value={event.end_date} onChange={handleChange} required />
        <input type="time" name="end_time" value={event.end_time} onChange={handleChange} required />
        <textarea name="event_description" placeholder="Event Description" value={event.event_description} onChange={handleChange} required />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
