import React from 'react';
import { Button, Container, Grid, LinearProgress, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ResultTable from "./ResultTable";

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

export default function Body(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({ isLoading: false, json: "" });

  const ConditionalResult = (props) => {
    const json = props.json;
    if (json.length > 0) {
      return <Grid item xs={12}><ResultTable json={state.json} /></Grid>;
    }
    return null;
  };

  const ConditionalLoad = (props) => {
    const isLoading = props.isLoading;
    if (isLoading) {
      return <Grid item xs={12} className={classes.progress}><LinearProgress color="secondary" /></Grid>;
    }
    return <Grid item xs={12}><Button onClick={onClick} variant="contained" color="secondary">Run Speed Test</Button></Grid>;
  };

  function onClick() {
    setState({ isLoading: true, json: "" });
    fetch('test')
      .then((response) => {
        return response.json();
      })
      .then((aJson) => {
        console.log(aJson);
        setState({ isLoading: false, json: JSON.stringify(aJson) });
      });
  };

  return (
    <Container fixed>
      <Paper className={classes.root} elevation={10}>
        <Grid container direction="column" justify='center' alignItems="center" spacing={4}>
          <ConditionalResult json={state.json} />
          <ConditionalLoad isLoading={state.isLoading} />
        </Grid>
      </Paper>
    </Container>
  );
}