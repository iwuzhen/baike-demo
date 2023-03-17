<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node'
import { T2S } from '~/utils'
import { postMetapediaCategory } from '~/requests'

interface Tree {
  title?: string
  parentTitle?: string
  label?: string
  leaf?: boolean
}

interface Category {
  title: string
  lang: string
}

const { modelValue } = defineModel<{
  modelValue: Category
}>()

const DataParent = new Map<string, string[]>()
const DataChild = new Map<string, string[]>()

const getData = async (args: Category) => {
  const response = await postMetapediaCategory(args.title, args.lang)
  if (response.data.ok === false)
    return
  DataParent.set(args.title, response.data.data.in || [])
  DataChild.set(args.title, response.data.data.out || [])
}

const customNodeClass = (data: Tree, node: Node) => {
  if (data.label!.startsWith('parent'))
    return 'tag-parent'

  else if (data.label!.startsWith('child'))
    return 'tag-child'

  return ''
}

const props = {
  label: 'label',
  children: 'zones',
  isLeaf: 'leaf',
  class: customNodeClass,
}

const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    getData(modelValue.value).then(() => {
      return resolve([{
        label: T2S(modelValue.value.title),
        title: modelValue.value.title,
      }])
    })
  }
  else {
    if (node.data.title) {
      if (!DataParent.get(node.data.title))
        await getData({ title: node.data.title, lang: modelValue.value.lang })

      return resolve([
        {
          label: `parent(${DataParent.get(node.data.title)!.length})`,
          parentTitle: node.data.title,
          leaf: DataParent.get(node.data.title)!.length === 0,
        },
        {
          label: `child(${DataChild.get(node.data.title)!.length})`,
          parentTitle: node.data.title,
          leaf: DataChild.get(node.data.title)!.length === 0,
        },
      ])
    }
    else {
      let dataSet
      if (node.label.startsWith('parent'))
        dataSet = DataParent

      else dataSet = DataChild
      return resolve(dataSet.get(node.data.parentTitle)!.map((item) => {
        return {
          label: T2S(item),
          title: item,
        }
      }))
    }
  }
}

const flashFlag = ref(true)
onMounted(() => {
  watchEffect(() => {
    if (modelValue.value?.title) {
      flashFlag.value = false
      setTimeout(() => [
        flashFlag.value = true,
      ], 100)
    }
  })
})
</script>

<template>
  <el-tree v-if="flashFlag" :props="props" :load="loadNode" lazy />
</template>

<style>
.tag-parent  > .el-tree-node__content{
    color:deepskyblue
}
.tag-child  > .el-tree-node__content{
    color: rgb(21, 72, 240);
}
</style>
