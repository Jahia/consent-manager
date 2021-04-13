import React from 'react';
import {StoreContext} from '../../contexts';
// Import PropTypes from 'prop-types';
import ScriptLoader from './loader/scriptLoader';

const ConsentLoader = () => {
    const {state} = React.useContext(StoreContext);
    const {manager, userConsentPreference} = state;
    const userConsentGranted = userConsentPreference.consents.reduce((grantedIds, consent) => {
        if (consent.value) {
            grantedIds.push(consent.id);
        }

        return grantedIds;
    }, []);
    const consents2Load = manager.consentNodes
        .filter(consent => userConsentGranted.includes(consent.id))
        .map(consent => {
            console.log('[ConsentLoader] consent.name : ', consent.name);
            return <ScriptLoader key={consent.id} scriptText={consent.js2Execute}/>;
        });

    return (
        <>
            {consents2Load}
        </>

    );
};

ConsentLoader.propTypes = {};

export default ConsentLoader;
