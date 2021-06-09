import {makeStyles} from '@material-ui/core/styles';

export default makeStyles(theme => ({
    btnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            marginRight: theme.spacing(1)
        }
    }
}));
