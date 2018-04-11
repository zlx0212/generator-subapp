'use strict';

import InitialState from './couponInitialState';
import Immutable, {Map} from 'immutable';

const {
	SET_HOST,
	SET_CONTENT_CODE,
	COUPON_CENTER_REQUEST,
	COUPON_CENTER_SUCCESS,
	COUPON_CENTER_FAILURE,
	GET_COUPON_REQUEST,
	GET_COUPON_SUCCESS,
	GET_COUPON_FAILURE,
	JUMP_WITH_URL,
	HIDE_SUCCESS_PROMPT,
	HIDE_NET_ERROR_PROMPT,
} = require('../../constants/actionTypes').default;

const initialState = new InitialState;

export default function couponReducer(state=initialState, action) {
    switch(action.type) {
    	case SET_HOST:{
    		return state.set('host',action.payload);
    	}

    	case SET_CONTENT_CODE: {
			return state.set('contentCode', action.payload);
		}

		case COUPON_CENTER_REQUEST: {
			return state.set('isFetching', true)
			.set('error', null);
		}

		case COUPON_CENTER_SUCCESS: {
			return state.set('isFetching', false)
			.set('error', null)
			.set('floors', Immutable.fromJS(action.payload));
		}

		case COUPON_CENTER_FAILURE: {
			return state.set('isFetching', false)
			.set('error', action.payload)
			.set('showNetErrorTip', true);
		}

		case GET_COUPON_REQUEST: {
			return state.set('isFetching', true)
			.set('error', null)
			.set('showSuccessTip', false);
		}

		case GET_COUPON_SUCCESS: {
			return state.set('isFetching', false)
			.set('error', null)
			.set('floors', Immutable.fromJS(action.payload))
			.set('showSuccessTip', true);
		}

		case GET_COUPON_FAILURE: {			
			return state.set('isFetching', false)
			.set('error', action.payload)
			.set('showSuccessTip', false)
			.set('showNetErrorTip', true);
		}

		case HIDE_SUCCESS_PROMPT: {
			return state.set('showSuccessTip', false);
		}

		case HIDE_NET_ERROR_PROMPT: {
			return state.set('showNetErrorTip', false);
		}
    }

    return state;
}
