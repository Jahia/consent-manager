import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './lib/schema';
import {ContextException} from '../exceptions/ContextException';

const ajv = new Ajv({useDefaults: true});
addFormats(ajv);

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

    context.gqlEndpoint = `${context.baseURL}/modules/graphql`;
    context.filesEndpoint = `${context.baseURL}/files/${context.workspace}`;
    context.gqlVariables = {
        id: context.siteUUID,
        language: context.language,
        workspace: getGQLWorkspace(context.workspace)
    };
    console.log('[Douane] context : ', context);
    return context;
};

export {
    contextValidator
};
