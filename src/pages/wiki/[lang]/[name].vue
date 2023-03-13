<script setup lang="ts">
import axios from 'axios'
import zhConvertor from 'zhconvertor'
import type { SearchResultModule } from '~/types'
const props = defineProps<{ name: string; lang: string }>()
const user = useUserStore()
const router = useRouter()

const activeName = ref('first')

const baikeUrl = ref('')
const hudongUrl = ref('')
const docItem = ref<SearchResultModule>()
const Summary = ref('')
const PageDetail = ref<any>({})

const T2S = (str: string) => {
  return zhConvertor.t2s(str.replaceAll('_', ' '))
}

const ConvertTitle = (str: string | undefined) => {
  if (str === undefined)
    return ''
  return T2S(str)
}

const DuplicateRedirect = (nameArray: string[] | undefined): string[] => {
  if (nameArray === undefined || nameArray === null)
    return []
  const set = new Set<string>()
  nameArray.forEach((element) => {
    set.add(T2S(element))
  })
  return Array.from(set)
}

watchEffect(() => {
  user.setNewName(props.name)
  Summary.value = ''
  axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/page', {
    title: props.name.replaceAll(' ', '_'),
    lang: props.lang,
  }).then((response) => {
    if (response.data.ok === false) {
      router.push('/404')
      return
    }
    baikeUrl.value = `https://baike.baidu.com/item/${response.data.data?.zh_title || response.data.data.title}`
    hudongUrl.value = `https://www.hudong.com/search?keyword=${response.data.data?.zh_title || response.data.data.title}`
    docItem.value = response.data.data
    axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/wiki_page_detail', {
      id: docItem.value?.id,
      lang: props.lang,
    }).then((response) => {
      if (response.data.ok)
        PageDetail.value = response.data.data
    })
  })
})

onMounted(() => {

})
</script>

<template>
  <div>
    <div>
      <p text-4xl>
        {{ ConvertTitle(docItem?.title) }}
      </p>
    </div>
    <div v-if="docItem?.redirect_from">
      （重定向自 {{ ConvertTitle(docItem?.redirect_from) }} ）
    </div>
    <div v-if="docItem?.lang === 'en' && docItem?.zh_title">
      （中文名 {{ ConvertTitle(docItem?.zh_title) }} ）
    </div>
    <div v-if="docItem?.zh_redirect">
      <span>其他中文名</span>
      <el-tag
        v-for="item in DuplicateRedirect(docItem?.zh_redirect)" :key="item"
        mb-1 ml-1
      >
        {{ item }}
      </el-tag>
    </div>

    <div v-if="docItem?.en_redirect">
      <span>其他英文名</span>
      <el-tag
        v-for="item in DuplicateRedirect(docItem?.en_redirect)" :key="item"
        mb-1 ml-1
      >
        {{ item }}
      </el-tag>
    </div>

    <div v-if="docItem?.zh_category">
      <span>中文分类</span>
      <el-tag
        v-for="item in docItem?.zh_category" :key="item"
        mb-1
        ml-1 type="success"
        @click="router.push(`/category/zh/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
    </div>

    <div v-if="docItem?.en_category">
      <span>英文分类</span>
      <el-tag
        v-for="item in docItem?.en_category" :key="item"
        mb-1 type="success"
        ml-1 @click="router.push(`/category/en/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
    </div>

    <article>{{ PageDetail?.plaintext }}</article>
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
