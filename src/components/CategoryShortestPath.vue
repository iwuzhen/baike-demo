<script setup lang="ts">
import axios from 'axios'

// import { useVModel } from '@vueuse/core'
import { customAlphabet } from 'nanoid'
import type { Ref } from 'vue'
const props = defineProps<{
  modelValue: { lang: string; title: string }
}>()

// const emit = defineEmits(['update:modelValue'])

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 4)

// const SourceCat = useVModel(props, 'modelValue', emit)

// let SourceCat = ref(props.modelValue)

const SourceCat = ref({
  lang: props.modelValue.lang,
  title: props.modelValue.title,
})

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
const activeNames = ref(['1'])
const diagram: Ref<{
  d1: string
  d2: string
  d3: string
  d4: string[]
}> = ref({
  d1: '',
  d2: '',
  d3: '',
  d4: [],
})

const renderChartText = (graph: any) => {
  if (graph.nodes === undefined || graph.nodes?.length === 0)
    return ''
  let chartValue = 'graph LR'
  const fnameMap = new Map()
  const markNameMap = new Map()
  graph.nodes.forEach((item: any) => {
    fnameMap.set(item.title, item.f_title)
    markNameMap.set(item.title, nanoid())
  })
  for (const path of graph.edges)
    chartValue += `\n  ${markNameMap.get(path[0])}["${fnameMap.get(path[0])}"]-->${markNameMap.get(path[2])}["${fnameMap.get(path[2])}"]`

  graph.nodes.forEach((item: any) => {
    chartValue += `\n  click ${markNameMap.get(item.title)} "/category/${SourceCat.value.lang}/${encodeURIComponent(item.title)}"`
  })

  chartValue += `\n  style ${markNameMap.get(graph.nodes[0].title)} fill:red,stroke:black,stroke-width:4px,color:white;`
  chartValue += `\n  style ${markNameMap.get(graph.nodes[graph.nodes.length - 1].title)} fill:red,stroke:black,stroke-width:4px,color:white;`
  return chartValue
}

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
    // shortest
    diagram.value.d1 = ''
    diagram.value.d2 = ''
    diagram.value.d3 = ''
    // console.log('diagram', diagram)
    diagram.value.d1 = renderChartText(response.data.d1)
    diagram.value.d2 = renderChartText(response.data.d2)
    diagram.value.d3 = renderChartText(response.data.d3)
    if (response.data.d4s !== undefined) {
      const d4 = []
      for (const row of response.data.d4s)
        d4.push(renderChartText(row))
      diagram.value.d4 = d4
    }
  })
}

onMounted(() => {
  // SourceCat = ref(props.modelValue)
  querySearchAsync()
})

watch([() => TargetCat.value.title, () => SourceCat.value.title], () => {
  querySearchAsync()
})

watch(() => props.modelValue.title, () => {
  SourceCat.value.lang = props.modelValue.lang
  SourceCat.value.title = props.modelValue.title
})

// watchEffect(() => {
//   querySearchAsync()
// })
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
  <el-collapse v-model="activeNames">
    <el-collapse-item v-if="diagram.d1 !== ''" title="Shortest path" name="1">
      <el-row mt-10>
        <el-col><VueMermaidString :options="{ maxTextSize: 50000 }" :model-value="diagram.d1" /></el-col>
      </el-row>
    </el-collapse-item>
    <el-collapse-item v-if="diagram.d2 !== '' || diagram.d3 !== ''" title="Line path" name="2">
      <el-row v-if="diagram.d2 !== '' " mt-10>
        <el-col><VueMermaidString :options="{ maxTextSize: 50000 }" :model-value="diagram.d2" /></el-col>
      </el-row>
      <el-row v-if="diagram.d3 !== ''" mt-10>
        Line path
        <el-col><VueMermaidString :options="{ maxTextSize: 50000 }" :model-value="diagram.d3" /></el-col>
      </el-row>
    </el-collapse-item>
    <el-collapse-item v-if="diagram.d4 !== undefined && diagram.d4!.length > 0" title="Common parent" name="3">
      <el-row mt-10>
        <el-col v-for="(dgm, index) in diagram.d4" :key="index">
          <VueMermaidString :options="{ maxTextSize: 50000 }" :model-value="dgm" />
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<style>
.el-autocomplete-suggestion li{
  padding-left: 10 !important;
  padding-top: 5;
}
</style>
