// pages/friends/randomFriends.js
const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMarker: true,
    hasAvatar: true,
    backBtnTop: 6,
    latitude: '',
    longitude: '',
    markers: [],
    userInfo: {},
    avatarUrl: '',
    shareBtnTop: 10,
    userID:'',
    randomID:'ttttt',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'IMJBZ-LVYLU-ZJ3VP-2Q77A-EIRY7-VTBFO'
    });
    var that = this;
    app.getLocal(that);
    this.startLocalHeart();
    this.getUserInfo();
    this.setBackBtn();
    this.setData ({
      userID:options.id,
    });
    console.log(this.data.userID);
  },
  tapBack(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  tapRandom(){
    var addUrl = 'randomFriends?id=' + this.data.randomID;
    console.log(addUrl);
    wx.reLaunch({
      url: addUrl,
    })
  },
  tapAction(){
    console.log("actions");
  },
  setBackBtn() {
    this.setData({
      backBtnTop: wx.getSystemInfoSync().statusBarHeight + 6
    })
  },
  getUserInfo() {
    var that = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        that.getAvatarImage(res.userInfo.avatarUrl);
      }
    })
  },
  getAvatarImage: function (avatarUrl) {
    var that = this;
    console.log(avatarUrl);
    wx.downloadFile({
      url: avatarUrl,
      success: function (res) {
        var cachePath = res.tempFilePath.replace("http:/", '').replace("https:/", '')
        that.setData({
          avatarUrl: cachePath,
          hasAvatar: true
        })

      }
    })
  },
  setMarkers() {
    var markers = [{
      iconPath: this.data.avatarUrl,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      height: 50,
      width: 50,
      id: 0,
      callout: {
        content: this.data.userInfo.nickName,
        color: "#FFFFFF",
        fontSize: 18,
        borderRadius: 20,
        bgColor: "#FF4081",
        padding: 5,
        display: 'ALWAYS'
      }
    }]
    this.setData({
      hasMarker: true,
      markers: markers
    })
    console.log(this.data.hasMarker);
    console.log(this.data.hasAvatar);
  },
  startLocalHeart() {
    var that = this;
    var timerTem = setInterval(function () {
      console.log("----success----0");
      app.getLocal(that);
      that.setMarkers();
      if (!that.data.hasMarker) {
        that.getUserInfo();
      }
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})