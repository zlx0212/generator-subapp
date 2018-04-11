'use strict';

import Request from '../../common/services/NativeRequest';

export default class CouponService {

	constructor (host) {
		let baseURL = 'http://api.yoho.cn';
		if(host){
			baseURL = host;
		}
		this.api = new Request(baseURL);
	}

	async fetchExtraData(contentCode, uid) {
		return await this.api.get({
			url: '',
			body: {
				method: 'app.promotion.couponStatus',
				contentCode,
				uid,
				'debug':'XYZ',
			}
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			throw(error);
		});
	}

	async fetchFloors(contentCode, uid) {
		return await this.api.get({
			url: '',
			body: {
				method: 'app.promotion.queryCouponCenter',
				contentCode,
				uid,
			}
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			throw(error);
		});
	}

	async getCoupon(couponId, uid) {
		return await this.api.get({
			url: '',
			body: {
				method: 'app.promotion.getCoupon',
				couponId,
				uid,
			}
		})
		.then((json) => {
			return json;
		})
		.catch((error) => {
			throw(error);
		});
	}

}
