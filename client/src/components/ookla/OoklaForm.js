import React from 'react';
import {
    Button, FormControl, FormControlLabel, FormGroup, Grid,
    MenuItem, Select, Snackbar, Switch
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ConnectionSnackbarContent from '../snackbar/ConnectionSnackbarContent';
import catchFetch from '../../util/catchFetch';

const useStyles = makeStyles(theme => ({
    switchLabel: {
        margin: 0,
    },
    select: {
        '&:before': {
            borderColor: theme.palette.primary.dark,
        },
        '&:after': {
            borderColor: theme.palette.secondary.main,
        }
    },
    serverFormBox: {
        marginBottom: 16,
    }
}));

export default function OoklaForm(props) {
    const classes = useStyles();
    const [state, setState] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            useServer: props.formState.useServer,
            serverJson: props.formState.serverJson,
            server: props.formState.server,
            requestUrl: props.formState.requestUrl
        });
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState("Request failed...");

    const handleSwitch = (event) => {
        let checked = event.target.checked;
        if (checked) {
            catchFetch('ookla/servers')
                .then((aResponse) => {
                    return aResponse.json();
                })
                .then((aJson) => {
                    console.log(aJson);
                    if (aJson.servers.length > 0) {
                        setState(
                            {
                                useServer: checked,
                                serverJson: JSON.stringify(aJson),
                                server: aJson.servers[0].id,
                                requestUrl: "ookla/test?serverId=" + aJson.servers[0].id
                            });

                    }
                })
                .catch((aError) => {
                    console.log(aError.message);
                    setErrorSnackbarMessage("Request rejected, " + aError.response.status + ": " + aError.response.statusText);
                    setErrorSnackbarOpen(true);
                    setState({ useServer: !checked, serverJson: "", server: "", requestUrl: "ookla/test" });
                });
        }
        else {
            setState({ useServer: checked, serverJson: "", server: "", requestUrl: "ookla/test" });
        }
    }

    const handleSelect = (event) => {
        setState({ server: event.target.value, requestUrl: "ookla/test?serverId=" + event.target.value });
    }


    const closeSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
    };

    const ServerList = (props) => {
        if (props.show && props.json.length > 0) {
            let json = JSON.parse(props.json);
            let servers = json.servers.map(server => (
                <MenuItem value={server.id} key={server.id}>
                    {server.name + " (" + server.location + ")"}
                </MenuItem>
            ));
            return <Select
                className={classes.select}
                onChange={handleSelect}
                value={state.server}>
                {servers}
            </Select>
        }
        return null;
    };

    return (
        <Grid item xs={12}>
            <FormControl>
                <FormControl className={classes.serverFormBox}>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.useServer}
                                    onChange={handleSwitch}
                                    edge="end" />
                            }
                            label="select server (optional)"
                            labelPlacement="start"
                            className={classes.switchLabel}
                        />
                    </FormGroup>
                    <ServerList json={state.serverJson} show={state} />
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