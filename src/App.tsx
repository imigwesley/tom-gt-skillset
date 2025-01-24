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
import { Authenticator, useAuthenticator, useTheme, Button, Heading, Text, View, Image } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import './auth.scss';
import { LayoutProps } from './Types/types';

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

// Custom form fields for Authenticator (email and password only for sign-in)
const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email', // Only email required for sign-in
    },
    password: {
      label: 'Password:', // Password field
      placeholder: 'Enter your password',
    },
  },
};

const Layout = ({ children, signOutFunction, user }: LayoutProps) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar user={user} signOutFunction={signOutFunction} />}
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
          <Authenticator components={components} formFields={formFields} hideSignUp>
            {({ signOut, user }) => (
              <>
                <Layout signOutFunction={signOut} user={user}>
                  <Routes>
                    <Route path="/" element={<HomePage user={user} />} />
                    <Route path="/modules/:moduleName" element={<TrainingModulesPage user={user} />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/contact" element={<FeedbackPage />} />
                    <Route path="/profile" element={<ProfilePage user={user} />} />
                    <Route path="/admin" element={<AdminPage user={user} />} />
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
