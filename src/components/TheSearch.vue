<script setup lang="ts">
import axios from 'axios'
const user = useUserStore()
const queryString = $ref(user.queryString)

const router = useRouter()
const handleSelect = (item: any) => {
  user.wikiPageInfo = item
  if (queryString)
    router.push(`/wiki/${item.lang}/${item.id}`)
}

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  if (queryString.length < 1)
    return

  axios.post('https://api.nikepai.com:10444/v/2.0/baike_demo/query', {
    query: queryString,
    namespace: 0,
    lang: 'zh',
  }).then((response) => {
    cb(response.data.data)
  })
}

// const searchTerm = ref('')
</script>

<template>
  <el-autocomplete
    v-model="queryString"
    :fetch-suggestions="querySearchAsync"
    clearable
    placeholder="Search"
    value-key="title"
    @select="handleSelect"
  >
    <template #suffix>
      <div i-carbon-search />
    </template>
    <template #default="{ item }">
      <div text-align>
        <div float-right>
          {{ item.lang }}
        </div>
        {{ item.title }}
      </div>
      <!-- <span class="link">{{ item.link }}</span> -->
    </template>
  </el-autocomplete>
  <!-- <label for="search">
    Type the name of a country to search
  </label> -->
  <!-- <input id="search" v-model="searchTerm" type="text" placeholder="Type here..."> -->
</template>
