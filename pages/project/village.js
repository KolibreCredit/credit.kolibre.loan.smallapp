// pages/project/village.js
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
        villageId: "",
        pageIndex: 0,
        pageSize: 200,
        villageSceneries: null,
        itemDatas: null,
        isItemDelete: false,
        sceneryId: "",
        isApartments: false,
        apartmentId: "",
        isPreviewImage: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            villageId: options.villageId
        });
        this.getApartmentsByVillageId();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.isPreviewImage) {
            this.setData({isPreviewImage: false});
        } else {
            this.getSceneries();
        }
    },
    getSceneries: function () {
        var scenerie = {
            villageId: this.data.villageId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize
        };
        var that = this;
        app.postInvoke(constants.URLS.GETSCENERIES, scenerie, function (res) {
            if (res.succeeded) {
                that.setData({
                    villageSceneries: res.data
                });
                if (res.data.data.length > 0) {
                    var itemDatas = [];
                    var i = 0;
                    while (i < res.data.data.length) {
                        itemDatas.push({
                            currentIndex: 0,
                            isMore: false
                        });
                        i++;
                    }
                    that.setData({itemDatas: itemDatas});
                }
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    previewImage: function (e) {
        this.setData({isPreviewImage: true});
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current,
            urls: [current]
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        if (this.data.villageSceneries != null) {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getSceneries();
            }
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.villageSceneries != null) {
            if (this.data.villageSceneries.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getSceneries();
            }
        }
    },
    addVillage: function (e) {
        wx.navigateTo({
            url: '/pages/project/villageItem?villageId=' + this.data.villageId
        });
    },
    swiperChange: function (e) {
        var index = e.currentTarget.dataset.index;
        var itemDatas = this.data.itemDatas;
        itemDatas[index].currentIndex = e.detail.current;
        this.setData({
            itemDatas: itemDatas
        });
    },
    showMore: function (e) {
        var index = e.currentTarget.dataset.index;
        var itemDatas = this.data.itemDatas;
        itemDatas[index].isMore = true;
        this.setData({
            itemDatas: itemDatas
        });
    },
    hideMore: function (e) {
        var index = e.currentTarget.dataset.index;
        var itemDatas = this.data.itemDatas;
        itemDatas[index].isMore = false;
        this.setData({
            itemDatas: itemDatas
        });
    },
    editorItem: function (e) {
        wx.navigateTo({
            url: '/pages/project/villageItem?sceneryId=' + e.currentTarget.dataset.sceneryid
        });
    },
    showItemDelete: function (e) {
        this.setData({
            isItemDelete: true,
            sceneryId: e.currentTarget.dataset.sceneryid
        });
    },
    hideItemDelete: function (e) {
        this.setData({
            isItemDelete: false,
            sceneryId: ""
        });
    },
    deleteScenery: function (e) {
        var itemScenery = {
            sceneryId: this.data.sceneryId
        };
        var that = this;
        app.postInvoke(constants.URLS.DELETESCENERY, itemScenery, function (res) {
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.DELETESCENERY);
                setTimeout(function () {
                    that.hideItemDelete();
                    that.getSceneries();
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    getApartmentsByVillageId: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETAPARTMENTSBYVILLAGEID + this.data.villageId, function (res) {
            if (res.succeeded) {
                if (res.data.length > 0) {
                    that.setData({
                        apartmentId: res.data[0].apartmentId
                    });
                }
                that.setData({
                    apartmentList: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    showApartments: function (e) {
        this.setData({
            isApartments: true
        });
    },
    hideApartments: function (e) {
        this.setData({
            isApartments: false
        });
    },
    pickApartment: function (e) {
        this.setData({
            apartmentId: e.currentTarget.dataset.apartmentid
        });
    },
    finishApartment: function (e) {
        this.setData({
            isApartments: false
        });
        wx.navigateTo({
            url: '/pages/project/apartment?villageId=' + this.data.villageId + '&apartmentId=' + this.data.apartmentId
        });
    }
})