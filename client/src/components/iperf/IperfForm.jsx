import {useState} from 'react';
import {
    Button, FormControl, Grid, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../../state';

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
    const [state, setState] = useStateValue();
    const [host, setHost] = useState(state.host);
    const [port, setPort] = useState(state.port);
    
    const handleChange = (event) => {

        const value = event.target.value;
        if (event.target.id === "host") {
            setHost(value);
        }
        if (event.target.id === "port") {
            setPort(value);
        }
    };

    const checkInput = () => {
        return !(host.length > 0 && port.length > 0 && /^\d+$/.test(port));
    };

    return (
        <Grid item xs={12}>
            <FormControl>
                <FormControl className={classes.serverFormBox}>
                    <TextField
                        className={classes.input}
                        id="host"
                        label="hostname or IP"
                        value={host}
                        onChange={handleChange}
                    />
                    <TextField
                        className={classes.input}
                        id="port"
                        label="port"
                        value={port}
                        onChange={handleChange}
                    />
                </FormControl>
                <Button
                    onClick={() => props.onClick({host: host, port: port})}
                    variant="contained"
                    color="secondary"
                    disabled={checkInput()}
                >Run Speed Test</Button>
            </FormControl>
        </Grid>
    );
}