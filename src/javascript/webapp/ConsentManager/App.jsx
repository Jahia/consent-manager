import React from 'react'; // UseEffect,useContext
// import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';
import DOMPurify from 'dompurify';
import get from 'lodash.get';
import {StoreContext} from './contexts';
import {GET_CONSENTS} from './consents.gql-queries';
import ConsentLoader from './components/Consent/Loader';
import ConsentViewer from './components/Consent/Viewer';
import {events} from './douane/lib/config';

import classnames from 'clsx';
import {Button, Typography, Modal, Backdrop, Fade} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from './components/theme';
// Import './App.scss';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ccc',
        boxShadow: theme.shadows[6],
        borderRadius: '3px',
        padding: theme.spacing(2, 4, 3)
    },
    btnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            marginRight: theme.spacing(1)
        }
    },
    sideWrapper: {
        visibility: 'hidden',
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        zIndex: 10001,
        boxShadow: '8px 0 8px -10px $dark-grey,-8px 0 8px -10px $dark-grey',
        background: 'rgba(255,255,255,.95)',
        transition: 'width .5s ease',

        '&.active': {
            visibility: 'visible',
            width: '400px'
        }
    },
    sideContent: {
        opacity: 0,
        transition: 'opacity 1s ease',
        '.active &': {
            opacity: 1
        }
    }
}));

const initLanguageBundle = managerData => {
    const keys = [
        'modalTitle',
        'modalDescription',
        'btnReview',
        'btnDenyAll',
        'btnGrantAll'
    ];
    return keys.reduce((bundle, key) => {
        bundle[key] = get(managerData, `${key}.value`);
        return bundle;
    }, {});
};

const App = props => {
    const classes = useStyles(props);

    const {state, dispatch} = React.useContext(StoreContext);
    const {manager, jContent, showSideDetails, showWrapper, userConsentPreference} = state;

    const handleReview = () => {
        dispatch({
            case: 'TOGGLE_SHOW_DETAILS'
        });
    };

    // Get consentType entry for the site
    const {loading, error, data} = useQuery(GET_CONSENTS, {
        variables: jContent.gqlVariables
    });

    React.useEffect(() => {
        console.debug('App consent-manager init !');
        if (loading === false && data) {
            console.debug('App consent-manager init Set Data!');

            const managerData = get(data, 'response.site', {});
            jContent.languageBundle = initLanguageBundle(managerData);

            dispatch({
                case: 'DATA_READY',
                payload: {
                    managerData
                }
            });

            // Init unomi tracker
            // if(jContent.gqlVariables.workspace === "LIVE")
            //     syncTracker({
            //         scope: jContent.scope,
            //         url: jContent.cdp_endpoint,
            //         sessionId:`qZ-${quizKey}-${Date.now()}`,
            //         dispatch
            //     });
        }
    }, [loading, data]);

    React.useEffect(() => {
        window.addEventListener(events.TOGGLE_SHOW_DETAILS, handleReview);
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error :(</p>;
    }

    const consentList = manager.consentNodes.map(consent => {
        console.log('[App] consent.name : ', consent.name);
        return <li key={consent.id}>{consent.name}</li>;
    });

    console.log('[App] manager.consentNodes : ', manager.consentNodes);
    console.log('[App] consentList : ', consentList);

    const handleDenyAll = () => {
        dispatch({
            case: 'DENY_ALL'
        });
    };

    const handleGrantAll = () => {
        dispatch({
            case: 'GRANT_ALL'
        });
    };

    const loadUserConsents = () => {
        if (userConsentPreference.isActive) {
            return <ConsentLoader/>;
        }
    };

    console.log('[App] userConsentPreference: ', userConsentPreference);
    console.log('[App] showWrapper: ', showWrapper);
    return (
        <ThemeProvider theme={theme(manager ? manager.userTheme : {})}>
            {loadUserConsents()}
            {!userConsentPreference.isActive &&
            <Modal
                closeAfterTransition
                disableBackdropClick
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                // OnClose={handleClose}
                className={classes.modal}
                open={showWrapper}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        {jContent.languageBundle &&
                        <>
                            <Typography variant="h2" id="transition-modal-title">
                                {jContent.languageBundle.modalTitle}
                            </Typography>
                            <Typography
                                id="transition-modal-description"
                                component="div"
                                // ClassName={classes.description}
                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(jContent.languageBundle.modalDescription, {ADD_ATTR: ['target']})}}/>
                            <div className={classes.btnWrapper}>
                                <Button onClick={handleReview}>
                                    {jContent.languageBundle && jContent.languageBundle.btnReview}
                                </Button>
                                <Button onClick={handleDenyAll}>
                                    {jContent.languageBundle && jContent.languageBundle.btnDenyAll}
                                </Button>
                                <Button onClick={handleGrantAll}>
                                    {jContent.languageBundle && jContent.languageBundle.btnGrantAll}
                                </Button>
                            </div>
                        </>}
                    </div>
                </Fade>
            </Modal>}

            <div className={classnames(
                classes.sideWrapper,
                (showSideDetails ? 'active' : '')
            )}
            >
                <div className={classes.sideContent}>
                    bla bla, alors tu acceptes ?
                    {

                    }
                    <ConsentViewer/>
                    {/* details about each cookie */}
                </div>
            </div>
        </ThemeProvider>
    );

    // Return (
    //     <>
    //         {loadUserConsents()}
    //         {!userConsentPreference.isActive &&
    //         <div className={`_jcm_wrapper_ ${showWrapper ? 'active' : ''}`}>
    //             <div className="_jcm_main_">
    //                 <a className="btn" value="">Continuer sans accepter</a>
    //                 <h1>Votre consentement</h1>
    //                 <div className="text-info">
    //                     <p>La nouvelle</p>
    //                 </div>
    //
    //                 <input type="button" value="Personnaliser mes choix" onClick={handleReview}/>
    //                 <input type="button" value="Tout refuser" onClick={handleDenyAll}/>
    //                 <input type="button" value="Tout accepter" onClick={handleGrantAll}/>
    //
    //                 <ul>
    //                     {consentList}
    //                 </ul>
    //             </div>
    //         </div>}
    //         <div className={`_jcm_side-wrapper ${showSideDetails ? 'active' : ''}`}>
    //             <div className="_jcm_side-content">
    //                 bla bla, alors tu acceptes ?
    //                 {
    //
    //                 }
    //                 <ConsentViewer/>
    //                 {/* details about each cookie */}
    //             </div>
    //         </div>
    //     </>
    // );
};

App.propTypes = {};

export default App;
