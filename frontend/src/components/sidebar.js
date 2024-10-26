import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import BiotechIcon from '@mui/icons-material/Biotech';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';

const usersData = [
  {
    name: "Charlse Henry",
    email: "charlsehenry@gmail.com"
  }
];

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { link: '/dashboard/diseases', label: 'Diseases', icon: CoronavirusIcon },
  { link: '/dashboard/diagnosis-results', label: 'Diagnosis Results', icon: BiotechIcon },
  { link: '/dashboard/registered-users', label: 'Users', icon: PersonIcon },
  { link: '/dashboard/community', label: 'Community', icon: GroupIcon },
  { link: '/dashboard/support', label: 'Support', icon: SupportAgentIcon },
];

export function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const currentPath = location.pathname;
  const { name, email } = usersData[0];

  const links = data.map((item) => {
    const Icon = item.icon;
    const isActive = currentPath === item.link;

    return (
      <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }} key={item.label}>
        <ListItem
          button
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#999AA3',
            padding: 0,
            borderRadius: 1,
            ml: 1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'white',
            },
            ...(isActive && {
              backgroundColor: 'white',
              color: 'black',
              '& .MuiSvgIcon-root': {
                color: 'black',
              },
            }),
          }}
        >
          <ListItemIcon sx={{ color: '#999AA3', marginRight: -2 }}>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      </Link>
    );
  });

  const handleLogoutClick = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleLogoutConfirm = () => {
    setOpen(false);
    navigate('/login'); 
  };

  const handleLogoutCancel = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F5F7F9',
        padding: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', mb: 1 }}>
          <Toolbar sx={{ mt: -2, padding: 1, borderBottom: `1px solid`, borderColor: '#999AA3', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'black', marginRight: 1, ml: -2.5 }}>
              {name.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ color: 'black', fontSize: '0.85rem' }} noWrap>
                {name}
              </Typography>
              <Typography sx={{ color: '#999AA3', fontSize: '0.85rem' }} noWrap>
                {email}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <List>{links}</List>
      </Box>

      <Box sx={{ borderTop: `1px solid`, borderColor: '#999AA3', paddingTop: 1, marginTop: 1 }}>
        <ListItem
          button
          onClick={handleLogoutClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#999AA3',
            padding: 0,
            borderRadius: 1,
            ml: 1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#999AA3', marginRight: -2 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>

      <Dialog 
  open={open} 
  onClose={handleLogoutCancel} 
  sx={{
    '& .MuiDialog-paper': {
      padding: 2,
      borderRadius: 2,
      minWidth: '400px',
    },
  }}
>
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
    Confirm Logout
  </DialogTitle>
  
  <Typography sx={{ textAlign: 'center', mb: 4, color: '#666' }}>
    Are you sure you want to logout?
  </Typography>
  
  <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
  <Button 
      onClick={handleLogoutConfirm} 
      sx={{ 
        color: '#fff', 
        backgroundColor: '#d9534f',
        '&:hover': {
          backgroundColor: '#c9302c',
        },
      }}
      autoFocus
    >
      Yes
    </Button>
    <Button 
      onClick={handleLogoutCancel} 
      sx={{ 
        color: '#fff', 
        backgroundColor: '#6c757d',
        '&:hover': {
          backgroundColor: '#5a6268',
        },
      }}
    >
      No
    </Button>
    
    
  </DialogActions>
</Dialog>

    </Box>
  );
}
