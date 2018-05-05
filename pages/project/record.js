// pages/project/record.js
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
const util = require('../../utils/util');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        roomId: "",
        tabIndex: 0,
        deviceId: "",
        deviceType: "",
        //
        recordType: "Close",
        addUpCount: "",
        recordStartTime: util.addDays(new Date(), -7),
        recordEndTime: util.formatDate(new Date()),
        //
        currentRead: "",
        securityRange: "100",
        recordTime: util.formatDate(new Date()),
        //
        describe: "",
        pictures: null,
        isPost: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            roomId: options.roomId,
            tabIndex: options.tabIndex,
            deviceId: options.deviceId,
            deviceType: options.deviceType
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    bindAddPictures: function (e) {
        var pictures = this.data.pictures || [];
        var kind = "";
        if (this.data.tabIndex == 0) {
            kind = "RoomRecord";
        }
        else if (this.data.tabIndex == 1) {
            kind = "DoorLock";
        }
        else {
            kind = "WaterElectric";
        }
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                app.postUploadImages(constants.URLS.UPLOADIMAGES, res.tempFilePaths[0], kind, function (res) {
                    if (res.succeeded) {
                        pictures.push(res.data[0].url);
                        that.setData({
                            pictures: pictures
                        });
                    } else {
                        mui.toast(res.message);
                    }
                });
            }
        });
    },
    bindDeletePictures: function (e) {
        var itemIndex = parseInt(e.currentTarget.dataset.key);
        var pictures = this.data.pictures;
        pictures.splice(itemIndex, 1);
        this.setData({
            pictures: pictures
        });
    },
    bindKeyInput: function (e) {
        var key = e.target.dataset.key;
        if (key == "addUpCount") {
            this.setData({
                addUpCount: e.detail.value
            });
        }
        else if (key == "currentRead") {
            this.setData({
                currentRead: e.detail.value
            });
            this.getSecurityRange();
        }
        else {
            this.setData({
                describe: e.detail.value
            });
        }
    },
    getSecurityRange: function () {
        var device = {
            deviceId: this.data.deviceId
        };
        var that = this;
        app.postInvoke(constants.URLS.GETSECURITYRANGE, device, function (res) {
            if (res.succeeded) {
                that.setData({
                        securityRange: parseFloat(res.data) * 100
                    }
                );
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    createRoomRecords: function (e) {
        if (this.data.describe == "") {
            mui.toast(constants.MSGINFO.ROOMRECORDDESCRIBE);
            return false;
        }
        if (this.data.pictures == null || this.data.pictures.length == 0) {
            mui.toast(constants.MSGINFO.PICTURES);
            return false;
        }

        var roomRecord = {
            roomId: this.data.roomId,
            describe: this.data.describe,
            pictures: this.data.pictures
        };
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.CREATEROOMRECORDS, roomRecord, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.ROOMRECORDDESCRIBESUCCEE);
                setTimeout(function () {
                    wx.navigateBack({delta: 1});
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    },
    recordTypeChange: function (e) {
        this.setData({
            recordType: (e.detail.value ? "Open" : "Close")
        });
    },

    recordStartTimeDateChange: function (e) {
        this.setData({
            recordStartTime: e.detail.value
        });
    },
    recordEndTimeDateChange: function (e) {
        this.setData({
            recordEndTime: e.detail.value
        });
    },
    recordTimeDateChange: function (e) {
        this.setData({
            recordTime: e.detail.value
        });
    },
    createOpenDoorLockRecord: function (e) {
        if (this.data.addUpCount == "") {
            mui.toast(constants.MSGINFO.ADDUPCOUNT);
            return false;
        }
        if (this.data.describe == "") {
            mui.toast(constants.MSGINFO.ROOMRECORDDESCRIBE);
            return false;
        }
        if (this.data.pictures == null || this.data.pictures.length == 0) {
            mui.toast(constants.MSGINFO.PICTURES);
            return false;
        }
        var doorLockRecord = {
            roomId: this.data.roomId,
            deviceId: this.data.deviceId,
            recordType: this.data.recordType,
            addUpCount: this.data.addUpCount,
            recordStartTime: this.data.recordStartTime,
            recordEndTime: this.data.recordEndTime,
            describe: this.data.describe,
            lockPictures: this.data.pictures
        };
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.CREATEOPENDOORLOCKRECORD, doorLockRecord, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.DOORLOCKRECORDSUCCEE);
                setTimeout(function () {
                    wx.navigateBack({delta: 1});
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    },
    createWaterElectricRecord: function (e) {
        if (this.data.currentRead == "") {
            mui.toast(constants.MSGINFO.CURRENTREAD);
            return false;
        }
        if (this.data.describe == "") {
            mui.toast(constants.MSGINFO.ROOMRECORDDESCRIBE);
            return false;
        }
        if (this.data.pictures == null || this.data.pictures.length == 0) {
            mui.toast(constants.MSGINFO.PICTURES);
            return false;
        }
        var waterElectricRecord = {
            roomId: this.data.roomId,
            deviceId: this.data.deviceId,
            deviceType: "ColdWaterMeter",
            recordTime: this.data.recordEndTime,
            describe: this.data.describe,
            recordPictures: this.data.pictures,
            currentRead: this.data.currentRead,
            securityRange: this.data.securityRange
        };
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.CREATEWATERELECTRICRECORD, waterElectricRecord, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.WATERELECTRICRECORDSUCCEE);
                setTimeout(function () {
                    wx.navigateBack({delta: 1});
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    }
})