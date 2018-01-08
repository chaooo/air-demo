<template>
  <div class="searchForm">
    <div class="Type f16">
      <label>
        <input name="type" type="radio" value="1" v-model="airAPI.searchType"><span>單程</span></label>
      <label>
        <input name="type" type="radio" value="2" v-model="airAPI.searchType"><span>來回</span></label>
    </div>
    <div class="Input" v-show="airAPI.searchType==1">
      <div class="Airport">
        <input class="departureCity f14" type="text" placeholder="城市或機場" tabindex="1" aircode="HKG" value="中國,香港(All Airport)[HKG]">
        <div class="cityData f14"></div>
        <ul class="airportData f14"></ul>
        <p class="errTxt">請提供正確的城市/機場名稱</p>
      </div>
      <div class="Airport">
        <input class="arrivalCity f14" type="text" placeholder="城市或機場" tabindex="2" aircode=''>
        <div class="cityData f14"></div>
        <ul class="airportData f14"></ul>
        <p class="errTxt">請提供正確的城市/機場名稱</p>
      </div>
      <div class="searchDate">
        <input class="departureDate f14" id="singleDate" type="date" placeholder="出發時間" doubleDate=first tabindex="3">
        <p class="errTxt">請提供正确的日期</p>
      </div>
    </div>
    <div class="Input" v-show="airAPI.searchType==2">
      <div class="Airport">
        <input class="departureCity f14" type="text" placeholder="城市或機場" tabindex="1" aircode="HKG" value="中國,香港(All Airport)[HKG]">
        <div class="cityData f14"></div>
        <ul class="airportData f14"></ul>
        <p class="errTxt">請提供正確的城市/機場名稱</p>
      </div>
      <div class="Airport">
        <input class="arrivalCity f14" type="text" placeholder="城市或機場" tabindex="2" aircode=''>
        <div class="cityData f14"></div>
        <ul class="airportData f14"></ul>
        <p class="errTxt">請提供正確的城市/機場名稱</p>
      </div>
      <div class="searchDate" id="doubleDate">
        <input class="departureDate f14" type="date" placeholder="出發時間" doubleDate=first tabindex="3">
        <input class="arrivalDate f14" type="date" placeholder="返回時間" doubleDate=last>
        <p class="errTxt">請提供正确的日期</p>
      </div>
    </div>
    <div class="Select f14">
      <dl>
        <dt>艙位</dt>
        <dd>
          <select class="classType f14" v-model="airAPI.cabin">
            <option value="y" selected="selected">經濟艙</option>
            <option value="w"> 特選經濟艙</option>
            <option value="c"> 商務艙</option>
            <option value="f"> 頭等艙</option>
          </select>
        </dd>
      </dl>
      <dl>
        <dt>成人</dt>
        <dd>
          <select class="adultNum f14" v-model="airAPI.adult">
            <option value="1" selected="selected">1</option>
            <option v-for="n in (adultNum-1)" v-bind:value="n+1"> {{n+1}}</option>
          </select>
        </dd>
      </dl>
      <dl>
        <dt>小童(2-11歲)</dt>
        <dd>
          <select class="childNum f14" v-model="airAPI.child">
            <option value="0" selected="selected">0</option>
            <option v-for="n in childNum" v-bind:value="n">{{n}}</option>
          </select>
        </dd>
      </dl>
    </div>
    <div class="Button">
      <button class="searchBtn f16" v-on:click="gotoSearch()">搜尋</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'AirHome',
  data () {
    return {
      airAPI: {
        searchType: '2',
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        adult: '1',
        child: '0',
        cabin: 'y',
        currency: 'HK$'
      },
      totalNum: 9
    }
  },
  computed: {
    adultNum: function () {
      let temp = this.totalNum - this.airAPI.child
      if (temp >= 6) {
        return 6
      } else {
        return temp
      }
    },
    childNum: function () {
      let temp = this.totalNum - this.airAPI.adult
      if (temp >= 6) {
        return 6
      } else {
        return temp
      }
    }
  },
  methods: {
    checkInput: function (element) {
      element.style.borderColor = 'red'
      ;[].forEach.call(element.parentNode.children, function (err) {
        if (err !== element && err.classList.contains('errTxt')) {
          err.style.display = 'block'
        }
      })
    },
    gotoSearch: function () {
      var $this = this
      document.querySelectorAll('.departureCity').forEach(function (el) {
        if (el.offsetParent !== null) {
          if (el.value !== '' && el.getAttribute('aircode') !== '') {
            $this.airAPI.origin = el.getAttribute('aircode').toLowerCase()
          } else {
            $this.checkInput(el)
          }
        }
      })
      document.querySelectorAll('.arrivalCity').forEach(function (el) {
        if (el.offsetParent !== null) {
          if (el.value !== '' && el.getAttribute('aircode') !== '') {
            $this.airAPI.destination = el.getAttribute('aircode').toLowerCase()
          } else {
            $this.checkInput(el)
          }
        }
      })
      document.querySelectorAll('.departureDate').forEach(function (el) {
        if (el.offsetParent !== null) {
          if (el.value !== '') {
            $this.airAPI.departureDate = el.value
          } else {
            $this.checkInput(el)
          }
        }
      })
      document.querySelectorAll('.arrivalDate').forEach(function (el) {
        if (el.offsetParent !== null) {
          if (el.value !== '') {
            $this.airAPI.returnDate = el.value
          } else {
            $this.checkInput(el)
          }
        } else {
          $this.airAPI.returnDate = ''
        }
      })
      // 出发地与目的地之一输入必须为香港
      var validationHK = ($this.airAPI.origin === 'hkg' ^ $this.airAPI.destination === 'hkg')
      // 单程
      var validationSG = ($this.airAPI.origin !== '' && $this.airAPI.destination !== '' && $this.airAPI.departureDate !== '')
      // 双程
      var validationDB = ($this.airAPI.origin !== '' && $this.airAPI.destination !== '' && $this.airAPI.departureDate !== '' && $this.airAPI.returnDate !== '')
      if (!validationHK) {
        alert('出發地與目的地輸入之一必須為香港！')
        return false
      }
      if ($this.airAPI.searchType === '1') {
        if (validationHK && validationSG) {
          this.$router.push({path: 'airs', query: $this.airAPI})
        } else {
          return false
        }
      }
      if ($this.airAPI.searchType === '2') {
        if (validationHK && validationDB) {
          this.$router.push({path: 'airs', query: $this.airAPI})
        } else {
          return false
        }
      }
    }
  },
  mounted: function () {
    let $this, minDate, checkDate, currentYear, maxDate
    $this = this
    minDate = this.ComonJS.GetDateStr(new Date(), 3)
    checkDate = this.ComonJS.GetDateStr(new Date(), 5)
    currentYear = (this.ComonJS.GetDateStr(new Date(), 0).split('/'))[0]
    if (currentYear % 4 === 0 || currentYear % 400 === 0) {
      maxDate = this.ComonJS.GetDateStr(new Date(), 366)
    } else {
      maxDate = this.ComonJS.GetDateStr(new Date(), 365)
    }
    document.querySelectorAll('.departureDate').forEach(function (el) {
      el.value = minDate
      el.setAttribute('min', minDate)
      el.setAttribute('max', maxDate)
    })
    document.querySelectorAll('.arrivalDate').forEach(function (el) {
      el.value = checkDate
      el.setAttribute('min', minDate)
      el.setAttribute('max', maxDate)
    })
    document.querySelectorAll('.Airport input').forEach(function (el) {
      $this.ComonJS.AirportDatas(el)
    })
    document.querySelectorAll('.Airport input, .searchDate input').forEach(function (el) {
      el.addEventListener('focus', function () {
        // this.style.cssText = 'border-color:#dbdbdb'
        el.style.borderColor = '#dbdbdb'
        ;[].forEach.call(el.parentNode.children, function (err) {
          if (err !== el && err.classList.contains('errTxt')) {
            err.style.display = 'none'
          }
        })
      })
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped> -->
<style>
  .searchForm{min-height:100%;background-color:#fafafa;padding:.5rem 0;}
  .searchForm .Type{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;justify-content:space-around;margin:.75rem auto;}
  .searchForm .Type label{width:2.5rem;height:1.25rem;line-height:1.25rem;text-align:center;}
  .searchForm .Type label input{display:none;}
  .searchForm .Type label span{display:block;cursor:pointer;width:100%;height:100%;position:relative;overflow:hidden;border-radius:.1rem;background:#ebe6e2;}
  .searchForm .Type label span:before,.searchForm .Type label span:after{position:absolute;right:0;bottom:0;display:none;}
  .searchForm .Type label span:before{content:"";width:0;height:0;border-color:transparent transparent #003399 transparent;border-style:solid;border-width:0 0 .5rem .5rem;}
  .searchForm .Type label span:after{content:"\2713";width:.5rem;height:.5rem;line-height:.6rem;text-align:right;color:#fdd700;font-size:.25rem;}
  .searchForm .Type input:checked+span{background:#fdd700;color:#003399;}
  .searchForm .Type label input:checked + span:before,.searchForm .Type label input:checked + span:after{display:block;}
  .searchForm .Airport,.searchForm .searchDate,.searchForm .Select,.searchForm .Button{width:9.2rem;margin:0 auto .25rem;padding-bottom:.5rem;text-align:left;position:relative;}
  .searchForm .Airport input,.searchForm .searchDate input{box-sizing:border-box;background:transparent;height:1.25rem;width:100%;background:#fff;border:1px solid #dbdbdb;border-radius:.1rem;text-indent:.25rem;outline:none;}
  .searchForm .errTxt{display:none;position:absolute;bottom:0;left:0;color:#e40613;text-indent:.25rem;}
  .searchForm .searchDate{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;}
  .searchForm .searchDate input{width:4.3rem;}
  .searchForm .searchDate input.arrivalDate{margin-left:.6rem;}
  #singleDate{width:100%;margin:0;}
  .searchForm .Select{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;justify-content:space-around;margin:0 auto .25rem;}
  .searchForm .Select dl{margin-left:.4rem;width:2.8rem;height:1.25rem;box-sizing:border-box;line-height:.6rem;border:1px solid #ddd;box-shadow:0 0 1px #ddd;border-radius:.1rem;background:#fff;position:relative;}
  .searchForm .Select dl:first-of-type{margin-left:0;}
  .searchForm .Select dl dt{height:.6rem;line-height:.6rem;margin:0;text-align:center;}
  .searchForm .Select dl dd{height:.65rem;line-height:.6rem;position:relative;}
  .searchForm .Select dl dd:before{content:'\25BC';transform:scale(.65);color:#000;position:absolute;right:.1rem;bottom:.1rem;}
  .searchForm .Select dl dd select{position:absolute;left:0;top:-.6rem;box-sizing:border-box;height:1.25rem;border:none;width:100%;padding-top:.6rem;line-height:.6rem;text-indent:.25rem;text-align:left;color:#003399;background:transparent;-webkit-appearance:none;-moz-appearance:none;appearance:none;}
  .searchForm .Select dl dd select::-ms-expand{display:none;}
  .searchForm .Select dl dd option{font-size:16px;}
  .searchForm .searchBtn{display:block;cursor:pointer;width:100%;height:1.25rem;line-height:1.25rem;text-align:center;background-color:#fdd700;color:#363636;border:none;border-radius:.1rem;text-decoration:none;}
  .airportData{position:absolute;left:0;top:1.3rem;box-sizing:border-box;width:100%;max-height:6rem;background:#fff;box-shadow:0 0 5px #d9d9d9;z-index:5;}
  .airportData li{list-style:none;display:block;line-height:1rem;margin:0;padding:0 .25rem;overflow:hidden;}
  .airportData li img{height:.5rem;vertical-align:middle;}
  .airportData li.focus{background:#003399;color:white;}
</style>