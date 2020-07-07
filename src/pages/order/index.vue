<template>
  <div class="order">
    <div @click="toAddressList" v-if="address.name" class="address">
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
              <span>{{address.name}}</span>
              <div v-if="address.is_default" class="moren">默认</div>
            </div>
            <div class="info">
              <p>{{address.mobile}}</p>
              <p>{{address.address+address.address_detail}}</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div @click="toAdd" v-else class="seladdress">请选择收货地址</div>
    <div class="orderbox">
      <div class="item">
        <div>商品合计</div>
        <div>￥{{goodsPrice}}</div>
      </div>
      <div class="item">
        <div>运费</div>
        <div>{{shipperPrice}}</div>
      </div>
      <div class="item">
        <div>优惠券</div>
        <div>暂无</div>
      </div>
    </div>
    <div class="cartlist">
      <div class="item" v-for="(item,index) in listData" :key="index">
        <div class="con">
          <div class="left">
            <div class="img">
              <img :src="item.list_pic_url" alt>
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">x{{item.number}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>实付 : ￥{{allprice}}</div>
      <div @click="pay">支付</div>
    </div>
  </div>
</template>

<script>
import { get, post, login, getStorageOpenid } from "../../utils";
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
  mounted() {},
  data() {
    return {
      orderId: "",
      addressId: "",
      openId: "",
      allprice: "",
      listData: [],
      address: {},
      shipperPrice: 0,
      goodsPrice: 0
    };
  },
  components: {},
  methods: {
    createTimeStamp: function() {
      return parseInt(new Date().getTime() / 1000) + "";
    },
    createNonceStr() {
      return Math.random()
        .toString(36)
        .substr(2, 15);
    },
    async pay() {
      if (!(this.address && this.address.id)) {
        wx.showToast({
          title: "请选择收货地址",
          icon: "none",
          duration: 1500
        });
        return false;
      }

      const payModel = await post("/order/getPrepayId", {
        openId: this.openId,
        payPrice: this.allprice,
        orderId: this.orderId
      });
      if (payModel.status === "100") {
        //微信支付
        wx.requestPayment({
          timeStamp: payModel.timestamp,
          nonceStr: payModel.nonceStr,
          package: payModel.package,
          signType: "MD5",
          paySign: payModel.paySign,
          success: async res => {
            const addExpress = await post("/order/payAction", {
              address: this.address,
              orderId: this.orderId
            });

            wx.showToast({
              title: "支付成功", //提示的内容,
              icon: "success", //图标,
              duration: 5000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {
                wx.navigateTo({
                  url: "/pages/payComplete/main?orderId=" + this.orderId
                });
              }
            });
          },
          fail: res => {
            console.log("fail+++", res);
          }
        });
      } else {
        wx.showToast({
          title: payModel.msg,
          icon: "none",
          duration: 1500
        });
        return false;
      }
    },
    toAddressList() {
      wx.navigateTo({
        url: "/pages/addressSelect/main"
      });
    },
    toAdd() {
      wx.navigateTo({
        url: "/pages/addaddress/main"
      });
    },
    async getDetail() {
      const data = await get("/order/detailAction", {
        openId: this.openId,
        addressId: this.addressId,
        orderId: this.orderId
      });

      if (data) {
        this.allprice = data.allPrise;
        this.listData = data.goodsList;
        this.address = data.address;
        this.goodsPrice = Number(data.allPrise) ;
      }
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
