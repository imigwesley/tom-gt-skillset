import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Home/Home';
import AboutPage from './Pages/About/About';
import MembersPage from './Pages/Members/Members';
import FeedbackPage from './Pages/Contact/Contact';
import ProfilePage from './Pages/Profile/Profile';
import AdminPage from './Pages/Admin/Admin';
import LoginPage from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import TrainingModulesPage from './Pages/TrainingModules/TrainingModules';

const App = () => {

  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/modules/:moduleName" element={<TrainingModulesPage />} /> {/*TODO: workshop implementation of modules page*/}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/contact" element={<FeedbackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
