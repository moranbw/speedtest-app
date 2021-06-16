import React from 'react';
import { Container, Grid, LinearProgress, Paper, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../../state';
import OoklaForm from "../ookla/OoklaForm";
import OoklaTable from "../ookla/OoklaTable";
import IperfForm from "../iperf/IperfForm";
import IperfTable from "../iperf/IperfTable";
import ConnectionSnackbarContent from "../snackbar/ConnectionSnackbarContent";
import catchFetch from '../../util/catchFetch';

import "./BodyContent.css"

const useStyles = makeStyles(theme => ({
  root: {
    padding: 16,
    margin: 16,
    backgroundColor: theme.palette.primary.main,
  },
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },

}));

export default function BodyContent(props) {
  const classes = useStyles();
  const [state, setState] = useStateValue();

  const ConditionalResult = (props) => {
    const tableJson = props.tableJson;
    if (tableJson.length > 0) {
      return <Grid item xs={12}>{props.tab === "ookla" ?
        <OoklaTable json={state.tableJson} /> : <IperfTable json={state.tableJson} />}</Grid>;
    }
    return null;
  };

  const ConditionalLoad = (props) => {
    if (state.isLoading) {
      return <Grid item xs={12} className={classes.progress}><LinearProgress color="secondary" /></Grid>;
    }
    return props.tab === "ookla" ?
      <OoklaForm onClick={onClick} /> : <IperfForm onClick={onClick} />;
  };

  const onClick = (aState) => {
    let options = {
      method: props.requestMethod
    };
    if (props.tab === "iperf") {
      setState({ host: aState.host, port: aState.port, isLoading: true, tableJson: "" });
      options.body = JSON.stringify({ host: aState.host, port: aState.port });
      options.headers = {
        'Content-Type': 'application/json'
      };
      options.mode = 'cors'; // no-cors, cors, *same-origin
      options.credentials = 'same-origin'; // include, *same-origin, omit
    }
    else {
      setState({ isLoading: true, tableJson: "" });

    }
    catchFetch(state.requestUrl, options)
      .then((aResponse) => {
        return aResponse.json();
      })
      .then((aJson) => {
        console.log(aJson);
        setState({ isLoading: false, tableJson: JSON.stringify(aJson) });
      })
      .catch((aError) => {
        console.log(aError.message);
        setState({
          isLoading: false,
          tableJson: "",
          errorSnackbarOpen: true,
          errorSnackbarMessage: "Request rejected, " + aError.response.status + ": " + aError.response.statusText
        });
      });
  };

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState( { errorSnackbarOpen: false });
  };

  return (
    <Container fixed>
      <Paper className={classes.root} elevation={10}>
        <Grid container direction="column" justify='center' alignItems="center" spacing={4}>
          <ConditionalResult tableJson={state.tableJson} tab={props.tab} />
          <ConditionalLoad isLoading={state.isLoading} tab={props.tab} />
        </Grid>
      </Paper>
      <Snackbar open={state.errorSnackbarOpen} autoHideDuration={6000} onClose={closeSnackBar}>
        <ConnectionSnackbarContent message={state.errorSnackbarMessage} variant={"error"}
          onClose={closeSnackBar} />
      </Snackbar>
    </Container>
  );
}