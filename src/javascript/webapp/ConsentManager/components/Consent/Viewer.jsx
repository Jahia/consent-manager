import React from 'react';
import {StoreContext} from '../../contexts';
// Import PropTypes from 'prop-types';
import ConsentDetail from './viewer/consentDetails';

const ConsentViewer = () => {
    const {state} = React.useContext(StoreContext);
    const {manager} = state;
    // Const userConsentGranted = userConsentPreference.consents.reduce((grantedIds, consent) => {
    //     if (consent.value) {
    //         grantedIds.push(consent.id);
    //     }
    //
    //     return grantedIds;
    // }, []);
    const consentsByCategory = manager.consentNodes
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
                <section key={category}>
                    <h3>{category}</h3>
                    <ul>
                        {consentsByCategory[category].map(consent => (
                            <li key={consent.id}>
                                <ConsentDetail consent={consent}/>
                            </li>
                          )
                    )}
                    </ul>
                </section>
            );
        });

    return (
        <>
            {consents2Display}
        </>

    );
};

ConsentViewer.propTypes = {};

export default ConsentViewer;
