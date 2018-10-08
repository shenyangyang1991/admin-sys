<template>
  <div id="app">
    <a-layout id="main-app">
      <a-layout-sider
        :trigger="null"
        collapsible
        v-model="collapsed"
      >
        <div class="logo">
          嗨范儿社区管理
        </div>
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
          <a-menu-item key="1">
            <a-icon type="upload"/>
            <span>话题上传</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="()=> collapsed = !collapsed"
          />
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff' }">
          <a-upload-dragger v-if="qiniuToken" accept="image/*" name="file" :multiple="true" action=""
                            :customRequest="upload">
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox"/>
            </p>
            <p class="ant-upload-text">单击或拖动文件到该区域上传</p>
            <p class="ant-upload-hint">上传单个或批量的话题图片，规则为：'话题标题.图片格式'</p>
          </a-upload-dragger>
          <a-alert
            v-if="qiniuErr"
            message="错误提示"
            description="七牛鉴权失败，无法进行上传，刷新页面重试"
            type="error"
            showIcon
          />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  import * as qiniu from 'qiniu-js'

  export default {
    name: 'Index',
    data() {
      return {
        collapsed: false,
        adminToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjQ5MDUyNDUsImlhdCI6MTUzODk4NTI0NSwic3ViIjoie1widXNlcl9pZFwiOi0xLFwibmlja25hbWVcIjpcImFkbWluXCIsXCJhdmF0YXJfdXJsXCI6XCJcIixcInJvbGVcIjoxLFwidmVyc2lvblwiOlwiMS4wLjFcIn0ifQ.KCGJc-NqXvfJKJ-Y4dK0LZxYZoHV4iKa1Lg5LT6EyJc',
        qiniuToken: '',
        qiniuErr: false,
      }
    },
    async created() {
      try {
        let resp = await this.$axios.$get('/api/v1/qiniu/token', {
          headers: {
            'Authorization': `${this.adminToken}`
          }
        })
        let result = resp
        if (result.success) {
          this.qiniuToken = result.data.token
        } else {
          this.qiniuErr = true
        }
      } catch (e) {
        this.qiniuErr = true
      }
    },
    methods: {
      upload(e) {
        setTimeout(() => {
          this.qiniu(e)
        }, 1000)
      },
      qiniu(e) {
        let file = e.file
        let ob = qiniu.upload(file, file.name, this.qiniuToken, {
          params: {
            "x:index": "subject",
            "x:category": "image",
            "x:context": file.name.slice(0, file.name.lastIndexOf(".")),
            "x:token": this.adminToken,
          }
        }, {
          useCdnDomain: true,
          region: qiniu.region.z2,
        })
        ob.subscribe((res) => {
          e.onProgress(res, file)
        }, (err) => {
          e.onError(err, null, file)
        }, (res) => {
          e.onSuccess(res, file)
        })
      }
    }
  }
</script>

<style>
  #main-app .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #main-app .trigger:hover {
    color: #1890ff;
  }

  #main-app .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;

    font-size: 14px;
    color: #fff;
    line-height: 32px;
    text-align: center;
  }
</style>

