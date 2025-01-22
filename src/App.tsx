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
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify with the generated outputs
Amplify.configure(awsmobile);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];

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
      <ThemeProvider theme={tomTheme}>
        <BrowserRouter>
          <Authenticator hideSignUp>
            {({ signOut, user }) => (
              <>
                <h1>Hello {user?.username}</h1>
                <button onClick={signOut}>Sign out</button>
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
              </>
            )}
          </Authenticator>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
};

export default App;
