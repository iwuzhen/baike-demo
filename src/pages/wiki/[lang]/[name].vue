<script setup lang="ts">
import axios from 'axios'
import type { SearchResultModule } from '~/types'
const props = defineProps<{ name: string; lang: string }>()
const user = useUserStore()

const activeName = ref('first')

const baikeUrl = ref('')
const hudongUrl = ref('')
const docItem = ref<SearchResultModule>()

watchEffect(() => {
  user.setNewName(props.name)
  axios.post('https://api.nikepai.com:10444/v/2.0/baike_demo/page', {
    id: Number(props.name),
    lang: props.lang,
  }).then((response) => {
    baikeUrl.value = `https://baike.baidu.com/item/${response.data.data.title}`
    hudongUrl.value = `https://www.hudong.com/search?keyword=${response.data.data.title}`
    docItem.value = response.data.data
  })
})

onMounted(() => {

})
</script>

<template>
  <div>
    <div>
      <p text-4xl>
        {{ docItem?.title }}
      </p>
    </div>
    <div v-if="docItem?.redirect_from">
      （重定向自 {{ docItem?.redirect_from }} ）
    </div>

    <el-tag
      v-for="item in docItem?.category" :key="item"
      mb-1 ml-1
    >
      {{ item }}
    </el-tag>

    <el-tabs v-model="activeName" class="demo-tabs" style="width: 960px;" ma-a>
      <el-tab-pane label="百度百科" name="first">
        <iframe id="iframe" :src="baikeUrl" style="width: 1200px; height: 1000px;transform-origin: left top; transform: scale(0.8, 0.8)" frameborder="0" />
      </el-tab-pane>
      <el-tab-pane label="互动百科" name="second">
        <iframe id="iframe" :src="hudongUrl" style="width: 1200px; height: 1000px;transform-origin: left top; transform: scale(0.8, 0.8)" frameborder="0" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
#testID {
    display: none;
}

.el-tab-pane {
  width: 960px;
}
</style>

<route lang="yaml">
meta:
  layout: wiki
</route>
