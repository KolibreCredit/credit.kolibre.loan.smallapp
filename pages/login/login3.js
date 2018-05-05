// pages/login/login3.js
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
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isPost: false,
        cellphone: "",
        password: ""
    },
    bindKeyInput: function (e) {
        var key = e.target.dataset.key;
        if (key == "cellphone") {
            this.setData({
                cellphone: e.detail.value
            });
        } else {
            this.setData({
                password: e.detail.value
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
    loginByPassword: function () {
        var cellphone = this.data.cellphone;
        if (cellphone == '') {
            mui.toast(constants.MSGINFO.PHONE);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.MSGINFO.PHONEERR);
            return false;
        }
        var password = this.data.password;
        if (password == '') {
            mui.toast(constants.MSGINFO.PASSWORD);
            return false;
        }
        if (!constants.REGEX.PASSWORD.test(password)) {
            mui.toast(constants.MSGINFO.PASSWORDERR);
            return false;
        }
        this.setData({isPost: true});
        var data = {
            loginInfoAccount: cellphone,
            password: password
        };
        var that = this;
        app.postInvoke(constants.URLS.LOGIN, data, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                if (res.data.loginState == "Succeed") {
                    app.setStorageSync(constants.COOKIES.AUTH, res.headers["x-KC-SID"]);
                    mui.toast(constants.MSGINFO.LOGINSUCCESS);
                    that.retlogin();
                } else {
                    that.enumLoginState(res.data.loginState);
                }
            } else {
                mui.toast(res.message);
            }
        }, function (res) {
            that.setData({isPost: false});
            mui.toast(res.message);
        });
    }
});