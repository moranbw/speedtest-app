import React from 'react';
import {
    Button, FormControl, FormControlLabel, FormGroup, Grid, Snackbar, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ConnectionSnackbarContent from '../snackbar/ConnectionSnackbarContent';
import catchFetch from '../../util/catchFetch';

const useStyles = makeStyles(theme => ({
    input: {
        '& label.Mui-focused': {
            color: theme.palette.secondary.main,
          },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.secondary.main,
          },
    },
    serverFormBox: {
        marginBottom: 16,
    }
}));

export default function IperfForm(props) {
    const classes = useStyles();
    const [state, setState] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            host: props.formState.host,
            port: props.formState.port,
            requestUrl: props.formState.requestUrl
        });
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState("Request failed...");

    const closeSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
    };

    const handleChange = (event) => {

        const value = event.target.value;
        if (event.target.id === "host") {
            setState({host: value});
        }
        if (event.target.id === "port") {
            setState({port: value});
        }
    };
    return (
        <Grid item xs={12}>
            <FormControl>
                <FormControl className={classes.serverFormBox}>
                    <TextField
                        className={classes.input}
                        id="host"
                        label="hostname or IP"
                        onChange={handleChange}
                        value={state.host}
                    />
                    <TextField
                        className={classes.input}
                        id="port"
                        label="port"
                        onChange={handleChange}
                        value={state.port}
                    />
                </FormControl>
                <Button onClick={() => props.onClick(state)} variant="contained" color="secondary">Run Speed Test</Button>
            </FormControl>
            <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={closeSnackBar}>
                <ConnectionSnackbarContent message={errorSnackbarMessage} variant={"error"}
                    onClose={closeSnackBar} />
            </Snackbar>
        </Grid>
    );
}