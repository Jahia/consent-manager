import React from 'react';
import {StoreContext} from '../contexts';
import * as PropTypes from 'prop-types';
import managerMapper from '../model/manager';
import {syncConsentStatus} from '../unomi/tracker';
import {consentStatus} from '../douane/lib/config';

const init = jContent => {
    let userConsentPreference = {
        isActive: false,
        consents: []
    };
    const storageKey = `_jcm_ucp_${jContent.siteUUID}`;
    /* eslint no-unused-vars: ["error", {"args": "after-used"}] */

    try {
        if (localStorage.getItem(storageKey)) {
            userConsentPreference = JSON.parse(localStorage.getItem(storageKey));
        }
    } catch (e) {
        console.warn('no user consent preferences stored in localstorage or data are corrupted');
    }

    return {
        jContent,
        storageKey,
        cxs: window.cxs || false, // Null,
        manager: {consentNodes: []},
        showSideDetails: false,
        showWrapper: !userConsentPreference.isActive,
        userConsentPreference
    };
};

const reducer = (state, action) => {
    const {payload} = action;
    const timeoutTrackerWorkaround = 300;

    switch (action.case) {
        case 'DATA_READY': {
            // Prepare slideIds
            const {storageKey} = state;
            const {managerData} = payload;
            console.debug('[STORE] DATA_READY - managerData: ', managerData);
            const manager = managerMapper(managerData);
            let userConsentPreference = null;

            const userLocalPreference =
                localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : null;

            if (userLocalPreference) {
                userConsentPreference = userLocalPreference.consents.reduce((consents, item) => {
                    consents[item.id] = item.value;
                    return consents;
                }, {});
            }

            if (userConsentPreference) {
                manager.consentNodes = manager.consentNodes.map(consentNode => {
                    if (Object.prototype.hasOwnProperty.call(userConsentPreference, consentNode.id)) {
                        consentNode.isGranted = userConsentPreference[consentNode.id];
                    }

                    return consentNode;
                });
            }

            console.debug('[STORE] DATA_READY - manager: ', manager);
            return {
                ...state,
                manager
            };
        }

        case 'ADD_CXS': {
            const cxs = payload.cxs;
            console.debug('[STORE] ADD_CXS - cxs: ', cxs);
            // GET consent?

            return {
                ...state,
                cxs
            };
        }

        case 'SAVE_USER_PREFERENCE': {
            console.debug('[STORE] SAVE_USER_PREFERENCE');
            const {consentNodes} = payload;
            const {jContent, manager, storageKey, cxs} = state;

            const userConsentPreference = {
                project: jContent.siteKey,
                isActive: true,
                date: Date.now(),
                consents: consentNodes.map((consentNode, index) => {
                    if (cxs) {
                        setTimeout(() => syncConsentStatus({
                            typeIdentifier: consentNode.id,
                            scope: jContent.siteKey,
                            status: consentNode.isGranted ? consentStatus.GRANTED.toUpperCase() : consentStatus.DENIED.toUpperCase()}),
                        timeoutTrackerWorkaround * index);
                    }

                    return {id: consentNode.id, value: consentNode.isGranted};
                })
            };

            localStorage.setItem(storageKey, JSON.stringify(userConsentPreference));
            console.debug('[STORE] localStorage.setItem : ', JSON.stringify(userConsentPreference));
            return {
                ...state,
                showSideDetails: false,
                manager: {
                    ...manager,
                    consentNodes
                },
                userConsentPreference
            };
        }

        case 'TOGGLE_SHOW_DETAILS': {
            console.debug('[STORE] TOGGLE_SHOW_DETAILS');
            return {
                ...state,
                showSideDetails: !state.showSideDetails
            };
        }

        case 'DENY_ALL': {
            console.debug('[STORE] DENY_ALL');
            const {jContent, manager, storageKey, cxs} = state;
            const userConsentPreference = {
                project: jContent.siteKey,
                isActive: true,
                date: Date.now(),
                consents: manager.consentNodes.map((consent, index) => {
                    if (cxs) {
                        setTimeout(() => syncConsentStatus({
                            typeIdentifier: consent.id,
                            scope: jContent.siteKey,
                            status: consent.isMandatory ? consentStatus.GRANTED.toUpperCase() : consentStatus.DENIED.toUpperCase()}),
                        timeoutTrackerWorkaround * index);
                    }

                    return {id: consent.id, value: consent.isMandatory};
                })
            };
            localStorage.setItem(storageKey, JSON.stringify(userConsentPreference));
            const consentNodes = manager.consentNodes.map(consentNode => {
                consentNode.isGranted = consentNode.isMandatory;
                return consentNode;
            });
            return {
                ...state,
                manager: {
                    ...manager,
                    consentNodes
                },
                showSideDetails: false,
                userConsentPreference
            };
        }

        case 'GRANT_ALL': {
            console.debug('[STORE] GRANT_ALL');
            const {jContent, manager, storageKey, cxs} = state;
            const userConsentPreference = {
                project: jContent.siteKey,
                isActive: true,
                date: Date.now(),
                consents: manager.consentNodes.map((consent, index) => {
                    if (cxs) {
                        setTimeout(() => syncConsentStatus({
                            typeIdentifier: consent.id,
                            scope: jContent.siteKey,
                            status: consentStatus.GRANTED.toUpperCase()}),
                        timeoutTrackerWorkaround * index);
                    }

                    return {id: consent.id, value: true};
                })
            };
            localStorage.setItem(storageKey, JSON.stringify(userConsentPreference));
            console.debug('[STORE] localStorage.setItem : ', JSON.stringify(userConsentPreference));

            const consentNodes = manager.consentNodes.map(consentNode => {
                consentNode.isGranted = true;
                return consentNode;
            });

            return {
                ...state,
                manager: {
                    ...manager,
                    consentNodes
                },
                showSideDetails: false,
                userConsentPreference
            };
        }

        default:
            throw new Error(`[STORE] action case '${action.case}' is unknown `);
    }
};

export const Store = props => {
    const [state, dispatch] = React.useReducer(
        reducer,
        props.jContent,
        init
    );
    return (
        <StoreContext.Provider value={{state, dispatch}}>
            {props.children}
        </StoreContext.Provider>
    );
};

Store.propTypes = {
    jContent: PropTypes.object.isRequired,
    children: PropTypes.object
};
