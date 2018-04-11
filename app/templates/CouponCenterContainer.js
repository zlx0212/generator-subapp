'use strict'

import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    Platform,
    View,
    NativeModules,
    InteractionManager,
    NativeAppEventEmitter,
} from 'react-native'

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import * as couponActions from '../reducers/coupon/couponActions';
import CouponCenter from '../components/coupon/CouponCenter';

const actions = [
    couponActions,
];

function mapStateToProps(state) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch) {

    const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

class CouponCenterContainer extends Component {
    constructor(props) {
        super(props);

        this._onPressBanner = this._onPressBanner.bind(this);
        this._onPressImage = this._onPressImage.bind(this);
        this._onPressCoupon = this._onPressCoupon.bind(this);
        this._onGetCoupon = this._onGetCoupon.bind(this);
        this._onPromptHidden = this._onPromptHidden.bind(this);
        this._onNetPromptHidden = this._onNetPromptHidden.bind(this);
        this.logEvent = this.logEvent.bind(this);

        // this.subscription = NativeAppEventEmitter.addListener(
        //     'UserDidLoginEvent',
        //     (reminder) => {
        //         this.props.actions.couponCenter(true);
        //     }
        // );
    }

    componentDidMount() {
        this.props.actions.couponCenter();
    }

    componentWillUnmount() {
        // this.subscription && this.subscription.remove();
    }

    _onPressBanner(url, index=0, floorIndex=0, templateId='', templateName='') {
        this.props.actions.jumpWithUrl(url);

        this.logEvent(templateId, templateName, url, floorIndex, index);
    }

    _onPressImage(url, index=0, floorIndex=0, templateId='', templateName='') {
        this.props.actions.jumpWithUrl(url);

        this.logEvent(templateId, templateName, url, floorIndex, index);
    }

    _onPressCoupon(url, index=0, floorIndex=0, templateId='', templateName='') {
        this.props.actions.jumpWithUrl(url);

        this.logEvent(templateId, templateName, url, floorIndex, index);
    }

    logEvent(templateId, templateName, url, floorIndex, index) {
        let channel = this.props.app.channel;
        let params = {
            C_I: channel,
            F_ID: templateId,
            F_NAME: templateName,
            F_URL: url,
            F_INDEX: (parseInt(floorIndex) + 1) + '',
            I_INDEX: (parseInt(index) + 1) + '',
        };
        NativeModules.YH_CommonHelper.logEvent('YB_LEADING_CENTER_FLR_C', params);
    }

    _onGetCoupon(couponID) {
        this.props.actions.getCoupon(couponID);
    }

    _onPromptHidden() {
        this.props.actions.promptHidden();
    }

    _onNetPromptHidden() {
        this.props.actions.netPromptHidden();
    }

    render() {
        let {isFetching, floors, showSuccessTip, showNetErrorTip, error} = this.props.coupon;
        
        return (
            <CouponCenter
                isFetching={isFetching}
                floors={floors}
                onPressBanner={this._onPressBanner}
                onPressImage={this._onPressImage}
                onPressCoupon={this._onPressCoupon}
                onGetCoupon={this._onGetCoupon}
                showSuccessTip={showSuccessTip}
                onPromptHidden={this._onPromptHidden}
                showNetErrorTip={showNetErrorTip}
                onNetPromptHidden={this._onNetPromptHidden}
                error={error}
            />
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(CouponCenterContainer);
