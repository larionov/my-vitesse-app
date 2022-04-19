<script setup>
import { useHead } from '@vueuse/head';
import { useRouter, useRoute } from 'vue-router';
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [{ name: 'description', content: 'Opinionated Vite Starter Template' }],
});
console.log(useRoute());
</script>

<template>
  <RouterView />
</template>
