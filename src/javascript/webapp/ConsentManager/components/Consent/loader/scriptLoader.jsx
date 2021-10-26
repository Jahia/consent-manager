import {useEffect} from 'react';
import PropTypes from 'prop-types';

const ScriptLoader = ({scriptText}) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.textContent = scriptText;// Note Dom.purify ?
        script.async = true;

        document.head.appendChild(script);
    }, [scriptText]);

    return (null);
};

ScriptLoader.propTypes = {
    scriptText: PropTypes.string.isRequired
};

export default ScriptLoader;
