
const date = new Date()
let remind_times = []

for (let i = 5; i <= 100; i=i+5) {
  remind_times.push(i)
}

Page({
  onShareAppMessage() {
    return {
      title: 'picker-view',
      path: 'page/component/pages/picker-view/picker-view'
    }
  },

  bindButtonTap: function (event) {
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面

    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }

    if (prevPage) {
      console.log('1111')
      prevPage.setData({
        remind_time: this.data.remind_time
      });
    }

    wx.navigateBack({
      delta: 1,
    })
  },

  data: {
    remind_times,
    remind_time: 5,
  },
  bindChange(e) {
    const val = e.detail.value
    this.setData({
      remind_time: this.data.remind_times[val[0]],
    })
  }
}) 