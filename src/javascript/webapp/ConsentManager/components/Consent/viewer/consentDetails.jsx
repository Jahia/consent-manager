import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Typography, Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import DOMPurify from 'dompurify';
// Import {StoreContext} from '../../../contexts';

const AntSwitch = withStyles(theme => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex'
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main
            }
        }
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none'
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white
    },
    checked: {}
}))(Switch);

const ConsentDetail = ({consent, handleToggleConsent}) => {
    return (
        <>
            <Typography variant="h4">
                {consent.name}
            </Typography>
            <Typography
                component="div"
                // ClassName={classes.description}
                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(consent.description, {ADD_ATTR: ['target']})}}/>

            <Typography component="div">
                <Grid container component="label" alignItems="center" spacing={1}>
                    <Grid item>Off</Grid>
                    <Grid item>
                        <AntSwitch
                            name="checkedC"
                            checked={consent.isMandatory ? consent.isMandatory : consent.isGranted}
                            disabled={consent.isMandatory}
                            onChange={() => handleToggleConsent(consent)}
                        />
                    </Grid>
                    <Grid item>On</Grid>
                </Grid>
            </Typography>
        </>
    );
};

ConsentDetail.propTypes = {
    consent: PropTypes.object.isRequired,
    handleToggleConsent: PropTypes.func.isRequired
};

export default ConsentDetail;
