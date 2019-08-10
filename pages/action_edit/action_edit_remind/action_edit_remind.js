
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

  data: {
    remind_times,
    remind_time: 5,
  },
  bindChange(e) {
    const val = e.detail.value
    this.setData({
      remind_times: this.data.remind_times[val[0]],
    })
  }
}) 