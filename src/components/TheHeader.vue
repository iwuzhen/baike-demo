<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <nav flex>
    <div inline-block ml-0>
      <img
        src="/metapedia-head.svg" alt="metapedia" w-40 ma-auto ma-a @click="
          router.push('/')"
      >
    </div>
    <div flex-grow />
    <TheSearch w-xs mr-0 />
  </nav>
</template>

<style scoped>
nav {
    width: 100%;
}
</style>
