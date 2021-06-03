import React from 'react';
import ReactDOM from 'react-dom';
import App from './ConsentManager/App';

import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';

import {Store} from './ConsentManager/store';
import AjvError from './ConsentManager/components/Error/Ajv';
import {contextValidator} from './ConsentManager/douane';
import {events} from './ConsentManager/douane/lib/config';

const render = (target, context) => {
    // TODO simply this
    const openConsentDetails = elem => {
        const event = new Event(events.TOGGLE_SHOW_DETAILS, {bubbles: true});
        elem.dispatchEvent(event);
    };

    window._jcm_ = {
        openConsentDetails
    };

    try {
        context = contextValidator(context);

        const headers = {};
        if (context.gqlAuthorization) {
            headers.Authorization = context.gqlAuthorization;
        }

        const client = new ApolloClient({
            uri: context.gqlEndpoint,
            headers
        });

        ReactDOM.render(
            <Store jContent={context}>
                <ApolloProvider client={client}>
                    <App/>
                </ApolloProvider>
            </Store>,
            document.getElementById(target)
        );
    } catch (e) {
        console.error('error : ', e);
        // Note: create a generic error handler
        return (
            <AjvError
                item={e.message}
                errors={e.errors}
            />
        );
    }
};

window.jahiaConsentManager = render;
