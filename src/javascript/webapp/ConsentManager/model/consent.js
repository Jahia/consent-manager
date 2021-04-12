import get from 'lodash.get';
import {consentStatus} from '../douane/lib/config';

export default function (consentData) {
    console.log('[model-consent] consentData: ', consentData);

    const defaultState = get(consentData, 'defaultState.value', 'denied');
    const isGranted = defaultState === consentStatus.GRANTED;

    return {
        // NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
        id: get(consentData, 'id'),
        name: get(consentData, 'name'),
        category: get(consentData, 'category.node.name'),
        description: get(consentData, 'description.value'),
        event2Triggered: get(consentData, 'event2Triggered.value', null),
        js2Execute: get(consentData, 'js2Execute.value', null),
        isGranted
    };
}
