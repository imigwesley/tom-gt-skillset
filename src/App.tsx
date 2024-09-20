import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/Landing/Landing';
import AboutPage from './Pages/About/About';
import MembersPage from './Pages/Members/Members';
import FeedbackPage from './Pages/Feedback/Feedback';
import ProfilePage from './Pages/Profile/Profile';
import AdminPage from './Pages/Admin/Admin';
import LoginPage from './Pages/Login/Login';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/modules" element={<TrainingModulesPage />} /> */} {/*TODO: workshop implementation of modules page*/}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
