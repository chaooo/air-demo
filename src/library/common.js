export default {
  // 获取随机数
  getRandom: function (min, max) {
    var r = Math.random() * (max - min)
    var re = Math.round(r + min)
    re = Math.max(Math.min(re, max), min)
    return re
  },
  // 星期返回
  GetDateWeek: function (date) {
    // date此处也可以写成17/07/2014一样识别，也可以写成07-17-2014但需要正则转换
    var day = new Date(Date.parse(date.replace(/-/g, '/')))
    var weekDay = new Array(['週日', '週一', '週二', '週三', '週四', '週五', '週六'])
    var week = weekDay[day.getDay()]
    return week
  },
  // 汉化日期
  GetDateChinese: function (dd_) {
    var str_ = dd_
    str_ = str_.substr(5)
    str_ = str_.replace(/[\-\/]/, '月') + '日'
    return str_
  },
  // 日期返回
  GetDateStr: function (dd_, AddDayCount) {
    var dd = new Date(dd_)
    // 获取AddDayCount天后的日期
    dd.setDate(dd.getDate() + AddDayCount)
    var y = dd.getFullYear()
    // 获取当前月份的日期，不足10补0
    var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
    return y + '-' + m + '-' + d
  },
  // 机场数据(接口数据)
  AirportDatas: function (el) {
    var timeOut = 'undefined'
    el.addEventListener('input', function () {
      if (typeof timeOut !== 'undefined') {
        clearTimeout(timeOut)
      }
      if (el.value !== '') {
        clearTimeout(timeOut)
        timeOut = setTimeout(function () {
          var xmlhttp = new XMLHttpRequest()
          if (typeof xmlhttp !== 'undefined') {
            xmlhttp.abort()
          }
          // 解决有些浏览器服务端无法响应XMLMinoType的问题
          if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType('text/xml')
          }
          xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              var r = JSON.parse(xmlhttp.responseText)
              var _html = ''
              if (r.length === 0) {
                _html = '<li class="focus">无数据</li>'
              } else {
                var eq = 0
                for (var i = 0; i < r.length; i++) {
                  if (r[i].children.length > 0) {
                    for (var j = 0; j < r[i].children.length; j++) {
                      _html += '<li _index="' + eq + '" id="' + r[i].children[j].id + '" citycode="' + r[i].children[j].giataCode + '"><img src="http://online.texpert.com/images/city-15.png">' + r[i].text + ',' + r[i].children[j].text + '(All Airport)[<strong>' + r[i].children[j].id + '</strong>]</li>'
                      eq += 1
                      if (r[i].children[j].children.length > 0) {
                        for (var k = 0; k < r[i].children[j].children.length; k++) {
                          _html += '<li _index="' + eq + '" id="' + r[i].children[j].children[k].id + '" citycode="' + r[i].children[j].giataCode + '"><img src="http://online.texpert.com/images/fly-15px.png">' + r[i].children[j].children[k].text + '[<strong>' + r[i].children[j].children[k].id + '</strong>]</li>'
                          eq += 1
                        }
                      }
                    }
                  }
                }
                // var test = eq
              }
              ;[].forEach.call(el.parentNode.children, function (child) {
                if (child !== el && child.classList.contains('airportData')) {
                  child.innerHTML = _html
                  child.style.display = 'block'
                  child.addEventListener('click', function (e) {
                    var target = e.target
                    if (target.nodeName === 'LI') {
                      el.setAttribute('aircode', target.id)
                      el.value = target.textContent || target.innerText
                      child.style.display = 'none'
                    }
                  }, false)
                }
              })
            }
          }
          xmlhttp.open('GET', 'http://online.texpert.com/ashx/package/AirHandler.ashx?action=airports&keywords=' + encodeURI(el.value) + '&language=2', true)
          xmlhttp.send()
        }, 500)
      } else {
        clearTimeout(timeOut)
        document.querySelectorAll('.airportData').forEach(function (a) {
          a.style.display = 'none'
        })
      }
    })
  }
}