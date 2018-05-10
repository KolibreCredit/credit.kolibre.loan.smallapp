// pages/user/user.js

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
        positions: null,
        hasInfo: false,
        accountPhotoUrl: "",
        realName: "",
        credentialNo: "",
        positionName: "",
        positionId: "",
        isPost: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPositions();
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
                var user = res.data;
                that.setData({
                    hasInfo: user.hasInfo,
                    accountPhotoUrl: user.accountPhotoUrl,
                    realName: user.realName,
                    credentialNo: user.credentialNo,
                    positionName: user.positionName,
                    positionId: user.positionId
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    getPositions: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETPOSITIONS, function (res) {
            if (res.succeeded) {
                that.setData({
                    positions: res.data
                });
            }
        });
    },
    bindPositionChange: function (e) {
        this.setData({
            positionId: this.data.positions[e.detail.value].positionId,
            positionName: this.data.positions[e.detail.value].positionName
        });
    },
    bindUpdateLoanInAccountInfo: function (e) {
        if (this.data.realName == "") {
            mui.toast(constants.MSGINFO.REALNAME);
            return false;
        }
        if (this.data.credentialNo == "") {
            mui.toast(constants.MSGINFO.CREDENTIALNO);
            return false;
        }
        var userInfo = {
            realName: this.data.realName,
            credentialNo: this.data.credentialNo,
            credentialType: "IDCard",
            accountPhotoUrl: this.data.accountPhotoUrl,
            positionId: this.data.positionId
        };
        var that = this;
        that.setData({isPost: true});
        app.postInvoke(constants.URLS.UPDATELOANINACCOUNTINFO, userInfo, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                that.getCurrentAccount();
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            that.setData({isPost: false});
            mui.toast(err.message);
        });
    },
    bindEditor: function (e) {
        this.setData({
            hasInfo: false
        });
    },
    bindChooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                app.postUploadImages(constants.URLS.UPLOADIMAGES, res.tempFilePaths[0], "PersonalPhoto", function (res1) {
                    if (res1.succeeded) {
                        that.setData({accountPhotoUrl: res1.data[0].url});
                    } else {
                        mui.toast(res1.message);
                    }
                });
            }
        });
    },
    bindKeyInput: function (e) {
        var key = e.target.dataset.key;
        if (key == "realName") {
            this.setData({
                realName: e.detail.value
            });
        } else {
            this.setData({
                credentialNo: e.detail.value
            });
        }
    }
});