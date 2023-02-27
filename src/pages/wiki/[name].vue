<script setup lang="ts">
const props = defineProps<{ name: string }>()
const user = useUserStore()
const { t } = useI18n()

watchEffect(() => {
  user.setNewName(props.name)
})
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-pedestrian inline-block />
    </div>
    <div id="testID">
      ccwzz
    </div>
    <p>
      {{ t('intro.hi', { name: props.name }) }}
    </p>

    <p text-sm opacity-75>
      <em>{{ t('intro.dynamic-route') }}</em>
    </p>
    <iframe id="iframe" :src="`https://baike.baidu.com/item/${user.wikiPageInfo.title}`" style="height: 600px" width="100%" frameborder="0" />
  </div>
</template>

<style>
#testID {
    display: none;
}
</style>
