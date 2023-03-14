<script setup lang="ts">
import axios from 'axios'
import zhConvertor from 'zhconvertor'

const props = defineProps<{ title: string; lang: string }>()

const router = useRouter()

const T2S = (str: string) => {
  return zhConvertor.t2s(str.replaceAll('_', ' '))
}

const ConvertTitle = (str: string | undefined) => {
  if (str === undefined)
    return ''
  return T2S(str)
}

// const DuplicateRedirect = (nameArray: string[] | undefined): string[] => {
//   if (nameArray === undefined || nameArray === null)
//     return []
//   const set = new Set<string>()
//   nameArray.forEach((element) => {
//     set.add(T2S(element))
//   })
//   return Array.from(set)
// }

const PageObject = ref<any>({})
watchEffect(() => {
  axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/category', {
    title: props.title.replaceAll(' ', '_'),
    lang: props.lang,
  }).then((response) => {
    if (response.data.ok === false)
      router.push('/404')
    PageObject.value = response.data.data
  })
})
</script>

<template>
  <div>
    <div>
      <p v-if="PageObject?.title !== undefined " text-4xl>
        {{ ConvertTitle(PageObject?.title) }}
      </p>
    </div>
    <div v-if="PageObject?.in?.[0] !== undefined">
      <span>父类({{ PageObject?.in.length }})</span>
      <el-tag
        v-for="item in PageObject?.in" :key="item"
        mb-1 ml-1 type="success"
        @click="router.push(`/category/${PageObject.lang}/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
    </div>

    <div v-if="PageObject?.out?.[0] !== undefined">
      <span>子类({{ PageObject?.out.length }})</span>
      <el-tag
        v-for="item in PageObject?.out" :key="item"
        mb-1 type="success"
        ml-1 @click="router.push(`/category/${PageObject.lang}/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
    </div>

    <div v-if="PageObject?.page?.[0] !== undefined">
      <span>page({{ PageObject?.page.length }})</span>
      <el-tag
        v-for="item in PageObject?.page.slice(0, 100)"
        :key="item" mb-1
        ml-1
        @click="router.push(`/wiki/${PageObject.lang}/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
      <span v-if="PageObject?.page.length > 100"><el-tag ml-1>more ......</el-tag></span>
    </div>
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
