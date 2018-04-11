'use strict';

import InitialState from './appInitialState';

const {
	SET_PLATFORM,
	SET_CHANNEL,
	SET_HOST,
} = require('../../constants/actionTypes').default;

const initialState = new InitialState;

export default function appReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.merge(state);

    switch (action.type) {
		case SET_PLATFORM:
			return state.set('platform', action.payload);
		case SET_CHANNEL:
			return state.set('channel', action.payload);
		case SET_HOST:
			return state.set('host', action.payload);

			break;
    }

    return state;
}
