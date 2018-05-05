// pages/project/detail.js

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
        roomId: "",
        villageName: "",
        roomNumber: "",
        tenantName: "",
        roomType: "",
        roomState: "",
        tabIndex: 0,
        pageIndex: 0,
        pageSize: 200,
        roomRecords: null,
        roomRecordItems: [],
        //
        doorLock: null,
        doorLockDeviceIndex: 0,
        doorLockRecordItems: [],
        //
        waterElectric: null,
        waterElectricDeviceIndex: 0,
        waterElectricRecordItems: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            roomId: options.roomId,
            villageName: options.villageName,
            roomNumber: options.roomNumber,
            tenantName: options.tenantName,
            roomType: (options.roomType == "true" ? true : false),
            roomState: options.roomState
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getPageData();
    },
    tabRecord: function (e) {
        var index = parseInt(e.currentTarget.dataset.key);
        this.setData({
            pageIndex: (this.data.tabIndex == index ? this.data.tabIndex : 0),
            tabIndex: index
        });
        this.getPageData();
    },
    getPageData: function () {
        if (this.data.tabIndex == 0) {
            this.getRoomRecords();
        }
        else if (this.data.tabIndex == 1) {
            this.getRoomOpenDoorLockRecord();
        } else {
            this.getWaterElectricRecord();
        }
    },
    getRoomRecords: function () {
        var apartment = {
            roomId: this.data.roomId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize
        };
        var that = this;
        app.postInvoke(constants.URLS.GETROOMRECORDS, apartment, function (res) {
            if (res.succeeded) {
                if (res.data.data.length > 0) {
                    var roomRecordItems = [];
                    for (var i = 0; i < res.data.data.length; i++) {
                        roomRecordItems.push({
                            index: 0,
                            ismore: false
                        });
                    }
                    that.setData({
                        roomRecordItems: roomRecordItems
                    });
                }
                that.setData({
                    roomRecords: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    getRoomOpenDoorLockRecord: function () {
        var apartment = {
            roomId: this.data.roomId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize
        };
        var that = this;
        app.postInvoke(constants.URLS.GETROOMOPENDOORLOCKRECORD, apartment, function (res) {
            if (res.succeeded) {
                if (res.data.doorLockRecords.data.length > 0) {
                    var doorLockRecordItems = [];
                    for (var i = 0; i < res.data.doorLockRecords.data.length; i++) {
                        doorLockRecordItems.push({
                            index: 0,
                            ismore: false
                        });
                    }
                    that.setData({
                        doorLockRecordItems: doorLockRecordItems
                    });
                }
                that.setData({
                    doorLock: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    getWaterElectricRecord: function () {
        var apartment = {
            roomId: this.data.roomId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize
        };
        var that = this;
        app.postInvoke(constants.URLS.GETWATERELECTRICRECORD, apartment, function (res) {
            if (res.succeeded) {
                if (res.data.waterElectricRecords.data.length > 0) {
                    var waterElectricRecordItems = [];
                    for (var i = 0; i < res.data.waterElectricRecords.data.length; i++) {
                        waterElectricRecordItems.push({
                            index: 0,
                            ismore: false
                        });
                    }
                    that.setData({
                        waterElectricRecordItems: waterElectricRecordItems
                    });
                }
                that.setData({
                    waterElectric: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    addRecord: function (e) {
        if (this.data.tabIndex == 0) {
            wx.navigateTo({url: '/pages/project/record?roomId=' + this.data.roomId + "&tabIndex=" + this.data.tabIndex + "&deviceId=0"});
        }
        else if (this.data.tabIndex == 1) {
            var itemDevice = this.data.doorLock.devices[this.data.doorLockDeviceIndex];
            if (itemDevice == null) {
                itemDevice = this.data.doorLock.devices[this.data.doorLockDeviceIndex - 1];
            }
            var doorLockDeviceId = itemDevice.deviceId;
            wx.navigateTo({url: '/pages/project/record?roomId=' + this.data.roomId + "&tabIndex=" + this.data.tabIndex + "&deviceId=" + doorLockDeviceId});
        }
        else {
            var itemDevice = this.data.waterElectric.devices[this.data.waterElectricDeviceIndex];
            if (itemDevice == null) {
                itemDevice = this.data.waterElectric.devices[this.data.waterElectricDeviceIndex - 1];
            }
            var waterElectricDeviceId = itemDevice.deviceId;
            wx.navigateTo({url: '/pages/project/record?roomId=' + this.data.roomId + "&tabIndex=" + this.data.tabIndex + "&deviceId=" + waterElectricDeviceId});
        }
    },
    addDevice: function (e) {
        wx.navigateTo({url: '/pages/project/device?roomId=' + this.data.roomId + "&tabIndex=" + this.data.tabIndex});
    },
    roomRecordPicturesChange: function (e) {
        var roomRecordItems = this.data.roomRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        roomRecordItems[itemIndex].index = e.detail.current;
        this.setData({
            roomRecordItems: roomRecordItems
        });
    },
    doorLockDevicesChange: function (e) {
        this.setData({
            doorLockDeviceIndex: e.detail.current
        });
    },
    doorLockRecordsPicturesChange: function (e) {
        var doorLockRecordItems = this.data.doorLockRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        doorLockRecordItems[itemIndex].index = e.detail.current;
        this.setData({
            doorLockRecordItems: doorLockRecordItems
        });
    },
    waterElectricDevicesChange: function (e) {
        this.setData({
            waterElectricDeviceIndex: e.detail.current
        });
    },
    waterElectricRecordsPicturesChange: function (e) {
        var waterElectricRecordItems = this.data.waterElectricRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        waterElectricRecordItems[itemIndex].index = e.detail.current;
        this.setData({
            waterElectricRecordItems: waterElectricRecordItems
        });
    },
    showRoomRecordDescribeMore: function (e) {
        var roomRecordItems = this.data.roomRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        roomRecordItems[itemIndex].ismore = true;
        this.setData({
            roomRecordItems: roomRecordItems
        });
    },
    hideRoomRecordDescribeMore: function (e) {
        var roomRecordItems = this.data.roomRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        roomRecordItems[itemIndex].ismore = false;
        this.setData({
            roomRecordItems: roomRecordItems
        });
    },

    showDoorLockRecordDescribeMore: function (e) {
        var doorLockRecordItems = this.data.doorLockRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        doorLockRecordItems[itemIndex].ismore = true;
        this.setData({
            doorLockRecordItems: doorLockRecordItems
        });
    },
    hideDoorLockRecordDescribeMore: function (e) {
        var doorLockRecordItems = this.data.doorLockRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        doorLockRecordItems[itemIndex].ismore = false;
        this.setData({
            doorLockRecordItems: doorLockRecordItems
        });
    },

    showWaterElectricRecordDescribeMore: function (e) {
        var waterElectricRecordItems = this.data.waterElectricRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        waterElectricRecordItems[itemIndex].ismore = true;
        this.setData({
            waterElectricRecordItems: waterElectricRecordItems
        });
    },
    hideWaterElectricRecordDescribeMore: function (e) {
        var waterElectricRecordItems = this.data.waterElectricRecordItems;
        var itemIndex = e.currentTarget.dataset.index;
        waterElectricRecordItems[itemIndex].ismore = false;
        this.setData({
            waterElectricRecordItems: waterElectricRecordItems
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        if (this.data.tabIndex == 0) {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getRoomRecords();
            }
        }
        else if (this.data.tabIndex == 1) {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getRoomOpenDoorLockRecord();
            }
        } else {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getWaterElectricRecord();
            }
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.tabIndex == 0) {
            if (this.data.roomRecords.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getRoomRecords();
            }
        }
        else if (this.data.tabIndex == 1) {
            if (this.data.doorLock.doorLockRecords.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getRoomOpenDoorLockRecord();
            }
        } else {
            if (this.data.waterElectric.waterElectricRecords.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getWaterElectricRecord();
            }
        }
    }
})