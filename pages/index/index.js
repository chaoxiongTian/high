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
    actionId:' ',
    actionName:' ',
    friends:[],
    friendsCount:0,
    friendsZindex:10,
    friendsAvator:[],
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
    setTimeout(function () {
      app.getLocal(that);
      that.getFriendInfo();
      that.setMarkers();
      if (!that.data.hasMarker) {
        that.getUserInfo();
      }
      if (that.data.hasAvatar && that.data.hasMarker) {
        that.updatePos();
      }
    }, 2000)
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

          //that.setFriends(res.userInfo.avatarUrl)

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

    var markers = {
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
    }
    this.setData({
      hasMarker: true,
      'markers[0]': markers
    })
    //console.log('marker:',markers);
    //console.log(this.data.hasMarker);
    //console.log(this.data.hasAvatar);
  },
  startLocalHeart() {
    var that = this;
    var timerTem = setInterval(function () {
      app.getLocal(that);
      that.setMarkers();
      if(!that.data.hasMarker){
        that.getUserInfo();
      }
      if (that.data.hasAvatar&&that.data.hasMarker){
        that.updatePos();
      }
    }, 10000)
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
    if (id == app.globalData.userOpenId) {
      return;
    }
    wx.request({
      url: 'http://149.28.31.199/update_friend.php',
      data: {
        wxidA: id,
        wxidB: app.globalData.userOpenId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType: "json",
      method: 'POST',
      success: function (res) {
        console.log("update_friend: " + res.data.success)
      },
      fail: function () {
        console.log("update_friend fail")
      }
    })
  },

  getFriendInfo:function(){
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/get_friend_list.php',
      data: {
        wxid:app.globalData.userOpenId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType: "json",
      method: 'GET',
      success: function (res) {
        console.log("get_friend_list: " + res.data.count);
        var friends=[];
        for (var i = 0; i < res.data.count; i++) {
          var oneFriend = {
            index: i,
            name: res.data.nickname[i],
            openId: res.data.frientId[i],
            avator: res.data.friendAvator[i],
            cachePath: '',
            longitude:'',
            latitude:'',
            hasAction:false,
            actionId:'',
            actionName:'',
          }
          friends[i]=oneFriend;
        }
        if (res.data.count) {
          console.log("get_friend_list:",friends);
          that.setData({
            friends:friends,
            friendsCount: res.data.count
          })
          app.globalData.friends = friends;
          app.globalData.friendsCount = res.data.count;
          that.getAllFriends();
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
      url: 'http://149.28.31.199/update_position.php',
      data: {
        wxid: app.globalData.userOpenId,
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        avator: app.globalData.userInfo.avatarUrl,
        nickname: app.globalData.userInfo.nickName,
      }, 
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType: "json",
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log("update_position:",res.data)
          that.setData({
            hasAction: res.data.hasAction,
            actionName:res.data.actionName[0],
            actionId:res.data.actionId[0],
          })
        }
      },
      fail: function () {
        console.log("update_position fail")
      }
    })
  },

  getAllFriends() {
    console.log("getAllFriends----------------");
    var that = this;
    for (let i=0; i<that.data.friendsCount; i++){
      wx.request({
        url: 'http://149.28.31.199/update_position.php',
        data: {
          wxid: that.data.friends[i].openId,
          longitude: 0,
          latitude: 0,
          avator: '',
          nickname: '',
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        dataType: "json",
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 200) {
            console.log("update_position_friends:", res.data)
            var t1 = 'friends[' + i + '].longitude';
            var t2 = 'friends[' + i + '].latitude';
            var t3 = 'friends[' + i + '].hasAction';
            var t4 = 'friends[' + i + '].actionName';
            var t5 = 'friends[' + i + '].actionId';
            that.setData({
              [t1]: res.data.longitude,
              [t2]: res.data.latitude,
              [t3]: res.data.hasAction,
              [t4]: res.data.actionName[0],
              [t5]: res.data.actionId[0],
            })
          }
        },
        fail: function () {
          console.log("update_position fail")
        }
      })
      that.getAvatarImage(that.data.friends[i].avator).then(function (cachePath) {
        console.log('xxxxxx  ', cachePath);
        var t1 = 'friends[' + i + '].cachePath';
        that.setData({
          [t1]:cachePath,
        })
      })
    }
    setTimeout(function () {
      that.setFriendsMarker();
    }, 5000)
  },
  setFriendsMarker(){
    console.log('setFriends:',this.data.friends);
    for (var i=0; i<this.data.friendsCount; i++){
      var markers = {
        iconPath: this.data.friends[i].cachePath,
        latitude: this.data.friends[i].latitude,
        longitude: this.data.friends[i].longitude,
        height: 50,
        width: 50,
        id: i+1,
        callout: {
          content: this.data.friends[i].hasAction ? this.data.friends[i].actionName : this.data.friends[i].name,
          color: "#FFFFFF",
          fontSize: 18,
          borderRadius: 20,
          bgColor: "#FF4081",
          padding: 5,
          display: 'ALWAYS'
        }
      }
      console.log('setFriendsMark:',i,markers);
      var t1 = 'markers[' + [i+1] + ']';
      this.setData({
        [t1]: markers
      })
    }
    console.log('setFriendsMark:', this.data.markers);
  }
})
