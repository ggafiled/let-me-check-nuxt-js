<template>
  <div class="h-100">
    <v-app-bar color="primary" dense dark>
      <v-toolbar-title>ร้านค้าของฉัน</v-toolbar-title>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-title text-left">
            เช็คอินล่าสุด
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      class="pt-0 pb-0 h-100"
      :class="!getThaichana.myshop.length ? 'fill-height' : ''"
    >
      <v-row v-if="!getThaichana.myshop.length">
        <v-col cols="12">
          <div class="text-center">
            <p>
              ร่วมรณรงค์
              <span class="text-primary text-bold">เช็คอิน</span>
              ทุกครั้งเมื่อเข้ารับบริการ
            </p>
            <p>
              และ
              <span class="text-primary text-bold">เช็คเอ้าท์</span>
              เมื่อออกจากสถานที่หรือร้านค้า
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-list three-line>
          <template v-for="(item, index) in getThaichana.myshop">
            <v-list-item :key="index">
              <v-list-item-content>
                <v-list-item-title v-html="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-form>
            <v-btn
              rounded
              color="primary"
              dark
              class="w-100 text-bold"
              @click="scanToAddShop()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#FFFFFF"
              >
                <rect fill="none" height="24" width="24" />
                <path
                  d="M9.5,6.5v3h-3v-3H9.5 M11,5H5v6h6V5L11,5z M9.5,14.5v3h-3v-3H9.5 M11,13H5v6h6V13L11,13z M17.5,6.5v3h-3v-3H17.5 M19,5h-6v6 h6V5L19,5z M13,13h1.5v1.5H13V13z M14.5,14.5H16V16h-1.5V14.5z M16,13h1.5v1.5H16V13z M13,16h1.5v1.5H13V16z M14.5,17.5H16V19h-1.5 V17.5z M16,16h1.5v1.5H16V16z M17.5,14.5H19V16h-1.5V14.5z M17.5,17.5H19V19h-1.5V17.5z M22,7h-2V4h-3V2h5V7z M22,22v-5h-2v3h-3v2 H22z M2,22h5v-2H4v-3H2V22z M2,2v5h2V4h3V2H2z"
                />
              </svg>
              สแกน QR</v-btn
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
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  // middleware: ["IsAuthenticated"],
  data() {
    return {
      errorMsg: ""
    };
  },
  watch: {
    getThaichana() {
      return this.$store.getters.getThaichana;
    }
  },
  methods: {
    extractUriParams(uri) {
      let params = (
        uri.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []
      ).reduce(function(result, each, n, every) {
        let [key, value] = each.split("=");
        result[key] = value;
        return result;
      }, {});
      return params;
    },
    scanToAddShop() {
      try {
        var vm = this;
        liff.scanCode().then(result => {
          var { appId, shopId } = vm.extractUriParams(result.value);
          if (appId.trim() == "" || shopId.trim() == "") {
            vm.$store.dispatch("setDialog", {
              isShow: true,
              title: "Form error",
              message: "Incorrect shop format on thaichana platform."
            });
          } else {
            const {
              shopName,
              subcategory,
              businessType,
              canCheckin,
              status
            } = vm.$store.dispatch("getThaichanaShopNameByToken", {
              appId: appId,
              shopId: shopId
            });

            vm.$store.dispatch("setThaichanaShop", {
              appId: appId,
              shopId: shopId,
              title: shopName,
              subcategory: subcategory,
              businessType: businessType,
              canCheckin: canCheckin,
              status: status
            });

            vm.$store.dispatch("getThaichana");

            vm.$store.dispatch("setDialog", {
              isShow: true,
              title: "Success",
              message: `ระบบได้ทำการบันทึกร้านค้า ${shopName} ให้แล้วค่ะ`
            });
          }
        });
      } catch (e) {
        this.$store.dispatch("setDialog", {
          isShow: true,
          title: "Liff module error",
          message: "Can't open camera. seems liff library has problem."
        });
      }
    },
    close() {
      liff.closeWindow();
    }
  },
  created() {
    if (!this.$auth.$storage.getLocalStorage("authenticated")) {
      this.$router.push("/register");
    }
  },
  mounted() {
    this.$store.dispatch("getThaichana");
  },
  head() {
    return {
      title: "My Shop"
    };
  }
};
</script>

<style lang="scss" scoped>
.v-form {
  padding: 0 10px;
}
.v-btn__content {
  svg {
    margin-right: 10px;
  }
}
</style>
