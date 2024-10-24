<script setup lang="ts">
import axios from 'axios'
import zhConvertor from 'zhconvertor'
import type { SearchResultModule } from '~/types'
const props = defineProps<{ name: string; lang: string }>()
const user = useUserStore()
const router = useRouter()

const activeName = ref('second')
const activeNames = ref(['1', '2', '3'])

const docItem = ref<SearchResultModule>()
const PageDetail = ref<any>({})

const baikeKey = computedAsync(async () => {
  if (docItem.value?.title !== undefined) {
    const titleSet = new Set<string>()
    const titles = [docItem.value.title]

    if (!!docItem.value?.zh_title && !titleSet.has(docItem.value?.zh_title)) {
      titles.push(docItem.value?.zh_title)
      titleSet.add(docItem.value.zh_title)
    }

    if (docItem.value?.zh_redirect?.[0]) {
      for (const subTitle of docItem.value?.zh_redirect) {
        if (!titleSet.has(subTitle)) {
          titles.push(subTitle)
          titleSet.add(subTitle)
        }
      }
    }
    if (!!docItem.value?.en_title && !titleSet.has(docItem.value?.en_title)) {
      titles.push(docItem.value?.en_title)
      titleSet.add(docItem.value.en_title)
    }

    if (docItem.value?.en_redirect?.[0]) {
      for (const subTitle of docItem.value?.en_redirect) {
        if (!titleSet.has(subTitle)) {
          titles.push(subTitle)
          titleSet.add(subTitle)
        }
      }
    }

    const response = await axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/baidu_baike', {
      title: titles,
    })

    if (response.data.ok)
      return response.data.data.baidu.title

    const failTitle = []
    for (const title of response.data.data.title) {
      const response = await axios.get(`https://api.nikepai.com:10444/cors/v1/baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_length=600&bk_key=${title}`)
      try {
        if (Object.keys(response.data).length === 0) {
          await axios.put('https://api.nikepai.com:10444/v/2.0/metapedia/v1/baidu_baike', {
            title: [title],
          })
        }
        // failTitle.push(title)
      }
      catch (error) {
      }
      if (response.data.error !== undefined) {
        failTitle.push(title)
      }
      else if (response.data?.title !== undefined) {
        const data = response.data
        axios.put('https://api.nikepai.com:10444/v/2.0/metapedia/v1/baidu_baike', {
          title: failTitle,
          baidu_title: title,
          data,
        })
        return data.title
      }
    }
    axios.put('https://api.nikepai.com:10444/v/2.0/metapedia/v1/baidu_baike', {
      title: failTitle,
    })
    return ''
  }
  return ''
})

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

const htmlStr = computed(() => {
  if (PageDetail.value?.links?.internal) {
    const plaintext = PageDetail.value?.plaintext.replace(/\n/g, '<br>').replace('（）', '').replace('()', '')
    const links = PageDetail.value?.links?.internal.sort((a: any, b: any) => {
      if (!b.text)
        return -1
      if (!a.text)
        return 1

      return b.text.length - a.text.length
    })
    // initialize array of highlighted ranges
    const ranges: any[] = []

    // loop through words and highlight non-overlapping ones
    for (const linkItem of links) {
      const mtStr = linkItem.text || linkItem.page
      let startIndex = 0
      while (startIndex >= 0) {
        startIndex = plaintext.indexOf(mtStr, startIndex)
        if (startIndex >= 0) {
          const endIndex = startIndex + mtStr.length
          if (!ranges.some(range => startIndex < range.end && endIndex > range.start))
            ranges.push({ start: startIndex, end: endIndex, linkItem })

          startIndex = endIndex
        }
      }
    }

    // sort ranges by start position (ascending)
    ranges.sort((a, b) => a.start - b.start)

    // build HTML with highlighted spans
    let result = ''
    let lastIndex = 0
    for (const range of ranges) {
      result += plaintext.substring(lastIndex, range.start)
      // result += `<span class="highlight">${plaintext.substring(range.start, range.end)}</span>`
      result += `<a href="/wiki/${props.lang}/${range.linkItem.page}">${plaintext.substring(range.start, range.end)}</a>`
      lastIndex = range.end
    }
    result += plaintext.substring(lastIndex)
    return result

    // console.log(links)
    // for (const linkItem of links) {
    //   if (linkItem.text)
    //     plaintext = plaintext.replaceAll(T2S(linkItem.text), `<a href="/wiki/${props.lang}/${linkItem.page}">${T2S(linkItem.text)}</a>`)
    //   else if (linkItem.page)
    //     plaintext = plaintext.replaceAll(T2S(linkItem.page), `<a href="/wiki/${props.lang}/${linkItem.page}">${T2S(linkItem.page)}</a>`)
    // }
    // // console.log(links)
    // return plaintext
  }
  return ''
})

const currentIndex = ref(0)
const currentImage = computed(() => {
  if (PageDetail.value?.images?.[currentIndex.value] !== undefined)
    return `//wsrv.nl/?url=${PageDetail.value?.images[currentIndex.value]?.url}`
  return 'null'
})

const imgAlt = computed(() => {
  if (PageDetail.value?.images?.[currentIndex.value] !== undefined)
    return PageDetail.value?.images[currentIndex.value].caption
  return ''
})

function loadNextImage() {
  if (PageDetail?.images?.[currentIndex.value] !== undefined) {
    currentIndex.value++
    if (currentIndex.value < PageDetail.value?.images.length || 0) {
    // do something
    }
  }
}

watchEffect(() => {
  baikeKey.value = ''
  user.setNewName(props.name)
  axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/page', {
    title: props.name.replaceAll(' ', '_'),
    lang: props.lang,
  }).then((response) => {
    if (response.data.ok === false) {
      router.push('/404')
      return
    }
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
  <div class="content">
    <div>
      <p text-4xl>
        {{ ConvertTitle(docItem?.title) }}
      </p>
    </div>
    <div v-if="docItem?.redirect_from">
      (redirect from {{ ConvertTitle(docItem?.redirect_from) }} )
    </div>
    <div v-if="docItem?.lang === 'en' && docItem?.zh_title">
      (名字 {{ ConvertTitle(docItem?.zh_title) }} )
    </div>

    <el-collapse v-model="activeNames" text-left>
      <el-collapse-item v-if="docItem?.zh_redirect?.[0] !== undefined " :title="`其他名字(${docItem?.zh_redirect.length})`" name="1">
        <el-tag
          v-for="item in DuplicateRedirect(docItem?.zh_redirect)" :key="item"
          mb-1 ml-1
        >
          {{ item }}
        </el-tag>
      </el-collapse-item>
      <el-collapse-item v-if="docItem?.en_redirect?.[0] !== undefined " :title="`other name(${docItem?.en_redirect.length})`" name="2">
        <el-tag
          v-for="item in DuplicateRedirect(docItem?.en_redirect)" :key="item"
          mb-1 ml-1
        >
          {{ item }}
        </el-tag>
      </el-collapse-item>
      <el-collapse-item v-if="docItem?.en_category?.[0] !== undefined " :title="`category(${docItem?.en_category.length})`" name="3">
        <el-tag
          v-for="item in docItem?.en_category" :key="item"
          mb-1
          ml-1
          @click="router.push(`/category/en/${item}`)"
        >
          {{ T2S(item) }}
        </el-tag>
      </el-collapse-item>

      <el-collapse-item v-if="docItem?.zh_category?.[0] !== undefined " :title="`分类(${docItem?.zh_category.length})`" name="4">
        <el-tag
          v-for="item in docItem?.zh_category" :key="item"
          mb-1
          ml-1
          @click="router.push(`/category/zh/${item}`)"
        >
          {{ T2S(item) }}
        </el-tag>
      </el-collapse-item>
    </el-collapse>

    <el-tabs v-model="activeName" class="demo-tabs" style="max-width: 960px;" ma-a mt-5>
      <el-tab-pane label="wikipedia" name="first">
        <article flex-inline>
          <div text-left v-html="htmlStr" />
          <Transition name="slide-fade" :duration="550">
            <img v-if="PageDetail?.images?.[0] !== undefined" class="page-img" :src="currentImage" :alt="imgAlt" @error="loadNextImage">
          </Transition>
        </article>
      </el-tab-pane>
      <el-tab-pane label="百度百科" name="second" lazy>
        <iframe v-if="baikeKey !== ''" id="iframe" :src="`https://baike.baidu.com/item/${baikeKey}`" style="width: 1200px; height: 1000px;transform-origin: left top; transform: scale(0.8, 0.8)" frameborder="0" />
        <el-skeleton v-else :rows="10" animated />
      </el-tab-pane>
      <el-tab-pane label="互动百科" name="thread" lazy>
        <iframe v-if="baikeKey !== ''" id="iframe" :src="`https://www.hudong.com/search?keyword=${baikeKey}`" style="width: 1200px; height: 1000px;transform-origin: left top; transform: scale(0.8, 0.8)" frameborder="0" />
        <el-skeleton v-else :rows="10" animated />
      </el-tab-pane>
      <el-tab-pane label="360百科" name="fourth" lazy>
        <iframe v-if="baikeKey !== ''" id="iframe" :src="`https://baike.so.com/search/?q=${baikeKey}`" style="width: 1200px; height: 1000px;transform-origin: left top; transform: scale(0.8, 0.8)" frameborder="0" />
        <el-skeleton v-else :rows="10" animated />
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

.content{
  max-width: 960px;
  margin: auto;
}

.page-img {
  max-width: 18rem;
  height: 100%;
}
article {
  font-size: 0.938rem;
  line-height: 1.6;
}
article a {
  color: #0645ad; /* 设置文字颜色为黑色 */
  text-decoration: none; /* 去掉下划线 */
}

article a:hover, article a:focus {
  text-decoration:underline;
}
</style>

<route lang="yaml">
meta:
  layout: wiki
</route>
