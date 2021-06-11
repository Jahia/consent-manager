import React from 'react';
import {StoreContext} from '../../contexts';
// Import PropTypes from 'prop-types';
import ConsentDetail from './viewer/consentDetails';
import {Button, List, ListSubheader} from '@material-ui/core';
import cssSharedClasses from '../../cssSharedClasses';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    categoryTitle: {
        marginBottom: theme.spacing(2)
    }
}));

const ConsentViewer = props => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const {state, dispatch} = React.useContext(StoreContext);
    const {manager} = state;

    const [consentNodes, setConsentNodes] = React.useState([]);

    React.useEffect(() => {
        setConsentNodes(manager.consentNodes);
    }, [manager.consentNodes]);

    const handleSavePreference = () =>
        dispatch({
            case: 'SAVE_USER_PREFERENCE',
            payload: {
                consentNodes
            }
        });

    const handleToggleConsent = consent => {
        setConsentNodes(consentNodes.map(consentNode => {
            if (consentNode.id === consent.id) {
                consentNode.isGranted = !consentNode.isGranted;
            }

            return consentNode;
        }));
    };

    const handleCancel = () =>
        dispatch({
            case: 'TOGGLE_SHOW_DETAILS'
        });

    // Const userConsentGranted = userConsentPreference.consents.reduce((grantedIds, consent) => {
    //     if (consent.value) {
    //         grantedIds.push(consent.id);
    //     }
    //
    //     return grantedIds;
    // }, []);
    const consentsByCategory = consentNodes
        .reduce((items, consent) => {
            if (!Object.prototype.hasOwnProperty.call(items, consent.category)) {
                items[consent.category] = [];
            }

            items[consent.category].push(consent);
            return items;
        }, {});
    console.log('[ConsentViewer] consentsByCategory : ', consentsByCategory);

    const consents2Display = Object.keys(consentsByCategory)
        .map(category => {
            return (
                <List key={category} subheader={<ListSubheader>{category}</ListSubheader>} className={classes.root}>
                    {consentsByCategory[category].map(consent => (
                        <ConsentDetail key={consent.id} consent={consent} handleToggleConsent={handleToggleConsent}/>
                    ))}
                </List>
            );
        });

    // Const consents2Display = Object.keys(consentsByCategory)
    //     .map(category => {
    //         return (
    //             <section key={category}>
    //                 <Typography className={classes.categoryTitle} variant="h5">
    //                     {category}
    //                 </Typography>
    //                 <ul className={classes.consentList}>
    //                     {consentsByCategory[category].map(consent => (
    //                         <li key={consent.id}>
    //                             <ConsentDetail consent={consent} handleToggleConsent={handleToggleConsent}/>
    //                         </li>
    //                       )
    //                 )}
    //                 </ul>
    //             </section>
    //         );
    //     });

    return (
        <>
            {consents2Display}
            <div className={sharedClasses.btnWrapper}>
                <Button variant="outlined" onClick={handleCancel}>
                    cancel
                    {/* {jContent.languageBundle && jContent.languageBundle.btnGrantAll} */}
                </Button>
                <Button onClick={handleSavePreference}>
                    save preference
                    {/* {jContent.languageBundle && jContent.languageBundle.btnGrantAll} */}
                </Button>
            </div>
        </>

    );
};

ConsentViewer.propTypes = {};

export default ConsentViewer;
