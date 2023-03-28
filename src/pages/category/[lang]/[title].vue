<script setup lang="ts">
import axios from 'axios'
import { T2S } from '~/utils'
import { postMetapediaCategory } from '~/requests'

const props = defineProps<{ title: string; lang: string }>()

const router = useRouter()

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
const entityList = ref<any>([])
const categoryQueryTitle = ref('')
const pageLoading = ref(false)
watchEffect(() => {
  postMetapediaCategory(props.title.replaceAll(' ', '_'), props.lang).then((response) => {
    if (response.data.ok === false)
      router.push('/404')
    PageObject.value = response.data.data
    categoryQueryTitle.value = ConvertTitle(PageObject.value.title)
    entityList.value = PageObject.value.entity
  })
})
const pageChange = async (pageNumber: number) => {
  pageLoading.value = true
  const response = await axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/category_page', {
    title: props.title.replaceAll(' ', '_'),
    lang: props.lang,
    page: pageNumber,
  })
  entityList.value = response.data.data.entity
  pageLoading.value = false
}
</script>

<template>
  <div>
    <div>
      <p v-if="PageObject?.title !== undefined " text-4xl>
        {{ ConvertTitle(PageObject?.title) }}
      </p>
    </div>

    <CategoryShortestPath v-if="categoryQueryTitle !== '' " :model-value="{ lang: props.lang, title: categoryQueryTitle }" />

    <el-row>
      <p>tree view</p>
    </el-row>
    <el-row>
      <TheRelation v-if="props.title" :model-value="props" />
    </el-row>
    <div v-if="PageObject?.in?.[0] !== undefined" mt-5>
      <span>parent class({{ PageObject?.in.length }})</span>
      <el-tag
        v-for="item in PageObject?.in" :key="item"
        mb-1 ml-1
        @click="router.push(`/category/${PageObject.lang}/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
    </div>

    <div v-if="PageObject?.out?.[0] !== undefined" mt-2>
      <span>child class({{ PageObject?.out.length }})</span>
      <el-tag
        v-for="item in PageObject?.out" :key="item"
        mb-1
        ml-1 @click="router.push(`/category/${PageObject.lang}/${item}`)"
      >
        {{ T2S(item) }}
      </el-tag>
    </div>

    <div v-if="PageObject?.entity_total !== undefined" mt-5>
      <el-row>
        <span>entity({{ PageObject?.entity_total }})</span>
      </el-row>
      <el-row v-loading="pageLoading">
        <el-tag
          v-for="item in entityList"
          :key="item" mb-1
          ml-1 size="large"
          @click="router.push(`/wiki/${PageObject.lang}/${item}`)"
        >
          {{ T2S(item) }}
        </el-tag>
      </el-row>
      <el-row>
        <el-pagination
          ma-a
          small
          background
          layout="prev, pager, next"
          :page-size="PageObject?.page_size"
          :total="Math.min(PageObject?.entity_total - PageObject?.page_size, 100 * PageObject?.page_size)"
          @current-change="pageChange"
        />
      </el-row>
    </div>
  </div>
</template>

<style>

</style>

<route lang="yaml">
meta:
  layout: wiki
</route>
