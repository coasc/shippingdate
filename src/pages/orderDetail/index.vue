<template>
  <div class="order">
    <div v-if="address.name" class="address">
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
              <span>{{address.name}}</span>
            </div>
            <div class="info">
              <p>{{address.mobile}}</p>
              <p>{{address.address+address.address_detail}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="orderbox">
      <div class="item">
        <div>订单号：{{orderId}}</div>
        <div>订单状态：{{orderStatus}}</div>
      </div>
      <div class="item">
        <div>支付时间</div>
        <div>{{orderTime}}</div>
      </div>
      <div class="item">
        <div>物流</div>
        <div>{{shipper}}</div>
      </div>
    </div>
    <div class="cartlist">
      <div class="item" v-for="(item,index) in listData" :key="index">
        <div class="con">
          <div class="left">
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              x{{item.number}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        订单总额 : ￥{{allprice}}
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get,
    post,
    login,
    getStorageOpenid,
    formatDate
  } from "../../utils";
  export default {
    onShow() {
      if (wx.getStorageSync("addressId")) {
        this.addressId = wx.getStorageSync("addressId");
      }
      this.openId = getStorageOpenid();
      this.orderId = this.$root.$mp.query.orderId;
      this.getDetail();
    },
    created() {},
    mounted() {
      
    },
    data() {
      return {
        orderId: "",
        addressId: "",
        openId: "",
        allprice: "",
        listData: [],
        address: {},
        orderTime: "",
        shipper:"",
        orderStatus:"",
        statusTxtArr: ['待付款', '待发货', '待收货', '交易完成']
      };
    },
    components: {},
    methods: {
      createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + ''
      },
      createNonceStr() {
        return Math.random().toString(36).substr(2, 15)
      },
    
     
      async getDetail() {
        const data = await get('/orderDetail/detailAction', {
          openId: this.openId,
          orderId: this.orderId
        });
        
        if (data) {
          this.allprice = data.allPrise;
          this.listData = data.goodsList;
          this.address = data.address;
          this.orderTime = formatDate(data.orderTime);
          this.orderStatus = this.statusTxtArr[data.orderStatus];
          this.shipper = data.shipper;
        }
      }
    },
    computed: {}
      
        
};

</script>
<style lang='scss' scoped>
  @import "./style";
  

</style>
