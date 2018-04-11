'use strict';

import React from 'react';
import ReactNative, {
	AppRegistry,
	Platform,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';

import {
	Provider,
	connect
} from 'react-redux';

import configureStore from './store/configureStore';
import {Record, List, Map} from 'immutable';

import appInitialState from './reducers/app/appInitialState';
import couponInitialState from './reducers/coupon/couponInitialState';

import CouponCenterContainer from './containers/CouponCenterContainer';

import {
	setPlatform,
	setChannel,
} from './reducers/app/appActions';

import {
	setContentCode,
	setHost,
} from './reducers/coupon/couponActions';

function getInitialState() {
	const _initState = {
		app: (new appInitialState()),
    	coupon: (new couponInitialState()),
	};
	return _initState;
}

export default function native(platform) {

	let YH_Coupon = React.createClass({

		render() {
		  	const store = configureStore(getInitialState());
			store.dispatch(setPlatform(platform));
			let channel = this.props.channel;
			channel && store.dispatch(setChannel(channel));
			if(this.props.contentCode){
				store.dispatch(setContentCode(this.props.contentCode));
			}
			store.dispatch(setHost(this.props.host));
			return (
				<Provider store={store}>
					<CouponCenterContainer />
				</Provider>
			);
		}
	});

	AppRegistry.registerComponent('YH_Coupon', () => YH_Coupon);
}

let styles = StyleSheet.create({

});
