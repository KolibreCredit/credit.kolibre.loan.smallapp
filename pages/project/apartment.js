// pages/project/apartment.js

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
        villageId: "",
        apartmentId: "",
        roomType: false,
        pageIndex: 0,
        pageSize: 200,
        apartments: null,
        villageApartment: null,
        roomloanInfoList: null,
        isApartments: false,
        apartmentId2: ""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            villageId: options.villageId,
            apartmentId: options.apartmentId,
            apartmentId2: options.apartmentId
        });
        this.getApartmentsByVillageId();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        this.getRoomLoanIns();
    },
    tabRoomType: function (e) {
        this.setData({
            roomType: (e.currentTarget.dataset.key == "true" ? true : false),
            pageIndex: 0
        });
        this.getRoomLoanIns();
    },
    getRoomLoanIns: function () {
        var apartment = {
            apartmentId: this.data.apartmentId,
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize,
            roomType: this.data.roomType
        };
        var that = this;
        app.postInvoke(constants.URLS.GETROOMLOANINS, apartment, function (res) {
            if (res.succeeded) {
                that.setData({
                    villageApartment: res.data.villageApartment,
                    roomloanInfoList: res.data.roomloanInfoList
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
        if (this.data.roomloanInfoList != null) {
            if (this.data.pageIndex > 0) {
                this.setData({
                    pageIndex: this.data.pageIndex - 1
                });
                this.getRoomLoanIns();
            }
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.roomloanInfoList != null) {
            if (this.data.roomloanInfoList.hasNextPage) {
                this.setData({
                    pageIndex: this.data.pageIndex + 1
                });
                this.getRoomLoanIns();
            }
        }
    },
    viewDetail: function (e) {
        var index = e.currentTarget.dataset.index;
        var room = this.data.roomloanInfoList.data[index];
        var roomId = room.roomId;
        var roomState = room.roomState;
        var roomNumber = room.roomNumber;
        var tenantName = (room.tenantName == null ? "" : room.tenantName);
        var villageName = this.data.villageApartment.villageName;
        var roomType = this.data.roomType;
        wx.navigateTo({
            url: "/pages/project/detail?roomId=" + roomId + "&villageName=" + villageName + "&roomNumber=" + roomNumber + "&tenantName=" + tenantName + "&roomType=" + roomType + "&roomState=" + roomState
        });
    },
    getApartmentsByVillageId: function () {
        var that = this;
        app.getInvoke(constants.URLS.GETAPARTMENTSBYVILLAGEID + this.data.villageId, function (res) {
            if (res.succeeded) {
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
            apartmentId2: e.currentTarget.dataset.apartmentid
        });
    },
    finishApartment: function (e) {
        this.setData({
            isApartments: false,
            apartmentId: this.data.apartmentId2,
            pageIndex: 0,
            roomType: false
        });
        this.getRoomLoanIns();
    }
})