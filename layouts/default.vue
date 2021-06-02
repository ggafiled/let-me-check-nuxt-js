<template>
  <v-app>
    <nuxt />
    <Dialog />
  </v-app>
</template>

<script>
import Dialog from "~/components/Dialog";
export default {
  components: { Dialog },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
* {
  font-family: "Quicksand", sans-serif;
}
.v-toolbar__title {
  text-align: center;
  width: 100%;
}
.v-application .primary {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
  font-family: "Quicksand" !important;
  font-weight: bold;
}
.text-primary {
  color: #1976d2;
}
.text-title {
  font-size: 20px;
  font-weight: bold;
}
.w-100 {
  width: 100%;
}
</style>
