<script setup lang="ts">
import axios from 'axios'
const user = useUserStore()
const queryString = $ref(user.queryString)

const suggestion = ref<any>([])

const router = useRouter()
const handleSelect = (item: any) => {
  user.wikiPageInfo = item
  if (queryString)
    router.push(`/wiki/${item.lang}/${item.title}`)
}

const handleEnter = () => {
  if (suggestion.value?.length > 0)
    handleSelect(suggestion.value[0])
}

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  suggestion.value = []
  if (queryString.length < 1)
    return

  axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/query', {
    query: queryString,
    namespace: 0,
    lang: 'zh',
  }).then((response) => {
    suggestion.value = response.data.data
    cb(response.data.data)
  })
}
</script>

<template>
  <el-autocomplete
    ref="autocompleteRef"
    v-model="queryString"
    :fetch-suggestions="querySearchAsync"
    clearable
    placeholder="Search"
    value-key="title"
    popper-class="my-autocomplete"
    @select="handleSelect"
    @keyup.enter="handleEnter"
  >
    <template #suffix>
      <div i-carbon-search />
    </template>
    <template #default="{ item }">
      <div>
        <div v-if="item.images" float-left class="thumb-img" :style="`background-image:url(//wsrv.nl/?url=${item.images.url}&w=70&h=69)'`">
          <img :src="`//wsrv.nl/?url=${item.images.url}&w=70&h=69`" alt="">
        </div>
        <div v-else float-left class="thumb" />
        <div float-right>
          {{ item.lang }}
        </div>
      </div>
      <div text-align>
        {{ item.title }}
      </div>
      <div v-if="item.redirect">
        redirect to {{ item.redirect }}
      </div>

      <!-- <span class="link">{{ item.link }}</span> -->
    </template>
  </el-autocomplete>
  <!-- <label for="search">
    Type the name of a country to search
  </label> -->
  <!-- <input id="search" v-model="searchTerm" type="text" placeholder="Type here..."> -->
</template>

<style>
.thumb {
  width: 70px;
  height: 69px;
  background-image: -webkit-linear-gradient(transparent,transparent),url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'%3E%3Cpath fill='%23eee' d='M0 0h56v56H0z'/%3E%3Cpath fill='%23999' d='M36.4 13.5H17.8v24.9c0 1.4.9 2.3 2.3 2.3h18.7v-25c.1-1.4-1-2.2-2.4-2.2zM30.2 17h5.1v6.4h-5.1V17zm-8.8 0h6v1.8h-6V17zm0 4.6h6v1.8h-6v-1.8zm0 15.5v-1.8h13.8v1.8H21.4zm13.8-4.5H21.4v-1.8h13.8v1.8zm0-4.7H21.4v-1.8h13.8v1.8z'/%3E%3C/svg%3E");
  }
.thumb-img {
  width: 70px;
  height: 69px;
}

.el-autocomplete-suggestion li{
  padding-left: 0 !important;
  padding-top: 0;
}
</style>
