<template>
  <n-modal v-model:show="store.showSummonerInfoModal"
           :mask-closable="false"
           :auto-focus="false">
    <n-card
      class="summonerInfoDiv"
      :bordered="false"
      size="small"
      role="dialog"
      aria-modal="true"
      content-style="padding: 0"
    >

      <n-tabs animated
              type="line"
              :tabs-padding="20"
              pane-style="padding: 20px;">
        <n-tab-pane name="友方召唤师" tab="友方召唤师" style="width: 280px">
          <n-space vertical :size="[2,18]" style="width:100% ">
            <n-space justify="space-between" class="alignItemCenter"  v-for="summoner in summonersList">
              <n-avatar
                round
                :size="50"
                :src="summoner[2]"
                style="display: block"
                @click="showMatch(summoner)"
              />
              <n-tag type="success" :bordered="false" style="width: 145px;" class="alignCenter">{{ summoner[0] }}</n-tag>
              <n-button size="small" type="error" @click="preAddBlacklist(summoner[0],summoner[1])">拉黑</n-button>
            </n-space>
          </n-space>
        </n-tab-pane>
        <n-tab-pane name="敌方召唤师" tab="敌方召唤师" style="width: 280px">
          <n-space vertical :size="[2,18]">
            <n-space justify="space-between" class="alignItemCenter" v-for="summoner in enemySummonersList">
              <n-avatar
                round
                :size="50"
                :src="summoner[2]"
                style="display: block"
                @click="showMatch(summoner)"
              />
              <n-tag type="success" :bordered="false" style="width: 145px;" class="alignCenter">{{ summoner[0] }}</n-tag>
              <n-button size="small" type="error"  @click="preAddBlacklist(summoner[0],summoner[1])">拉黑</n-button>
            </n-space>
          </n-space>
        </n-tab-pane>
      </n-tabs>

      <div class="iconDiv">

        <n-popconfirm @positive-click="closeModal"
                      :show-icon="false" positive-text="确定" negative-text="取消">
          <template #trigger>
            <n-icon size="25">
              <circle-x></circle-x>
            </n-icon>
          </template>
          是否关闭此窗口
        </n-popconfirm>
      </div>
      <p class="tipsP">{{ getRandomString() }}</p>
    </n-card>

  </n-modal>

  <n-drawer v-model:show="active" style="border-top-left-radius: 12px;border-top-right-radius: 12px"
            :height="420" placement="bottom" :auto-focus="false">
    <add-blacklist @closeDra = "active=false"
                   :name="blacklistName"
                   :summonerId="blacklistId"
                   :gameAfterId="gameAfterId"
                   :isHandAdd="false"
    ></add-blacklist>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NCard, NModal, NSpace, NTag, NButton,NAvatar,
  NDrawer,NTabs,NTabPane,NIcon,NPopconfirm,useMessage
} from "naive-ui"
import {CircleX} from '@vicons/tabler'
import AddBlacklist from './addBlacklist.vue'
import {Ref, ref} from "vue";
import assistStore from "../../../store/assistStore";

const active = ref(false)
const summonersList:Ref = ref([])
const enemySummonersList:Ref = ref([])
const store = assistStore()
const blacklistName = ref('')
const blacklistId = ref('')
const gameAfterId = ref(0)
const emits = defineEmits(['refreshList'])
const message = useMessage()

cube.windows.message.on('received',async (id) => {
  if (id==='show-other-summoner'){
    if (store.endGameAfterInfo[0].length !== 0) {
      summonersList.value = []
      for (const summoner of store.endGameAfterInfo[0]) {
        summonersList.value.push([summoner.name, `${summoner.summonerId}`,summoner.selectChamp,summoner.index])
      }
    }
    if (store.endGameAfterInfo[1].length!== 0) {
      enemySummonersList.value = []
      for (const summoner of store.endGameAfterInfo[1]) {
        enemySummonersList.value.push([summoner.name, `${summoner.summonerId}`,summoner.selectChamp,summoner.index])
      }
    }
    gameAfterId.value = store.endGameAfterInfo[2]
    store.showSummonerInfoModal = true
  }
})

const closeModal = () => {
  store.showSummonerInfoModal = false
}

const preAddBlacklist = (summonerName:string, summonerId:string) => {
  blacklistName.value = summonerName
  blacklistId.value = summonerId
  active.value = true
}
const showMatch =async (summoner:any) => {
  if (localStorage.getItem('isSubscribe') === 'f'){
    message.warning('跳转查询战绩界面 需要订阅服务')
    return
  }
  localStorage.setItem('initQueryMatch',JSON.stringify({matchId:undefined,summonerId:summoner[1]}))
  const queryMatch = await cube.windows.obtainDeclaredWindow('queryMatch')
  if (queryMatch!==undefined){
    cube.windows.message.send(queryMatch.id,'refresdh-window','')
  }
}
const getRandomString = () =>  {
  const strings = [
    '点击头像可查看此召唤师战绩',
    '拉黑玩家将在下次遇见时提示'
  ];

  const index = Math.floor(Math.random() * strings.length);

  return strings[index];
}

</script>

<style scoped>
.alignCenter {
  justify-content: center;
}
.alignItemCenter {
  align-items: center;
}
.iconDiv {
  position: absolute;
  top: 9px;
  right: 32px;
}
.summonerInfoDiv {
  width: 320px;
  position: fixed;
  bottom: 0px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px
}
.tipsP {
  position: absolute;
  left: 85px;
  bottom: 1px;
  font-size: 12px;
  color: #9aa4af;
}
</style>
