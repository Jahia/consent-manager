import {useEffect} from 'react';
// Import {StoreContext} from '../../contexts'; // UseEffect,useContext
import PropTypes from 'prop-types';

const ScriptLoader = ({scriptText}) => {
    useEffect(() => {
        const script = document.createElement('script');

        // Script.src = url;
        script.textContent = scriptText;// Note Dom.purify ?
        script.async = true;

        document.head.appendChild(script);

        // Return () => {
        //     console.log('[ScriptLoader] useEffect return !');
        //     // Document.head.removeChild(script);
        // };
    }, [scriptText]);

    return (null);
};

ScriptLoader.propTypes = {
    scriptText: PropTypes.string.isRequired
};

export default ScriptLoader;
