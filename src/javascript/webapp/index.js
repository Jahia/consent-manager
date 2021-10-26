import React from 'react';
import ReactDOM from 'react-dom';
import App from './ConsentManager/App';

import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';

import {Store} from './ConsentManager/store';
import AjvError from './ConsentManager/components/Error/Ajv';
import {contextValidator} from './ConsentManager/douane';
import {StylesProvider, createGenerateClassName} from '@material-ui/core/styles';
import {getRandomString} from './ConsentManager/misc/utils';

const generateClassName = createGenerateClassName({
    // DisableGlobal:true,
    seed: getRandomString(8, 'aA')
});

const render = (target, context) => {
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
            <StylesProvider generateClassName={generateClassName}>
                <Store jContent={context}>
                    <ApolloProvider client={client}>
                        <App/>
                    </ApolloProvider>
                </Store>
            </StylesProvider>,
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
