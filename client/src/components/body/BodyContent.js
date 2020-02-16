import React from 'react';
import { Button, Container, Grid, LinearProgress, Paper, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import OoklaForm from "../ookla/OoklaForm";
import OoklaTable from "../ookla/OoklaTable";
import IperfForm from "../iperf/IperfForm";
import IperfTable from "../iperf/IperfTable";
import ConnectionSnackbarContent from "../snackbar/ConnectionSnackbarContent";
import catchFetch from '../../util/catchFetch';

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
  }
}));

export default function BodyContent(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({ isLoading: false, json: "" });
  const [formState, setFormState] = React.useReducer(
    (state, newState) => ({ ...state, ...newState }),
    props.formState
  );
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState("Request failed...");

  const ConditionalResult = (props) => {
    const json = props.json;
    if (json.length > 0) {
      return <Grid item xs={12}>{props.tab === "ookla" ?
        <OoklaTable json={state.json} /> : <IperfTable json={state.json} />}</Grid>;
    }
    return null;
  };

  const ConditionalLoad = (props) => {
    const isLoading = props.isLoading;
    if (isLoading) {
      return <Grid item xs={12} className={classes.progress}><LinearProgress color="secondary" /></Grid>;
    }
    return props.tab === "ookla" ?
      <OoklaForm onClick={onClick} formState={formState} /> : <IperfForm onClick={onClick} formState={formState} />;
  };

  function onClick(aState) {
    setState({ isLoading: true, json: "" });
    //let query = aState.server.toString().length > 0 ? "?serverId=" + aState.server : "";
    let options = {
      method: props.requestMethod
    };
    if (props.tab === "iperf") {
      options.body = JSON.stringify({ host: aState.host, port: aState.port });
      options.headers = {
        'Content-Type': 'application/json'
      };
      options.mode = 'cors'; // no-cors, cors, *same-origin
      options.credentials = 'same-origin'; // include, *same-origin, omit
    }
    catchFetch(aState.requestUrl, options)
      .then((aResponse) => {
        return aResponse.json();
      })
      .then((aJson) => {
        console.log(aJson);
        setState({ isLoading: false, json: JSON.stringify(aJson) });
        setFormState(aState)
      })
      .catch((aError) => {
        console.log(aError.message);
        setErrorSnackbarMessage("Request rejected, " + aError.response.status + ": " + aError.response.statusText);
        setErrorSnackbarOpen(true);
        setState({ isLoading: false, json: "" });
        setFormState(aState)
      });
  };

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackbarOpen(false);
  };

  return (
    <Container fixed>
      <Paper className={classes.root} elevation={10}>
        <Grid container direction="column" justify='center' alignItems="center" spacing={4}>
          <ConditionalResult json={state.json} tab={props.tab} />
          <ConditionalLoad isLoading={state.isLoading} tab={props.tab} />
        </Grid>
      </Paper>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={closeSnackBar}>
        <ConnectionSnackbarContent message={errorSnackbarMessage} variant={"error"}
          onClose={closeSnackBar} />
      </Snackbar>
    </Container>
  );
}