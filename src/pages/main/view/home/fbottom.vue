<template>
  <div class="mainCard">
    <n-card class="boxShadow" size="small">
      <n-space class="fade-in" v-if="props.page===1" justify="center">
        <n-space :size="[40,0]" justify="center" style="margin-top: 10px;margin-bottom: 0px">
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openGithub">
                  <BrandGithub></BrandGithub>
                </n-icon>
              </template>
              <span>Github 点亮✨</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openSyjun">
                  <Code></Code>
                </n-icon>
              </template>
              <span>来我的个人网站喝杯茶吧</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openFrank">
                  <Help></Help>
                </n-icon>
              </template>
              <span>Frank使用手册大全🐣</span>
            </n-popover>
          </n-button>
          <n-button text>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-icon size="20" @click="openUpdate">
                  <ArrowUpCircle></ArrowUpCircle>
                </n-icon>
              </template>
              <span>当前版本 {{ config.version }}</span>
            </n-popover>
          </n-button>
        </n-space>
      </n-space>
      <Notice class="fade-in" v-else :notice=props.notice></Notice>
      <div class="transform" v-if="props.notice?.isShow!==undefined">
        <div class="circle">
          <span :class="props.page===1?'active':''" @click="changePage"></span>
          <span :class="props.page===2?'active':''" @click="changePage"></span>
        </div>
      </div>
    </n-card>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 360px;height: auto;"
        title="温馨提示"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
      >
        <n-alert title="Cube账号未登录" type="error">
          如果您是订阅用户,<br/>则无法正常使用订阅功能。<br/>请登录Cube账号后，重启Frank。
        </n-alert>

      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {NCard, NSpace, NButton, NIcon, NPopover,NModal,NAlert} from 'naive-ui'
import {BrandGithub, Help, Code, ArrowUpCircle} from '@vicons/tabler'
import config from "../../../../../package.json"
import Notice from "./notice.vue"
import {ref} from "vue";

const showModal = ref(false)
const props:any = defineProps({
  notice:{
    type:Object
  },
  page:{
    type:Number,
    defaule:1
  }
})
const emits = defineEmits(['changePage'])

cube.profile.getCurrentUser().catch(() => {showModal.value=true})

const openUpdate = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank/update')
}
const openGithub = () => {
  cube.utils.openUrlInDefaultBrowser('https://github.com/java-S12138/frank')
}
const openSyjun = () => {
  cube.utils.openUrlInDefaultBrowser('https://syjun.vip')
}
const openFrank = () => {
  cube.utils.openUrlInDefaultBrowser('https://www.yuque.com/java-s/frank')
}
const changePage = () => {
  emits('changePage')
}
</script>

<style scoped>
.mainCard {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 37px;
}

.n-card {
  border-radius: 10px;
  padding: 5px;
  height: 73.5px;
}

.transform {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  bottom: -1px;
}

.circle span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background: rgba(24, 160, 88, 0.3);
  margin: 0px 2.5px 0px 2.5px;
  transition: background-color 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.active {
  background: #18a058 !important;
}

.fade-in {
  animation: fade-in 1s cubic-bezier(.39, .575, .565, 1.000) both
}

@keyframes fade-in {
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
}
</style>
