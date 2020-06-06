//index.js
//获取应用实例
import audioList from './data.js'
var app = getApp()
const back = wx.getBackgroundAudioManager()
Page({
  data: {
    UIchange:0,//播放模式
    audioList: audioList,//音乐列表
    audioIndex: 0,//音乐列表中数据个数
    pauseStatus: true,//旋转图是否旋转（是否暂停）
    listShow: false,//时候显示列表界面，false为音乐播放界面
    timer: '',
    currentPosition: 0,//当前歌曲时间戳
    duration: 0,//歌曲时间长度
  },
  onLoad: function() {
    wx.showModal({
      title: '1.1.1版本更新',
      content: '修复部分BUG和体验 \r\n 增加分享歌曲功能 \r\n 感谢您的支持！Created By Gilbert',
      showCancel: false,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    console.log('onLoad')
    console.log(this.data.audioList.length)
    //  获取本地存储存储audioIndex
    var audioIndexStorage = wx.getStorageSync('audioIndex')
    console.log(audioIndexStorage)
    if (audioIndexStorage) {
      this.setData({
        audioIndex: audioIndexStorage
      })
    }
  },
  onReady: function(e) {
    console.log('onReady')
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    // this.audioCtx = wx.createAudioContext('audio')
  },
  popSelect: function ()
  {
    let that = this;
    var xx=that.data.UIchange;
    xx=(xx+1)%3;
    that.setData({
     UIchange : xx
    })
    console.log("mode is "+that.data.UIchange);
    // console.log(that.data.UIchange);
          if(that.data.UIchange === 0)
          {
          wx.showToast({
            title: '切换成单曲循环',
            icon: '',    //如果要纯文本，不要icon，将值设为'none'
            duration: 1000
          })
          }
          else if (that.data.UIchange === 1)
          {
            wx.showToast({
              title: '切换成列表循环',
              icon: '',    //如果要纯文本，不要icon，将值设为'none'
              duration: 1000
            })
          }
          else if (that.data.UIchange === 2) 
          {
            wx.showToast({
              title: '切换成随机播放',
              icon: '',    //如果要纯文本，不要icon，将值设为'none'
              duration: 1000
            })
          }
  },
  bindSliderchange: function(e) {
    // clearInterval(this.data.timer)
    let value = e.detail.value
    let that = this
    console.log(e.detail.value)
    wx.getBackgroundAudioPlayerState({
      success: function(res) {
        console.log(res)
        let {
          status,
          duration
        } = res
        if (status === 1 || status === 0) {
          that.setData({
            sliderValue: value
          })
          wx.seekBackgroundAudio({
            position: value * duration / 100,
          })
        }
      }
    })
  },
  bindTapPrev: function() {
    let that=this
    console.log('bindTapPrev')
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if(that.data.UIchange!=2)
    {
      if (audioIndexPrev === 0) {
        audioIndexNow = length - 1
      } else {
       audioIndexNow = audioIndexPrev - 1
      }
    }
    else
    {
      audioIndexNow = parseInt(Math.random() * length, 10)
    }
    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
    })
    setTimeout(() => {
      that.setData({
        pauseStatus: false
      })
      this.play()
    }
    ,1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },
  bindTapNext: function() {
    let that=this
    console.log('bindTapNext')
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if(that.data.UIchange!=2)
    {
    if (audioIndexPrev === length - 1) {
      audioIndexNow = 0
    } else {
      audioIndexNow = audioIndexPrev + 1
    }
    }
    else{
      audioIndexNow = parseInt(Math.random() * length, 10)
    }
    console.log("下一首为"+audioIndexNow);
    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
    })
    setTimeout(() => {
      that.setData({
         pauseStatus: false
         })
        this.play()
      }
    , 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },
  bindTapPlay: function() {
    console.log('bindTapPlay')
    console.log(this.data.pauseStatus)
    if (this.data.pauseStatus === true) {
      this.play()
      this.setData({
        pauseStatus: false
      })
    } else {
      wx.pauseBackgroundAudio()
      this.setData({
        pauseStatus: true
      })
    }
  },
  bindTapList: function(e) {
    console.log('bindTapList')
    console.log(e)
    this.setData({
      listShow: true
    })
  },
  anotherbindTapList: function (e) {
    console.log('anotherbindTapList')
    console.log(e)
    this.setData({
      listShow: false
    })
  },
  bindTapChoose: function(e) {
    let that = this
    console.log('bindTapChoose')
    console.log(e)
    this.setData({
      audioIndex: parseInt(e.currentTarget.id, 10),
      listShow: false
    })
    setTimeout(() => {
      if(that.data.pauseStatus===false)
        that.play()
    }, 1000)
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10))
  },
  play() {
    let that = this
    let length = this.data.audioList.length
    console.log("play");
    let {
      audioList,
      audioIndex
    } = this.data
    wx.playBackgroundAudio({
      dataUrl: audioList[audioIndex].src,
      title: audioList[audioIndex].name,
      coverImgUrl: audioList[audioIndex].poster,
    })
    // player();
    // function player()
    // {
    //   console.log(11111);
    //   console.log(that.data.audioIndex)
    //   console.log(length)
    //   back.src = audioList[that.data.audioIndex].src;
    //   back.title=audioList[that.data.audioIndex].name;
    //   back.coverImgUrl=audioList[that.data.audioIndex].poster;
    //   back.onPlay(() => {
    //     console.log("音乐播放开始");
    //   })
    //   back.onEnded(()=>{
    //   if(that.data.UIchange===0)
    //   {
    //     player();
    //   }
    //   else if(that.data.UIchange===1)
    //   {
    //     that.setData({
    //       audioIndex:(audioIndex+1)%length,
    //       sliderValue: 0,
    //       currentPosition: 0,
    //       duration: 0,
    //     }),
    //     player();
    //   }
    //   else 
    //   {
    //     that.setData({
    //       audioIndex: (audioIndex+Math.floor(Math.random() * length))%length,
    //       sliderValue: 0,
    //       currentPosition: 0,
    //       duration: 0,
    //     }),
    //       player();
    //   }
    //   })
    // }
    let timer = setInterval(function() {
      that.setDuration(that)
    }, 1000)
    this.setData({
      timer: timer
    })
    console.log("timer"+timer);
  },
  setDuration(that) {
    wx.getBackgroundAudioPlayerState(
      {
      success: function(res) {
        console.log(res)
        let {
          status,
          duration,
          currentPosition
        } = res
        if (status!=2) 
        {
          // console.log(currentPosition);
           currentPosition = Math.round(currentPosition);
           duration=Math.round(duration);
           if(currentPosition==2)
           {
              //循环播放
           }
          // console.log(Math.round(currentPosition));
          // console.log(Math.round(duration));
          that.setData({
            currentPosition: that.stotime(currentPosition),
            duration: that.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration)
          })
          currentPosition = Math.floor(currentPosition);
          // console.log(currentPosition)
        }
        else{
          console.log("播放已结束！");
          that.setData({
            currentPosition:0
          })
          if(that.data.UIchange===2)
          {
            let length = that.data.audioList.length;
            var xx = (that.data.audioIndex + Math.floor(Math.random() * length)) % length;
            console.log("已切换！")
            that.setData({
              audioIndex:xx
            })
          }
          that.play();
        }
      }
    }
    )
  },
  stotime: function(s) {
    let t = '';
    if (s > -1) {
      // let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      // if (hour < 10) {
      //   t = '0' + hour + ":";
      // } else {
      //   t = hour + ":";
      // }
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },
  onShareAppMessage: function() {
    console.log("share");
    let that = this
    return {
      title: '我在light a world上分享了：' + that.data.audioList[that.data.audioIndex].name + '给你，快来收听吧！',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 1000
        })
      }
    }
  }
})