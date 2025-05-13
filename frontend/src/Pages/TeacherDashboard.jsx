// import { useState, useEffect } from 'react';
// import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, LogOut, User, Menu, X } from 'lucide-react';
// import axios from 'axios';

// // Mock data
// const teacherData = {
//   id: 1,
//   name: "Dr. Sarah Johnson",
//   email: "sarah.johnson@school.edu",
//   departmentId: 2,
//   departmentName: "Science",
//   profilePhoto: "/api/placeholder/120/120",
//   userId: 5
// };

// const mockNotifications = [
//   {
//     id: 1,
//     message: "You've been assigned as a Science Fair judge",
//     timestamp: "2025-05-12T10:30:00",
//     read: false
//   },
//   {
//     id: 2,
//     message: "Staff meeting tomorrow at 8:00 AM",
//     timestamp: "2025-05-12T09:15:00",
//     read: true
//   },
//   {
//     id: 3,
//     message: "Reminder: Grade submission deadline Friday",
//     timestamp: "2025-05-11T16:45:00",
//     read: false
//   }
// ];

// function formatDate(dateString) {
//   const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
//   return new Date(dateString).toLocaleDateString('en-US', options);
// }

// function isCurrentEvent(event) {
//   const today = new Date();
//   const startDate = new Date(event.startDate);
//   const endDate = new Date(event.endDate);
  
//   // Set time to midnight for date comparison
//   today.setHours(0, 0, 0, 0);
//   startDate.setHours(0, 0, 0, 0);
//   endDate.setHours(0, 0, 0, 0);
  
//   return startDate <= today && today <= endDate;
// }

// function isPastEvent(event) {
//   const today = new Date();
//   const endDate = new Date(event.endDate);
  
//   // Set time to midnight for date comparison
//   today.setHours(0, 0, 0, 0);
//   endDate.setHours(0, 0, 0, 0);
  
//   return endDate < today;
// }

// function isFutureEvent(event) {
//   const today = new Date();
//   const startDate = new Date(event.startDate);
  
//   // Set time to midnight for date comparison
//   today.setHours(0, 0, 0, 0);
//   startDate.setHours(0, 0, 0, 0);
  
//   return startDate > today;
// }

// // Main component
// export default function TeacherDashboard() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [eventView, setEventView] = useState('current');
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:8085/events")
//       .then((res) => setEvents(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const currentEvents = events.filter(isCurrentEvent);
//   const pastEvents = events.filter(isPastEvent);
//   const futureEvents = events.filter(isFutureEvent);
//   // Filter events based on selected view
//   const filteredEvents = 
//     eventView === 'current' ? currentEvents :
//     eventView === 'past' ? pastEvents :
//     futureEvents;
    
//   // Count unread notifications
//   const unreadCount = mockNotifications.filter(n => !n.read).length;

//   useEffect(() => {
//     axios.get("http://localhost:8085/events")
//       .then((res) => setEvents(res.data))
//       .catch((err) => console.error(err));
//   }, []);
  
//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Top navigation bar */}
//       <header className="bg-blue-700 text-white shadow-md">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <button 
//               className="md:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//             <h1 className="text-xl font-bold">Teacher Dashboard</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <button 
//                 className="relative p-1 rounded-full hover:bg-blue-600"
//                 onClick={() => setShowNotifications(!showNotifications)}
//               >
//                 <Bell size={24} />
//                 {unreadCount > 0 && (
//                   <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
              
//               {/* Notifications dropdown */}
//               {showNotifications && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
//                   <div className="p-3 border-b border-gray-200">
//                     <h3 className="font-semibold">Notifications</h3>
//                   </div>
//                   <div className="max-h-64 overflow-y-auto">
//                     {mockNotifications.map(notification => (
//                       <div 
//                         key={notification.id} 
//                         className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
//                       >
//                         <p className="text-sm">{notification.message}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {new Date(notification.timestamp).toLocaleString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="p-2 text-center text-sm text-blue-600 hover:underline cursor-pointer">
//                     View all notifications
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <img 
//                 src={teacherData.profilePhoto} 
//                 alt="Profile" 
//                 className="h-8 w-8 rounded-full" 
//               />
//               <span className="hidden md:inline">{teacherData.name}</span>
//             </div>
//           </div>
//         </div>
//       </header>
      
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar navigation */}
//         <aside 
//           className={`${
//             mobileMenuOpen ? 'block' : 'hidden'
//           } md:block bg-gray-800 text-white w-64 flex-shrink-0`}
//         >
//           <nav className="mt-5 px-2">
//             <button
//               className={`group flex items-center px-4 py-3 text-sm w-full ${
//                 activeTab === 'dashboard' ? 'bg-gray-900 rounded-md' : ''
//               }`}
//               onClick={() => setActiveTab('dashboard')}
//             >
//               <Calendar className="mr-3 h-5 w-5" />
//               Dashboard
//             </button>
            
//             <button
//               className={`group flex items-center px-4 py-3 text-sm w-full ${
//                 activeTab === 'profile' ? 'bg-gray-900 rounded-md' : ''
//               }`}
//               onClick={() => setActiveTab('profile')}
//             >
//               <User className="mr-3 h-5 w-5" />
//               Profile
//             </button>
            
//             <button
//               className={`group flex items-center px-4 py-3 text-sm w-full ${
//                 activeTab === 'events' ? 'bg-gray-900 rounded-md' : ''
//               }`}
//               onClick={() => setActiveTab('events')}
//             >
//               <Calendar className="mr-3 h-5 w-5" />
//               Events
//             </button>
            
//             <button
//               className={`group flex items-center px-4 py-3 text-sm w-full ${
//                 activeTab === 'notifications' ? 'bg-gray-900 rounded-md' : ''
//               }`}
//               onClick={() => setActiveTab('notifications')}
//             >
//               <Bell className="mr-3 h-5 w-5" />
//               Notifications
//               {unreadCount > 0 && (
//                 <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>
            
//             <button className="group flex items-center px-4 py-3 text-sm w-full mt-6 text-red-300">
//               <LogOut className="mr-3 h-5 w-5" />
//               Logout
//             </button>
//           </nav>
//         </aside>
        
//         {/* Main content area */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           {activeTab === 'dashboard' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <h3 className="font-medium text-gray-700 mb-2">Current Events</h3>
//                   <p className="text-3xl font-bold">{currentEvents.length}</p>
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <h3 className="font-medium text-gray-700 mb-2">Upcoming Events</h3>
//                   <p className="text-3xl font-bold">{futureEvents.length}</p>
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <h3 className="font-medium text-gray-700 mb-2">Notifications</h3>
//                   <p className="text-3xl font-bold">{unreadCount}</p>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow">
//                 <div className="p-4 border-b border-gray-200">
//                   <h3 className="font-medium">Current Events</h3>
//                 </div>
                
//                 <div className="p-4">
//                   {currentEvents.length > 0 ? (
//                     <div className="divide-y divide-gray-200">
//                       {currentEvents.map(event => (
//                         <div key={event.id} className="py-3">
//                           <div className="flex justify-between">
//                             <h4 className="font-semibold">{event.name}</h4>
//                             <span className="text-sm text-gray-500">
//                               {formatDate(event.startDate)}
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-600 mt-1">{event.description}</p>
//                           <div className="flex items-center text-sm text-gray-500 mt-2">
//                             <Clock size={16} className="mr-1" />
//                             {event.startTime} - {event.endTime}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No current events</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'profile' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Teacher Profile</h2>
              
//               <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="md:flex">
//                   <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
//                     <div className="text-center">
//                       <img 
//                         src={teacherData.profilePhoto} 
//                         alt="Profile" 
//                         className="mx-auto h-32 w-32 rounded-full" 
//                       />
//                       <h3 className="mt-4 font-bold text-xl">{teacherData.name}</h3>
//                       <p className="text-gray-600">{teacherData.departmentName} Department</p>
//                       <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                         Change Photo
//                       </button>
//                     </div>
//                   </div>
                  
//                   <div className="md:w-2/3 p-6">
//                     <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Full Name
//                         </label>
//                         <input 
//                           type="text" 
//                           className="w-full border border-gray-300 rounded-md px-3 py-2"
//                           defaultValue={teacherData.name}
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Email Address
//                         </label>
//                         <input 
//                           type="email" 
//                           className="w-full border border-gray-300 rounded-md px-3 py-2"
//                           defaultValue={teacherData.email}
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Department
//                         </label>
//                         <select className="w-full border border-gray-300 rounded-md px-3 py-2">
//                           <option value="1">Mathematics</option>
//                           <option value="2" selected>Science</option>
//                           <option value="3">English</option>
//                           <option value="4">History</option>
//                         </select>
//                       </div>
                      
//                       <div className="pt-4">
//                         <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                           Save Changes
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'events' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold">Events</h2>
//                 <div className="flex bg-gray-200 rounded-md overflow-hidden">
//                   <button 
//                     className={`px-4 py-2 text-sm ${eventView === 'past' ? 'bg-blue-600 text-white' : ''}`}
//                     onClick={() => setEventView('past')}
//                   >
//                     Past
//                   </button>
//                   <button 
//                     className={`px-4 py-2 text-sm ${eventView === 'current' ? 'bg-blue-600 text-white' : ''}`}
//                     onClick={() => setEventView('current')}
//                   >
//                     Current
//                   </button>
//                   <button 
//                     className={`px-4 py-2 text-sm ${eventView === 'future' ? 'bg-blue-600 text-white' : ''}`}
//                     onClick={() => setEventView('future')}
//                   >
//                     Future
//                   </button>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow">
//                 <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//                   <h3 className="font-medium">
//                     {eventView === 'past' ? 'Past Events' : 
//                      eventView === 'current' ? 'Current Events' : 'Future Events'}
//                   </h3>
//                 </div>
                
//                 {filteredEvents.length > 0 ? (
//                   <div className="divide-y divide-gray-200">
//                     {filteredEvents.map(event => (
//                       <div key={event.id} className="p-4 hover:bg-gray-50">
//                         <div className="flex justify-between">
//                           <h4 className="font-semibold">{event.name}</h4>
//                           <span className="text-sm text-gray-500">
//                             {formatDate(event.startDate)}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600 mt-1">{event.description}</p>
//                         <div className="flex items-center text-sm text-gray-500 mt-2">
//                           <Clock size={16} className="mr-1" />
//                           {event.startTime} - {event.endTime}
//                         </div>
//                         <div className="mt-3 flex space-x-2">
//                           <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
//                             View Details
//                           </button>
//                           {eventView === 'future' && (
//                             <button className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">
//                               Cancel Participation
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="p-4 text-center text-gray-500">
//                     No {eventView} events found
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'notifications' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
              
//               <div className="bg-white rounded-lg shadow">
//                 <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//                   <h3 className="font-medium">All Notifications</h3>
//                   <button className="text-sm text-blue-600 hover:underline">
//                     Mark all as read
//                   </button>
//                 </div>
                
//                 <div className="divide-y divide-gray-200">
//                   {mockNotifications.map(notification => (
//                     <div 
//                       key={notification.id} 
//                       className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
//                     >
//                       <div className="flex justify-between">
//                         <p className="text-gray-800">{notification.message}</p>
//                         {!notification.read && (
//                           <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {new Date(notification.timestamp).toLocaleString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }