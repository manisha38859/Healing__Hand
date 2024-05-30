import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Notifications from './pages/Notifications'
import Userslist from './pages/Admin/Userslist'
import DoctorsList from './pages/Admin/DoctorsList'
import { Button } from 'antd'
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux"
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ApplyDoctor from './pages/ApplyDoctor'
import Profile from './pages/Doctor/Profile'
import UserProfile from './pages/User/UserProfile.js'
import BookAppointment from './pages/BookAppointment'
import Appointments from './pages/Appointments'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'

console.log("hello")
function App() {
  const {loading} = useSelector(state => state.alerts);
  return (
    <BrowserRouter>
      {loading && (<div className="spinner-parent">
        <div class="spinner-border" role="status">
            
        </div>
      </div>)}
      <Toaster position="top-center" reverseOrder={false}/>

      <Routes>

        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
     

       <Route path='/apply-doctor' element={<ProtectedRoute><ApplyDoctor/></ProtectedRoute>} />
       <Route path='/notifications' element={<ProtectedRoute><Notifications/></ProtectedRoute>} />
       <Route path='/admin/userslist' element={<ProtectedRoute><Userslist/></ProtectedRoute>} />
       <Route path='/admin/doctorslist' element={<ProtectedRoute><DoctorsList/></ProtectedRoute>} />
       <Route path='/doctor/profile/:userId' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
       <Route path='/user/userprofile/:userId' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
       <Route path='/book-appointment/:doctorId' element={<ProtectedRoute><BookAppointment/></ProtectedRoute>} />
       <Route path='/appointments' element={<ProtectedRoute><Appointments/></ProtectedRoute>} />
       <Route path='/doctor/appointments' element={<ProtectedRoute><DoctorAppointments/></ProtectedRoute>} />
       </Routes>
      


    </BrowserRouter>
  );
}

export default App;
