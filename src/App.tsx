import './App.scss';
import './index.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './Pages/Home/Home';
import AboutPage from './Pages/About/About';
import MembersPage from './Pages/Members/Members';
import FeedbackPage from './Pages/Contact/Contact';
import ProfilePage from './Pages/Profile/Profile';
import AdminPage from './Pages/Admin/Admin';
import Navbar from './Components/Navbar/Navbar';
import TrainingModulesPage from './Pages/TrainingActivities/TrainingActivities';
import { ThemeProvider } from '@mui/material/styles';
import tomTheme from './Themes/TOMTheme';
import { Authenticator, useAuthenticator, useTheme, Button, Heading, View, Image } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import './auth.scss';
import { signUp, SignUpInput } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { ImageCacheProvider } from './ImageCacheContext';
import SubmissionsPage from './Pages/Submissions/Submissions';

Amplify.configure(awsmobile);

const App = () => {
  const components = {
    Header() {
      const { tokens } = useTheme();
      return (
        <View textAlign="center" padding={tokens.space.small}>
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
  
    SignUp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading level={3} style={{textAlign: 'center', paddingTop: '19px'}}>
            Create Your Skillset Account
          </Heading>
        );
      }
    }
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
    signUp: {
      email: {
        order:1
      },
      password: {
        order: 2
      },
      confirm_password: {
        order: 3
      },
    }
  };

  const services = {
    async handleSignUp(input: SignUpInput) {
      const { username, password, options } = input;
      const signUpResponse = await signUp({
        username: options?.userAttributes.email as string,
        password,
      });
      return signUpResponse;
    },
  };

  // const location = useLocation();

  return (
    <div className="App">
       <ThemeProvider theme={tomTheme}>
         <BrowserRouter>
            <Authenticator components={components} formFields={formFields} services={services} initialState='signIn'>
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
  
  const rerenderPage = () => {
    window.location.reload();
  }

  return (
    <>
      {(location.pathname !== '/login') && (
        <Navbar signOutFunction={signOut} loggedInUser={loggedUser} />
      )}
      <ImageCacheProvider>
        <div className="main-body">
          <Routes>
            <Route path="/" element={<HomePage loggedInUser={loggedUser} onUserCreation={rerenderPage}/>} />
            <Route path="/activities/:activityName" element={<TrainingModulesPage loggedInUser={loggedUser} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/contact" element={<FeedbackPage loggedInUser={loggedUser} />} />
            <Route path="/profile" element={<ProfilePage loggedInUser={loggedUser} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/submissions" element={<SubmissionsPage loggedInUser={loggedUser} />} />
          </Routes>
        </div>
      </ImageCacheProvider>
      <div className="footer" />
    </>
  );
};


export default App;
