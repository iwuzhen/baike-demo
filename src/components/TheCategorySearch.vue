<script setup lang="ts">
import axios from 'axios'

import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: { lang: string; title: string }
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const title = ref('')

const suggestion = ref<any>([])

const handleSelect = (item: any) => {
  if (data.value.title) {
    // data.value = { lang: item.lang, title: item.f_title }
    data.value.title = item.f_title
    title.value = item.f_title
  }
}

const handleEnter = () => {
  if (suggestion.value?.length > 0)
    handleSelect(suggestion.value[0])
}

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  suggestion.value = []
  if (data.value.title.length < 1)
    return

  axios.post('https://api.nikepai.com:10444/v/2.0/baike_demo/query', {
    query: queryString,
    namespace: 14,
    lang: 'zh',
  }).then((response) => {
    suggestion.value = response.data.data
    cb(response.data.data)
  })
}

watch(() => data.value.title, () => {
  title.value = data.value.title
})

onMounted(() => {
  title.value = data.value.title
})
</script>

<template>
  <el-autocomplete
    ref="autocompleteRef"
    v-model="title"
    :fetch-suggestions="querySearchAsync"
    clearable
    placeholder="Search"
    value-key="f_title"
    popper-class="my-autocomplete"
    @select="handleSelect"
    @keyup.enter="handleEnter"
  >
    <template #suffix>
      <div i-carbon-search />
    </template>
    <template #default="{ item }">
      <div>
        <div float-right>
          {{ item.lang }}
        </div>
      </div>
      <div text-align>
        {{ item.f_title }}
      </div>
      <div v-if="item.redirect">
        redirect to {{ item.redirect }}
      </div>
    </template>
  </el-autocomplete>
</template>
