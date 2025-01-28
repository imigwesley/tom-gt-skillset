import './App.scss';
import './index.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/Home';
import AboutPage from './Pages/About/About';
import MembersPage from './Pages/Members/Members';
import FeedbackPage from './Pages/Contact/Contact';
import ProfilePage from './Pages/Profile/Profile';
import AdminPage from './Pages/Admin/Admin';
import Navbar from './Components/Navbar/Navbar';
import TrainingModulesPage from './Pages/TrainingModules/TrainingModules';
import { ThemeProvider } from '@mui/material/styles';
import tomTheme from './Themes/TOMTheme';
import { Authenticator, useAuthenticator, useTheme, Button, Heading, View, Image } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import './auth.scss';


// Configure Amplify with the generated outputs
Amplify.configure(awsmobile);

const components = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.small}>
        <p>Skillset</p>
        <Image alt='Tom GT Logo' src='/tom-gt-logo.png' />
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading level={3} style={{textAlign: 'center', paddingTop: '19px'}}>
          Sign in to Your Account
        </Heading>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();
      return (
        <View textAlign="center">
          <Button fontWeight="normal" onClick={toForgotPassword} size="small" variation="link">
            Forgot Password?
          </Button>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
    },
    password: {
      label: 'Password:',
      placeholder: 'Enter your password',
    },
  },
};

const App = () => {

  return (
    <div className="App">
       <ThemeProvider theme={tomTheme}>
         <BrowserRouter>
            <Authenticator components={components} formFields={formFields} hideSignUp>
              {({ signOut, user }) => (
                <AppContent
                  signOut={signOut}
                  loggedUser={user}
                />
              )}
            </Authenticator>
          </BrowserRouter>
       </ThemeProvider>
     </div>
  );
};

const AppContent = ({ signOut, loggedUser }: any) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && (
        <Navbar signOutFunction={signOut} loggedInUser={loggedUser} />
      )}
      <div className="main-body">
        <Routes>
          <Route path="/" element={<HomePage loggedInUser={loggedUser} />} />
          <Route path="/modules/:moduleName" element={<TrainingModulesPage loggedInUser={loggedUser} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/contact" element={<FeedbackPage loggedInUser={loggedUser} />} />
          <Route path="/profile" element={<ProfilePage loggedInUser={loggedUser} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
      <div className="footer" />
    </>
  );
};


export default App;
