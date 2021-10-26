import {useEffect} from 'react';
import PropTypes from 'prop-types';

const TriggerLoader = ({eventName}) => {
    useEffect(() => {
        if (!window.dataLayer) {
            console.warn('Google Tag Manager dataLayer is not available');
        } else {
            console.log(`%c Google Tag Manager dataLayer triggerEvent ${eventName}`, 'color: #3c8cba');
            window.dataLayer.push({event: eventName});
        }
    }, [eventName]);

    return (null);
};

TriggerLoader.propTypes = {
    eventName: PropTypes.string.isRequired
};

export default TriggerLoader;
