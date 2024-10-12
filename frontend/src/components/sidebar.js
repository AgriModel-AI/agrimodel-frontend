import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar
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
  { link: '', label: 'Dashboard', icon: DashboardIcon },
  { link: '', label: 'Diseases', icon: CoronavirusIcon },
  { link: '', label: 'Diagnosis Results', icon: BiotechIcon },
  { link: '', label: 'Users', icon: PersonIcon },
  { link: '', label: 'Community', icon: GroupIcon },
  { link: '', label: 'Support', icon: SupportAgentIcon },
];

export function SideBar() {
  const [active, setActive] = useState('Dashboard');
  const { name, email } = usersData[0];

  const links = data.map((item) => {
    const Icon = item.icon; // Get the component reference
    return (
      <ListItem
        button
        key={item.label}
        onClick={(event) => {
          event.preventDefault();
          setActive(item.label);
        }}
        data-active={item.label === active}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#999AA3',
          padding: 0,
          borderRadius: 1,
          ml:1,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'white',
          },
          '&[data-active="true"]': {
            backgroundColor: 'white',
            color: 'black',
            '& .MuiSvgIcon-root': {
              color: 'black',
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: '#999AA3', marginRight: -2}}>
          <Icon /> 
        </ListItemIcon>
        <ListItemText primary={item.label}/>
      </ListItem>
    );
  });

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
            <Avatar sx={{ bgcolor: 'black', marginRight: 1, ml:-2.5,  }}>
              {name.charAt(0)} 
            </Avatar>
            <Box>
              <Typography  sx={{ color: 'black', fontSize:'0.85rem' }} noWrap>
                {name}
              </Typography>
              <Typography  sx={{ color: '#999AA3', fontSize:'0.85rem' }} noWrap>
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
          onClick={(event) => event.preventDefault()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#999AA3',
            padding: 0,
            borderRadius: 1,
            ml:1,
           
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
    </Box>
  );
}
