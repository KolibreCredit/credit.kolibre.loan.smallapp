// pages/project/device.js
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
        deviceSn: "",
        supplierName: "",
        installTime: util.formatDate(new Date()),
        deviceType: "",
        deviceTypeIndex: 0,
        deviceTypes: [{
            key: "ColdWaterMeter",
            desc: "冷水"
        }, {
            key: "HotWaterMeter",
            desc: "热水"
        }, {
            key: "ElectricMeter",
            desc: "电"
        }],
        deviceModelType: "NotIntelligence"
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            roomId: options.roomId,
            tabIndex: options.tabIndex
        });
    },
    bindKeyInput: function (e) {
        var key = e.target.dataset.key;
        if (key == "deviceSn") {
            this.setData({
                deviceSn: e.detail.value
            });
        } else {
            this.setData({
                supplierName: e.detail.value
            });
        }
    },
    pickerDeviceTypeChange: function (e) {
        this.setData({
            deviceTypeIndex: e.detail.value
        });
    },
    deviceModelTypeChange: function (e) {
        this.setData({
            deviceModelType: (e.detail.value ? "Intelligence" : "deviceModelType")
        });
    },
    installTimeDateChange: function (e) {
        this.setData({
            installTime: e.detail.value
        });
    },
    createRoomDevice: function (e) {
        if (this.data.deviceSn == "") {
            mui.toast(constants.MSGINFO.DEVICESN);
            return false;
        }
        if (this.data.supplierName == "") {
            mui.toast(constants.MSGINFO.SUPPLIERNAME);
            return false;
        }
        var deviceType = "";
        if (this.data.tabIndex == 1) {
            deviceType = "DoorLock";
        } else {
            deviceType = this.data.deviceTypes[this.data.deviceTypeIndex].key;
        }
        var device = {
            roomId: this.data.roomId,
            deviceSn: this.data.deviceSn,
            supplierName: this.data.supplierName,
            installTime: this.data.installTime,
            deviceType: deviceType,
            deviceModelType: this.data.deviceModelType
        };
        app.postInvoke(constants.URLS.CREATEROOMDEVICE, device, function (res) {
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.DEVICESUCCEE);
                setTimeout(function () {
                    wx.navigateBack({delta: 1});
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    }
})