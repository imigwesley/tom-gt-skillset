import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import './Navbar.scss';

const Navbar = () => {

  const initials = 'WI';


  return (
    <div className='nav-container'>
      <div className='nav-subsection clickable'>
        <p>
          Skillset - by
        </p>
        <img src='/tom-gt-logo.png' alt='tom logo' className='logo'/>
      </div>
      <div className='nav-subsection'>
        <MenuIcon className='icon clickable'/>
        <div className='profile-section clickable'>
        <Avatar>{initials}</Avatar> 
           <div>
              Profile
           </div> 
        </div>
      </div>
    </div>
  );
};

export default Navbar;