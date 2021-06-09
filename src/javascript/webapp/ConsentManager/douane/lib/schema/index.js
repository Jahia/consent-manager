import {workspace} from '../config';
export default {
    context: {
        title: 'context validation schema ',
        description: 'context is an object provided by the page in charge to load the app',
        type: 'object',
        properties: {
            language: {type: 'string', pattern: '[a-z]{2}(?:_[A-Z]{2})?'}, // "fr" or "fr_FR"
            siteUUID: {type: 'string'}, // "3ff7b68c-1cfa-4d50-8377-03f19db3a985"
            siteName: {type: 'string'}, // "Acme"
            siteKey: {type: 'string'}, // "acme"
            workspace: {
                type: 'string',
                enum: workspace,
                default: workspace[1]// "live"
            },
            cdpEndPoint: {
                type: 'string',
                format: 'uri'
            },
            baseURL: {
                type: 'string',
                format: 'uri',
                default: 'http://localhost:8080'
            },
            gqlAuthorization: {type: 'string'}// "Basic aaaaAaa223" or token
        },
        required: [
            'language',
            'siteUUID',
            'siteName',
            'siteKey',
            'baseURL',
            'gqlAuthorization'
        ],
        additionalProperties: false
    }
};
