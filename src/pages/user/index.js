// pages/user/index.js
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
        user: null
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getCurrentAccount();
    },
    getCurrentAccount: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETCURRENTACCOUNT, function (res) {
            if (res.succeeded) {
                that.setData({user: res.data});
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    loginOut: function () {
        app.removeStorageSync(constants.COOKIES.AUTH);
        wx.switchTab({
            url: '/pages/customer/index'
        });
    }
})