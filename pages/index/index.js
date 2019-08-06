//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    avatarUrl:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    thisCity: '',//当前城市
    range: "",//配送范围
    shapLocation: '',//商铺坐标
    siteData: [],//地址列表
    vague: [],//关键词输入提示
    scale: 16,//缩放级别
    latitude: '',
    longitude: '',
    markers: [],
    listIndex: "0",//选择地址
    hasMarker: false,
    hasAvatar: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: 'IMJBZ-LVYLU-ZJ3VP-2Q77A-EIRY7-VTBFO'
    });
    var that = this;
    app.getLocal(that);
    this.startLocalHeart();
    this.getUserInfo();
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
  getAvatarImage: function (avatarUrl){
    var that = this;
    console.log(avatarUrl);
    wx.downloadFile({
      url:avatarUrl,
      success: function (res)  {
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
    }, 2000)
  },
})
