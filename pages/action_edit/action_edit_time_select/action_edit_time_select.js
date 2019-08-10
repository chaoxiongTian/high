
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []

for (let i = date.getFullYear(); i <= date.getFullYear() + 10; i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
for (let i = 1; i <= 24; i++) {
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

  data: {
    years,
    year: date.getFullYear(),
    months,
    month: 1,
    days,
    day: 1,
    value: [9999, 1, 1],
    hours,
    hours:24,
    minutes,
    minutes:59,
  },
  bindChange(e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[0]],
      day: this.data.days[val[0]],
      hours: this.data.days[val[0]],
      minutes: this.data.minutes[val[0]],
    })
  }
}) 