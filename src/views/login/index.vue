<template>
  <div class="login-container">
    <vue-canvas-nest :config="config"></vue-canvas-nest>
    <div class="login-container-left">
    </div>
    <div class="login-container-right">
      <div class="login-form">

        <Card :bordered="false">
          <p slot="title">
            <Icon type="log-in"></Icon> 欢迎登陆</p>
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="username">
              <Input type="text" v-model="formInline.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="请输入密码" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" long :loading="loading">登 录</Button>
            </FormItem>
          </Form>
        </Card>

      </div>
    </div>
  </div>
</template>

<script>
import vueCanvasNest from '@/components/VueCanvasNest'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: { vueCanvasNest },
  data () {
    return {
      config: { color: '255,255,255', opacity: '1', count: 320 },
      loading: false,
      imagesrc: '',
      uuid: '',
      formInline: {
        username: '',
        password: '',
        code: ''
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: '请输入用户名！',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码！',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 5,
            message: '密码长度不能小于5位！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'firstPage'
    ])
  },
  mounted () {
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async valid => {
        this.loading = true
        if (valid) {
          try {
            await this.$store.dispatch('login', { name: this.formInline.username, password: this.formInline.password, uuid: this.uuid, code: this.formInline.code })
            await this.$store.dispatch('getUserInfo')
            await this.$store.dispatch('getUserMenu')
            this.$router.push({ name: 'home' })
          } catch (error) {
            const response = error.response
            if (response.status === 401) {
              this.$Message.error({
                content: '账号或者密码有误!',
                duration: 5
              })
            } else {
              let msg = (response.data && response.data.message) ? response.data.message : ''
              if (response) {
                this.$Message.error({
                  content: msg,
                  duration: 5
                })
              }
            }
          }
        } else {
          this.$Message.error('请填写账号密码!')
        }
        this.loading = false
      })
    }

  }

}

</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  width: 100%;
  height: 100%;
  //   background: #2d3a4b;
  //   background-color:rgba(0,152,50,0.7);// -->70%的不透明度
  background-image: url('http://7xqeyw.com1.z0.glb.clouddn.com/xingkong.jpg');
  //   background-image: url("https://file.iviewui.com/iview-admin/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  .login-container-left {
    flex: 1;
  }
  .login-container-right {
    flex: 0 0 360px;
    .login-form {
      margin: 200px 20px 20px 20px;
      // padding: 20px;
      background: #fff;
      width: 300px;
      // height: 300px;
      border-radius: 5px;
    }
  }
}
.show-pwd {
  cursor: pointer;
}
.show-captcha {
  cursor: pointer;
  margin-top: -5px;
  margin-bottom: -8px;
  margin-left: -7px;
  margin-right: -7px;
}
</style>
