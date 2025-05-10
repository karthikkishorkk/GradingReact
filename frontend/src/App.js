import './App.css'
import Home from './Pages/Home'
import CreateEventForm from './Pages/CreateEventForm';
import CreateTeacher from './Pages/CreateTeacher';
import EventList from './Pages/EventList';
import ModifyEvent from './Pages/ModifyEvent';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const router = createBrowserRouter([
  { path: "/", element: <Home/> },
  { path: "/create-event", element: <CreateEventForm/> },
  { path: "/create-teacher", element: <CreateTeacher/> },
  { path: "/events", element: <EventList/> },
  { path: "/modify-event/:id", element: <ModifyEvent/> },
]);

function App() {
  return <RouterProvider router={router} />;
}


export default App