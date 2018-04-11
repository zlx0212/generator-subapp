import {combineReducers} from 'redux';
import app from './app/appReducer';
import coupon from './coupon/couponReducer';

const rootReducer = combineReducers({
	app,
	coupon,
});

export default rootReducer;
