import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { AppBar, Box, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import PropTypes from "prop-types";
import SwipeableViews from 'react-swipeable-views';
import { StateProvider } from '../../state';
import BodyContent from "../body/BodyContent";
import train from "../../resources/train.png";
import './App.css';


function App(props) {
  const [value, setValue] = React.useState(0);

  const initialState =
  {
    ookla:
    {
      useServer: false,
      serverJson: "",
      server: "",
      requestUrl: "ookla/test",
      tableJson: "",
      isLoading: false,
      errorSnackbarOpen: false,
      errorSnackbarMessage: "Request failed..."
    },
    iperf:
    {
      host: "",
      port: "",
      requestUrl: "iperf/test",
      tableJson: "",
      isLoading: false,
      errorSnackbarOpen: false,
      errorSnackbarMessage: "Request failed..."
    },

  }

  const reducer = (state, newState) => {
    // merge the old and new state
    return { ...state, ...newState };
  };


  const theme = createMuiTheme({
    palette: {
      primary: { main: grey[300] },
      secondary: { main: "#3b88c3" },
    },
    typography: {
      useNextVariants: true,
    },
  });

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && { ...children }}
      </Box>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  return (
    <CssBaseline>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              <div><img className="logo" alt="logo" src={train} /></div>
              <Typography className="title" variant="h6" color="inherit">
                speedtest
              </Typography>
              <Tabs
                value={value}
                onChange={handleChange}
              >
                <Tab label="ookla" {...a11yProps(0)} />
                <Tab label="iperf" {...a11yProps(1)} />
              </Tabs>
            </Toolbar>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <StateProvider initialState={initialState.ookla} reducer={reducer} >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <BodyContent requestMethod={"GET"} tab={"ookla"} />
              </TabPanel>
            </StateProvider>
            <StateProvider initialState={initialState.iperf} reducer={reducer}>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <BodyContent requestMethod={"POST"} tab={"iperf"} />
              </TabPanel>
            </StateProvider>
          </SwipeableViews>
        </div>
      </MuiThemeProvider>
    </CssBaseline>
  );

}
export default App;
