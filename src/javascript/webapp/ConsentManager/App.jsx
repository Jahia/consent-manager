import React from 'react'; // UseEffect,useContext
// import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';
import DOMPurify from 'dompurify';
import get from 'lodash.get';
import {StoreContext} from './contexts';
import {GET_CONSENTS} from './consents.gql-queries';
import ConsentLoader from './components/Consent/Loader';
import ConsentViewer from './components/Consent/Viewer';
import {syncTracker} from './unomi/tracker';
// Import {events} from './douane/lib/config';

import classnames from 'clsx';
import {Button, Typography, Modal, Backdrop, Fade, Link} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from './components/theme';
import cssSharedClasses from './cssSharedClasses';

const useStyles = makeStyles(theme => ({
    main: {
        '& *, &::after, &::before': {
            boxSizing: 'border-box'
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        // MaxWidth: '730px'
    },
    paper: {
        // BackgroundColor: theme.palette.background.paper,
        backgroundColor: '#f1f3f4',
        border: '1px solid #ccc',
        boxShadow: theme.shadows[5],
        borderRadius: '3px',
        padding: theme.spacing(2, 4, 3)
    },
    sideWrapper: {
        visibility: 'hidden',
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        zIndex: 10001,
        padding: theme.spacing(2),
        boxShadow: `8px 0 8px -10px ${theme.palette.grey[800]},-8px 0 8px -10px ${theme.palette.grey[800]}`,
        // Background: 'rgba(255,255,255,.95)',
        backgroundColor: '#f1f3f4',
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
    },
    sideContentTitle: {
        marginBottom: theme.spacing(3)
    },
    denyAllLink: {
        float: 'right'
    },
    consentTitle: {
        clear: 'both'
    },
    logo: {
        clear: 'both',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
        '& img': {
            maxWidth: '150px'// Theme.geometry.logo.maxWidth
        }
    }
}));

// Const initLanguageBundle = managerData => {
//     const keys = [
//         'modalTitle',
//         'modalDescription',
//         'btnReview',
//         'btnDenyAll',
//         'btnGrantAll'
//     ];
//     return keys.reduce((bundle, key) => {
//         bundle[key] = get(managerData, `${key}.value`);
//         return bundle;
//     }, {});
// };

const App = props => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);

    const {state, dispatch} = React.useContext(StoreContext);
    const {
        manager,
        jContent,
        showSideDetails,
        showWrapper,
        userConsentPreference,
        cxs
    } = state;

    // Get consentType entry for the site
    const {loading, error, data} = useQuery(GET_CONSENTS, {
        variables: jContent.gqlVariables
    });

    React.useEffect(() => {
        // Window.addEventListener(events.TOGGLE_SHOW_DETAILS, handleReview);

        // Init unomi tracker
        if (jContent.gqlVariables.workspace === 'LIVE' && !cxs) {
            syncTracker({
                scope: jContent.siteKey,
                url: jContent.cdpEndPoint,
                // SessionId:`qZ-${quizKey}-${Date.now()}`,
                dispatch
            });
        }
    }, []);

    React.useEffect(() => {
        console.debug('App consent-manager init !');
        if (loading === false && data) {
            console.debug('App consent-manager init Set Data!');

            const managerData = get(data, 'response.site', {});
            // JContent.languageBundle = initLanguageBundle(managerData);

            dispatch({
                case: 'DATA_READY',
                payload: {
                    managerData
                }
            });
        }
    }, [loading, data]);

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

    const handleReview = () => {
        // E.preventDefault();
        dispatch({
            case: 'TOGGLE_SHOW_DETAILS'
        });
    };

    window._jcm_ = {
        openConsentDetails: handleReview
    };

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

    const getTitle = () => {
        if (manager.config.logo) {
            return (
                <div className={classes.logo}>
                    <img className=""
                         id="transition-modal-title"
                         src={`${jContent.filesEndpoint}${encodeURI(manager.config.logo)}`}
                         alt={jContent.siteName}/>
                </div>

            );
        }

        if (manager.config.modalTitle) {
            return (
                <Typography className={classes.consentTitle}
                            variant="h3"
                            id="transition-modal-title"
                >
                    {manager.config.modalTitle}
                </Typography>
            );
        }

        return (
            <Typography className={classes.consentTitle}
                        variant="h3"
                        id="transition-modal-title"
            >
                {jContent.siteName}
            </Typography>
        );
    };

    console.log('[App] userConsentPreference: ', userConsentPreference);
    console.log('[App] showWrapper: ', showWrapper);
    return (
        <ThemeProvider theme={theme(manager ? manager.userTheme : {})}>
            <div className={classes.main}>
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
                    maxWidth="md"
                >
                    <Fade in={showWrapper}>
                        <div className={classes.paper}>
                            {manager.config &&
                            <>

                                <Link component="button"
                                      variant="body1"
                                      color="primary"
                                      className={classes.denyAllLink}
                                      onClick={handleDenyAll}
                                >
                                    {manager.config && manager.config.btnDenyAll}
                                    <ArrowRightAltIcon/>
                                </Link>
                                    {/* continuer sans accepter */}

                                {getTitle()}

                                <Typography
                                    id="transition-modal-description"
                                    component="div"
                                    // ClassName={classes.description}
                                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(manager.config.modalDescription, {ADD_ATTR: ['target']})}}/>
                                <div className={sharedClasses.btnWrapper}>
                                    <Button variant="outlined" onClick={handleReview}>
                                        {manager.config && manager.config.btnReview}
                                    </Button>
                                    {/* <Button onClick={handleDenyAll}> */}
                                    {/*    {manager.config && manager.config.btnDenyAll} */}
                                    {/* </Button> */}
                                    <Button onClick={handleGrantAll}>
                                        {manager.config && manager.config.btnGrantAll}
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
                        <Typography className={classes.sideContentTitle} variant="h4">
                            Consent details
                            {/* {manager.config.modalTitle} */}
                        </Typography>

                        <ConsentViewer/>
                        {/* details about each cookie */}
                    </div>
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
