import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import Navbar from './Components/Navbar';
import Search from './Pages/Search';
import Mentor from './Pages/Mentor';
import About from './Pages/About';
import Contact from './Pages/Contact';
import ChatRoom from './Pages/ChatRoom';
import Admin from'./Pages/Admin'
import AdminEditUser from './Pages/AdminEditUser'


function App() {
  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/mentor/:id' element={<Mentor />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<Search />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/admin' element={<Admin />} />
          <Route path="/chat/:requestId" element={<ChatRoom />} />
          <Route path="/admin/edit/:id" element={<AdminEditUser />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
