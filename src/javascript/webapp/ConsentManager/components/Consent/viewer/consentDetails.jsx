import React from 'react';
import PropTypes from 'prop-types';
import {
    Switch,
    ListItem,
    ListItemText,
    ListItemSecondaryAction, Typography
} from '@material-ui/core';
// Import {withStyles} from '@material-ui/core/styles';
import DOMPurify from 'dompurify';
// Import {StoreContext} from '../../../contexts';

// const AntSwitch = withStyles(theme => ({
//     root: {
//         width: 28,
//         height: 16,
//         padding: 0,
//         display: 'flex'
//     },
//     switchBase: {
//         padding: 2,
//         color: theme.palette.grey[500],
//         '&$checked': {
//             transform: 'translateX(12px)',
//             color: theme.palette.common.white,
//             '& + $track': {
//                 opacity: 1,
//                 backgroundColor: theme.palette.primary.main,
//                 borderColor: theme.palette.primary.main
//             }
//         }
//     },
//     thumb: {
//         width: 12,
//         height: 12,
//         boxShadow: 'none'
//     },
//     track: {
//         border: `1px solid ${theme.palette.grey[500]}`,
//         borderRadius: 16 / 2,
//         opacity: 1,
//         backgroundColor: theme.palette.common.white
//     },
//     checked: {}
// }))(Switch);

const ConsentDetail = ({consent, handleToggleConsent}) => {
    return (
        <ListItem>
            {/* <ListItemIcon> */}
            {/*    <WifiIcon /> */}
            {/* </ListItemIcon> */}
            <ListItemText id={`switch-list-label-${consent.id}`}
                          primary={consent.name}
                          primaryTypographyProps={{color: 'primary'}}
                          secondary={
                              <Typography
                                  component="div"
                                  variant="body2"
                                  // ClassName={classes.description}
                                  dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(consent.description, {ADD_ATTR: ['target']})}}/>
                          }
            />
            {!consent.isMandatory &&
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        checked={consent.isMandatory ? consent.isMandatory : consent.isGranted}
                        inputProps={{'aria-labelledby': `switch-list-label-${consent.id}`}}
                        onChange={() => handleToggleConsent(consent)}
                    />
                </ListItemSecondaryAction>}
        </ListItem>
    );
};

ConsentDetail.propTypes = {
    consent: PropTypes.object.isRequired,
    handleToggleConsent: PropTypes.func.isRequired
};

export default ConsentDetail;
