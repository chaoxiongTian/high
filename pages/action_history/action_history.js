//获取应用实例
const app = getApp();
var util = require('../utils/util.js');
Page({
  data: {
    listData: [],
    backBtnTop: 6,
    navHeight:6,
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },

  onLoad: function () {
   
    this.setBackBtn();
  },
  setBackBtn() {
    this.setData({
      backBtnTop: wx.getSystemInfoSync().statusBarHeight + 6,
      navHeight: wx.getSystemInfoSync().statusBarHeight + 43,
    })
  },
  tapBack() {
    wx.navigateBack({
    })
  },
  onClickAction: function (e) {
    var next_url = '../invite/invite?id=' + e.currentTarget.dataset.supplierid;
    wx.navigateTo({
      url:next_url
    })
    console.log("action id:" + e.currentTarget.dataset.supplierid);
  },

  onRequestData:function(){
    //请求数据
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/get_action_list.php',
      data: {
        wxid: app.globalData.userOpenId,
        all: true,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType: 'json',
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log("get_action_list", res.data)
          var actionInfo = new Array();
          for (var i = 0; i < res.data.length; i++){
            var action = res.data[i];
            var users = action.users;
            var userInfo = new Array();
            for (var j=0; j<users.length && j<4; j++) {       
              var user = {
                id: users[j].wxid,
                avatar:users[j].avator, 
                show: false,
              };
              userInfo.push(user);
            }
            console.log("get_action_list_users", userInfo);
            let actionTimes = new Date(action.actionTime * 1000 - 3600000 * 8)
            let nowDate = (new Date()).getTime() / 1000 - 3600*8;
            var action0 = {
              id: action.actionID,
              theme: action.actionName,
              time: util.formatTime(actionTimes),
              location: action.actionPosName,
              address: action.actionPosDec,
              participants: userInfo,
              status: action.isOldAction,
              shouldEllipsis: false
            }
            actionInfo.push(action0);
          }
          console.log(actionInfo);
          actionInfo.forEach((action, action_index, array) => {
            action.participants.forEach((user, user_index, array) => {
              if (user_index < 3) {
                user.show = true;
              }
              else {
                user.show = false;
              }
            })
            if (that.userNum(action.participants) > 3) {
              action.shouldEllipsis = true;
            }
            else {
              action.shouldEllipsis = false;
            }
          })
          that.setData({
            actionList: actionInfo
          })
          console.log("get_action_list: " + that.data.actionList)
        } else {
          console.log("get_action_list error : " + res.statusCode)
        }
      },
      fail: function () {
        console.log("get_action_list fail")
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

  userNum:function(users){
    var counter = 0;
    for(var x in users){
      counter++;
    }
    return counter;
  },

  onShow: function () {
    global.sss = this;
    let scope = this;
    this.onRequestData();
  },
  
},
)
function transTimeMillToString(timeMillisecond) {
  let date = new Date(timeMillisecond)
  let dataString = ' '+ (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月' + date.getDate() + '日 周' + getDayOfWeek(date.getDay()) + date.getHours() + ':' + date.getMinutes();
  console.log('transTimeMillToString:', dataString);
  return dataString;
}

function getDayOfWeek(day) {
  // var dayOfWeek
  switch (day) {
    case 0:
      return '日'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
  }
}
