<template>
  <div class="feedback">
    <div class="title">
      添加客服微信服务号，为您提供更优质的服务.
    </div>
    <div class="cont">
      <wxParse :content="goods_desc" />
    </div>
  </div>
</template>

<script>
  import {
    post,
    login,
  } from '../../utils';
  import wxParse from "mpvue-wxparse";
  export default {
    mounted() {
      //判断是否登录获取用户信息
      if (login()) {
        this.userInfo = login();
        console.log(this.userInfo);

      }
    },
    data() {
      return {
        userInfo: {},
        content: '',
        phone: '',
        goods_desc:'<p><img src="https://www.chinafish.club/image/KF/KF.jpg"  _src="https://www.chinafish.club/image/KF/KF.jpg" style="" /></p><p><br/></p>'

      };
    },
    components: {
      wxParse
    },
    methods: {

      async submitMes() {
        var _this = this;
        const data = await post('/feedback/submitAction', {
          openId: this.userInfo.openId,
          name: this.userInfo.nickName,
          content: this.content,
          phone: this.phone
        })
        if (data.data) {
          wx.showToast({
            title: '提交成功', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {
              _this.content = '';
              _this.phone = '';
            }
          });

        }
      },
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";
  @import url("~mpvue-wxparse/src/wxParse.css");

</style>
