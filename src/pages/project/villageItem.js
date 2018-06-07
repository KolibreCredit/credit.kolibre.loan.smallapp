// pages/customer/riskItem.js
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
        sceneryId: "",
        sceneryTypes: null,
        sceneryIndex: -1,
        sceneryDescribe: "",
        sceneryPictures: null,
        isSceneryType: false,
        sceneryTypeName: "",
        isUpdate: false,
        isPost: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.hasOwnProperty("sceneryId")) {
            this.setData({
                sceneryId: options.sceneryId,
                isUpdate: true
            });
        } else {
            this.setData({
                villageId: options.villageId
            });
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getSceneryTypes();
        if (this.data.sceneryId != "") {
            this.getSceneryDetails();
        }
    },
    getSceneryTypes: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETSCENERYTYPES, function (res) {
            if (res.succeeded) {
                that.setData({
                    sceneryTypes: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    selectSceneryType: function (e) {
        var itemIndex = e.currentTarget.dataset.key;
        if (itemIndex == this.data.sceneryIndex) {
            this.setData({
                sceneryIndex: -1
            });
        } else {
            this.setData({
                sceneryIndex: itemIndex
            });
        }
    },
    showItemSceneryType: function (e) {
        this.setData({
            isSceneryType: true
        });
    },
    hideItemSceneryType: function (e) {
        this.setData({
            isSceneryType: false,
            sceneryTypeName: ""
        });
    },
    bindKeyInput: function (e) {
        var key = e.target.dataset.key;
        if (key == "sceneryType") {
            this.setData({
                sceneryTypeName: e.detail.value
            });
        } else {
            this.setData({
                sceneryDescribe: e.detail.value
            });
        }
    },
    createSceneryType: function (e) {
        if (this.data.sceneryTypeName == "") {
            mui.toast(constants.MSGINFO.SCENERYDESCRIBE2);
            return false;
        }
        var that = this;
        var itemSceneryType = {
            sceneryTypeName: this.data.sceneryTypeName
        };
        app.postInvoke(constants.URLS.CREATESCENERYTYPE, itemSceneryType, function (res) {
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.SCENERYTYPESUCCEE);
                setTimeout(function () {
                    that.hideItemSceneryType();
                    that.getSceneryTypes();
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    bindAddPictures: function (e) {
        var sceneryPictures = this.data.sceneryPictures || [];
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                app.postUploadImages(constants.URLS.UPLOADIMAGES, res.tempFilePaths[0], "SceneryRecord", function (res) {
                    if (res.succeeded) {
                        sceneryPictures.push(res.data[0].url);
                        that.setData({
                            sceneryPictures: sceneryPictures
                        });
                    } else {
                        mui.toast(res.message);
                    }
                });
            }
        });
    },
    bindDeletePictures: function (e) {
        var itemIndex = e.currentTarget.dataset.key;
        var sceneryPictures = this.data.sceneryPictures;
        sceneryPictures.splice(itemIndex, 1);
        this.setData({
            sceneryPictures: sceneryPictures
        });
    },
    createScenery: function (e) {
        if (this.data.sceneryIndex == -1) {
            mui.toast(constants.MSGINFO.SCENERYDESCRIBE);
            return false;
        }
        if (this.data.sceneryPictures == null || this.data.sceneryPictures.length == 0) {
            mui.toast(constants.MSGINFO.SCENERYDESCRIBE3);
            return false;
        }
        var sceneryTypeId = this.data.sceneryTypes[this.data.sceneryIndex].sceneryTypeId;
        var itemScenery = {
            villageId: this.data.villageId,
            sceneryTypeId: sceneryTypeId,
            describe: this.data.sceneryDescribe,
            sceneryPictures: this.data.sceneryPictures
        };
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.CREATESCENERY, itemScenery, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.SCENERYSUCCEE);
                setTimeout(function () {
                    wx.navigateTo({
                        url: '/pages/project/village?villageId=' + that.data.villageId
                    });
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    },
    findSceneryTypesIndex: function (sceneryTypeId) {
        var selectIndex = 0;
        for (var i = 0; i < this.data.sceneryTypes.length; i++) {
            if (this.data.sceneryTypes[i].sceneryTypeId == sceneryTypeId) {
                selectIndex = i;
                break;
            }
        }
        return selectIndex;
    },
    getSceneryDetails: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETSCENERYDETAILS + this.data.sceneryId, function (res) {
            if (res.succeeded) {
                var selectIndex = that.findSceneryTypesIndex(res.data.sceneryTypeId);
                that.setData({
                    sceneryIndex: selectIndex,
                    sceneryDescribe: res.data.describe,
                    sceneryPictures: res.data.sceneryPictures,
                    villageId: res.data.villageId
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    updateScenery: function (e) {
        if (this.data.sceneryIndex == -1) {
            mui.toast(constants.MSGINFO.SCENERYDESCRIBE);
            return false;
        }
        var sceneryTypeId = this.data.sceneryTypes[this.data.sceneryIndex].sceneryTypeId;
        var itemScenery = {
            sceneryId: this.data.sceneryId,
            sceneryTypeId: sceneryTypeId,
            describe: this.data.sceneryDescribe,
            sceneryPicture: this.data.sceneryPictures
        };
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.UPDATESCENERY, itemScenery, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.UPDATESCENERY);
                setTimeout(function () {
                    wx.navigateTo({url: '/pages/project/village?villageId=' + that.data.villageId});
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    }
});