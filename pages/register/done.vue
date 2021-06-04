<template>
  <div>
    <v-app-bar color="primary" dense dark>
      <v-toolbar-title>Register</v-toolbar-title>
    </v-app-bar>
    <v-container class="pt-0 pb-0">
      <v-row>
        <v-col cols="12">
          <div class="text-center p-0 m-0">
            <img src="~/assets/done.jpg" alt="" srcset="" width="350" />
          </div>
        </v-col>
        <v-col cols="12">
          <div class="p-0 m-0 mt-2 text-title text-center text-bold">
            ยินดีต้อนรับ, {{ getProfile.displayName }}
          </div>
          <div class="text-center">
            "Let Me Check" แชทบอทพร้อมเช็คอินให้คุณแล้วค่ะ
            มาเพิ่มสถานที่เพื่อเริ่มกันได้เลยค่ะ.
          </div>
        </v-col>
        <v-col cols="12">
          <v-btn
            rounded
            color="primary"
            dark
            class="w-100 text-bold"
            @click="addShop()"
            >Add Shop to Scan</v-btn
          >
          <v-btn
            rounded
            color="primary"
            dark
            outlined
            class="w-100 mt-2 text-bold"
            @click="close()"
            >Close</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  // middleware: ["RedirectToShop"],
  data() {
    return {};
  },
  computed: {
    getProfile() {
      return this.$store.getters.getProfile;
    }
  },
  methods: {
    close() {
      liff.closeWindow();
    },
    addShop() {
      this.$router.push("/myshop");
    }
  },
  mounted() {
    if (this.$auth.$storage.getLocalStorage("authenticated")) {
      return redirect("/myshop");
    }
  }
};
</script>

<style lang="scss" scoped>
.v-form {
  padding: 0 10px;
}
</style>
