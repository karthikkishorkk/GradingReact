import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function formatDate(dateTimeStr) {
  if (!dateTimeStr) return '';
  const d = new Date(dateTimeStr);
  return d.toISOString().split('T')[0];
}

const formatTimeOnly = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const d = new Date(dateTimeStr);
  return d.toISOString().substr(11, 8); // Extracts just the time part (HH:MM:SS)
};


function formatTime(dateTimeStr) {
  if (!dateTimeStr) return '';
  const d = new Date(dateTimeStr);
  return d.toISOString().substr(11, 5); 
}


function ModifyEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newRoles, setNewRoles] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8085/events/${id}`) 
      .then(res => res.json())
      .then(data => setEvent(data));

    fetch(`http://localhost:8085/teachers`)
      .then(res => res.json())
      .then(data => setTeachers(data));

    fetch(`http://localhost:8085/roles/${id}`)
      .then(res => res.json())
      .then(data => setRoles(data));
  }, [id]);

  const handleEventChange = (e) => {
    const { name, value, type } = e.target;
  
    if ((type === 'date' || type === 'time') && value === '') return;
  
    setEvent({ ...event, [name]: value });
  };
  

  const handleNewRoleChange = (index, e) => {
    const updated = [...newRoles];
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    updated[index] = { ...updated[index], [e.target.name]: value };
    setNewRoles(updated);
  };

  const addNewRole = () => {
    const tempId = `temp-${Date.now()}`;
    setNewRoles([...newRoles, {
      role_id: tempId, 
      role_name: '',
      role_point: 0,
      role_headcount: 1
    }]);
  };

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index] = { ...updated[index], [field]: value };
    setAssignments(updated);
  };

  const addAssignment = () => {
    setAssignments([...assignments, {}]);
  };

  const submitAllChanges = async () => {
    try {
      console.log('Sending event:', );
      console.log('Sending new roles:', JSON.stringify(newRoles));
      console.log('Sending assignments:', JSON.stringify(assignments));

      const formattedEvent = {
        event_name: event.event_name,
        start_date: formatDate(event.start_date),
        start_time: formatTime(event.start_time),
        end_date: formatDate(event.end_date),
        end_time: formatTime(event.end_time),
        event_description: event.event_description,
      };
      
      // 1. Update event
      const eventRes = await fetch(`http://localhost:8085/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedEvent),
      });

      if (!eventRes.ok) throw new Error('Failed to update event');

      // 2. Create new roles and refresh roles list
        for (const role of newRoles) {
            const roleWithEvent = { ...role, event_id: parseInt(id) };
            const res = await fetch(`http://localhost:8085/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roleWithEvent),
            });
            if (!res.ok) throw new Error('Failed to create role');
        }
        
        // Refresh roles so newly created ones show up in dropdown
        const updatedRoles = await fetch(`http://localhost:8085/roles/${id}`)
            .then(res => res.json());
        setRoles(updatedRoles);
  

      // 3. Assign teachers
      // inside submitAllChanges, safely parse teacher_id and role_id
      for (const a of assignments) {
        await fetch('http://localhost:8085/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: parseInt(id),
            teacher_id: parseInt(a.teacher_id),
            role_id: parseInt(a.role_id),
          }),
        });
      }


      alert('All changes submitted!');
      setNewRoles([]);
      setAssignments([]);

      // Optionally refresh data
      fetch(`http://localhost:8085/roles/${id}`)
        .then(res => res.json())
        .then(data => setRoles(data));

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Modify Event</h2>

      <div className="space-y-2">
      <input name="event_name" value={event.event_name} onChange={handleEventChange} className="border p-2 w-full" />
        <input
          type="date"
          name="start_date"
          value={formatDate(event.start_date)}
          onChange={handleEventChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="time"
          name="start_time"
          value={formatTimeOnly(event.start_time)}  // Using formatTimeOnly here
          onChange={handleEventChange}
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="end_date"
          value={formatDate(event.end_date)}
          onChange={handleEventChange}
          className="border p-2 w-full"
        />
        <input
          type="time"
          name="end_time"
          value={formatTimeOnly(event.end_time)}  // Using formatTimeOnly here
          onChange={handleEventChange}
          className="border p-2 w-full"
        />
        <textarea name="event_description" value={event.event_description} onChange={handleEventChange} className="border p-2 w-full" />
      </div>

      <div>
        <h3 className="text-xl font-semibold">New Roles</h3>
        {newRoles.map((role, index) => (
          <div key={role.role_id || index} className="space-y-2 border p-4 rounded bg-gray-50">
            <input
              name="role_name"
              placeholder="Role Name"
              value={role.role_name}
              onChange={(e) => handleNewRoleChange(index, e)}
              className="border p-2 w-full"
            />
            <input
              name="role_point"
              placeholder="Points"
              type="number"
              value={Number.isFinite(role.role_point) ? role.role_point : 0} // ✅ Avoid NaN
              onChange={(e) => handleNewRoleChange(index, e)}
              className="border p-2 w-full"
            />
            <input
              name="role_headcount"
              placeholder="Headcount"
              type="number"
              value={Number.isFinite(role.role_headcount) ? role.role_headcount : 1} // ✅ Avoid NaN
              onChange={(e) => handleNewRoleChange(index, e)}
              className="border p-2 w-full"
            />
            <button
              onClick={() => {
                const roleWithTempId = {
                  ...role,
                  role_id: role.role_id || `temp-${Date.now() + index}`,
                };
                setRoles(prev => [...prev, roleWithTempId]);
              }}
              className="bg-yellow-500 text-white px-4 py-1 rounded"
            >
              Save Role
            </button>
          </div>
        ))}
        <button
        onClick={addNewRole}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
        + Add Role
        </button>

      </div>

      <div>
        <h3 className="text-xl font-semibold">Teacher Assignments</h3>
        {assignments.map((a, idx) => (
          <div key={idx} className="flex space-x-2 mb-2">
            <select
              value={a.teacher_id || ''}
              onChange={(e) => handleAssignmentChange(idx, 'teacher_id', e.target.value)}
              className="border p-2"
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={`teacher-${t.teacher_id}`} value={t.teacher_id}>
                  {t.teacher_name}
                </option>
              ))}
            </select>
            <select
              value={a.role_id || ''}
              onChange={(e) => handleAssignmentChange(idx, 'role_id', e.target.value)}
              className="border p-2"
            >
              <option value="">Select Role</option>
              {roles.map(r => <option key={r.role_id} value={r.role_id}>{r.role_name}</option>)}
            </select>
          </div>
        ))}
        <button onClick={addAssignment} className="bg-gray-500 text-white px-4 py-2 mr-2">+ Add Assignment</button>
      </div>

      <button onClick={submitAllChanges} className="bg-blue-700 text-white px-6 py-3 rounded text-lg">
        Submit All Changes
      </button>
    </div>
  );
}

export default ModifyEvent;
