import get from 'lodash.get';

export default function (siteData) {
    return {
        // NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
        id: get(siteData, 'id'),
        type: get(siteData, 'type.value'),
        consentNodes: get(siteData, 'consentNodes.values', []).map(node => {
            return {
                id: get(node, 'id'),
                name: get(node, 'name'),
                category: get(node, 'category.node.name'),
                isActive: JSON.parse(get(node, 'isActive.value'))
            };
        }).filter(node => node.isActive),
        consentDuration: get(siteData, 'consentDuration.value', '')
    };
}
