<template>
  <div class="goods">
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <block v-for="(item, index) in gallery " :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.img_url" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <div class="swiper-b">
      <!-- <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div> -->
    </div>
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
        <div v-if="brand.name" class="brand">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <div @click="showType" class="section-nav">
      <div>请选择规格数量</div>
      <div></div>
    </div>
    <!-- <div @click="showType" class="section-nav">
      <div>用户评价</div>
      <div></div>
    </div> -->

    <div v-if="attribute.length!=0" class="attribute">
      <div class="head">
        商品参数
      </div>
      <div v-for="(item,index) in attribute" :key="index" class="item">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <div v-if="goods_desc" class="detail">
      <wxParse :content="goods_desc" />
    </div>
    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">常见问题</text>
        <div class="line"></div>
      </div>
      <div class="b">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">
            {{item.answer}}
          </div>
        </div>
      </div>
    </div>
    <!-- 常见问题 -->
    <!-- 大家都在看 -->

    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">大家都在看</text>
        <div class="line"></div>
      </div>
      <div class="sublist">
        <div @click="togoodsDetail(subitem.id)" v-for="(subitem, subindex) in productList" :key="subindex">
          <img :src="subitem.list_pic_url" alt="">
          <p>{{subitem.name}}</p>
          <p>￥{{subitem.retail_price}}</p>
        </div>
      </div>
    </div>

    <!-- 大家都在看 -->
    <div class="bottom-fixed">
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' :'']">

        </div>

      </div>
      <div @click="toCart">
        <div class="car">
          <span>
            {{allnumber}}
          </span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="bug">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格部分 -->
    <div v-show="showpop" @click="showType" class="pop">

    </div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url" alt="">
        </div>
        <div class="right">
          <div>
            <p>价格￥{{showPrice}}</p>
            <p>{{productMsg}}</p>
          </div>
        </div>
        <div @click="showType" class="close">
          X
        </div>
      </div>
      <div class="b">
        <p>数量</p>
        <div class="count">
          <div @click="reduce" class="cut">-</div>
          <input class="number" disabled="" v-model="number" />
          <div @click="add" class="add">+</div>
        </div>

        <div class="section-nav">
            <picker class="weui-btn" mode="multiSelector" @change="MultiPickerChange" :value="indexMulPicker" :range="skuPickerArr">
              <button type="default">{{productMsg}}</button>
            </picker>
        </div>

      </div>
    </div>

    <!-- 选择规格部分 -->
  </div>
</template>

<script>
import { get, post, toLogin, login, getStorageOpenid } from "../../utils";
import wxParse from "mpvue-wxparse";

export default {
  onShow() {
    //判断是否登录获取用户信息
    if (login()) {
      this.userInfo = login();
    }
    //console.log(this.$root.$mp.query.id);

    this.id = this.$root.$mp.query.id;

    this.openId = getStorageOpenid();
    this.goodsDetail();
  },
  mounted() {
    
  },
  //商品转发
  onShareAppMessage() {
    console.log(this.info.name);
    console.log(this.info.id);
    console.log(this.gallery[0].img_url);

    return {
      title: this.info.name,
      path: "/pages/goods/main?id=" + this.info.id,
      imageUrl: this.gallery[0].img_url //拿第一张商品的图片
    };
  },
  data() {
    return {
      allnumber: 0,
      openId: "",
      collectFlag: false,
      number: 1,
      showpop: false,
      gallery: [],
      info: {},
      brand: {},
      attribute: [],
      issueList: [],
      productList: [],
      goods_desc: "",
      id: "",
      userInfo: "",
      goodsId: "",
      goodsName: "",
      allPrise: "",
      indexMulPicker:"",
      skuPickerArr:[],
      productMsg:"请选择产品规格",
      showPrice: 0,
      skuId: 0
    
    };
  },
  components: {
    wxParse
  },
  methods: {
    togoodsDetail(id) {
      wx.redirectTo({ url: "/pages/goods/main?id=" + id });
    },
    add() {
      this.number = this.number + 1;
    },
    reduce() {
      if (this.number > 1) {
        this.number = this.number - 1;
      } else {
        return false;
      }
    },
    async bug() {
      if (toLogin()) {
        if (this.showpop) {

          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }
          
           if(this.skuId == 0 ){
           wx.showToast({
              title: "请选择商品规格", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }

          const data = await post("/order/ordernowAction", {
            goodsId: this.goodsId, 
            openId: this.userInfo.openId,
            number: this.number,
            skuId: this.skuId,
            showPrice: this.showPrice,
            productMsg:this.goodsName + '<' + this.productMsg + '>',
            goodsInfo: this.info
          });
          console.log(data.flag);
           console.log(data.data);
         
          if (data.flag) {
            wx.navigateTo({
              url: "/pages/order/main?orderId="+data.data
            });
          }
        } else {
          this.showpop = true;
        }
      }
    },
    async collect() {
      if (toLogin()) {
        this.userInfo = login();
        this.collectFlag = !this.collectFlag;
        const data = await post("/collect/addcollect", {
          openId: this.userInfo.openId,
          goodsId: this.goodsId
        });
      }
    },
    async addCart() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }
          if(this.skuId == 0 ){
           wx.showToast({
              title: "请选择商品规格", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }
          const data = await post("/cart/addCart", {
            openId: this.userInfo.openId,
            goodsId: this.goodsId,
            number: this.number,
            skuId: this.skuId,
            showPrice: this.showPrice,
            productMsg:this.goodsName + '<' + this.productMsg + '>'
          });
          //添加成功后
          if (data) {
            this.allnumber = this.allnumber + this.number;
            wx.showToast({
              title: "添加购物车成功",
              icon: "success",
              duration: 1500
            });
          }
        } else {
          this.showpop = true;
        }
      }
    },
    toCart() {
      wx.switchTab({
        url: "/pages/cart/main"
      });
      // wx.navigateTo({
      //   url: "/pages/cart/main"
      // });
    },
    async goodsDetail() {
      const data = await get("/goods/detailaction", {
        id: this.id,
        openId: this.openId
      });
      this.gallery = data.gallery;
      this.info = data.info;
      this.allPrise = data.info.retail_price;
      this.goodsId = data.info.id;
      this.goodsName = data.info.name;
      this.brand = data.brand;
      this.attribute = data.attribute;
      this.goods_desc = data.info.goods_desc;
      this.issueList = data.issue;
      this.collectFlag = data.collected;
      this.allnumber = data.allnumber;
      this.productList = data.productList;
      this.skuPickerArr = data.skuPickerArr;
      this.showPrice = data.info.retail_price;

   },
     
   async MultiPickerChange(e) {
      var arrLength = this.skuPickerArr.length;
      this.productMsg = "";
      var skuValue = "";
      if(arrLength > 0 ){

        skuValue = this.skuPickerArr[0][e.mp.detail.value[0]];
        this.goodsSkuInfo(skuValue);

         for (let i = 0; i < arrLength; i++) {
           // console.log('选中的值为：' + this.skuPickerArr[i][e.mp.detail.value[i]] );
            this.fnName(this.skuPickerArr[i][e.mp.detail.value[i]]);
          }

       }
    },

    showType() {
      if (toLogin()) {
        this.showpop = !this.showpop;
      }
    },
    fnName(newname) {
	  	this.productMsg = this.productMsg+ newname;
    },
    async goodsSkuInfo(skuValue){
      const data = await get("/goods/skuinfoaction", {
         goodsId: this.goodsId,
         skuValue: skuValue
      });
      if(data.skuInfo.length> 0 ){
        this.showPrice = data.skuInfo[0].price;
        this.skuId = data.skuInfo[0].sku_id;
        
      }
      
    }

  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
@import "./style.scss";
</style>
