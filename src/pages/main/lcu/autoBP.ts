import {invokeLcu} from "./index";

//选择或者禁用英雄共用函数
const champSelectPatchAction = async (actionID:any, champId:any, type:string,idSetInterval:number) => {
  const localBody = {
    "completed": true,
    "type": type,
    "championId": champId
  }
  invokeLcu('patch',`/lol-champ-select/v1/session/actions/${actionID}`,[localBody]).then(value => {
    if (!value?.success && type==='pick'){
      clearInterval(idSetInterval)
    }
  })
}

// 获取选人会话
export const champSelectSession = async (idSetInterval:number,config:any) => {
  try {
    const res = await invokeLcu('get','/lol-champ-select/v1/session')
    const localPlayerCellId = res?.localPlayerCellId
    const actions = res?.actions
    if (actions === undefined){
      clearInterval(idSetInterval)
    }

    for (let action of actions) {
      for (let actionElement of action) {
        if (actionElement.actorCellId == localPlayerCellId && actionElement.isInProgress) {
          if (actionElement.type === 'pick' && config.autoPickChampion.isAuto) {
            champSelectPatchAction(actionElement.id,config.autoPickChampion.championId,'pick',idSetInterval)
          } else if (actionElement.type === 'ban'&& config.autoBanChampion.isAuto) {
            champSelectPatchAction(actionElement.id,config.autoBanChampion.championId,'ban',idSetInterval)
          }
        }
        if (actionElement.actorCellId == localPlayerCellId && !actionElement.isInProgress){
          if (actionElement.type === 'pick' && actionElement.completed){
            clearInterval(idSetInterval)
          }
        }
      }
    }
  }catch (e:any){
    clearInterval(idSetInterval)
  }
}
