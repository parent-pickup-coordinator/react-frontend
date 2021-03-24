import React from 'react';
import './Footer.scss';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const Footer = () => {

  const useStyles = makeStyles((theme) => ({
    appBar: {
      top: 'auto',
      bottom: 0,
    },
  }));

  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed" color="primary" id="footer" className={classes.appBar}>
        <Toolbar>
          <Typography>Parent Pickup Coordinator &copy; 2021</Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}


export default Footer;