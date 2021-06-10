import {useEffect} from 'react';
import PropTypes from 'prop-types';

const TriggerLoader = ({eventName}) => {
    useEffect(() => {
        if (!window.dataLayer) {
            console.warn('Google Tag Manager dataLayer is not available');
        } else {
            console.warn(`Google Tag Manager dataLayer triggerEvent ${eventName}`);
            window.dataLayer.push({event: eventName});
        }
    }, [eventName]);

    return (null);
};

TriggerLoader.propTypes = {
    eventName: PropTypes.string.isRequired
};

export default TriggerLoader;
