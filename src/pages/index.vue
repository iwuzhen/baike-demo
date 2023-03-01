<script setup lang="ts">
// import axios from 'axios'

import { useAxios } from '@vueuse/integrations/useAxios'
const router = useRouter()

const { data } = useAxios('https://api.nikepai.com:10444/v/2.0/baike_demo/lately_search', { method: 'Get' }, {
  immediate: true,
})

defineOptions({
  name: 'IndexPage',
})

const historyClick = (item: any) => {
  router.push(`/wiki/${item.lang}/${item.id}`)
}
</script>

<template>
  <div mt-50 mb-60>
    <p text-4xl mb-10>
      <!-- BaiKe Search Engine -->
      <img src="/metapedia-black.svg" alt="" w-100 ma-auto>
    </p>
    <the-search class="w-xl" />
    <div mt-30>
      <el-card v-for="item in data?.data" :key="item" shadow="hover" w-auto mr-2 inline-block @click="historyClick(item)">
        {{ item.title }}
      </el-card>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
