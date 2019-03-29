<template>
  <div class="flightList">
    <div class="title f16" v-on:click="goToAir()">
      <div v-if="chosenVoyage.length>=1">選擇回程:{{title.arrivalCity + '✈' + title.originCity + ' ' + ComonJS.GetDateChinese(title.arrivalDate) + ' '+ ComonJS.GetDateWeek(title.arrivalDate)}}</div>
      <div v-else>選擇去程:{{title.originCity + '✈' + title.arrivalCity + ' ' + ComonJS.GetDateChinese(title.originDate) + ' '+ ComonJS.GetDateWeek(title.originDate)}}</div>
    </div>
    <div class="listBox">
      <div class="Chosen f12" v-if="chosenVoyage.length>=1" v-for="item in chosenVoyage">
          <div class="tit">
              <label>去程<br>已選定</label>
          </div>
          <div class="line">
              <p>{{item.Voyages[0].AirLineName}}</p>
              <p>{{item.Voyages[0].AirLineCode + item.Voyages[0].FlightNumber}}</p>
          </div>
          <div class="port">
              <p>{{item.Voyages[0].DeparturePortName}}</p>
              <p>{{item.Voyages[0].ArrivalPortName}}</p>
          </div>
          <div class="time">
              <p>{{item.Voyages[0].DepartureTime}}</p>
              <p>{{item.Voyages[0].ArrivalTime}}</p>
          </div>
          <a class="cancel" href="javascript:void(0);" v-on:click="clearChosen($event)">重新選擇</a>
      </div>
      <div class="listNum" v-if="chosenVoyage.length>=1">搜索到<em>{{flightList.length}}</em>條<em>{{title.arrivalCity}}</em>到<em>{{title.originCity}}</em>的航班</div>
      <div class="listNum" v-else>搜索到<em>{{flightList.length}}</em>條<em>{{title.originCity}}</em>到<em>{{title.arrivalCity}}</em>的航班</div>
      <div class="List">
        <div class="Item f12" v-for="(item, index) in flightList">
          <div class="infoBox">
            <div class="departure">
              <p class="date f16">{{item.Voyages[0].DepartureTime}}</p>
              <p>{{item.Voyages[0].DeparturePortName +"(" + item.Voyages[0].DepartureCode + ")"}}</p>
            </div>
            <div class="duration">
              <p class="time">約{{item.Voyages[0].Duration}}</p>
              <p class="tran" v-if="item.Voyages[0].Segments.length>1">{{item.Voyages[0].Segments[0].ArrivalCityName}}</p>
              <p class="stra" v-else>直飛</p>
            </div>
            <div class="Arrival">
              <p class="date f16">{{item.Voyages[0].ArrivalTime}}</p>
              <p>{{item.Voyages[0].ArrivalPortName +"(" + item.Voyages[0].ArrivalCode + ")"}}</p>
            </div>
            <div class="choose">
              <p class="price">HK$<b class="f16">{{item.AdultPrice}}</b></p>
              <p class="last">剩餘<span>{{(airAPI.searchType*1===2 && item.Voyages[0].AvailableCount > item.Voyages[1].AvailableCount) ? item.Voyages[1].AvailableCount : item.Voyages[0].AvailableCount}}</span>位</p>
            </div>
          </div>
          <div class="airline">
            <div class="name">
              <img v-bind:src="'https://texpert.com/images/airline/' + item.Voyages[0].AirLineCode +'.png'">
              <span>{{item.Voyages[0].AirLineName +'('+ item.Voyages[0].AirLineCode + item.Voyages[0].FlightNumber+')'}}</span>
            </div>
            <div class="rule">
              <a class="showRule" v-on:click="showAirRule($event)"  v-bind:_ref="item.Ref" v-bind:_num="chosenVoyage.length>0?1:0" href="javascript:void(0);">机票条款</a>
              <a class="showDitl" v-on:click="showAirDetail($event)" v-bind:_ref="item.Ref" href="javascript:void(0);">航班详情</a>
            </div>
            <button v-if="airAPI.searchType*1===1||chosenVoyage.length>=1" class="submitBtn f14" v-bind:_ref="item.Ref" v-on:click="BookingNow($event)">預 訂</button>
            <button v-else class="submitBtn f14" v-bind:_index="item.Ref" v-bind:value="item.Voyages[0].RefNumber" v-on:click="chosenVoyages($event)">選 擇</button>
          </div>
          <div class="airDetail" style="display:none;" v-bind:_ref="item.Ref">
            <p class="price"><em>{{airAPI.adult*1 + airAPI.child*1}}</em>位旅客的總價格，含稅費及附加費：<i>HK$<b>{{item.AdultTotal*airAPI.adult + item.ChildTotal*airAPI.child}}</b></i></p>
            <div v-for="n in item.Voyages[0].Segments.length">
              <p class="tran" v-if="item.Voyages[0].Segments[n-1].StopDuration!=null&&item.Voyages[0].Segments[n-1].StopDuration!=''"><em>&#x25F7;{{item.Voyages[0].Segments[n-1].StopDuration}}</em>停留<em>{{item.Voyages[0].Segments[n-1].DepartureCityName+'('+item.Voyages[0].Segments[n-1].DepartureCode+')'}}</em></p>
              <p class="time">
                  <em>{{item.Voyages[0].Segments[n-1].DepartureTime}}</em>
                  &#x279E;<em>{{item.Voyages[0].Segments[n-1].ArrivalTime}}</em>
                  <em>{{item.Voyages[0].Segments[n-1].Duration}}</em>
                  抵達:<em>{{item.Voyages[0].Segments[n-1].ArrivalDate}}</em>
              </p>
              <div class="detl">
                <p><span>{{item.Voyages[0].Segments[n-1].DepartureCityName +"(" + item.Voyages[0].Segments[n-1].DepartureCode + ")"}}</span>  &#x279E;  <span>{{item.Voyages[0].Segments[n-1].ArrivalCityName +"(" + item.Voyages[0].Segments[n-1].ArrivalCode + ")"}}</span></p>
                <p><span>{{item.Voyages[0].Segments[n-1].DeparturePortName}}</span>  &#x279E;  <span>{{item.Voyages[0].Segments[n-1].ArrivalPortName}}</span></p>
                <p>{{item.Voyages[0].Segments[n-1].AirLineName +"("+item.Voyages[0].Segments[n-1].AirLineCode + item.Voyages[0].Segments[n-1].FlightNumber +")"}}</p>
              </div>
            </div>
          </div>
          <div class="airRules" style="display:none;">
            <div class="top f18">
              <span>退改條款</span>
              <a class="btn f14" v-on:click="showFareRule($event)" v-bind:_ref="item.Ref" v-bind:_num="chosenVoyage.length>0?1:0" href="javascript:void(0);">詳細條款</a>
            </div>
            <div class="loading" v-if="ruleState.mini"><img src="https://texpert.com/images/loading.gif"></div>
            <div class="rules" v-else-if="item.minirule.length>0" v-for="seg in item.minirule">
              <div class="tit">{{seg.route}}</div>
              <dl v-for="rule in seg.miniRules">
                  <dt>{{rule.Name}}</dt>
                  <dd v-for="ru in rule.MiniRuleItems">
                    <span>{{ru.Name}}</span>
                    <span>{{ru.State}}</span>
                  </dd>
              </dl>
            </div>
            <div v-else class="error">未能成功請求到機票條款。</div>
            <p class="notice">注：所有費用均以港幣計算，詳細規則請與航空公司核對。</p>
            <em class="close f18" v-on:click="closeAirRule($event)">關閉</em>
          </div>
        </div>
      </div>
      <div id="FareRule" class="fareRules" style="display:none;">
         <div class="top f18">
            <span>機票條款</span>
            <a class="close" v-on:click="closeFareRule($event)" href="javascript:void(0);">&#x292C;</a>
          </div>
          <div class="loading" v-if="ruleState.fare"><img src="https://texpert.com/images/loading.gif"></div>
          <div v-else-if="Farerule.length!=0" class="btm">
            <ul class="ruleTab">
                <li v-if="Farerule.length!=0" v-for="(seg,index) in Farerule" v-bind:_val="seg.route" v-bind:class="{'active': index===0}" v-on:click="changeFareRule($event)">{{seg.route}}</li>
            </ul>
            <div class="ruleCon">
              <div class="fareItem" v-for="(seg,index) in Farerule" v-show="index===0" v-bind:_val="seg.route">
                  <div v-if="seg.fareRules.length===0||seg.fareRules===[]" class="error">此航程機票條款為空</div>
                  <div v-if="seg.fareRules.length>0&&seg.fareRules!==[]" v-for="fare in seg.fareRules">
                      <h6>{{fare.category}}</h6>
                      <p>{{fare.text}}</p>
                  </div>
              </div>
            </div>
          </div>
          <div v-else class="error">未能成功請求到機票條款。</div>  
      </div>
    </div>

    <div class="filterBtn f14">
      <div class="more" v-on:click="openFilter()">
        <i class="f18">&#x2611;</i>
        <br>
        <em>篩選</em>
      </div>
      <div class="time">
        <i class="f18">&#x25F7;</i>
        <em v-if="orderBy.timeUp" v-on:click="orderByTimeDown($event)">时间从早到晚</em>
        <em v-else-if="orderBy.timeDown" v-on:click="orderByTimeUp($event)">时间从晚到早</em>
        <em v-else v-on:click="orderByTimeUp($event)">时间</em>
      </div>
      <div class="price active">
        <i class="f18">&#x2608;</i>
        <em v-if="orderBy.priceUp" v-on:click="orderByPriceDown($event)">价格从低到高</em>
        <em v-else-if="orderBy.priceDown" v-on:click="orderByPriceUp($event)">价格从高到低</em>
        <em v-else v-on:click="orderByPriceUp($event)">价格</em>
      </div>
    </div>
    <div class="filterMark">
      <div class="filterWrap">
        <div class="filterBox f12">
          <div class="tit f14">
          <span>篩選</span>
          <a class="reset f12" v-on:click="clearFilter()" href="javascript:void(0);">清空筛选</a>
          </div>
          <dl class="filter">
            <dt>航空公司</dt>
            <dd>
              <label v-for="(item, index) in airLine" v-if="item.Voyages[0].AirLineName!=''">
                <input type="checkbox" name="box" v-model="filter.airline" v-bind:value="item.Voyages[0].AirLineCode" v-bind:id="'airline_'+item.Voyages[0].AirLineCode"><span>{{item.Voyages[0].AirLineName}}</span></label>
            </dd>
          </dl>
          <dl class="filter">
            <dt>中途站</dt>
            <dd>
              <label>
                <input type="checkbox" name="box1" value="0" id="transfer0" v-model="filter.transfer"><span>直達</span></label>
              <label>
                <input type="checkbox" name="box1" value="1" id="transfer1" v-model="filter.transfer"><span>一個中途站</span></label>
              <label>
                <input type="checkbox" name="box1" value="2" id="transfer2" v-model="filter.transfer"><span>多個中途站</span></label>
            </dd>
          </dl>
          <dl class="filter">
            <dt>去程起飛時段</dt>
            <dd>
              <label>
                <input type="checkbox" name="box2" value="1" id="time1" v-model="filter.time"><span>00:00-05:59</span></label>
              <label>
                <input type="checkbox" name="box2" value="2" id="time2" v-model="filter.time"><span>06:00-11:59</span></label>
              <label>
                <input type="checkbox" name="box2" value="3" id="time3" v-model="filter.time"><span>12:00-17:59</span></label>
              <label>
                <input type="checkbox" name="box2" value="4" id="time4" v-model="filter.time"><span>18:00-23:59</span></label>
            </dd>
          </dl>
          <dl class="filter" v-if="this.airAPI.searchType*1===2">
            <dt>返程起飛時段</dt>
            <dd>
              <label>
                <input type="checkbox" name="box3" value="1" id="returnTime1" v-model="filter.returnTime"><span>00:00-05:59</span></label>
              <label>
                <input type="checkbox" name="box3" value="2" id="returnTime2" v-model="filter.returnTime"><span>06:00-11:59</span></label>
              <label>
                <input type="checkbox" name="box3" value="3" id="returnTime3" v-model="filter.returnTime"><span>12:00-17:59</span></label>
              <label>
                <input type="checkbox" name="box3" value="4" id="returnTime4" v-model="filter.returnTime"><span>18:00-23:59</span></label>
            </dd>
          </dl>
          <dl class="filter">
            <dt>去程機場</dt>
            <dd>
              <label v-for="(item, index) in airPort">
                <input type="checkbox" name="box4" v-bind:value="item.Voyages[0].DepartureCode" v-model="filter.airport" v-bind:id="'airport'+item.Voyages[0].DepartureCode"><span>{{item.Voyages[0].DeparturePortName}}</span></label>
            </dd>
          </dl>
          <dl class="filter" v-if="this.airAPI.searchType*1===2">
            <dt>返程機場</dt>
            <dd>
              <label v-for="(item, index) in airPort">
                <input type="checkbox" name="box5" v-bind:value="item.Voyages[1].DepartureCode" v-model="filter.returnAirport" v-bind:id="'returnAirport'+item.Voyages[1].DepartureCode"><span>{{item.Voyages[1].DeparturePortName}}</span></label>
            </dd>
          </dl>
        </div>
        <div class="btnBox f16">
          <a class="cancel" v-on:click="closeFilter()"  href="javascript:void(0);">取消</a>
          <a class="confirm" v-on:click="confirmFilter()"  href="javascript:void(0);">確定</a>
        </div>
      </div>
    </div>
    <div class="loadingPage" v-show="loadingPage.status">
        <div class="logo">
            <img src="https://texpert.com/images/logo.png" />
        </div>
        <div class="tip f16">我們正為您搜羅最優惠的機票</div>
        <div class="result f16">
            <div class="page_result_name" v-text="loadingPage.originTxt + ' ➞ ' + loadingPage.destinationTxt"></div>
            <div class="page_result_peo" v-text="airAPI.adult + ' 成人 ' + (airAPI.child>0? airAPI.child+'兒童' : '')"></div>
            <div class="page_result_time" v-text="airAPI.departureDate+ (airAPI.searchType!=1 ? ' ➞ '+airAPI.returnDate : '')"></div>
        </div>
        <div class="bar">
            <img src="https://texpert.com/images/loading.gif" />
        </div>
        <div class="redrom f18" v-text="loadingPage.randomNum"></div>
    </div>
  </div>
</template>

<script>
/* import axios from 'axios' */
export default {
  name: 'AirList',
  data () {
    return {
      airAPI: this.$route.query,
      submitKey: '',
      flightList: [],
      tempList: [],
      chosenVoyage: [],
      Farerule: [],
      ruleState: {
        mini: true,
        fare: true
      },
      loadingPage: {
        status: true,
        randomNum: 0,
        originTxt: this.$route.query.origin,
        destinationTxt: this.$route.query.destination
      },
      title: {
        originCity: '',
        arrivalCity: '',
        originDate: '',
        arrivalDate: ''
      },
      orderBy: { // 排序
        timeUp: false,
        timeDown: false,
        priceUp: true,
        priceDown: false
      },
      filter: { // 筛选
        Voyages: 1,
        airline: [],
        transfer: [],
        time: [],
        returnTime: [],
        airport: [],
        returnAirport: []
      }
    }
  },
  computed: {
    airLine: function () {
      if (this.filter.Voyages === 1) {
        return this.LinqJS.Enumerable.From(this.tempList).Distinct("x=>x.Voyages[0].AirLineCode").OrderBy("x=>x.AdultPrice").ToArray()
      } else {
        return this.LinqJS.Enumerable.From(this.tempList2).Distinct("x=>x.Voyages[0].AirLineCode").OrderBy("x=>x.AdultPrice").ToArray()
      }
    },
    airPort: function () {
      if (this.filter.Voyages === 1) {
        return this.LinqJS.Enumerable.From(this.tempList).Distinct("x=>x.Voyages[0].AirLinePort").ToArray()
      } else {
        return this.LinqJS.Enumerable.From(this.tempList2).Distinct("x=>x.Voyages[0].AirLinePort").ToArray()
      }
    }
  },
  methods: {
    // 回机票首页
    goToAir: function () {
      this.$router.push({path: 'air'})
    },
    // 航班详情
    showAirDetail: function (event) {
      var el = event.currentTarget
      el.classList.toggle('active')
      event.stopPropagation()
      document.querySelectorAll('.airDetail').forEach(function (dital) {
        if (dital.getAttribute('_ref') === el.getAttribute('_ref')) {
          if (dital.style.display === 'none') {
            dital.style.display = 'block'
          } else {
            dital.style.display = 'none'
          }
        } else {
          dital.style.display = 'none'
        }
      })
    },
    // 机票退改条款
    showAirRule: function (event) {
      var $this = this
      $this.ruleState.mini = true
      var el = event.currentTarget
      var par = el.parentNode.parentNode
      ;[].forEach.call(par.parentNode.children, function (rule) {
        if (rule !== par && rule.classList.contains('airRules')) {
          rule.style.display = 'block'
        }
      })
      var apiKey = this.submitKey;
      var apiRef = el.getAttribute('_ref')
      var apiIndex = el.getAttribute('_num')
      this.$http.get('https://texpert.com/ashx/package/airhandler.ashx?action=minirule&language=2&key=' + apiKey + '&ref=' + apiRef + '&index=' + apiIndex).then(function (r) {
        $this.flightList.forEach(function(ele) {
          if (ele.Ref === apiRef) {
            ele.minirule = r.data
            $this.ruleState.mini = false
          }
        })
      }).catch(function (error) {
        console.log(error)
        $this.ruleState.fare = false
      })
    },
    // 关闭退改条款弹框
    closeAirRule: function (event) {
      var el = event.currentTarget
      el.parentNode.style.display = 'none'
    },
    // 机票详细条款
    showFareRule: function (event) {
      var $this = this
      $this.ruleState.fare = true
      var el = event.currentTarget
      document.querySelector('#FareRule').style.display = 'block'
      var apiKey = this.submitKey;
      var apiRef = el.getAttribute('_ref')
      var apiIndex = el.getAttribute('_num')
      this.$http.get('https://texpert.com/ashx/package/airhandler.ashx?action=farerule&language=2&key=' + apiKey + '&ref=' + apiRef + '&index=' + apiIndex).then(function (r) {
        $this.Farerule = r.data
        $this.ruleState.fare = false
      }).catch(function (error) {
        console.log(error)
        $this.ruleState.fare = false
      })
    },
    // 关闭详细条款弹框
    closeFareRule: function (event) {
      var el = event.currentTarget
      document.querySelector('#FareRule').style.display = 'none'
    },
    // 详细条款航程切换
    changeFareRule: function (event) {
      var el = event.currentTarget
      ;[].forEach.call(el.parentNode.children, function (sl) {
        sl.classList.remove('active')
        el.classList.add('active')
      })
      document.querySelectorAll('#FareRule .fareItem').forEach(function (item) {
        if (item.getAttribute('_val') !== el.getAttribute('_val')) {
          item.style.display = 'none'
        } else {
          item.style.display = 'block'
        }
      })
    },
    // 弹出筛选框
    openFilter: function () {
      document.querySelector('.filterMark').style.display = 'block'
      document.querySelector('body').style.overflow = 'hidden'
    },
    // 关闭筛选框
    closeFilter: function () {
      document.querySelector('.filterMark').style.display = 'none'
      document.querySelector('body').style.overflow = 'auto'
    },
    // 清除选择条件
    clearFilter: function () {
      this.filter.airline = []
      this.filter.transfer = []
      this.filter.time = []
      this.filter.returnTime = []
      this.filter.airport=[]
      this.filter.returnAirport=[]
    },
    // 确认筛选
    confirmFilter: function() {
      this.dataFilter()
      document.querySelector('.filterMark').style.display = 'none'
      document.querySelector('body').style.overflow = 'auto'
    },
    // 条件筛选
    dataFilter: function () {
      var $this = this, checkedList
      if (this.filter.Voyages === 1) {
        checkedList=this.LinqJS.Enumerable.From($this.tempList).Distinct('x=>x.Voyages[0].RefNumber').ToArray()
      } else {
        checkedList=this.LinqJS.Enumerable.From($this.tempList2).Distinct('x=>x.Voyages[0].RefNumber').ToArray()
      }
      this.flightList = this.LinqJS.Enumerable.From(checkedList).Where(
        function (item) { 
          var returnData = true
          //航空公司筛选
          if ($this.filter.airline.length>0) {
            returnData = returnData && $this.filter.airline.indexOf(item.Voyages[0].AirLineCode) != -1
          }
          //中转站筛选
          if($this.filter.transfer.length>0){
            if ($this.filter.transfer.indexOf('2') != -1) {
              returnData = returnData && ($this.filter.transfer.indexOf(item.Voyages[0].ConnectingCities.length.toString()) != -1 || item.Voyages[0].ConnectingCities.length >= 2)
            }else{
              returnData = returnData && $this.filter.transfer.indexOf(item.Voyages[0].ConnectingCities.length.toString()) != -1
            }
          }
          //出发时间筛选
          if($this.filter.time.length>0){
            returnData = returnData && $this.filter.time.indexOf(item.Voyages[0].TimeZone.toString()) != -1
          }
          if($this.filter.returnTime.length>0){
            returnData = returnData && $this.filter.returnTime.indexOf(item.Voyages[1].TimeZone.toString()) != -1
          }
          //出发机场筛选
          if($this.filter.airport.length>0){
            returnData = returnData && $this.filter.airport.indexOf(item.Voyages[0].DepartureCode.toString()) != -1
          }
          if($this.filter.returnAirport.length>0){
            returnData = returnData && $this.filter.returnAirport.indexOf(item.Voyages[1].DepartureCode.toString()) != -1
          }
          return returnData
        }
      ).ToArray()
    },
    // 时间升序
    orderByTimeUp: function (event) {
      var el = event.currentTarget
      this.orderBy.timeUp = true
      this.orderBy.timeDown = false
      this.orderBy.priceUp = false
      this.orderBy.priceDown = false
      this.orderData()
      el.parentNode.classList.add('active')
      var next = el.parentNode.nextElementSibling || el.parentNode.nextSibling
      next.classList.remove('active')
    },
    // 时间降序
    orderByTimeDown: function (event) {
      var el = event.currentTarget
      this.orderBy.timeUp = false
      this.orderBy.timeDown = true
      this.orderBy.priceUp = false
      this.orderBy.priceDown = false
      this.orderData()
      el.parentNode.classList.add('active')
      var next = el.parentNode.nextElementSibling || el.parentNode.nextSibling
      next.classList.remove('active')
    },
    // 价格升序
    orderByPriceUp: function (event) {
      var el = event.currentTarget
      this.orderBy.timeUp = false
      this.orderBy.timeDown = false
      this.orderBy.priceUp = true
      this.orderBy.priceDown = false
      this.orderData()
      el.parentNode.classList.add('active')
      var prev = el.parentNode.previousElementSibling || el.parentNode.previousSibling
      prev.classList.remove('active')
    },
    // 价格降序
    orderByPriceDown: function (event) {
      var el = event.currentTarget
      this.orderBy.timeUp = false
      this.orderBy.timeDown = false
      this.orderBy.priceUp = false
      this.orderBy.priceDown = true
      this.orderData()
      el.parentNode.classList.add('active')
      var prev = el.parentNode.previousElementSibling || el.parentNode.previousSibling
      prev.classList.remove('active')
    },
    //条件排序
    orderData: function () {
      if (this.orderBy.timeUp) {
        this.flightList = this.LinqJS.Enumerable.From(this.flightList).OrderBy('x=>x.Voyages[0].DepartureTime').ToArray()
      }
      if (this.orderBy.timeDown) {
        this.flightList = this.LinqJS.Enumerable.From(this.flightList).OrderByDescending('x=>x.Voyages[0].DepartureTime').ToArray()
      }
      if (this.orderBy.priceUp) {
        this.flightList = this.LinqJS.Enumerable.From(this.flightList).OrderBy('x=>x.AdultPrice').ToArray()
      }
      if (this.orderBy.priceDown) {
        this.flightList = this.LinqJS.Enumerable.From(this.flightList).OrderByDescending('x=>x.AdultPrice').ToArray()
      }
    },
    // 选择航程
    chosenVoyages: function (event) {
      var $this = this
      var el = event.currentTarget
      this.filter.Voyages = 2
      this.chosenVoyage = this.LinqJS.Enumerable.From($this.tempList).Where(function (item) {
        return item.Ref === el.getAttribute('_index')
      }).ToArray()
      var tempArr = JSON.parse(JSON.stringify($this.tempList))
      for (var i = 0; i < tempArr.length; i++) {
        tempArr[i].Voyages.reverse()
      }
      this.tempList2 = this.LinqJS.Enumerable.From(tempArr).Where(function (item) {
        return item.Voyages[1].RefNumber === el.value
      }).ToArray()
      this.flightList = JSON.parse(JSON.stringify($this.tempList2))
      this.dataFilter()
      this.orderData()
    },
    // 取消选择
    clearChosen: function (event) {
      var $this = this
      var el = event.currentTarget
      this.filter.Voyages = 1
      this.flightList = JSON.parse(JSON.stringify($this.tempList))
      this.chosenVoyage=[]
      this.dataFilter()
      this.orderData()
    },
    // 预订
    BookingNow: function (event) {
      var el = event.currentTarget
      this.$router.push({path: 'booking', query: {ref: el.getAttribute('_ref'), key: this.submitKey}})
    }

  },
  mounted: function () {
    var $this = this
    var addNum = 0, randomNum=0
    var interval = setInterval( function () {
        addNum = addNum + $this.ComonJS.getRandom(10, 15)
        randomNum = addNum + ", " + $this.ComonJS.getRandom(100, 999)
        $this.loadingPage.randomNum = randomNum
    }, 100)
    document.addEventListener('click', function () {
      document.querySelectorAll('.airDetail').forEach(function (dital) {
        dital.style.display = 'none'
      })
    })
    // 获取数据
    this.airAPI.action='airs'
    this.$http.get('https://texpert.com/ashx/package/AirHandler.ashx', {params: this.airAPI}).then(function (response) {
      $this.submitKey = response.data.Data.key
      $this.tempList = $this.LinqJS.Enumerable.From(response.data.Data.outputTickets).OrderBy('x=>x.AdultPrice').ToArray().map(function (obj) {
        obj.minirule = []
        return obj
      })
      $this.flightList = JSON.parse(JSON.stringify($this.tempList))
      $this.title.originCity = $this.tempList[0].Voyages[0].DepartureCityName
      $this.title.arrivalCity = $this.tempList[0].Voyages[0].ArrivalCityName
      $this.title.originDate = $this.tempList[0].Voyages[0].DepartureDate
      $this.title.arrivalDate = $this.tempList[0].Voyages[0].ArrivalDate
      $this.loadingPage.status = false
      clearInterval(interval)
    }).catch(function (error) {
      console.log(error)
      alert("未搜索到數據！")
      $this.loadingPage.status = false
      clearInterval(interval)
      $this.$router.push({path: 'air'})
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped>-->
<style>
/* 头部信息 */
.flightList .title{height:1.5rem;line-height:1.5rem;background:#fdd700;font-weight:bold;position:relative;white-space:nowrap;}
.flightList .title:before{position:absolute;left:.5rem;content:'\276E';font-size:.6rem;font-weight:normal;}
.flightList .listNum{height:.8rem;line-height:.6rem;text-align:left;padding:.2rem .25rem 0;box-sizing:border-box;}
.flightList .listNum em{color:#003399;font-style:normal;margin:0 .1rem;}
.flightList .Chosen{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-moz-justify-content:space-between;-webkit-justify-content:space-between;justify-content:space-between;width:100%;height:1.5rem;overflow:hidden;box-sizing:border-box;border-bottom:1px solid #ccc;border-top:1px solid #ccc;background:#fff;color:#363636;white-space:nowrap;line-height:.5rem;}
.flightList .Chosen > div{text-align:center;padding:.25rem 0;color:#003399;}
.flightList .Chosen .tit{padding-left:.25rem;}
.flightList .Chosen .port p{max-width:2.6rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.flightList .Chosen .cancel{color:#003399;width:1.8rem;height:100%;line-height:1.5rem;text-align:center;text-decoration:none;border:none;border-left:1px solid #cccccc;background:#f6f0c0;text-align:center;cursor:pointer;}

/* 机票列表 */
.flightList .List{position:relative;box-sizing:border-box;background:#eee;width:100%;overflow:hidden;padding:.25rem .15rem;}
.flightList .List .Item{position:relative;background:#fff;margin-bottom:.25rem;border-radius:.15rem;padding:.25rem .15rem .1rem .1rem;}
.flightList .List .infoBox,.flightList .List .airline{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-moz-justify-content:space-between;-webkit-justify-content:space-between;justify-content:space-between;}
.flightList .List .departure,.flightList .List .duration,.flightList .List .Arrival,.flightList .List .choose{box-sizing:border-box;width:25%;}
.flightList .List .departure,.flightList .List .choose{text-align:right;}
.flightList .List .Arrival{text-align:left;}
.flightList .List .duration{text-align:center;padding:0 .25rem;line-height:.8rem;}
.flightList .List .infoBox .date{font-weight:bold;}
.flightList .List .duration .time{border-bottom:1px solid #ddd;position:relative;color:#000;}
.flightList .List .duration .time:before{content:"";width:.15rem;height:.15rem;border-radius:50%;background:#999;position:absolute;left:0;bottom:-.08rem;}
.flightList .List .duration .time:after{content:"\2708";height:.8rem;line-height:.8rem;color:#999;position:absolute;right:0;bottom:-.4rem;font-size:.6rem;}
.flightList .List .duration .tran{position:relative;}
.flightList .List .duration .stra{color:#003399;}
.flightList .List .duration .tran:before{content:"";width:.15rem;height:.15rem;border-radius:50%;background:#999;position:absolute;left:48%;top:-.08rem;}
.flightList .List .choose{position:relative;}
.flightList .List .choose .price{color:#e40613;white-space:nowrap;}
.flightList .List .choose .price b{font-weight:bold;}
.flightList .List .choose .last{white-space:nowrap;}
.flightList .List .choose .last span{color:#e40613;}
.flightList .List .submitBtn{display:inline-block;background:#fdd700;color:#363636;text-align:center;border-radius:.1rem;border:none;width:1.8rem;height:.7rem;line-height:.7rem;position:relative;top:-.1rem;}
.flightList .List .airline{width:100%;line-height:.8rem;height:.8rem;white-space:nowrap;}
.flightList .List .airline img{vertical-align:text-top;margin-top:-.05rem;max-height:.6rem;}

/* 航班详情 机票条款 */
.flightList .List .airline .rule a{display:inline-block;height:.8rem;padding:0 .15rem;color:#003399;border-radius:.15rem .15rem 0 0;}
.flightList .List .airline .rule a.active{background:#fffcf1;}
.flightList .List .airDetail{background:#fffcf1;padding:.25rem 0;text-align:left;display:none;}
.flightList .List .airDetail em{color:#003399;font-style:normal;margin:0 .1rem;}
.flightList .List .airDetail i{color:#e40613;font-style:normal;}
.flightList .List .airDetail .detl{padding-left:.5rem;}
.flightList .List .airRules{position:fixed;bottom:0;left:0;width:100%;height:100%;margin:0 auto;z-index:20;overflow-y:scroll;-webkit-overflow-scrolling:touch;background-color:#FFF;box-shadow:0 0 3px #ccc inset;}
.flightList .List .airRules .top{height:1.3rem;line-height:1.3rem;border-bottom:.1rem solid #fdd700;color:#003399;text-align:left;padding:0 .5rem;}
.flightList .List .airRules .btn{border:none;text-decoration:none;background:#fdd700;color:#363636;padding:.1rem .25rem;cursor:pointer;margin-left:.5rem;border-radius:.1rem;}
.flightList .List .airRules .tit{border-bottom:1px solid #ccc;height:.6rem;line-height:.6rem;width:10rem;margin:0 auto;}
.flightList .List .airRules dl{width:10rem;margin:0 auto;}
.flightList .List .airRules dl:after{content:'';display:table;clear:both;}
.flightList .List .airRules dt{box-sizing:border-box;width:2rem;height:2.45rem;line-height:2.4rem;background:#eee;float:left;border-bottom:1px solid #ccc;}
.flightList .List .airRules dd{box-sizing:border-box;width:8rem;height:.6rem;line-height:.6rem;float:left;display:table;white-space:nowrap;}
.flightList .List .airRules dd span{box-sizing:border-box;display:table-cell;width:4rem;height:.6rem;border-left:1px solid #ccc;border-bottom:1px solid #ccc;overflow:hidden;}
.flightList .List .airRules .notice{text-align:left;padding-left:.25rem;}
.flightList .List .airRules .close{float:right;width:3.5rem;height:1.2rem;line-height:1.2rem;text-align:center;font-style:normal;background-color:#fdd700;color:#363636;margin:.5rem .25rem 1rem;}
.flightList .fareRules{position:fixed;left:0;top:0;z-index:99;box-sizing:border-box;width:100%;height:100%;padding-top:1.5rem;background:#fff;overflow:hidden;}
.flightList .fareRules .top{margin-top:-1.5rem;height:1.3rem;line-height:1.3rem;border-bottom:.1rem solid #fdd700;color:#003399;text-align:left;padding:0 .5rem;}
.flightList .fareRules .btm{width:100%;height:100%;}
.flightList .fareRules .top .close{position:absolute;right:0;top:0;width:1.3rem;height:1.3rem;line-height:1.3rem;text-decoration:none;text-align:center;font-size:.8rem;color:#003399;}
.flightList .fareRules .ruleTab{box-sizing:border-box;float:left;width:32%;height:100%;background:#f1f1f1;overflow:auto;text-align:left;padding:.5rem 0 0 0;}
.flightList .fareRules .ruleTab li{box-sizing:border-box;list-style:none;padding:0 0 0 .5rem;height:1.5rem;line-height:1.5rem;font-weight:bold;}
.flightList .fareRules .ruleTab li.active{background:#fff;border-left:5px solid #fdd700;}
.flightList .fareRules .ruleCon{box-sizing:border-box;float:right;width:67%;height:100%;padding:.1rem;overflow-y:scroll;-webkit-overflow-scrolling:touch;}
.flightList .fareRules .ruleCon h6{border-bottom:.05rem solid #fdd700;line-height:.6rem;height:.6rem;color:#003399;font-weight:normal;padding-top:.3rem;}
.flightList .airRules .loading,.flightList .fareRules .loading,.flightList .airRules .error,.flightList .fareRules .error{padding:2rem 0;text-align:center;}
/* 机票排序筛选 */
.flightList .filterBtn{position:fixed;bottom:0;left:0;z-index:8;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-moz-justify-content:space-between;-webkit-justify-content:space-between;justify-content:space-between;width:100%;height:1.5rem;background:#fcef82cf;color:#003399;}
.flightList .filterBtn>div{box-sizing:border-box;width:33.4%;height:100%;text-align:center;line-height:.5rem;padding-top:.25rem;position:relative;}
.flightList .filterBtn>div.active{background:#fdd70070;}
.flightList .filterBtn i,.flightList .filterBtn em{font-style:normal;}
.flightList .filterBtn em{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;padding-top:.75rem;}
.flightList .filterMark{position:fixed;top:0;bottom:0;left:0;right:0;z-index:9;background-color:rgba(0,0,0,.7);width:100%;height:100%;display:none;}
.flightList .filterWrap{position:absolute;width:100%;left:0;top:50%;transform:translateY(-50%);}
.flightList .filterWrap .btnBox{width:9.5rem;margin:0 auto;padding-top:.5rem;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-moz-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;}
.flightList .filterWrap .cancel,.flightList .filterWrap .confirm{width:4rem;height:1.15rem;line-height:1.15rem;border:1px solid #fdd700;border-radius:.8rem;background-color:#fffad199;color:#003399;text-decoration:none;font-weight:bold;}
.flightList .filterWrap .confirm{background-color:#fdd700;}
.flightList .filterBox{box-sizing:border-box;max-height:11rem;width:9.5rem;line-height:.8rem;margin:0 auto;padding:.25rem;background:#fff;border-radius:.15rem;overflow-y:scroll;-webkit-overflow-scrolling:touch;}
.flightList .filterBox .tit{text-align:center;position:relative;}
.flightList .filterBox .reset{position:absolute;right:0;top:.1rem;height:.6rem;line-height:.6rem;padding:0 .1rem;border:1px solid #ccc;border-radius:.1rem;color:#666;text-decoration:none;}
.flightList .filterBox .filter{text-align:left;}
.flightList .filterBox .filter dt{color:#003399;}
.flightList .filterBox .filter label{display:inline-block;margin-right:.15rem;height:.8rem;line-height:.8rem;white-space:nowrap;}
.flightList .filterBox .filter input{width:.4rem;height:.4rem;vertical-align:text-top;}
.loadingPage{width:100%;height:100%;position:fixed;left:0;top:0;z-index:99999;background:#fff;background:url(https://texpert.com/images/loadbg1.png) center center repeat #fff;font-size:0.7rem;}
.loadingPage .logo{padding:1rem 0 .75rem;text-align:center;}
.loadingPage .logo img{width:5rem;}
.loadingPage .tip{box-sizing:border-box;min-height:1.6rem;line-height:.8rem;padding:.4rem;background-image:url(https://texpert.com/images/loadbd.png);background-repeat:repeat;background-position:center center;text-align:center;font-weight:bold;background-size:cover;}
.loadingPage .result{text-align:center;line-height:.6rem;}
.loadingPage .result > div{padding-top:.6rem;}
.loadingPage .img{text-align:center;margin-top:1rem;}
.loadingPage .img img{width:100%;}
.loadingPage .bar{width:100%;height:.75rem;text-align:center;padding: .8rem 0;}
.loadingPage .bar img{display:inline-block;}

</style>
