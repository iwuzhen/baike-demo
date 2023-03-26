<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { MermaidConfig } from 'mermaid'
import mermaid from 'mermaid'
import { customAlphabet } from 'nanoid'

import { useVModel } from '@vueuse/core'
const props = defineProps<{
  modelValue: string
  options: MermaidConfig
}>()

const emit = defineEmits(['update:modelValue', 'parseError', 'nodeClick'])

const nanoid = customAlphabet('abcdefghijk', 4)

const modelValue = useVModel(props, 'modelValue', emit)

const memaidId = ref(nanoid())

onMounted(() => {
  mermaid.initialize({
    startOnLoad: true,
  })
  mermaid.run({
    querySelector: `#${memaidId.value}`,
  })
})
</script>

<template>
  <pre :id="memaidId">
    {{ modelValue }}
  </pre>
  <!-- {{ modelValue }} -->
</template>
