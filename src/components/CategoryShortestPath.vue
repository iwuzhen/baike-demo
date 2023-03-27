<script setup lang="ts">
import axios from 'axios'

import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: { lang: string; title: string }
}>()
const emit = defineEmits(['update:modelValue'])

const SourceCat = useVModel(props, 'modelValue', emit)

// const SourceCat = ref({
//   title: '已灭绝动物',
//   lang: 'zh',
// })

const zhTarget = {
  title: '哲学',
  lang: 'zh',
}

const enTarget = {
  title: 'Philosophy',
  lang: 'en',
}
const TargetCat = ref(zhTarget)

const diagram = ref('')

const querySearchAsync = () => {
  if (SourceCat.value.lang === 'en')
    TargetCat.value = enTarget

  else
    TargetCat.value = zhTarget

  axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/category_path', {
    source: SourceCat.value.title,
    target: TargetCat.value.title,
    lang: SourceCat.value.lang,
  }).then((response) => {
    if (!response.data.nodes) {
      diagram.value = ''
      return
    }
    diagram.value = 'graph LR'
    const fnameMap = new Map()
    response.data.nodes.forEach((item: any) => {
      fnameMap.set(item.title, item.f_title)
    })
    for (const path of response.data.edges)
      diagram.value += `\n  ${path[0]}["${fnameMap.get(path[0])}"]-->${path[2]}["${fnameMap.get(path[2])}"]`

    response.data.nodes.forEach((item: any) => {
      diagram.value += `\n  click ${item.title} "/category/${SourceCat.value.lang}/${encodeURIComponent(item.title)}"`
    })

    diagram.value += `\n  style ${response.data.nodes[0].title} fill:red,stroke:black,stroke-width:4px,color:white;`
    diagram.value += `\n  style ${response.data.nodes[response.data.nodes.length - 1].title} fill:red,stroke:black,stroke-width:4px,color:white;`
    // console.log('diagram', diagram)
  })
}

// onMounted(() => {
//   querySearchAsync()
// })

watchEffect(() => {
  querySearchAsync()
})
</script>

<template>
  <el-row justify="start">
    <el-col :span="8">
      source
      <TheCategorySearch :model-value="SourceCat" />
    </el-col>
    <el-col :span="8">
      target
      <TheCategorySearch :model-value="TargetCat" />
    </el-col>
  </el-row>
  <el-row>
    <el-col><VueMermaidString v-if="diagram !== ''" :options="{ maxTextSize: 10000 }" :model-value="diagram" /></el-col>
  </el-row>
</template>

<style>
.el-autocomplete-suggestion li{
  padding-left: 10 !important;
  padding-top: 5;
}
</style>
