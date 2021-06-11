import get from 'lodash.get';
import consentMapper from './consent';

const getTheme = theme => {
    if (typeof theme === 'string') {
        try {
            return JSON.parse(theme);
        } catch (e) {
            console.error('the user theme => \n' + theme + '\n => is not a json object : ', e);
        }
    }

    return theme;
};

export default function (managerData) {
    console.log('[consentModel] managerData: ', managerData);
    return {
        // NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
        id: get(managerData, 'id'),
        type: get(managerData, 'type.value'),
        logo: get(managerData, 'logo.node.path'),
        consentNodes: get(managerData, 'consentNodes.values', [])
            .map(consentData => consentMapper(consentData)),
        consentDuration: get(managerData, 'consentDuration.value', ''),
        userTheme: getTheme(get(managerData, 'userTheme.value', {}))
    };
}
