<script lang="ts" setup>
import type { MermaidConfig } from 'mermaid'
import mermaid from 'mermaid'
import { customAlphabet } from 'nanoid'

import { useVModel } from '@vueuse/core'
const props = defineProps<{
  modelValue: string
  options: MermaidConfig
}>()

const emit = defineEmits(['update:modelValue'])

const nanoid = customAlphabet('abcdefghijk', 4)

const modelValue = useVModel(props, 'modelValue', emit)
const svgHtml = ref('')
const mermaidId = nanoid()

const update = async () => {
  // console.log('value update', modelValue.value)
  // mermaid.run({
  //   querySelector: `#${mermaidId}`,
  //   // suppressErrors: true,
  // })
  const { svg } = await mermaid.render(mermaidId, modelValue.value)
  svgHtml.value = svg
  // mermaid.render(mermaidId, modelValue.value)
}

onMounted(() => {
  mermaid.initialize({
    theme: 'default',
    securityLevel: 'loose',
    startOnLoad: false,
    ...props.options,
  })
  update()
})

watch(modelValue, () => {
  update()
})
</script>

<template>
  <div v-html="svgHtml" />
  <!-- {{ modelValue }} -->
</template>
