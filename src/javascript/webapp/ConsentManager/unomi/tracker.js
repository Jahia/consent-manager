import uTracker from 'unomi-analytics';

const syncTracker = ({scope, url, /* sessionId, */dispatch}) => {
    uTracker.initialize({
        'Apache Unomi': {
            scope,
            url
            // SessionId
        }
    });

    uTracker.ready(() =>
        dispatch({
            case: 'ADD_CXS',
            payload: {
                cxs: window.cxs
            }
        })
    );
};

// TODO build the revoke date based on consent Manager cookieDuration
const syncConsentStatus = ({typeIdentifier, scope, status}) => {
    const statusDate = new Date();
    const revokeDate = new Date(statusDate);
    revokeDate.setFullYear(revokeDate.getFullYear() + 2);
    // Console.debug('syncConsentStatus status :', status);

    uTracker.track('modifyConsent', {
        consent: {
            typeIdentifier,
            scope,
            status,
            statusDate: statusDate.toISOString(), // "2018-05-22T09:27:09.473Z",
            revokeDate: revokeDate.toISOString()// "2020-05-21T09:27:09.473Z"
        }
    });
};

export {
    syncTracker,
    syncConsentStatus
};
