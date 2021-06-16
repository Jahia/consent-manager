import React from 'react';
import {StoreContext} from '../../contexts';
// Import PropTypes from 'prop-types';
import ScriptLoader from './loader/scriptLoader';
import TriggerLoader from './loader/triggerLoader';

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
            switch (true) {
                case consent.event2Triggered !== null:
                    // console.log(`[ConsentLoader] ${consent.name} -> load trigger`);
                    return <TriggerLoader key={consent.id} eventName={consent.event2Triggered}/>;
                case consent.js2Execute !== null:
                    // console.log(`[ConsentLoader] ${consent.name} -> load script`);
                    return <ScriptLoader key={consent.id} scriptText={consent.js2Execute}/>;
                default:
                    console.warn(`[ConsentLoader] ${consent.name} -> nothing to load`);
                    return <></>;
            }

            // Console.log('[ConsentLoader] consent.name : ', consent.name);
            // return <ScriptLoader key={consent.id} scriptText={consent.js2Execute}/>;
        });

    return (
        <>
            {consents2Load}
        </>

    );
};

ConsentLoader.propTypes = {};

export default ConsentLoader;
