import React from 'react';
import {StoreContext} from '../../contexts';
// Import PropTypes from 'prop-types';
import ConsentDetail from './viewer/consentDetails';
import {Button} from '@material-ui/core';

const ConsentViewer = () => {
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
                <section key={category}>
                    <h3>{category}</h3>
                    <ul>
                        {consentsByCategory[category].map(consent => (
                            <li key={consent.id}>
                                <ConsentDetail consent={consent} handleToggleConsent={handleToggleConsent}/>
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
            <Button onClick={handleSavePreference}>
                save preference
                {/* {jContent.languageBundle && jContent.languageBundle.btnGrantAll} */}
            </Button>
        </>

    );
};

ConsentViewer.propTypes = {};

export default ConsentViewer;
