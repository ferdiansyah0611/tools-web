<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button type="button" @click="count++">count is {{ count }}</button>
</template>

<style scoped></style>
