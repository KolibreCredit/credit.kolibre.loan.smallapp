// pages/login/login.js
const app = getApp();
const constants = app.constants;
const $toast = require('../../utils/showToast');
const mui = {
    toast: function (title) {
        $toast.showToast({
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
        cellphone: ""
    },
    bindKeyInput: function (e) {
        this.setData({
            cellphone: e.detail.value
        });
    },
    bindLgin2: function () {
        var cellphone = this.data.cellphone;
        if (cellphone === '') {
            mui.toast(constants.MSGINFO.PHONE);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.MSGINFO.PHONEERR);
            return false;
        }
        wx.navigateTo({
            url: '/pages/login/login2?cellphone=' + this.data.cellphone
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

    }
});