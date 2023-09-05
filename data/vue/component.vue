<template>
  <div>
    <p>this is $name component</p>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "$name",
  props: [],
  data() {
    return {};
  },
  mounted() {},
  unmounted() {},
  methods: {
    ...mapActions([]),
    ...mapMutations([]),
  },
  computed: {},
  watch: {},

  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
};
</script>
<style></style>
