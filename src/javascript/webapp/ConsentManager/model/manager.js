import get from 'lodash.get';
import consentMapper from './consent';

export default function (managerData) {
    console.log('[consentModel] managerData: ', managerData);
    return {
        // NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
        id: get(managerData, 'id'),
        type: get(managerData, 'type.value'),
        consentNodes: get(managerData, 'consentNodes.values', [])
            .map(consentData => consentMapper(consentData)),
        consentDuration: get(managerData, 'consentDuration.value', '')
    };
}
