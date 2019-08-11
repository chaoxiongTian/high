const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backBtnTop: 6,
    navHeight: 6,
    actionId:0,
    wxid:0,
    joinUserNum:0,
    isOwner:true,
    isJoin:true,
    joinUserArray:[
      // { avatar: "image/back.png", nickname: "小明"},
      // { avatar: "image/back.png", nickname: "小明"},
      // { avatar: "image/back.png", nickname: "小明"},
    ],
    latitude:null, 
    longitude:null,
    noticeTime:null,
    actionName: "吃饭",
    actionTime: null,
    actionTimeString: "8月32日\t周日\t11:45",
    actionPosName: "深圳腾讯滨海大厦",
    actionPosDec: "广东省深圳市南山区后海大道与滨海大道交汇处",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setBackBtn();
    this.setData({
      actionId:options.id,
      wxid:app.globalData.userOpenId,
    })
    console.log('actionID',this.data.actionId);
  },
  setBackBtn() {
    this.setData({
      backBtnTop: wx.getSystemInfoSync().statusBarHeight + 6,
      navHeight: wx.getSystemInfoSync().statusBarHeight + 43,
    })
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
    var that = this
    wx.request({
      url: 'http://149.28.31.199/get_action.php',
      data: {
        wxid: this.wxid,
        actionId: this.actionId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType:'json',
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log("invite.js getAction", res.data)
          that.setData({
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            actionName: res.data.actionName,
            actionTime: res.data.actionTime,
            actionTimeString: transTimeMillToString(res.data.actionTime),
            actionPosName: res.data.actionPosName,
            actionPosDec: res.data.actionPosDec,
            noticeTime: res.data.noticeTime,
            isOwner: res.data.isOwner,
            joinUserArray: res.data.users,
            joinUserNum: joinUserArray.length,
          })

        } else {
          console.log("invite.js getAction error : " + res.statusCode)
        }
      },
      fail: function () {
        console.log("invite.js getAction fail")
      }
    })
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
    var path = "pages/index/index?share=1&id=" + app.globalData.userOpenId + '&actionId=' + this.data.actionId;
    var desc = app.globalData.userInfo.nickName + "邀请你来使用";
    return {
      title: '嗨的不行',
      desc: desc,
      path: path,
    }
  },

  doContact: function () {

  },

  invite: function () {

  },

  editMetting: function () {
    var action = {
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      noticeTime: this.data.noticeTime,
      actionName: this.data.actionName,
      actionTime: this.data.actionTime,
      actionPosName: this.data.actionPosName,
      actionPosDec: this.data.actionPosDec,
    }
    var url = '../action_edit/action_edit?actionId=' + this.data.actionId + '&action=' + JSON.stringify(action);
    
    wx.navigateTo({
      url:url,
    })
  },

  exitMetting: function () {

  },

  deleteMetting: function () {

  },

  getAvatarImage: function (avatarUrl, index) {
    var that = this;
    console.log(avatarUrl);
    wx.downloadFile({
      url: avatarUrl,
      success: function (res) {
        var cachePath = res.tempFilePath.replace("http:/", '').replace("https:/", '')
        that.setData({
          [joinUserArray[index].avatar] : cachePath,
        })
      }
    })
  },

  transUsersAvatar: function() {
    for (var i = 0; i < joinUserArray.length; i++){
      getAvatarImage(joinUserArray[i].avatar, i)
    }
  },

  onTapBack: function () {
    wx.navigateBack({
    })
  },

  openLocation: function() {
    wx.openLocation({
      longitude:this.data.longitude,
      latitude: this.data.latitude,
      name: this.data.actionPosName,
      address: this.data.actionPosDec,
    })
  }
})

function transTimeMillToString(timeMillisecond) {
  let date = new Date(timeMillisecond)
  console.log(`transTimeMillToString:  ${timeMillisecond}`)
  return `${(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)}月${date.getDate()}日 周${getDayOfWeek(date.getDay())}  ${date.getHours()}:${date.getMinutes()}`
}

function getDayOfWeek(day) {
  // var dayOfWeek
  switch(day){
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
