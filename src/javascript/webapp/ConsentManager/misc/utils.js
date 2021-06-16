
const getRandomString = (length, format) => {
    let mask = '';
    if (format.indexOf('a') > -1) {
        mask += 'abcdefghijklmnopqrstuvwxyz';
    }

    if (format.indexOf('A') > -1) {
        mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    if (format.indexOf('#') > -1) {
        mask += '0123456789';
    }

    if (format.indexOf('!') > -1) {
        mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    }

    let result = '';
    for (let i = length; i > 0; --i) {
        result += mask[Math.floor(Math.random() * mask.length)];
    }

    return result;
};

const getGQLWorkspace = workspace => {
    return workspace === 'default' ?
        'EDIT' :
        workspace.toUpperCase();
};

export {
    getRandomString,
    getGQLWorkspace
};
