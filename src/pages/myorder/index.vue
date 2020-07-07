<template>
  <div class="order">
    <scroll-view scroll-x="true" :scroll-left="scrollLeft" class="head">
      <div @click="changeTab(index,item.code)" :class="[nowIndex==index ?'active':'']" v-for="(item, index) in navData" :key="index">
        {{item.name}}
      </div>
    </scroll-view>
    <div v-if="orderList.length > 0">
      <div class="orderitem" v-for="(item, index) in orderList" :key="index">
        <h2>
          <span class="left">订单编号：{{item.id}}</span>
          <span class="right status">{{item.statusTxt}}</span>
        </h2>
        <div class="order-time">下单时间：{{item.orderTime}}</div>
        <div class="goodslist">
          <div class="item" v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex">
            <div class="con">
              <div class="left">
                <div class="img">
                  <img :src="goodsItem.list_pic_url" :alt="goodsItem.goods_name">
                </div>
                <div class="info">
                  <p>{{goodsItem.goods_name}}</p>
                  <p>￥{{goodsItem.retail_price}}</p>
                </div>
              </div>
              <div class="right">
                <div class="num">×{{goodsItem.number}}</div>
              </div>
            </div>
          </div>
        </div>
        <h3>
          <span class="left">总价：￥{{item.allPrice}}</span>
          <span class="right">
            <button @click="handleJumpBtn(item)" :class="item.btnClassName">{{item.handleBtnTxt}}</button>
          </span>
        </h3>
      </div>
    </div>
    <div v-else class="none">
      数据库暂无数据...
    </div>
  </div>
</template>

<script>
import {
  get,
  getStorageOpenid,
  formatDate
} from "../../utils";
export default {
  onShow() {
    if (wx.getStorageSync("addressId")) {
      this.addressId = wx.getStorageSync("addressId");
    }
    this.openId = getStorageOpenid();
  },
  created() { },
  mounted() {
    //获取页面传的参数
    this.categoryId = this.$root.$mp.query.id;
    this.getOrderList();
  },
  data() {
    return {
      title: '我的订单',
      nowIndex: 0,
      orderList: [],
      navData: [{
        name: '全部',
        code: null
      }, {
        name: '待付款',
        code: 0
      }, {
        name: '待发货',
        code: 1
      }, {
        name: '待收货',
        code: 2
      }, {
        name: '完成',
        code: 4
      }],
      statusTxtArr: ['待付款', '待发货', '待收货', '交易完成'],
      currentNav: {},
      scrollLeft: 0,
      openId: '',
      status: null,
      address: {}
    };
  },
  components: {},
  methods: {
    async changeTab(index, code) {
      this.nowIndex = index;
      this.status = code
      this.getOrderList()
      //需要让导航滚动到可见区域
      if (this.nowIndex > 4) {
        this.scrollLeft = this.nowIndex * 60
      } else {
        this.scrollLeft = 0
      }
    },
    async getOrderList() {
      const params = {
        openId: this.openId
      }
      this.status !== null && (params.status = this.status)
      const listData = await get("/myorder/listAction", params)
      this.orderList = listData.data
      this.orderList.forEach(item => {
        item.orderTime = formatDate(item.orderTime);
        item.handleBtnTxt = item.orderStatus === 0 ? '去付款' : '查看详情';
        item.btnClassName = item.orderStatus === 0 ? 'pay' : 'detail';
        item.statusTxt = this.statusTxtArr[item.orderStatus];
      })
    },
    handleJumpBtn(item) {
      const status = item.orderStatus
      if (status === 0) {
        wx.navigateTo({
          url: "/pages/order/main?orderId=" + item.id
        });
      } else {
        wx.navigateTo({
          url: "/pages/orderDetail/main?orderId=" + item.id
        });

      }
    }
  },
  computed: {}
};

</script>
<style lang='scss' scoped>
@import "./style";
</style>
