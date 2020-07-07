<template>
  <div class="pay-complete">
    <div class="icon"></div>
    <h2>支付成功</h2>
    <p>我们将尽快安排发货，请保持手机通讯畅通，以便快递员能够第一时间联系到您。</p>
    <div class="handler-btn">
      <button class="weui-btn" type="primary" @click="backToShop">继续购物</button>
      <button class="weui-btn" type="default" plain="true" @click="goToOrder">查看订单</button>
    </div>
  </div>
</template>

<script>
  export default {
    onShow() {
    },
    created() {},
    mounted() {
      this.orderId = this.$root.$mp.query.orderId;
    },
    data() {
      return {
        orderId: ""
      };
    },
    components: {},
    methods: {
      backToShop() {
        wx.navigateBack({
          delta: 10
        })
      },
      goToOrder() {
        wx.navigateTo({
          url: "/pages/orderDetail/main?orderId=" + this.orderId
        })
      }
    },
    computed: {}
      
        
};

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
