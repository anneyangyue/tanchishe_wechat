var ctx = wx.createCanvasContext('tcsCanvas')
let snakeHead = {
  x: 0,
  y: 0,
  w: 20,
  h: 20,
  color: '#00ffff'
}
let direction = 'right'
let touchstartY = 0
let touchmoveX = 0
let touchstartX = 0
let touchmoveY = 0
let windowW = 0
let windowH = 0
let bodyArr = []
let bodyArrLen = 2
let Foods = []
Page({
  data: {
  },
  onReady: function (e) {
    wx.getSystemInfo({
      success(res) {
        windowW = res.windowWidth
        windowH = res.windowHeight
      }
    })
    for (let i = 0; i < 20; i++) {
      let foodItem = {
        x: this.randomFun(0, windowW - 20),
        y: this.randomFun(0, windowH - 20),
        w: this.randomFun(15, 20),
        h: this.randomFun(15, 20),
        color: 'rgb(' + this.randomFun(0, 255) + "," + this.randomFun(0, 255) + "," + this.randomFun(0, 255) + ')'
      }
      Foods.push(foodItem)
    }
    this.animate()
  },
  draw: function (obj) {
    ctx.setFillStyle(obj.color)
    ctx.beginPath()
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h)
  },
  animate: function () {
    let that = this
    var animateTimer = setInterval(function () {
      bodyArr.push({
        x: snakeHead.x,
        y: snakeHead.y,
        w: 20,
        h: 20,
        color: '#ffff00'
      })
      if (direction === 'left') {
        snakeHead.x -= snakeHead.w
      } else if (direction === 'right') {
        snakeHead.x += snakeHead.w
      } else if (direction === 'top') {
        snakeHead.y -= snakeHead.h
      } else if (direction === 'bottom') {
        snakeHead.y += snakeHead.h
      }
      if (snakeHead.x < 0 || snakeHead.x > windowW || snakeHead.y < 0 || snakeHead.y > windowH) {
        console.log('over', snakeHead.x, windowW )
        clearInterval(animateTimer)
        wx.showModal({
          title: '提示',
          content: '游戏结束，是否重来?',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.restart()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      that.draw(snakeHead)
      if (bodyArr.length > bodyArrLen) {
        bodyArr.shift()
      }
      for (let i = 0; i < bodyArr.length; i++) {
        that.draw(bodyArr[i])
      }
      for (let i =0; i < Foods.length; i++) {
        that.draw(Foods[i])
        if (that.hits(Foods[i], snakeHead)) {
          console.log('撞上了')
          Foods[i].x = that.randomFun(0, windowW - 20)
          Foods[i].y = that.randomFun(0, windowH - 20)
          Foods[i].color = 'rgb(' + that.randomFun(0, 255) + "," + that.randomFun(0, 255) + "," + that.randomFun(0, 255) + ')'
          bodyArrLen++
        }
      }
      ctx.draw()
    }, 500)
  },
  randomFun: function (min, max) {
    return parseInt(min + Math.random()*(max-min))
  },
  handletouchstart: function (e) {
    touchstartX = e.touches[0].x
    touchstartY = e.touches[0].y
  },
  handletouchmove: function (e) {
    touchmoveX = e.touches[0].x
    touchmoveY = e.touches[0].y
    let xVal = touchmoveX - touchstartX
    let yVal = touchmoveY - touchstartY
    if (Math.abs(xVal) > Math.abs(yVal) && xVal > 0) {
      direction = 'right'
    } else if (Math.abs(xVal) > Math.abs(yVal) && xVal < 0) {
      direction = 'left'
    } else if (Math.abs(xVal) < Math.abs(yVal) && yVal > 0) {
      direction = 'bottom'
    } else if (Math.abs(xVal) < Math.abs(yVal) && yVal < 0) {
      direction = 'top'
    } else {
      direction = 'right'
    }
  },
  handletouchend: function (e) {
    console.log('handletouchend', e, direction)
  },
  hits: function (obj1, obj2){
    let l1 = obj1.x
    let r1 = l1 + obj1.w
    let t1 = obj1.y
    let b1 = t1 + obj1.h
    let l2 = obj2.x
    let r2 = l2 + obj2.w
    let t2 = obj2.y
    let b2 = t2 + obj2.h
    if (l1 < r2 && l2 < r1 && t1 < b2 && b1 > t2) {
      return true
    } else {
      return false
    }
  },
  restart: function () {
    snakeHead.x = 0
    snakeHead.y = 0
    direction = 'right'
    touchstartY = 0
    touchmoveX = 0
    touchstartX = 0
    touchmoveY = 0
    bodyArr = []
    bodyArrLen = 2
    this.animate()
  }
})
