<template>
  <div class="mainCard">
    <n-card class="boxShadow">
      <n-space vertical :size="[2,20]">
<!--        选择模式-->
        <n-space align="center">
            <n-tag :bordered="false">主题样式</n-tag>
            <n-radio
                    :checked="themeValue === 'light'"
                    value="light"
                    name="basic-demo"
                    @click="handleThemeChange"
            >
                浅色
            </n-radio>
            <n-radio
                    :checked="themeValue === 'dark'"
                    value="dark"
                    name="basic-demo"
                    @click="handleThemeChange"

            >
                深色
            </n-radio>
        </n-space>
<!--        秒选英雄-->
        <n-space>
          <n-tag :bordered="false">秒选英雄</n-tag>
          <n-tree-select
            v-model:value="config.autoPickChampion.championId"
            filterable
            :disabled="!config.autoPickChampion.isAuto"
            size="small"
            placeholder="选择英雄"
            :options="optionsChampion"
            @update:value="handleUpdatePick"
            style="width: 140px"
          >
            <template #action>
              点击箭头即可展开
            </template>
          </n-tree-select>
          <n-switch v-model:value="config.autoPickChampion.isAuto" @click="changePick"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        秒禁英雄-->
        <n-space>
          <n-tag :bordered="false">秒禁英雄</n-tag>
          <n-tree-select
            v-model:value="config.autoBanChampion.championId"
            filterable
            :disabled="!config.autoBanChampion.isAuto"
            size="small"
            placeholder="选择英雄"
            :options="optionsChampion"
            @update:value="handleUpdateBan"
            style="width: 140px"
          >
            <template #action>
              点击箭头即可展开
            </template>
          </n-tree-select>
          <n-switch v-model:value="config.autoBanChampion.isAuto" @click="changeBan"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        排位笔记-->
        <n-space>
          <n-tag :bordered="false">排位笔记</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 140px;justify-content: center">是否使用排位笔记</n-tag>

          <n-switch v-model:value="config.isSwitchBlacklist" @click="changeBlacklist"
                    style="margin-left:22px;margin-top: 3px"/>
        </n-space>
<!--        游戏窗口-->
        <n-space>
          <n-tag :bordered="false">游戏窗口</n-tag>
          <n-popover :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-tag :bordered="false" type="success"
                     style="width: 140px;justify-content: center">自动打开游戏窗口</n-tag>
            </template>
            修改快捷键  请到Cube平台里面设置
          </n-popover>

          <n-switch v-model:value="config.isGameInWindow" @click="changeAutoGameInWin"
                    style="margin-left:22px;margin-top: 3px"/>
          <n-tag :disabled="true" :bordered="false"
                 size="small" style="width: 300px;justify-content: center">游戏内显示战绩历史窗口 隐藏|显示 SHIFT+TAB</n-tag>
        </n-space>
<!--        秒接对局-->
        <n-space v-if="isSubscribe !== 'f'">
          <n-tag :bordered="false">秒接对局</n-tag>
          <n-slider v-model:value="config.autoAccept" :step="10" @update:value="handleUpdateAccept"
                    style="width: 213px;margin-top: 5px"/>
          <n-tag :disabled="true" :bordered="false"
                 size="small" style="width: 300px;justify-content: center">滑块的值: [ {{'<'}}50  关闭 ] [ =50 开启 ] [ =60 延迟两秒 ] </n-tag>
        </n-space>
        <n-space v-else>
          <n-space>
            <n-tag :bordered="false" >订阅服务</n-tag>
            <n-button size="small" type="warning" style="width: 214px;"
                      secondary @click="openSubscribePage">自动接收对局 需要订阅服务
            </n-button>
          </n-space>
        </n-space>
        <n-space v-if="isSubscribe !== 'f'">
          <n-tag :bordered="false">远程协助</n-tag>
          <n-tag :bordered="false" type="success"
                 style="width: 214px;justify-content: center">一对一服务: java_s@qq.com</n-tag>
        </n-space>
        <!--Cube平台-->
        <n-space>
          <n-tag :bordered="false" >插件平台</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="openCubeSite">CUBE 为改善游戏体验而生
          </n-button>
          <n-tag :disabled="true" :bordered="false"
                 size="small" style="width: 300px;justify-content: center">修改快捷键 可点击上方按钮 在Cube平台里面设置</n-tag>
        </n-space>
<!--        回到首页-->
        <n-space>
          <n-tag :bordered="false">回到首页</n-tag>
          <n-button size="small" type="success" style="width: 214px;"
                    secondary @click="toHomePage">Frank On Cube BY: Java_S
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>

</template>

<script setup lang="ts">
import {NCard, NSpace, NTag, NButton, NSelect, NSwitch, NSlider,NPopover,NRadio,NTreeSelect} from 'naive-ui'
import {optionsChampion} from '../../resources/champList'
import {reactive, ref} from "vue";

const emits = defineEmits(['changePage'])
const config = reactive(JSON.parse(<string>(localStorage.getItem('config'))))
const themeValue = ref(localStorage.getItem('theme'))
const isSubscribe = localStorage.getItem('isSubscribe')
const toHomePage = () => {
  emits('changePage')
}

const handleThemeChange = (e:Event) => {
  const r = confirm("如果你想切换主题 请点击 [确定] Frank会自动重启 ^_^")
  if (r == true) {
    themeValue.value = (e.target as HTMLInputElement).value
    localStorage.setItem('theme',(e.target as HTMLInputElement).value)
    cube.extensions.relaunch()
  } else {
    alert("哎呀~~~ 你取消了切换主题")
  }
}

// 设置是否选项共用函数
const commoneChnage = (option:string) => {
  if (config[option] !== true) {
    config[option] = false
    localStorage.setItem('config',JSON.stringify(config))
  } else {
    config[option] = true
    localStorage.setItem('config',JSON.stringify(config))
  }
}
const commoneChnageSecond = (option:string,second:string) => {
  if (config[option][second] !== true) {
    config[option][second] = false
    localStorage.setItem('config',JSON.stringify(config))
  } else {
    config[option][second] = true
    localStorage.setItem('config',JSON.stringify(config))
  }
}

// 设置是否自动选择英雄
const changePick = () => {
  commoneChnageSecond('autoPickChampion','isAuto')
}
// 设置是否自动禁用英雄
const changeBan = () => {
  commoneChnageSecond('autoBanChampion','isAuto')
}
// 设置是否开启排位日记
const changeBlacklist = () => {
  cube.windows.getWindowByName('assist').then((v:any) => {
    cube.windows.message.send(v.id,'refresh','')
  })

  commoneChnage('isSwitchBlacklist')
}

// 设置是否开启自动打开游戏内窗口
const changeAutoGameInWin = () => {
  commoneChnage('isGameInWindow')
}

// 通过选择器选择英雄后, 执行的函数 选择
const handleUpdatePick = () => {
  localStorage.setItem('config',JSON.stringify(config))
}
// 通过选择器选择英雄后, 执行的函数 禁用
const handleUpdateBan = () => {
  localStorage.setItem('config',JSON.stringify(config))
}
// 是否自动接受对局
const handleUpdateAccept = () => {
  localStorage.setItem('config',JSON.stringify(config))
}
const openCubeSite = () => {
  cube.utils.openSettings()
}

const openSubscribePage = () => {
  cube.profile.subscriptions.inapp.subscribe('1627551195412164610')
}

</script>

<style scoped>
.mainCard {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.n-card {
  border-radius: 10px;
  padding: 5px;
}


.alignCent {
  align-items: center;
}
.carousel-img {
  width: 100%;
  height: 172px;
  object-fit: cover;

}
</style>
