import React from 'react'; // UseEffect,useContext
// import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';

import get from 'lodash.get';
import {StoreContext} from './contexts';
import {GET_CONSENTS} from './consents.gql-queries';
import ConsentLoader from './components/Consent/Loader';
import ConsentViewer from './components/Consent/Viewer';
import {events} from './douane/lib/config';
import './App.scss';

const App = () => {
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
        <>
            {loadUserConsents()}
            {!userConsentPreference.isActive &&
            <div className={`_jcm_wrapper_ ${showWrapper ? 'active' : ''}`}>
                <div className="_jcm_main_">
                    <a className="btn" value="">Continuer sans accepter</a>
                    <h1>Votre consentement</h1>
                    <div className="text-info">
                        <p>La nouvelle</p>
                    </div>

                    <input type="button" value="Personnaliser mes choix" onClick={handleReview}/>
                    <input type="button" value="Tout refuser" onClick={handleDenyAll}/>
                    <input type="button" value="Tout accepter" onClick={handleGrantAll}/>

                    <ul>
                        {consentList}
                    </ul>
                </div>
            </div>}
            <div className={`_jcm_side-wrapper ${showSideDetails ? 'active' : ''}`}>
                <div className="_jcm_side-content">
                    bla bla, alors tu acceptes ?
                    {

                    }
                    <ConsentViewer/>
                    {/* details about each cookie */}
                </div>
            </div>
        </>
    );
};

App.propTypes = {};

export default App;
