/**
 * # configureStore.js
 *
 * A Redux boilerplate setup
 *
 */
'use strict';

/**
 * ## Imports
 *
 * redux functions
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

/**
* ## Reducer
* The reducer contains the 4 reducers from
* device, global, auth, profile
*/
import reducer from '../reducers';

const logger = createLogger({
	predicate: (getState, action) => process.env.NODE_ENV === `development`
});

/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */
const createStoreWithMiddleware = applyMiddleware(
	thunk,
	logger
)(createStore);

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, auth, profile
 *
 */
export default function configureStore(initialState) {
	return createStoreWithMiddleware(reducer, initialState);
};
