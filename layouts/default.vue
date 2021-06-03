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
  },
  methods: {
    runApp() {
      liff
        .getProfile()
        .then(profile => {
          console.log(profile);
          this.$store.dispatch("setLineProfile", profile);
          this.$store.dispatch("checkIsRegisted");
        })
        .catch(err => console.error(err));
    }
  },
  mounted() {
    liff.init(
      { liffId: "1656052121-D7zQjejk" },
      () => {
        if (liff.isLoggedIn()) {
          this.runApp();
        } else {
          liff.login();
        }
      },
      err => console.error(err.code, error.message)
    );
  },
  beforeCreate() {
    this.$store.commit("initialiseStore");
  }
};
</script>

<style lang="scss">
* {
  font-family: "Quicksand", "Athiti", sans-serif;
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
.h-100 {
  height: 100% !important;
}
.text-bold {
  font-weight: bold;
}
</style>
