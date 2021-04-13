import React from 'react';
import PropTypes from 'prop-types';

const ConsentDetail = ({consent}) => {
    return (
        <>
            <h4>{consent.name}</h4>
            <div>{consent.description}</div>
            {/*    Note faire le switch pour activer ou non */}
        </>
    );
};

ConsentDetail.propTypes = {
    consent: PropTypes.object.isRequired
};

export default ConsentDetail;
