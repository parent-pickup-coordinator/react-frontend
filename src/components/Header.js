import React from 'react';
import { AppBar, Typography, Toolbar, IconButton } from '@material-ui/core';
// import MenuIcon from '@material-ui/icons/Menu';

const Header = () => {
  return (
    <div id="header">
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
          </IconButton>
          <Typography variant="h6" >
            Parent Pickup Coordinator
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
export default Header;