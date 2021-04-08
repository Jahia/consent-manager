import {gql} from 'apollo-boost';
import {PredefinedFragments} from '@jahia/data-helper';

const GET_CONSENTS = gql`
    query getConsents($workspace: Workspace!, $id: String!) {
        response: jcr(workspace: $workspace) {
            site: nodeById(uuid: $id) {
                id: uuid
                type:primaryNodeType{
                    value:name
                }
                consentNodes: property(name:"j:consentNodes"){
                    values: refNodes {
                        id: uuid,
                        type: primaryNodeType{
                            name
                        }
                        path
                        category: property(name:"j:category"){
                            node: refNode {
                                name: displayName
                            }
                        }
                        isActive:property(name:"j:isActive"){
                            value
                        }
                    }
                }
                consentDuration: property(name:"j:cookieDuration"){
                    value
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {GET_CONSENTS};
