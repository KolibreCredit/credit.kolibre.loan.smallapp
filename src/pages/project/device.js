// pages/project/device.js
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
            key: "coldwatermeter",
            desc: "冷水"
        }, {
            key: "hotwatermeter",
            desc: "热水"
        }, {
            key: "elemeter",
            desc: "电"
        }],
        deviceModelType: "NotIntelligence",
        isPost: false
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
            deviceModelType: (e.detail.value ? "Intelligence" : "NotIntelligence")
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
            deviceType = "lock";
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
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.CREATEROOMDEVICE, device, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.DEVICESUCCEE);
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