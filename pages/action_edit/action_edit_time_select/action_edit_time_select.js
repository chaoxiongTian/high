
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []

const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
const hour = date.getHours()
const minute = date.getMinutes()
const second = date.getSeconds()

for (let i = date.getFullYear(); i <= date.getFullYear() + 10; i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
for (let i = 0; i <= 23; i++) {
  hours.push(i)
}
for (let i = 0; i <= 59; i++) {
  minutes.push(i)
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

    let curTime = `${this.data.year}年${this.data.month}月${this.data.day}日 ${this.data.hour}:${this.data.minute}`;
    

    if (this.data.month < 10) {

    }
  
    let time = `${this.data.year}-${this.data.month < 10 ? '0' + this.data.month : this.data.month}-${this.data.day < 10 ? '0' + this.data.day : this.data.day}T${this.data.hour < 10 ? '0' + this.data.hour : this.data.hour}:${this.data.minute < 10?'0' + this.data.minute: this.data.minute}:00`
    var date = new Date(time);
    let timestamp = date.getTime();
    console.log('!!!!!', time,date, timestamp)
    if (prevPage) {
      console.log('1111')
      prevPage.setData({
        time: curTime,
        timestamp: timestamp
      });
    }
    
    wx.navigateBack({
      delta: 1,
    })
  },

  data: {
    years,
    year: date.getFullYear(),
    months,
    month: date.getMonth() + 1,
    days,
    day: date.getDate(),
    value: [0, date.getMonth(), date.getDate() - 1, hour - 1, minute],
    hours,
    hour: date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
    minutes,
    minute: date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
  },
  bindChange(e) {
    const val = e.detail.value;

    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]],
      minute: this.data.minutes[val[4]],
    })

    
  }
}) 