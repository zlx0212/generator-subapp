'use strict';

import ReactNative from 'react-native';
import CouponService from '../../services/CouponService';
const Platform = require('Platform');

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

export function setContentCode(code) {
    return {
        type: SET_CONTENT_CODE,
        payload: code
    };
}
export function setHost(host) {
    return {
        type: SET_HOST,
        payload: host
    };
}
export function couponCenterRequest() {
    return {
        type: COUPON_CENTER_REQUEST,
    };
}

export function couponCenterSuccess(json) {
    return {
        type: COUPON_CENTER_SUCCESS,
        payload: json
    };
}

export function couponCenterFailure(error) {
    return {
        type: COUPON_CENTER_FAILURE,
        payload: error
    };
}

/*
 * reload bool 是否需要强制重新请求数据，
 */
export function couponCenter(reload = false) {
	return (dispatch, getState) => {
		let {app, coupon} = getState();
        let {isFetching, floors, contentCode} = coupon;
		if (reload) {
			// 强制刷新数据

		} else {
			if (isFetching || floors.size > 0) {
				return;
			}
		}

		let fetchCouponInfo = (contentCode, uid) => {
			dispatch(couponCenterRequest());
			return ReactNative.NativeModules.YH_CouponHelper.couponFloors(contentCode, uid)
			.then(json => {
				let payload;
				if (Platform.OS === 'android') {
					payload = parseFloors(JSON.parse(json));
				}else{
					 payload = parseFloors(json);
				}

				dispatch(couponCenterSuccess(payload.floors));
				dispatch(dataExposure(payload.logFloors));
				dispatch(couponExtraData(payload.floors ,contentCode, uid));
			})
			.catch(error => {
				dispatch(couponCenterFailure(error));
			});
		}

		ReactNative.NativeModules.YH_CommonHelper.uid()
		.then(uid => {
			fetchCouponInfo(contentCode, uid);
		})
		.catch(error => {
			fetchCouponInfo(contentCode, '0');
		});
	};
}

function couponExtraData(originFloors, contentCode, uid) {
	return (dispatch, getState) => {

	    let {app} = getState();
		return new CouponService(app.host).fetchExtraData(contentCode, uid)
			.then(json => {

				originFloors.map((item, i) => {
					if (item.templateName == 'getCoupon' && item.data) {
						json.map((extraItem, k) => {

							let tempId = extraItem.couponId + '';
							if (item.data.couponID == tempId) {
								item.data.status = extraItem.status?extraItem.status:'';
								item.data.hasNum = extraItem.hasNum?extraItem.hasNum:0;
							}
						})
					}
				})
				dispatch(couponCenterSuccess(originFloors));
			})
			.catch(error => {
				console.log(error);
			});
	}
}

function parseFloors(json) {
	let carousel_banner = (data) => {
		let images = [];
		data && data.list && data.list.map((item, i) => {
			let src = item.src ? item.src : '';
			let url = item.url ? item.url : '';
			images.push({src, url});
		});
		return images;
	};

	let focus = (data) => {
		let images = [];
		data && data.map((item, i) => {
			let src = item.src ? item.src : '';
			let url = item.url ? item.url : '';
			images.push({src, url});
		});
		return images;
	};

	let text = (data) => {
		let text = data && data.text ? data.text : '';
		return text;
	};

	let single_image = (data) => {
		let src = data && data[0] && data[0].src ? data[0].src : '';
		let url = data && data[0] && data[0].url ? data[0].url : '';
		return {src, url};
	};

	let getCoupon = (data) => {
		let coupon = data && data[0] ? data[0] : {};
		let text = coupon.text ? coupon.text : '';
		let couponID = coupon.couponID ? coupon.couponID : '';
		let image = {
			src : coupon.image && coupon.image.src ? coupon.image.src : '',
			url : coupon.image && coupon.image.url ? coupon.image.url : '',
		};
		let isShow = coupon.isShow;
		let status = coupon.status;
		return {
			text,
			couponID,
			image,
			isShow,
			status,
		};
	};

	let floors = [];
	let logFloors = [];
	json && json.map((item, i) => {
		let templateName = item.template_name;
		if (!templateName) {
			templateName = item.templateName;
		}

		let templateId = item.template_id;
		if (!templateId) {
			templateId = item.templateId;
		}

		let data;
		let logData = [];
		if (templateName == 'carousel_banner') {
			data = carousel_banner(item.data);
			data.map((item, i) => {
				logData.push({
					I_INDEX: i + 1,
					ACTION_URL: item.src,
				});
			});
		} else if (templateName == 'focus') {
			data = focus(item.data);
			data.map((item, i) => {
				logData.push({
					I_INDEX: i + 1,
					ACTION_URL: item.src,
				});
			});
		} else if (templateName == 'text') {
			data = text(item.data);
			logData.push({
				I_INDEX: 1,
				TEXT: data,
			});
		} else if (templateName == 'single_image') {
			data = single_image(item.data);
			logData.push({
				I_INDEX: 1,
				ACTION_URL: data.src,
			});
		} else if (templateName == 'getCoupon') {
			data = getCoupon(item.data);
			if(!data.couponID){
				if(floors.length>1){
					if(floors[floors.length-1].templateName=='text'){
						floors.pop();
						logFloors.pop();
					}
				}
			} else {
				logData.push({
					I_INDEX: 1,
					ACTION_URL: data.image.src,
					COUPON_ID: data.couponID,
				});
			}
		}

		let floor = {
			data,
			templateName,
			templateId,
		};
		floors.push(floor);

		let logFloor = {
			"F_NAME" : templateName,
          	"F_ID" : templateId,
          	"LIST" : logData,
		};
		logFloors.push(logFloor);
	});

	return {
		floors,
		logFloors,
	};
}

function dataExposure(data) {
	return (dispatch, getState) => {
		let params = {
			DATA: data,
		};
		// console.log('YB_SHOW_COUPON_CENTER')
		// console.log(params)
		ReactNative.NativeModules.YH_CommonHelper.logEvent('YB_SHOW_COUPON_CENTER', params);
	};
}

export function getCouponRequest() {
    return {
        type: GET_COUPON_REQUEST,
    };
}

export function getCouponSuccess(json) {
    return {
        type: GET_COUPON_SUCCESS,
        payload: json
    };
}

export function getCouponFailure(error) {
    return {
        type: GET_COUPON_FAILURE,
        payload: error
    };
}

export function getCoupon(couponID) {
	return (dispatch, getState) => {
		let getCoupon = (couponID, uid) => {

			let success =  () => {
				let floors = getState().coupon.floors.toJS();
				for (var i = 0; i < floors.length; i++) {
					let item = floors[i];
					if (item.templateName == 'getCoupon' && item.data.couponID == couponID) {
						item.data.status = 3; //领取成功
						break;
					}

				}
				dispatch(getCouponSuccess(floors));

				let param = {
				 	PAGE_NM: '领券中心',
					PAGE_URL: '',
					COUP_ID: couponID,
			  	};

				ReactNative.NativeModules.YH_CommonHelper.logEvent('YB_GET_COUP', param);
			}

			dispatch(getCouponRequest());
			return ReactNative.NativeModules.YH_CouponHelper.getCoupon(couponID, uid)
			.then(json => {
				success();
			})
			.catch(error => {
				if (error && error.code && error.code == 401) {
					success();
				}
				dispatch(getCouponFailure(error));
			});
		}

		ReactNative.NativeModules.YH_CommonHelper.uid()
		.then(uid => {
			getCoupon(couponID, uid);
		})
		.catch(error => {
			ReactNative.NativeModules.YH_CommonHelper.login()
			.then(uid => {
				getCoupon(couponID, uid);
			})
			.catch(error => {

			});
		});
	};
}

export function jumpWithUrl(url) {
	if (!url) {
		__DEV__ && console.log('Illegal url');
		return {
	        type: JUMP_WITH_URL
	    }
	}

    ReactNative.NativeModules.YH_CommonHelper.jumpWithUrl(url);
    return {
        type: JUMP_WITH_URL,
		payload: url
    };
}

export function promptHidden() {
	return {
		type: HIDE_SUCCESS_PROMPT,
	};
}

export function netPromptHidden() {
	return {
		type: HIDE_NET_ERROR_PROMPT,
	};
}
