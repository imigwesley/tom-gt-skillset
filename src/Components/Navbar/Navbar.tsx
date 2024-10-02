import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import './Navbar.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const initials = 'WI';
  const isAdmin = true;

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageClick = (page: string) => {
    handleClose();
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'tomWebsite':
        window.open('https://tomglobal.org/', '_blank');
        break;
      case 'members':
        navigate('/members');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        console.warn('fallthrough happened');
    }
  };

  return (
    <div className='nav-container'>
      <div className='nav-subsection clickable' onClick={() => handlePageClick('home')}>
        <Typography variant='h5'>
          Skillset - by
        </Typography>
        <img src='/tom-gt-logo.png' alt='tom logo' className='logo'/>
      </div>
      <div className='nav-subsection'>

        <IconButton onClick={handleMenuClick} disableRipple>
          <MenuIcon className='icon clickable'/>
        </IconButton>
        <div className='profile-section clickable' onClick={() => handlePageClick('profile')}>
        <Avatar>{initials}</Avatar> 
           <Typography>
              Profile
           </Typography> 
        </div>
      </div>
      <Menu
          open={isMenuOpen}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transitionDuration={10}
        >
          <MenuItem onClick={() => handlePageClick('about')}>About</MenuItem>
          <MenuItem onClick={() => handlePageClick('tomWebsite')}>TOM Website</MenuItem>
          <MenuItem onClick={() => handlePageClick('members')}>Club Directory</MenuItem>
          {isAdmin && <MenuItem onClick={() => handlePageClick('admin')}>Admin</MenuItem>}
          <MenuItem onClick={() => handlePageClick('contact')}>Contact</MenuItem>
        </Menu>
    </div>
  );
};

export default Navbar;