<script setup lang="ts">
import axios from 'axios'

// import { useAxios } from '@vueuse/integrations/useAxios'

// const { data, isFinished } = useAxios('https://api.nikepai.com:10444/v/2.0/baike_demo/query', { method: 'POST' }, {
//   immediate: true,
// })

defineOptions({
  name: 'IndexPage',
})
const user = useUserStore()
const queryString = $ref(user.queryString)

const router = useRouter()
const handleSelect = (item) => {
  console.log(item)
  user.wikiPageInfo = item
  if (queryString)
    router.push('/wiki/'+item.title)
}

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  axios.post('https://api.nikepai.com:10444/v/2.0/baike_demo/query', {
    query: queryString,
    namespace: 0,
    lang: 'zh',
  }).then((response) => {
    cb(response.data.data)
  })
}
</script>

<template>
  <el-autocomplete
    v-model="queryString"
    :fetch-suggestions="querySearchAsync"
    placeholder="Please input"
    value-key="title"
    @select="handleSelect"
    @handleKeyEnter="handleSelect"
  />
</template>

<route lang="yaml">
meta:
  layout: home
</route>
