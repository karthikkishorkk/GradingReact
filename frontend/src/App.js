import './App.css'
import Home from './Pages/Home'
import CreateEventForm from './Pages/CreateEventForm';
import CreateTeacher from './Pages/CreateTeacher';
import EventList from './Pages/EventList';
import ModifyEvent from './Pages/ModifyEvent';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
// import TeacherDashboard from './Pages/TeacherDashboard';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const router = createBrowserRouter([
  { path: "/", element: <Signup/> },  
  { path: "/login", element: <Login/> },
  { path: "/create-event", element: <CreateEventForm/> },
  { path: "/create-teacher", element: <CreateTeacher/> },
  { path: "/events", element: <EventList/> },
  { path: "/modify-event/:id", element: <ModifyEvent/> },
  // { path: "/teacher-dashboard", element: <TeacherDashboard/> },
]);

function App() {
  return <RouterProvider router={router} />;
}


export default App