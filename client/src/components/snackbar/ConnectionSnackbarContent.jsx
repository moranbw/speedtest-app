import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { amber, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStyles1 = makeStyles((theme) => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.dark,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}));

function ConnectionSnackbarContentWrapper(props) {
	const classes = useStyles1();
	const { className, message, onClose, variant, ...other } = props;
	const Icon = variantIcon[variant];

	return (
		<SnackbarContent
			className={clsx(classes[variant], className)}
			aria-describedby='client-snackbar'
			message={
				<span id='client-snackbar' className={classes.message}>
					<Icon className={clsx(classes.icon, classes.iconVariant)} />
					{message}
				</span>
			}
			action={[
				<IconButton
					key='close'
					aria-label='Close'
					color='inherit'
					onClick={onClose}
				>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
			{...other}
		/>
	);
}

ConnectionSnackbarContentWrapper.propTypes = {
	className: PropTypes.string,
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const useStyles2 = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
	},
}));

export default function ConnectionSnackBarContent(props) {
	const classes = useStyles2();

	return (
		<ConnectionSnackbarContentWrapper
			variant={props.variant}
			className={classes.margin}
			message={props.message}
			onClose={props.onClose}
		/>
	);
}
