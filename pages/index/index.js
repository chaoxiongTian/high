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
    avator:'',
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
    hasAction: false,
    actionId:'testID',
    actionName:'testAction',
    friends:[],
    friendsCount:0,
    friendsZindex:10,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'IMJBZ-LVYLU-ZJ3VP-2Q77A-EIRY7-VTBFO'
    });
    
    var that = this;
    app.getLocal(that);
    this.startLocalHeart();
    this.getUserInfo();
    this.setShareBtn();
    this.getFriendInfo();
    console.log(options);
    if (options.share) {
      var friendOpenID = options.id;
      this.updateFriendInfo(friendOpenID);
      console.log("friendId ", friendOpenID);
      if (options.actionId){
        var addUrl = '../invite/invite?id=' + options.actionId;
        console.log(addUrl);
        wx.navigateTo({
          url: addUrl,
        })
      }
    }
  },
  onFriendsClose(){
    this.setData({
      friendsZindex:10,
    })
  },
  tapShare(){
    console.log("shareBtn");
    this.onShareAppMessage();
  },
  tapList() {
    wx.navigateTo({
      url: '../action_history/action_history',
    })
  },
  tapRandom() {
    var randomI = Math.floor(Math.random() * this.data.friendsCount);
    var addUrl = '../friends/randomFriends?id=' + randomI;
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
          avator: res.userInfo.avatarUrl,
        })
        console.log('userinfo:',res);
        that.getAvatarImage(res.userInfo.avatarUrl).then(function (cachePath){
          console.log('xxxxxx  ', cachePath);
          that.setData({
            avatarUrl: cachePath,
            hasAvatar: true
          })

          that.setFriends(res.userInfo.avatarUrl)

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
    app.globalData.friends = friends;
    app.globalData.friendsCount = 20;
    this.setData({
      friends:friends,
      friendsCount:20,
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
        content: this.data.hasAction ? this.data.actionName : this.data.userInfo.nickName, 
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
    //console.log('marker:',markers);
    //console.log(this.data.hasMarker);
    //console.log(this.data.hasAvatar);
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
      if (that.data.hasAvatar&&that.data.hasMarker){
        that.updatePos();
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

  onShareAppMessage: function () {
    var path = "pages/index/index?share=1&id=" + app.globalData.userOpenId;
    var desc = app.globalData.userInfo.nickName + "邀请你来使用";
    return {
      title: '嗨的不行',
      desc: desc,
      path: path,
    }
  },

  updateFriendInfo:function(id) {
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/update_friend',
      data: {
        wxidA: id,
        wxidB: app.globalData.userOpenId,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log("update_friend: " + res)
      },
      fail: function () {
        console.log("update_friend fail")
      }
    })
  },

  getFriendInfo:function(){
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/get_friend_list',
      data: {
        wxid:app.globalData.userOpenId,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log("get_friend_list: " + res);
        var friends=[];
        for (var i = 0; i < res.count; i++) {
          var oneFriend = {
            index: i,
            name: res.nikeName[i],
            openId: res.friendId[i],
            avator: res.frientAvator[i],
          }
          friends[i]=oneFriend;
        }
        if (res.count) {
          that.setData({
            friends:friends,
            friendsCount:res.count
          })
          app.globalData.friends = friends;
          app.globalData.friendsCount = res.count;
        }
      },
      fail: function () {
        console.log("get_friend_list fail")
      }
    })
  },
  updatePos: function () {
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/update_position',
      data: {
        wxid: app.globalData.userOpenId,
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        avator: app.globalData.userInfo.avatarUrl,
        nickname: app.globalData.userInfo.nickName,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log("update_position: " + res)
        
        that.setData({
          hasAction:res.hasAction,
          actionId:res.actionId[0],
          actionName:res.actionName[0],
        })
        
      },
      fail: function () {
        console.log("update_position fail")
      }
    })
  },
})
