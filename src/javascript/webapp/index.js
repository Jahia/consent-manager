import React from 'react';
import ReactDOM from 'react-dom';
import App from './ConsentManager/App';

import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';

import {Store} from './ConsentManager/store';

const render = (target, context) => {
    const headers = {};
    if (context.gql_authorization) {
        headers.Authorization = context.gql_authorization;
    }

    const client = new ApolloClient({
        uri: context.gql_endpoint,
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
};

window.jahiaConsentManager = render;
