<template>
  <div>
    <n-card class="boxShadow mainCard" content-style="padding:20px 10px 20px 10px" >
      <n-grid x-gap="20" :cols="5" style="margin-top: 15px" v-if="summonerInfo.length!==0">
        <n-gi v-for="summoner in (summonerInfo)">
          <n-space vertical :size="[10,4]" class="alignCenter">
            <n-avatar
              round
              :bordered="false"
              :size="50"
              :src="`https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summoner.iconId}.png`"
              fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
              style="display: block"
              @click="clickCurrentSummoner($event,summoner.summonerId,summoner.name,summoner.puuid)"
            />
            <n-tag type="default" :bordered="false"
                   round size="small" style="width: 120px;justify-content: center">{{summoner.name}}
            </n-tag>
            <n-tag type="info" :bordered="false"
                   round size="small">常玩位置: {{ summoner.simpleMatchHistory.regularPostion }}
            </n-tag>
            <n-tag :type="summoner.simpleMatchHistory.winInfo.isWin === true ? 'success':'error'" :bordered="false"
                   round size="small">{{summoner.simpleMatchHistory.winInfo.info}}
            </n-tag>
            <div style="width: 120px;margin-top: 12px" class="divList">
              <n-space justify="space-between" :size="[0]"
                       v-for="match in summoner.simpleMatchHistory.simpleMatch"  @click="toGameDetailsPage(match.gameId,summoner.name)">
                <n-avatar
                  :bordered="false"
                  :size="28"
                  :src="match.champImg"
                  fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                  style="display: block"
                />
                <div :class="match.position" ></div>
                <n-tag :bordered="false" :type="match.isWin === true ? 'success':'error'"
                       style="width: 60px;justify-content: center">{{ match.kill }}/{{ match.deaths }}/{{match.assists}}</n-tag>
              </n-space>
            </div>
          </n-space>
        </n-gi>
      </n-grid>
      <loading-anime v-else></loading-anime>
      <div class="suspension">
        <n-space>
          <n-tag :bordered="false"
                 style="font-size: 12px">点击右侧图标可查看队友评分</n-tag>
          <n-button
            text
            @click="() => {pageCount=4}" class="textButtonColor">
            <n-icon size="25">
              <PictureInPictureTop/>
            </n-icon>
          </n-button>

          <n-button
            text
            @click="handleMin" class="textButtonColor">
            <n-icon size="25">
              <ChevronsDownLeft/>
            </n-icon>
          </n-button>

          <n-popconfirm @positive-click="closeWindow" :show-icon="false"
                        negative-text="取消" positive-text="确认">
            <template #trigger>
              <n-button text circle class="textButtonColor">
                <n-icon size="24">
                  <circle-x/>
                </n-icon>
              </n-button>
            </template>
            是否关闭当前页面
          </n-popconfirm>

          <n-popover :show-arrow="false" trigger="hover" :delay="1000">
            <template #trigger>
              <n-icon size="24" class="textButtonColor">
                <Ballon @mousedown="handleChangePosition"/>
              </n-icon>
            </template>
            移动窗口位置
          </n-popover>
        </n-space>
      </div>
    </n-card>

  </div>
</template>

<script setup lang="ts">
import {
  NCard, NSpace, NTag,NIcon, NAvatar, NGrid, NGi,NButton, NPopover, NPopconfirm,NSwitch
} from 'naive-ui'
import {matchStore} from "../../store";
import {storeToRefs} from "pinia";
import {ChevronsDownLeft, CircleX, Ballon,PictureInPictureTop} from "@vicons/tabler"
import LoadingAnime from "../components/loadingAnime.vue";
import {reactive} from "vue";

const config = reactive(JSON.parse(<string>(localStorage.getItem('config'))))
const emits = defineEmits(['changePage','summonerId','toGameDetailsPage'])
const store = matchStore()
const {
  summonerInfo,currentSummonerName,pageCount
} = storeToRefs(store)

const clickCurrentSummoner = (e:any, summonerId:number, name:string,puuid:string) => {
  emits('summonerId', {summonerId, name, puuid})
}

const toGameDetailsPage = (gameId:any,summoneName:string) => {
  currentSummonerName.value = summoneName
  emits('toGameDetailsPage',{gameId:gameId,lastPage:1})
}

const handleChangePosition = () => {
  cube.windows.current.dragMove()
}

const closeWindow = async () => {
 cube.windows.close((await cube.windows.getCurrentWindow()).id)
}
const handleMin =async () => {
  cube.windows.minimize((await cube.windows.getCurrentWindow()).id)
}

</script>

<style scoped>

.mainCard {
  margin: 10px;
  border-radius: 10px;
  height: 556px;
  width: 722px;
}
.TOP {
  width: 20px;
  height: 20px;
  margin-top: 3px;
  background-size:20px;
  background-image: url('@/assets/tLevel/top.svg');
  display: inline-block;
}

.MIDDLE {
  width: 20px;
  height: 20px;
  margin-top: 3px;
  background-size:20px;
  background-image: url('@/assets/tLevel/mid.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.JUNGLE {
  width: 20px;
  height: 20px;
  margin-top: 3px;
  background-size:20px;
  background-image: url('@/assets/tLevel/jug.svg');
  display: inline-block;
  background-repeat: no-repeat;
}

.BOTTOM {
  width: 20px;
  height: 20px;
  margin-top: 3px;
  background-size:20px;
  background-image: url('@/assets/tLevel/bot.svg');
  display: inline-block;
  background-repeat: no-repeat;
}
.NONE {
  width: 20px;
  height: 20px;
  margin-top: 3px;
  background-size:20px;
  background-image: url('@/assets/tLevel/bot.svg');
  display: inline-block;
  visibility: hidden;
  background-repeat: no-repeat;
}

.divList >.n-space {
  margin-top: 5px;
}
.alignCenter {
  align-items: center
}

.suspension {
  position: absolute;
  top: 7px;
  right: 3px;
}
</style>
