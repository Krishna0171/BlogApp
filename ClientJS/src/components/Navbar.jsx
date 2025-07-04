import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { ColorModeContext } from '../context/ColorModeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Navbar = () => {
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          MyBlog
        </Typography>

        <Box>
          <Button color='inherit' component={RouterLink} to='/'>Home</Button>
          <Button color='inherit' component={RouterLink} to='/login'>Login</Button>
          <Button color='inherit' component={RouterLink} to='/register'>Register</Button>
          <IconButton color='inherit' onClick={toggleColorMode}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
