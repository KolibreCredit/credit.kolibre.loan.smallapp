// pages/login/login2.js
const app = getApp();
const constants = app.constants;
const dialog = require('../../utils/showToast');
const mui = {
    toast: function (title) {
        dialog.showToast({
            title: title,
            mask: false
        });
    }
};
var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
//
var waitTimer2 = null;
var waitCount2 = 60;
var isSendCaptcha2 = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cellphone: "",
        validateCode: "",
        captchaText: "获取验证码",
        isVoice: true,
        isPost: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            cellphone: options.cellphone
        });
        this.sendCaptcha();
    },
    bindKeyInput: function (e) {
        this.setData({
            validateCode: e.detail.value
        });
    },
    sendCaptcha: function () {
        if (!isSendCaptcha) {
            return false;
        }
        var cellphone = this.data.cellphone;
        if (cellphone == '') {
            mui.toast(constants.MSGINFO.PHONE);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.MSGINFO.PHONEERR);
            return false;
        }
        var businessType = "AccountRegisterOrLogin";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        var that = this;
        isSendCaptcha = false;
        waitTimer = setInterval(function () {
            if (waitCount > 0) {
                that.setData({
                    captchaText: waitCount + '秒'
                });
                waitCount = waitCount - 1;
                if (waitCount == 40) {
                    that.setData({isVoice: true});
                }
            } else {
                clearInterval(waitTimer);
                that.setData({
                    captchaText: '获取验证码'
                });
                waitCount = 60;
                isSendCaptcha = true;
            }
        }, 1000);
        app.postInvoke(constants.URLS.SEND, data, function (res) {
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.SEND);
            } else {
                waitCount = 0;
                mui.toast(res.message);
            }
        }, function (res) {
            waitCount = 0;
            mui.toast(res.message);
        });
    },
    voiceCallCaptcha: function () {
        if (isSendCaptcha2) {
            var businessType = "AccountRegisterOrLogin";
            var data = {
                cellphone: this.data.cellphone,
                businessType: businessType,
                byVoiceCall: true
            };
            waitTimer2 = setInterval(function () {
                if (waitCount2 > 0) {
                    waitCount2 = waitCount2 - 1;
                } else {
                    clearInterval(waitTimer2);
                    waitCount2 = 60;
                    isSendCaptcha2 = true;
                }
            }, 1000);
            isSendCaptcha2 = false;
            app.postInvoke(constants.URLS.SEND, data, function (res) {
                isSendCaptcha2 = true;
            }, function (err) {
                isSendCaptcha2 = true;
            });
        }
    },
    enumLoginState: function (loginState) {
        if (loginState == "PasswordError") {
            mui.toast(constants.MSGINFO.LOGINERR1);
        }
        else if (loginState == "PasswordNotExist") {
            mui.toast(constants.MSGINFO.LOGINERR2);
        }
        else if (loginState == "Locked") {
            mui.toast(constants.MSGINFO.LOGINERR3);
        }
        else {
            mui.toast(constants.MSGINFO.LOGINERR4);
        }
    },
    retlogin: function () {
        setTimeout(function () {
            wx.switchTab({url: '/pages/customer/index'});
        }, 2000);
    },
    loginByCaptcha: function () {
        var captcha = this.data.validateCode;
        if (captcha == '') {
            mui.toast(constants.MSGINFO.CAPTCHA);
            return false;
        }
        if (!constants.REGEX.CHECKCODE.test(captcha)) {
            mui.toast(constants.MSGINFO.CAPTCHAERR);
            return false;
        }
        this.setData({isPost: true});
        var verify = {
            cellphone: this.data.cellphone,
            businessType: "AccountRegisterOrLogin",
            validateCode: captcha
        };
        var that = this;
        app.postInvoke(constants.URLS.VERIFY, verify, function (res) {
            if (res.succeeded) {
                app.postInvoke(constants.URLS.QUICKLOGIN, {authCode: res.data.authCode}, function (res1) {
                    if (res1.succeeded) {
                        that.setData({isPost: false});
                        if (res1.data.loginState == "Succeed") {
                            app.setStorageSync(constants.COOKIES.AUTH, res1.headers["x-KC-SID"]);
                            mui.toast(constants.MSGINFO.LOGINSUCCESS);
                            that.retlogin();
                        }
                        else {
                            that.enumLoginState(res1.data.loginState);
                        }
                    } else {
                        that.setData({isPost: false});
                        mui.toast(res1.message);
                    }
                }, function (err) {
                    that.setData({isPost: false});
                    mui.toast(err.message);
                });
            } else {
                that.setData({isPost: false});
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    }
});