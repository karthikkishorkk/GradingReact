import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function formatTimeOnly(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toTimeString().substr(0, 5);
}

const input = "w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
const btn = "inline-flex items-center justify-center px-5 py-2.5 text-white font-medium rounded-md shadow-sm transition-colors";

export default function ModifyEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [roles, setRoles] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [assignmentMode, setAssignmentMode] = useState('manual'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch event details
        const eventRes = await fetch(`http://localhost:8085/events/${id}`);
        if (!eventRes.ok) throw new Error(`Failed to fetch event: ${eventRes.status}`);
        const eventData = await eventRes.json();
        console.log('Fetched event data:', eventData);
        setEvent(eventData);
        
        // Fetch roles for this event
        const rolesRes = await fetch(`http://localhost:8085/roles/${id}`);
        if (!rolesRes.ok) throw new Error(`Failed to fetch roles: ${rolesRes.status}`);
        const rolesData = await rolesRes.json();
        console.log('Fetched roles data:', rolesData);
        setRoles(rolesData);
        
        // Fetch all teachers
        const teachersRes = await fetch(`http://localhost:8085/teachers`);
        if (!teachersRes.ok) throw new Error(`Failed to fetch teachers: ${teachersRes.status}`);
        const teachersData = await teachersRes.json();
        console.log('Fetched teachers data:', teachersData);
        setTeachers(teachersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const submitAllChanges = async () => {
    try {
      // Check if the event object exists
      if (!event) {
        throw new Error('No event data to update');
      }
      
      // Format the event data for API
      const formattedEvent = {
        event_name: event.event_name,
        start_date: event.start_date,
        start_time: event.start_time,
        end_date: event.end_date,
        end_time: event.end_time,
        event_description: event.event_description,
      };
      
      console.log('Submitting event update:', formattedEvent);
      
      const response = await fetch(`http://localhost:8085/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedEvent),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.error || response.statusText}`);
      }
      
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const openRoleModal = (role) => {
    setSelectedRole(role);
    setSelectedTeachers([]);
    setAssignmentMode('manual');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setSelectedTeachers([]);
  };

  const toggleTeacherSelection = (teacher) => {
    // Only allow selecting up to headcount teachers
    if (selectedTeachers.includes(teacher.teacher_id)) {
      setSelectedTeachers(selectedTeachers.filter(id => id !== teacher.teacher_id));
    } else if (selectedTeachers.length < (selectedRole.role_headcount || selectedRole.head_count)) {
      setSelectedTeachers([...selectedTeachers, teacher.teacher_id]);
    }
  };

  const autoAssign = () => {
    // Check if we have the required data
    if (!teachers.length || !selectedRole) return;
    
    // Get the headcount from the role (handling different field names)
    const headcount = selectedRole.role_headcount || selectedRole.head_count;
    
    // Sort teachers by points (ascending) and select the first 'headcount' teachers
    const sortedTeachers = [...teachers].sort((a, b) => 
      (a.points || 0) - (b.points || 0)
    );
    
    const autoSelected = sortedTeachers
      .slice(0, headcount)
      .map(teacher => teacher.teacher_id);
    
    setSelectedTeachers(autoSelected);
    setAssignmentMode('auto');
  };

  const submitAssignments = async () => {
    if (!selectedRole || selectedTeachers.length === 0) {
      alert('Please select teachers to assign to this role');
      return;
    }

    try {
      console.log('Submitting teacher assignments:', {
        role_id: selectedRole.role_id || selectedRole.id,
        teacher_ids: selectedTeachers,
        event_id: parseInt(id)
      });
      
      // Create a promise for each teacher assignment
      const assignmentPromises = selectedTeachers.map(teacherId => 
        fetch('http://localhost:8085/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: parseInt(id),
            teacher_id: teacherId,
            role_id: selectedRole.role_id || selectedRole.id
          })
        })
      );

      // Wait for all assignments to complete
      const results = await Promise.all(assignmentPromises);
      
      // Check if any requests failed
      const failedRequests = results.filter(res => !res.ok);
      if (failedRequests.length > 0) {
        throw new Error(`${failedRequests.length} assignments failed`);
      }
      
      alert('Teachers assigned successfully!');
      closeModal();
    } catch (error) {
      console.error('Error assigning teachers:', error);
      alert(`Error assigning teachers: ${error.message}`);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!event) return <div className="p-6 text-gray-600">No event data found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-gray-800">Modify Event</h2>

      {/* EVENT DETAILS */}
      <div className="bg-white shadow-md rounded-lg p-6 ring-1 ring-gray-100 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input name="event_name" value={event.event_name || ''} onChange={handleEventChange} className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" name="start_date" value={event.start_date || ''} onChange={handleEventChange} className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input type="time" name="start_time" value={event.start_time || ''} onChange={handleEventChange} className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" name="end_date" value={event.end_date || ''} onChange={handleEventChange} className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input type="time" name="end_time" value={event.end_time || ''} onChange={handleEventChange} className={input} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
            <textarea name="event_description" value={event.event_description || ''} onChange={handleEventChange} rows={4} className={input} />
          </div>
        </div>
      </div>

      {/* ASSIGN ROLES SECTION */}
      <div className="bg-white shadow-md rounded-lg p-6 ring-1 ring-gray-100 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Assign Roles</h3>
        
        {roles.length === 0 ? (
          <p className="text-gray-500 italic">No roles found for this event</p>
        ) : (
          <div className="space-y-4">
            {roles.map(role => (
              <div 
                key={role.role_id || role.id} 
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => openRoleModal(role)}
              >
                <div>
                  <h4 className="font-medium text-gray-800">{role.role_name || role.name}</h4>
                  <p className="text-sm text-gray-500">
                    Points: {role.role_point || role.point} | 
                    Headcount: {role.role_headcount || role.head_count}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    type="button"
                    className={`${btn} bg-blue-600 hover:bg-blue-700`}
                  >
                    Assign Teachers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-right">
        <button 
          type="button"
          onClick={submitAllChanges} 
          className={`${btn} bg-blue-700 hover:bg-blue-800 text-lg font-semibold`}
        >
          Submit Changes
        </button>
      </div>

      {/* MODAL FOR TEACHER ASSIGNMENT */}
      {isModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Assign Teachers to "{selectedRole.role_name || selectedRole.name}"
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Required: {selectedRole.role_headcount || selectedRole.head_count} teachers | 
                Points per teacher: {selectedRole.role_point || selectedRole.point}
              </p>
            </div>
            
            <div className="p-6 flex flex-col gap-4 flex-grow overflow-auto">
              <div className="flex gap-4 mb-2">
                <button 
                  type="button"
                  className={`${btn} ${assignmentMode === 'manual' ? 'bg-blue-700' : 'bg-gray-500'}`}
                  onClick={() => setAssignmentMode('manual')}
                >
                  Manual Selection
                </button>
                <button 
                  type="button"
                  className={`${btn} ${assignmentMode === 'auto' ? 'bg-blue-700' : 'bg-gray-500'}`}
                  onClick={autoAssign}
                >
                  Auto Assign (Lowest Points)
                </button>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-4 gap-x-4 p-3 bg-gray-100 font-medium text-sm text-gray-700 border-b">
                  <div>Select</div>
                  <div>Name</div>
                  <div>Department</div>
                  <div>Current Points</div>
                </div>
                <div className="max-h-[40vh] overflow-y-auto">
                  {teachers.map(teacher => (
                    <div 
                      key={teacher.teacher_id}
                      className={`grid grid-cols-4 gap-x-4 p-3 border-b last:border-b-0 hover:bg-gray-50 ${
                        selectedTeachers.includes(teacher.teacher_id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div>
                        <input 
                          type="checkbox" 
                          checked={selectedTeachers.includes(teacher.teacher_id)}
                          onChange={() => toggleTeacherSelection(teacher)}
                          className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div>{teacher.teacher_name}</div>
                      <div>{teacher.department}</div>
                      <div>{teacher.points || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                {selectedTeachers.length}/{selectedRole.role_headcount || selectedRole.head_count} teachers selected
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={closeModal}
                className={`${btn} bg-gray-500 hover:bg-gray-600`}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={submitAssignments}
                className={`${btn} bg-green-600 hover:bg-green-700`}
                disabled={selectedTeachers.length === 0}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}