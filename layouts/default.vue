<template>
  <v-app>
    <nuxt />
    <Dialog />
    <vue-confirm-dialog></vue-confirm-dialog>
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
        .then(async profile => {
          console.log(profile);
          await this.$store.dispatch("initialiseStore");
          await this.$store.dispatch("setLineProfile", profile);
          await this.$store.dispatch("checkIsRegisted");
        })
        .catch(err => console.error(err));
    }
  },
  mounted() {
    liff.init(
      { liffId: "1656069795-m40pLPAy" },
      () => {
        if (liff.isLoggedIn()) {
          this.runApp();
        } else {
          liff.login();
        }
      },
      err => console.error(err.code, error.message)
    );
    this.$store.dispatch("checkIsRegisted");
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
