<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Metapedia',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      // content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
      content: '#00aba9',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      // href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
