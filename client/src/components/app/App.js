import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, deepOrange } from '@material-ui/core/colors';
import { AppBar, CssBaseline,Toolbar, Typography } from '@material-ui/core';
import Body from "../body/Body";

import train from "../../resources/train.png";
import './App.css';


function App(props) {

  const theme = createMuiTheme({
    palette: {
      primary: { main: grey[300] },
      secondary: { main: deepOrange[500] },

    },
    typography: {
      useNextVariants: true,
    },
  });

  return (
    <CssBaseline>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <AppBar position="static" color="secondary">
            <Toolbar>
              <div><img className="logo" src={train}/></div>
              <Typography variant="h6" color="inherit">
                speedtest
              </Typography>
            </Toolbar>
          </AppBar>
          <Body />
        </div>
      </MuiThemeProvider>
    </CssBaseline>
  );

}
export default App;
