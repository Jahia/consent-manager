import React from 'react';
import {StoreContext} from '../contexts';
import * as PropTypes from 'prop-types';

// Import {getRandomString} from 'misc/utils';
// Import {syncQuizScore} from "misc/tracker";
import managerMapper from '../model/manager';
// Import App from 'src/javascript/webapp/ConsentManager/App';

const init = jContent => {
    let userConsentPreference = {
        isActive: false,
        consents: []
    };
    const storageKey = `_jcm_ucp_${jContent.siteUUID}`;
    /* eslint no-unused-vars: ["error", {"args": "after-used"}] */

    try {
        if (localStorage.getItem(storageKey)) {
            userConsentPreference = JSON.parse(localStorage.getItem(storageKey));
        }
    } catch (e) {
        console.warn('no user consent preferences stored in localstorage or data are corrupted');
    }

    return {
        jContent,
        storageKey,
        manager: {consentNodes: []},
        showSideDetails: false,
        showWrapper: !userConsentPreference.isActive,
        userConsentPreference
        // ResultSet:[],//array of boolean, order is the same a slideSet
        // currentResult:false,//previously result
        // slideSet:[],//previously slideIndex
        // currentSlide:null,//previously index
        // showResult:false,
        // showNext:false,
        // showScore:false,
        // max:-1,
        // score:0,
        // cxs:null,
        // reset:false,
        // scoreIndex:getRandomString(5,"#aA")
    };
};

const reducer = (state, action) => {
    const {payload} = action;

    switch (action.case) {
        case 'DATA_READY': {
            // Prepare slideIds
            const {managerData} = payload;
            console.debug('[STORE] DATA_READY - managerData: ', managerData);
            const manager = managerMapper(managerData);
            console.debug('[STORE] DATA_READY - manager: ', manager);
            return {
                ...state,
                manager
            };
        }

        case 'TOGGLE_SHOW_DETAILS': {
            console.debug('[STORE] TOGGLE_SHOW_DETAILS');
            return {
                ...state,
                showSideDetails: !state.showSideDetails
            };
        }

        // Case 'UPDATE_USER_CONSENT_PREFERENCES': {
        //     console.debug('[STORE] UPDATE_USER_CONSENT_PREFERENCES');
        //     const userConsentPreference = {
        //         date:Date.now(),
        //         consents:state.manager.consentNodes.filter(consent=>consent.)
        //     }
        //     localStorage.setItem(storageKey,JSON.stringify(userConsentPreference))
        //     //Reload the page to restart the cookie loading process
        //     //We don't care about the return because page is reloaded
        //     return {
        //         ...state,
        //         userConsentPreference:
        //     };
        // }

        case 'DENY_ALL': {
            console.debug('[STORE] DENY_ALL');

            // LocalStorage.setItem(storageKey,JSON.stringify(userConsentPreference))
            return {
                ...state
            };
        }

        case 'GRANT_ALL': {
            console.debug('[STORE] GRANT_ALL');
            const {jContent, manager, storageKey} = state;
            const userConsentPreference = {
                project: jContent.siteKey,
                isActive: true,
                date: Date.now(),
                consents: manager.consentNodes.map(consent => {
                    return {id: consent.id, value: true};
                })
            };
            localStorage.setItem(storageKey, JSON.stringify(userConsentPreference));
            console.debug('[STORE] localStorage.setItem : ', JSON.stringify(userConsentPreference));
            return {
                ...state,
                userConsentPreference
            };
        }

        // Case "ADD_CXS": {
        //     const cxs = payload.cxs;
        //     console.debug("[STORE] ADD_CXS - cxs: ",cxs);
        //     return {
        //         ...state,
        //         cxs
        //     };
        // }
        // case "ADD_SLIDES": {
        //     const slides = payload.slides;
        //     const parentSlide = payload.parentSlide;
        //     let slideSet = state.slideSet;
        //
        //     if (parentSlide && slideSet.includes(parentSlide)) {
        //         const position = slideSet.indexOf(parentSlide) + 1;
        //         slideSet.splice(position, 0, ...slides);
        //     } else {
        //         slideSet = [...slideSet, ...slides];
        //     }
        //
        //     const max = slideSet.length -1;
        //
        //     console.debug("[STORE] ADD_SLIDE - slides: ",slides," parentSlide: ",parentSlide);
        //     return {
        //         ...state,
        //         slideSet,
        //         showNext:showNext({slideSet,max,slide:state.currentSlide}),
        //         max
        //     };
        // }
        // case "NEXT_SLIDE":{
        //     const currentIndex = state.slideSet.indexOf(state.currentSlide);
        //     const nextIndex = currentIndex+1;
        //     console.debug("[STORE] NEXT_SLIDE - currentIndex: ",currentIndex,", max : ",state.max);
        //
        //     let nextSlide = state.currentSlide;
        //
        //     if(currentIndex  < state.max )
        //         nextSlide = state.slideSet[nextIndex];
        //
        //     return {
        //         ...state,
        //         currentSlide:nextSlide,
        //         showNext: showNext({...state,slide:nextSlide}),
        //         showResult:false,
        //         reset:false
        //     };
        // }
        // case "SHOW_SLIDE": {
        //     const slide = payload.slide
        //     console.debug("[STORE] SHOW_SLIDE - slide: ",slide);
        //     return {
        //         ...state,
        //         currentSlide: slide,
        //         showNext: showNext({...state, slide})
        //     };
        // }
        // case "SHOW_RESULT": {
        //     const currentResult = payload.result;
        //     const currentIndex = state.slideSet.indexOf(state.currentSlide);
        //     const showScore = currentIndex === state.max-1;
        //     console.debug("[STORE] SHOW_RESULT - currentResult: ", currentResult);
        //
        //     return {
        //         ...state,
        //         showScore,
        //         resultSet: [...state.resultSet, currentResult],
        //         currentResult,
        //         showResult: true
        //     };
        // }
        // case "SHOW_SCORE": {
        //     console.debug("[STORE] SHOW_SCORE");
        //     const [slide] = state.slideSet.slice(-1);
        //
        //     const goodAnswers = state.resultSet.filter(result => result).length;
        //     const answers = state.resultSet.length;
        //     const score = Math.floor((goodAnswers/answers)*100);
        //
        //     syncQuizScore({
        //         quizKey:state.quiz.key,
        //         split:state.jContent.score_splitPattern,
        //         quizScore:score
        //     });
        //
        //     return {
        //         ...state,
        //         currentSlide: slide,
        //         showNext: showNext({...state, slide}),
        //         showResult:false,
        //         score
        //     };
        // }
        // case "RESET": {
        //     console.debug("[STORE] RESET");
        //
        //     const [currentSlide] = state.slideSet.slice(0,1);
        //     console.debug("[STORE] RESET slideSet",state.slideSet);
        //
        //     return {
        //         ...state,
        //         currentSlide,
        //         resultSet:[],
        //         currentResult:false,
        //         reset:true
        //     }
        // }
        default:
            throw new Error(`[STORE] action case '${action.case}' is unknown `);
    }
};

export const Store = props => {
    const [state, dispatch] = React.useReducer(
        reducer,
        props.jContent,
        init
    );
    return (
        <StoreContext.Provider value={{state, dispatch}}>
            {props.children}
        </StoreContext.Provider>
    );
};

Store.propTypes = {
    jContent: PropTypes.object.isRequired,
    children: PropTypes.object
};
