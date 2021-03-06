import React from 'react'; // UseEffect,useContext
import {useQuery} from '@apollo/react-hooks';
import DOMPurify from 'dompurify';
import get from 'lodash.get';
import {StoreContext} from './contexts';
import {GET_CONSENTS} from './consents.gql-queries';
import ConsentLoader from './components/Consent/Loader';
import ConsentViewer from './components/Consent/Viewer';
import {syncTracker} from './unomi/tracker';
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
    // DenyAllLink: {
    //     float: 'right'
    // },
    btnHeaderWrapper: {
        display: 'flex',
        justifyContent: 'right',
        marginBottom: theme.spacing(3)
    },
    consentModalTitle: {
        marginBottom: theme.spacing(3)
    },
    consentModalDescription: {
        padding: theme.spacing(2, 0)
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
        // Init unomi tracker
        if (jContent.gqlVariables.workspace === 'LIVE' && !cxs) {
            syncTracker({
                scope: jContent.siteKey,
                url: jContent.cdpEndPoint,
                dispatch
            });
        }
    }, []);

    React.useEffect(() => {
        console.debug('App consent-manager init !');
        if (loading === false && data) {
            console.debug('App consent-manager init Set Data!');

            const managerData = get(data, 'response.site', {});
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

    // Const consentList = manager.consentNodes.map(consent => {
    //     return <li key={consent.id}>{consent.name}</li>;
    // });

    const handleReview = () => {
        dispatch({
            case: 'TOGGLE_SHOW_DETAILS'
        });
    };

    window._jcm_ = {
        openConsentDetails: handleReview
    };

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
                <Typography className={classes.consentModalTitle}
                            variant="h3"
                            id="transition-modal-title"
                >
                    {manager.config.modalTitle}
                </Typography>
            );
        }

        return (
            <Typography className={classes.consentModalTitle}
                        variant="h3"
                        id="transition-modal-title"
            >
                {jContent.siteName}
            </Typography>
        );
    };

    return (
        <ThemeProvider theme={theme(manager && manager.config ? manager.config.userTheme : {})}>
            <div className={classes.main}>
                {loadUserConsents()}
                {!userConsentPreference.isActive &&
                <Modal
                    closeAfterTransition
                    disableBackdropClick
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
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
                                <div className={classes.btnHeaderWrapper}>
                                    <Link component="button"
                                          variant="body1"
                                          color="primary"
                                          onClick={handleDenyAll}
                                    >
                                        {manager.config && manager.config.btnDenyAll}
                                        <ArrowRightAltIcon/>
                                    </Link>
                                </div>

                                {getTitle()}

                                <Typography
                                    id="transition-modal-description"
                                    component="div"
                                    className={classes.consentModalDescription}
                                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(manager.config.modalDescription, {ADD_ATTR: ['target']})}}/>

                                <div className={sharedClasses.btnWrapper}>
                                    <Button variant="outlined" onClick={handleReview}>
                                        {manager.config && manager.config.btnReview}
                                    </Button>
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
                            {manager.config && manager.config.sideModalTitle}
                        </Typography>

                        <ConsentViewer/>
                        {/* details about each cookie */}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

App.propTypes = {};

export default App;
