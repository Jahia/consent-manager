import get from 'lodash.get';

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

export default function (configData) {
    console.debug('[model-config] configData: ', configData);
    // NOTE to be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    return Object.keys(configData).reduce((bundle, key) => {
        let value;
        switch (key) {
            case 'userTheme':
                value = getTheme(get(configData, `${key}.value`, {}));
                break;
            case 'logo':
                value = get(configData, 'logo.node.path');
                break;
            default:
                value = get(configData, `${key}.value`);
                break;
        }

        bundle[key] = value;
        return bundle;
    }, {});
}
