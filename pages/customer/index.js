//index.js
//获取应用实例
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
    data: {
        list: []
    },
    onLoad: function () {

    },
    onShow: function () {
        this.getTenanies();
    },
    getTenanies: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETTENANIES, function (res) {
            if (res.succeeded) {
                that.setData({list: res.data});
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    bindItem: function (e) {
        var tenancyId = e.currentTarget.dataset.tenancyid;
        wx.navigateTo({url: '/pages/customer/risk?tenancyId=' + tenancyId});
    },
    bindView: function (e) {
        var tenancyId = e.currentTarget.dataset.tenancyid;
        app.globalData.tenancyId = tenancyId;
        wx.switchTab({
            url: '/pages/project/index',
            success: function (e) {
                var currentpage = getCurrentPages().pop();
                if (currentpage == undefined || currentpage == null) {
                    return;
                }
                currentpage.onLoad();
            }
        });
    }
})
