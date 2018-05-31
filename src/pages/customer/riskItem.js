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
const util = require('../../utils/util');
var riskPictures = [];
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tenancyId: "",
        riskLableName: "请选择风险标签",
        riskLables: null,
        activeIndex: -1,
        isRiskLableName: false,
        riskLableStyle: "block",
        riskLableName2: "",
        activeGrade: 0,
        riskGrades: [{
            grade: 1,
            gradeDescribe: "1级：问题提示"
        }, {
            grade: 2,
            gradeDescribe: "2级：风险提示"
        }, {
            grade: 3,
            gradeDescribe: "3级：风险评估"
        }, {
            grade: 4,
            gradeDescribe: "4级：风险恶化"
        }, {
            grade: 5,
            gradeDescribe: "5级：风险拒绝"
        }],
        riskDescribe: "",
        riskTime: util.formatDate(new Date()),
        relevantPictures: null,
        isPost: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            tenancyId: options.tenancyId
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getRiskLables();
    },
    getRiskLables: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETRISKLABLES, function (res) {
            if (res.succeeded) {
                that.setData({
                    riskLables: res.data
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    showItemRiskLable: function (e) {
        this.setData({
            isRiskLableName: true,
            riskLableStyle: "none"
        });
    },
    hideItemRiskLable: function (e) {
        this.setData({
            isRiskLableName: false,
            riskLableName2: "",
            riskLableStyle: "block"
        });
    }
    , selectRiskLable: function (e) {
        var itemIndex = e.currentTarget.dataset.key;
        if (itemIndex == this.data.activeIndex) {
            this.setData({
                activeIndex: -1,
                riskLableName: "请选择风险标签"
            });
        } else {
            this.setData({
                activeIndex: itemIndex,
                riskLableName: this.data.riskLables[itemIndex].lableName
            });
        }
    },
    bindKeyInput: function (e) {
        var key = e.target.dataset.key;
        if (key == "riskLable") {
            this.setData({
                riskLableName2: e.detail.value
            });
        } else {
            this.setData({
                riskDescribe: e.detail.value
            });
        }
    },
    createRiskLable: function (e) {
        if (this.data.riskLableName2 == "") {
            mui.toast(constants.MSGINFO.RISKLABLENAME2);
            return false;
        }
        var that = this;
        var itemRiskLable = {
            lableName: this.data.riskLableName2
        };
        app.postInvoke(constants.URLS.CREATERISKLABLE, itemRiskLable, function (res) {
            if (res.succeeded) {
                mui.toast(constants.MSGINFO.RISKLABLENAMESUCCEE);
                setTimeout(function () {
                    that.hideItemRiskLable();
                    that.getRiskLables();
                }, 2000);
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    },
    radioChange: function (e) {
        this.setData({
            activeGrade: e.detail.value
        });
    },
    bindDateChange: function (e) {
        this.setData({
            riskTime: e.detail.value
        });
    },
    bindAddRiskPictures: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                app.postUploadImages(constants.URLS.UPLOADIMAGES, res.tempFilePaths[0], "RiskRecord", function (res1) {
                    if (res1.succeeded) {
                        riskPictures.push(res1.data[0].url);
                        that.setData({
                            relevantPictures: riskPictures
                        });
                    } else {
                        mui.toast(res1.message);
                    }
                });
            }
        });
    },
    deleteRiskPictures: function (e) {
        var itemIndex = e.currentTarget.dataset.key;
        riskPictures.splice(itemIndex, 1);
        this.setData({
            relevantPictures: riskPictures
        });
    },
    createRisk: function (e) {
        if (this.data.activeIndex == -1) {
            mui.toast(constants.MSGINFO.RISKLABLENAME);
            return false;
        }
        var riskLableId = this.data.riskLables[this.data.activeIndex].riskLableId;
        if (this.data.activeGrade == 0) {
            mui.toast(constants.MSGINFO.RISKGRADE);
            return false;
        }
        if (this.data.riskDescribe == "") {
            mui.toast(constants.MSGINFO.RISKDESCRIBE);
            return false;
        }
        var gradeDescribe = "";
        for (var i = 0; i < this.data.riskGrades.length; i++) {
            if (this.data.riskGrades[i].grade == this.data.activeGrade) {
                gradeDescribe = this.data.riskGrades[i].gradeDescribe;
                break;
            }
        }
        this.setData({isPost: true});
        var itemRisk = {
            tenancyId: this.data.tenancyId,
            lableId: riskLableId,
            riskGrade: this.data.activeGrade,
            gradeDescribe: gradeDescribe,
            riskTime: this.data.riskTime,
            riskDescribe: this.data.riskDescribe,
            relevantPictures: this.data.relevantPictures
        };
        var that = this;
        app.postInvoke(constants.URLS.CREATERISK, itemRisk, function (res) {
            that.setData({isPost: false});
            if (res.succeeded) {
                riskPictures = [];
                mui.toast(constants.MSGINFO.RISKSUCCEE);
                setTimeout(function () {
                    wx.navigateTo({
                        url: '/pages/customer/risk?tenancyId=' + that.data.tenancyId
                    });
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