//app.js
var constants = require('constants');
const util = require('utils/util');
App({
    constants: constants,
    globalData: {
        tenancyId: ""
    },
    setStorageSync: function (key, value) {
        wx.setStorageSync(key, value);
    },
    getStorageSync: function (key) {
        return wx.getStorageSync(key);
    },
    removeStorageSync: function (key) {
        wx.removeStorageSync(key);
    },
    postInvoke: function (apiUrl, data, cbSuccess, cbfail) {
        var auth = this.getStorageSync(constants.COOKIES.AUTH);
        wx.request({
            url: apiUrl,
            data: data,
            header: {
                "Content-Type": "application/json;charset=utf-8",
                "X-KC-SID": auth
            },
            method: "POST",
            success: function (wxRes) {
                var res = wxRes.data;
                if (res.succeeded) {
                    typeof cbSuccess == "function" && cbSuccess(res);
                }
                else if (res.code == 130078401) {
                    wx.navigateTo({url: '/pages/login/login'});
                }
                else if (res.code == 130078403) {
                    wx.showToast({
                        title: "无操作权限,请联系客服",
                        image: "http://h.fengniaowu.com/loan/images/err.png",
                        duration: 2000
                    });
                } else {
                    typeof cbfail == "function" && cbfail(res);
                }
            },
            fail: function () {
                wx.showToast({
                    title: "网络链接异常,请稍后",
                    image: "http://h.fengniaowu.com/loan/images/err.png",
                    duration: 2000
                });
            }
        });
    },
    getInvoke: function (apiUrl, cbSuccess, cbfail) {
        var auth = this.getStorageSync(constants.COOKIES.AUTH);
        wx.request({
            url: apiUrl,
            header: {
                "Content-Type": "application/json;charset=utf-8",
                "X-KC-SID": auth
            },
            method: "GET",
            success: function (wxRes) {
                var res = wxRes.data;
                if (res.succeeded) {
                    typeof cbSuccess == "function" && cbSuccess(res);
                }
                else if (res.code == 130078401) {
                    wx.navigateTo({url: '/pages/login/login'});

                } else if (res.code == 130078403) {
                    wx.showToast({
                        title: "无操作权限,请联系客服",
                        image: "http://h.fengniaowu.com/loan/image/err.png",
                        duration: 2000
                    });
                } else {
                    typeof cbfail == "function" && cbfail(res);
                }
            },
            fail: function () {
                wx.showToast({
                    title: "网络链接异常,请稍后",
                    image: "/images/err.png",
                    duration: 2000
                });
            }
        });
    },
    postUploadImages: function (apiUrl, filePath, kind, cbSuccess) {
        wx.uploadFile({
            url: apiUrl,
            filePath: filePath,
            name: util.uuid(),
            formData: {
                sequenceNo: util.uuid(),
                kind: kind
            },
            success: function (wxRes) {
                if (wxRes.statusCode == 200) {
                    var res = JSON.parse(wxRes.data);
                    typeof cbSuccess == "function" && cbSuccess(res);
                } else {
                    var errInfo = JSON.parse(wxRes.data);
                    wx.showToast({
                        title: errInfo.message,
                        image: "http://h.fengniaowu.com/loan/images/err.png",
                        duration: 2000
                    });
                }
            }, fail: function () {
                wx.showToast({
                    title: "网络链接异常,请稍后",
                    image: "http://h.fengniaowu.com/loan/images/err.png",
                    duration: 2000
                });
            }
        });
    },
    stringFormat: function () {
        if (arguments.length == 0)
            return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }
});