import './App.scss';
import './index.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/Home';
import AboutPage from './Pages/About/About';
import MembersPage from './Pages/Members/Members';
import FeedbackPage from './Pages/Contact/Contact';
import ProfilePage from './Pages/Profile/Profile';
import AdminPage from './Pages/Admin/Admin';
import LoginPage from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import TrainingModulesPage from './Pages/TrainingModules/TrainingModules';
import { ThemeProvider } from '@mui/material/styles';
import tomTheme from './Themes/TOMTheme';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login']; // Add paths where Navbar should not appear

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="main-body">{children}</div>
      <div className="footer" />
    </>
  );
};


const App = () => {

  return (
    <div className="App">
      <div>
        <ThemeProvider theme={tomTheme}>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/modules/:moduleName" element={<TrainingModulesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/contact" element={<FeedbackPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;
