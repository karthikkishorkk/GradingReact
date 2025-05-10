import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8085/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.ID}
            className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/modify-event/${event.event_id}`)}
          >
            <h2 className="text-lg font-semibold">{event.event_name}</h2>
            <p className="text-sm">{event.event_description}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
