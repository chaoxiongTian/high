//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    zIndex: 50,
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
    hasAvatar: false,
    shareBtnTop:10,
    randomID:'test',
    hasAction: false,
    actionId:'testID',
    btnText:"找人玩",
    friends:[],
    friendsZindex:10,
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
    this.setShareBtn();
  },
  onFriendsClose(){
    this.setData({
      friendsZindex:10,
    })
  },
  tapShare(){
    console.log("shareBtn");
  },
  tapList() {
    wx.navigateTo({
      url: '../action_history/action_history',
    })
  },
  tapRandom() {
    var addUrl = '../friends/randomFriends?id=' + this.data.randomID;
    console.log(addUrl);
    wx.reLaunch({
      url: addUrl, 
    })
  },
  tapAction() {
    if (this.data.hasAction) {
      var addUrl = '../invite/invite?id=' + this.data.actionId;
      console.log(addUrl);
      wx.navigateTo({
        url: addUrl,
      })
    } else {
      var addUrl = '../action_edit/action_edit';
      console.log(addUrl);
      wx.navigateTo({
        url: addUrl,
      })
    }
    console.log("actionBtn");
  },
  tapFriend(){
    this.setData({
      friendsZindex: 1000,
    })
  },
  setShareBtn() {
    this.setData({
      shareBtnTop: wx.getSystemInfoSync().statusBarHeight + 6
    })
  },
  getUserInfo() {
    var that = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log(app.globalData.userOpenId);
        that.setData({
          userInfo: res.userInfo,
          zIndex: 50,
        })
        that.getAvatarImage(res.userInfo.avatarUrl).then(function (cachePath){
          console.log('xxxxxx  ', cachePath);
          that.setData({
            avatarUrl: cachePath,
            hasAvatar: true
          })

          that.setFriends(cachePath)

        })
        
      },
      fail:res => {
        that.setData({
          zIndex: 1000,
        })
      }
    })
  },
  setFriends: function(avatarUrl){
    var friends = [];
    for (var i = 0; i < 20; i++) {
      var oneFriend = {
        index:i,
        name: this.data.userInfo.nickName,
        openId: app.globalData.userOpenId,
        avator:avatarUrl,
      }
      friends[i]=oneFriend;
    }
    console.log(friends);
    this.setData({
      friends:friends,
    })
  },
  getAvatarImage: function (avatarUrl){
    var that = this;
    return new Promise((resolve, reject) => {
      console.log('xxx   ',avatarUrl);
      wx.downloadFile({
        url: avatarUrl,
        success: function (res) {
          var cachePath = res.tempFilePath.replace("http:/", '').replace("https:/", '')
          resolve(cachePath)
        },
        fail: function (res) {
          resolve('')
        }
      }) 
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
      if(!that.data.hasMarker){
        that.getUserInfo();
      }
    }, 2000)
  },

  onClickAction: function (e) {
    console.log(e);
    var next_url = '../friends/randomFriends?id=' + e.currentTarget.dataset.supplierid;
    wx.reLaunch({
      url: next_url
    })
    console.log("open id:" + e.currentTarget.dataset.supplierid);
  },
})
