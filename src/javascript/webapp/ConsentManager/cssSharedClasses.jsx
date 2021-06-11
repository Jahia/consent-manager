import {makeStyles} from '@material-ui/core/styles';

export default makeStyles(theme => ({
    btnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(2, 0, 1),
        // PaddingBottom: theme.spacing(1),
        '& button': {
            marginRight: theme.spacing(1),
            minWidth: '175px',
            borderRadius: '0'
        },
        '& button:last-child': {
            marginRight: 0
        }
    }
}));
