import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import './Navbar.scss';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MemberInformation } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';
import { NavbarProps } from '../../Types/props';

const Navbar = ({ signOutFunction, loggedInUser }: NavbarProps) => {
  
  const [initials, setInitials] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      setInitials(tempCurrUser?.identifiers?.name?.split(" ").map((n)=>n[0]).join(''));
      setIsAdmin(tempCurrUser?.roles?.isAdmin)
    }
    fetchData();
  }, [])


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
        if (location.pathname === '/') {
          window.location.reload();
        } else {
          navigate('/');
        }
        break;
      // case 'about':
      //   navigate('/about');
      //   break;
      // case 'tomWebsite':
      //   window.open('https://tomglobal.org/', '_blank');
      //   break;
      case 'members':
        navigate('/members');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'submissions':
        navigate('/submissions');
        break;
      // case 'contact':
      //   navigate('/contact');
      //   break;
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
        <Tooltip 
          disableInteractive
          title='Menu'
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -20],
                  },
                },
              ],
            },
          }}
        >
          <IconButton onClick={handleMenuClick} disableRipple>
            <MenuIcon className='icon clickable'/>
          </IconButton>
        </Tooltip>
        <div className='profile-section clickable' onClick={() => handlePageClick('profile')}>
          <Avatar>
            <>
              {initials}
            </>
          </Avatar> 
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
          <MenuItem onClick={() => handlePageClick('home')}>Home</MenuItem>
          {/* <MenuItem onClick={() => handlePageClick('about')}>About</MenuItem> */}
          {/* <MenuItem onClick={() => handlePageClick('tomWebsite')}>TOM Website</MenuItem> */}
          <MenuItem onClick={() => handlePageClick('members')}>Club Directory</MenuItem>
          <MenuItem onClick={() => handlePageClick('submissions')}>Review Submissions</MenuItem>
          {isAdmin && <MenuItem onClick={() => handlePageClick('admin')}>Admin</MenuItem>}
          {/* <MenuItem onClick={() => handlePageClick('contact')}>Contact</MenuItem> */}
          <MenuItem onClick={signOutFunction}>Sign Out</MenuItem>
        </Menu>
    </div>
  );
};

export default Navbar;