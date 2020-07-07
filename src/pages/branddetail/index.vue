<template>
    <div class="branddetail">
        <div class="banner">
            <img src="https://www.chinafish.club/image/BG/BG1.jpg" alt="">
            <div class="info">
                <span>浅小糖海钓俱乐部</span>
            </div>
        </div>
        <div class="info-desc">
            纵享海钓激情
        </div>
        <div v-if="goodsList.length!=0" class="sortlist">
            <div @click="goodsDetail(item.id)" v-for="(item, index) in goodsList" :key="index" class="item">
                <img :src="item.list_pic_url" alt="">
                <p class="name">{{item.name}}</p>
                <p class="price">￥{{item.retail_price}}</p>
            </div>
        </div>
        <div v-else class="none">
            数据库暂无数据...
        </div>
    </div>
</template>

<script>
import { get } from "../../utils";
export default {
  created() {},
  mounted() {
    this.id = this.$root.$mp.query.id;
    this.getDetail();
  },
  data() {
    return {
      id: "",
      detailData: {},
      goodsList: []
    };
  },
  components: {},
  methods: {
    async getDetail() {
      const data = await get("/brand/detailaction", { id: this.id });
      this.detailData = data.data;
      this.goodsList = data.goodsList;
    },
     goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id
      });
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>