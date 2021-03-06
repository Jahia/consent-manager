import {gql} from 'apollo-boost';
// Import {PredefinedFragments} from '@jahia/data-helper';

const GET_CONSENTS = gql`
    query getConsents($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            site: nodeById(uuid: $id) {
                id: uuid
                type:primaryNodeType{
                    value:name
                }
                consentNodes: property(language:$language,name:"j:consentNodes"){
                    values: refNodes {
                        id: uuid
                        name: displayName
                        type: primaryNodeType{
                            name
                        }
                        path
                        category: property(language:$language,name:"j:category"){
                            node: refNode {
                                name: displayName
                            }
                        }
                        description:property(language:$language,name:"j:description"){
                            value
                        }
                        event2Triggered:property(name:"j:event2Triggered"){
                            value
                        }
                        js2Execute:property(name:"j:js2Execute"){
                            value
                        }
                        isMandatory:property(name:"j:isMandatory"){
                            value
                        }
                        defaultState:property(name:"j:defaultState"){
                            value
                        }
                    }
                }
                consentDuration: property(name:"j:cookieDuration"){
                    value
                }
                consentManagerConfig: property(name:"j:webAppConfig"){
                    value: refNode {
                        userTheme: property(name:"j:webappTheme"){
                            value
                        }
                        logo: property(language:$language,name:"j:cmCompanyLogo",){
                            node: refNode {
                                id: uuid
                                type: primaryNodeType{
                                    value:name
                                }
                                mixins: mixinTypes{
                                    value:name
                                }
                                path
                            }
                        }
                        modalDescription: property(language:$language, name:"j:modalDescription"){
                            value
                        },
                        modalTitle: property(language:$language, name:"j:modalTitle"){
                            value
                        },
                        sideModalTitle: property(language:$language, name:"j:sideModalTitle"){
                            value
                        },
                        btnReview: property(language:$language, name:"j:btnReview"){
                            value
                        },
                        btnDenyAll: property(language:$language, name:"j:btnDenyAll"){
                            value
                        },
                        btnGrantAll: property(language:$language, name:"j:btnGrantAll"){
                            value
                        },
                        btnCancel: property(language:$language, name:"j:btnCancel"){
                            value
                        },
                        btnSavePreference: property(language:$language, name:"j:btnSavePreference"){
                            value
                        }
                    }
                }
            }
        }
    }
`;

export {GET_CONSENTS};
