// pages/project/index.js
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
        tenancyId: "",
        tenancyId2: "",
        pageIndex: 0,
        pageSize: 200,
        tenancyList: null,
        tenancyItem: null,
        villageAparment: null,
        isTenancys: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.setData({
            tenancyId: app.globalData.tenancyId,
            tenancyId2: app.globalData.tenancyId
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTenancies();
    },
    filterTenancy: function () {
        var tenancyList = this.data.tenancyList;
        for (var i = 0; i < tenancyList.length; i++) {
            if (tenancyList[i].tenancyId == this.data.tenancyId) {
                this.setData({
                    tenancyItem: tenancyList[i]
                });
                break;
            }
        }
    },
    getTenancies: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETTENANCIES, function (res) {
            if (res.succeeded) {
                that.setData({
                    tenancyList: res.data
                });
                if (that.data.tenancyId == "") {
                    that.setData({
                        tenancyId: res.data[0].tenancyId,
                        tenancyItem: res.data[0]
                    });
                } else {
                    that.filterTenancy();
                }
                that.getVillageApartments();
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    getVillageApartments: function () {
        var aparment = {
            tenancyId: this.data.tenancyId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize
        };
        var that = this;
        app.postInvoke(constants.URLS.GETVILLAGEAPARTMENTS, aparment, function (res) {
            if (res.succeeded) {
                that.setData({
                    villageAparment: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        if (this.data.villageAparment != null) {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getVillageApartments();
            }
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.villageAparment != null) {
            if (this.data.villageAparment.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getVillageApartments();
            }
        }
    }
    , villageView: function (e) {
        var villageId = e.currentTarget.dataset.key;
        wx.navigateTo({url: '/pages/project/village?villageId=' + villageId});
    },
    apartmentView: function (e) {
        var villageId = e.currentTarget.dataset.villageid;
        var apartmentId = e.currentTarget.dataset.apartmentid;
        wx.navigateTo({url: '/pages/project/apartment?villageId=' + villageId + '&apartmentId=' + apartmentId});
    },
    showTenancys: function (e) {
        wx.hideTabBar({
            animation: true
        });
        var that = this;
        setTimeout(function () {
            that.setData({
                isTenancys: true
            });
        }, 200);
    },
    hideTenancys: function (e) {
        this.setData({
            isTenancys: false
        });
        wx.showTabBar({animation: true});
    },
    pickTenancy: function (e) {
        this.setData({
            tenancyId2: e.currentTarget.dataset.tenancyid
        });
    },
    finishTenancy: function (e) {
        wx.showTabBar({animation: true});
        var that = this;
        setTimeout(function () {
            that.setData({
                tenancyId: that.data.tenancyId2,
                isTenancys: false,
                pageIndex: 0
            });
            that.filterTenancy();
            that.getVillageApartments();
        }, 200);
    }
})