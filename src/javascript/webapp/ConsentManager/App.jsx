import React from 'react'; // UseEffect,useContext
// import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';

import get from 'lodash.get';
import {StoreContext} from './contexts';
import {GET_CONSENTS} from './consents.gql-queries';

const App = () => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {virtualSite, jContent} = state;
    // Get consentType entry for the site
    const {loading, error, data} = useQuery(GET_CONSENTS, {
        variables: jContent.gql_variables
    });

    React.useEffect(() => {
        console.debug('App consent-manager init !');
        if (loading === false && data) {
            console.debug('App consent-manager init Set Data!');

            const siteData = get(data, 'response.site', {});

            dispatch({
                case: 'DATA_READY',
                payload: {
                    siteData
                }
            });

            // Init unomi tracker
            // if(jContent.gql_variables.workspace === "LIVE")
            //     syncTracker({
            //         scope: jContent.scope,
            //         url: jContent.cdp_endpoint,
            //         sessionId:`qZ-${quizKey}-${Date.now()}`,
            //         dispatch
            //     });
        }
    }, [loading, data]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error :(</p>;
    }

    const consentList = virtualSite.consentNodes.map(consent => {
        console.log('consent.name : ', consent.name);
        return <li key={consent.id}>{consent.name}</li>;
    });

    console.log('[App] virtualSite.consentNodes : ', virtualSite.consentNodes);
    console.log('[App] consentList : ', consentList);

    return (
        <>
            <h1>Hello cookie</h1>
            <ul>
                {consentList}
            </ul>
        </>
    );
};

App.propTypes = {};

export default App;
