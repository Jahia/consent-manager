import Ajv from 'ajv';
import schema from './lib/schema';
import {ContextException} from '../exceptions/ContextException';

const ajv = new Ajv({useDefaults: true});

function getGQLWorkspace(workspace) {
    return workspace === 'default' ?
        'EDIT' :
        workspace.toUpperCase();
}

// Note the try catch should be done here and a React component should be returned
const contextValidator = context => {
    const valid = ajv.validate(schema.context, context);
    if (!valid) {
        throw new ContextException({
            message: 'Context configuration object',
            errors: ajv.errors
        });
    }

    context.gqlEndpoint = `${context.baseUrl}/modules/graphql`;
    context.gqlVariables = {
        id: context.siteUUID,
        language: context.language,
        workspace: getGQLWorkspace(context.workspace)
    };
    return context;
};

export {
    contextValidator
};
