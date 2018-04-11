'use strict';

import {Record, List, Map} from 'immutable';

let InitialState = Record({
	contentCode: 'b78b32ed81b18dde8ac84fd33602b88b',
	host:'http://api.yoho.cn',
	isFetching: false,
	error: null,
	floors: List(),
	showSuccessTip: false,
	showNetErrorTip: false,
});

export default InitialState;
