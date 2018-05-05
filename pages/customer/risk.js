// pages/customer/risk.js

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
        tenancyId: "",
        pageIndex: 0,
        pageSize: 200,
        tenancyResponse: null,
        riskResponses: null,
        riskItems: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            tenancyId: options.tenancyId
        });
    },
    onShow: function () {
        this.getRisks();
    },
    getRisks: function () {
        var risks = {
            tenancyId: this.data.tenancyId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize
        };
        var that = this;
        app.postInvoke(constants.URLS.GETRISKS, risks, function (res) {
            if (res.succeeded) {
                if (res.data.riskResponses.data.length > 0) {
                    var riskItems = [];
                    for (var i = 0; i < res.data.riskResponses.data.length; i++) {
                        riskItems.push(false);
                    }
                    that.setData({
                        riskItems: riskItems
                    });
                }
                that.setData({
                    tenancyResponse: res.data.tenancyResponse,
                    riskResponses: res.data.riskResponses
                });


            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    onPullDownRefresh: function () {
        if (this.data.riskResponses != null) {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getRisks();
            }
        }
    },
    onReachBottom: function () {
        if (this.data.riskResponses != null) {
            if (this.data.riskResponses.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getRisks();
            }
        }
    },
    addRisk: function () {
        wx.navigateTo({
            url: '/pages/customer/riskItem?tenancyId=' + this.data.tenancyId
        });
    },
    showRiskDescribe: function (e) {
        var riskItems = this.data.riskItems;
        riskItems[e.currentTarget.dataset.index] = true;
        this.setData({
            riskItems: riskItems
        });
    },
    hideRiskDescribe: function (e) {
        var riskItems = this.data.riskItems;
        riskItems[e.currentTarget.dataset.index] = false;
        this.setData({
            riskItems: riskItems
        });
    }
})