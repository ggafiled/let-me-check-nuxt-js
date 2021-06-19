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
      :class="getThaichana.myshop.length <= 0 ? 'fill-height' : ''"
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
            <p>
              <span class="text-primary text-bold"
                >เพิ่มร้านค้าได้สูงสุด 3 รายการ</span
              >
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-list class="w-100">
          <v-list-item
            :key="index"
            v-for="(item, index) in getThaichana.myshop"
          >
            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
            </v-list-item-content>

            <v-switch
              :input-value="item.canAutoCheckinOut"
              label="AUTO"
              color="primary"
              class="mr-4"
              @change="changeAutoChecInOutState(item)"
            ></v-switch>
            <button
              v-show="!item.isCheckIn"
              @click="checkInThaichana(item)"
              class="mr-4"
            >
              <v-icon color="grey lighten-1">mdi-timeline-check-outline</v-icon>
            </button>
            <button
              v-show="item.isCheckIn"
              @click="checkOutThaichana(item)"
              class="mr-4"
            >
              <v-icon color="grey lighten-1">mdi-exit-to-app</v-icon>
            </button>
            <button @click="removeShop(item)">
              <v-icon color="grey lighten-1">mdi-trash-can-outline</v-icon>
            </button>
          </v-list-item>
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
  computed: {
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
    async checkInThaichana(item) {
      item.mode = "CI";
      this.$confirm({
        title: "ยืนยันเช็คอิน",
        message: `คุณต้องการเช็คอินร้านค้า 💡${item.title} หรือไม่`,
        button: {
          yes: "ยืนยัน",
          no: "ยกเลิก"
        },
        /**
         * Callback Function
         * @param {Boolean} confirm
         */
        callback: async confirm => {
          if (confirm) {
            item.mobileNumber =
              this.$store.getters.getRegister.mobileNumber ||
              "0" + Math.floor(Math.random() * 900000000) + 100000000;
            console.log(item);
            const isAlreadyCheckin = await this.$store.dispatch(
              "checkIsAlreadyCheckin",
              item
            );

            if (!isAlreadyCheckin.data().isCheckIn) {
              await this.$store
                .dispatch("checkInThaichana", item)
                .then(async response => {
                  console.log(response);
                  if (response.message === "ok") {
                    await this.$store.dispatch(
                      "changeShopStatusToCheckin",
                      item
                    );
                    await this.$store
                      .dispatch("pushMessageToLine", item)
                      .then(async data => {
                        if (data.message === "ok") {
                          this.$confirm({
                            title: "แจ้งเตือน",
                            message: `ระบบได้ทำการเช็คอินร้านค้า ${item.title} ให้คุณแล้วค่ะ`,
                            button: {
                              yes: "รับทราบ"
                            }
                          });
                          await this.$store.dispatch("getThaichana");
                        } else {
                          this.$confirm({
                            title: "มีบางอย่างผิดพลาด",
                            message:
                              "ขออภัยค่ะ มีบางอย่างผิดพลาดไม่สามารถเช็คอินได้ กรุณาลองใหม่อีกครั้ง",
                            button: {
                              yes: "รับทราบ"
                            }
                          });
                        }
                      });
                  }
                });
            } else {
              this.$confirm({
                title: "ก่อนหน้านี้คุณได้ทำการ เช็คอิน ร้านค้านี้แล้ว",
                message:
                  "หากต้องการเช็คอินใหม่ กรุณาเช็คเอาท์ออกจากร้านค้าก่อนค่ะ",
                button: {
                  yes: "รับทราบ"
                }
              });
            }
          }
        }
      });
    },
    async checkOutThaichana(item) {
      item.mode = "CO";
      this.$confirm({
        title: "ต้องการเช็คเอาท์ใช่หรือไม่?",
        message: `คุณต้องการเช็คเอาท์ร้านค้า 💡${item.title} หรือไม่`,
        button: {
          yes: "ยืนยัน",
          no: "ยกเลิก"
        },
        /**
         * Callback Function
         * @param {Boolean} confirm
         */
        callback: async confirm => {
          if (confirm) {
            const isAlreadyCheckin = await this.$store.dispatch(
              "checkIsAlreadyCheckin",
              item
            );
            console.log(isAlreadyCheckin);
            if (isAlreadyCheckin.data().isCheckIn) {
              await this.$store
                .dispatch("checkOutThaichana", item)
                .then(async response => {
                  console.log(response);
                  if (response.message === "ok") {
                    await this.$store.dispatch(
                      "changeShopStatusToCheckout",
                      item
                    );
                    await this.$store
                      .dispatch("pushMessageToLine", item)
                      .then(async data => {
                        if (data.message === "ok") {
                          this.$confirm({
                            title: "แจ้งเตือน",
                            message: `ระบบได้ทำการเช็คเอาท์ร้านค้า ${item.title} ให้คุณแล้วค่ะ`,
                            button: {
                              yes: "รับทราบ"
                            }
                          });
                          await this.$store.dispatch("getThaichana");
                        } else {
                          this.$confirm({
                            title: "มีบางอย่างผิดพลาด",
                            message:
                              "ขออภัยค่ะ มีบางอย่างผิดพลาดไม่สามารถเช็คเอาท์ได้ กรุณาลองใหม่อีกครั้ง",
                            button: {
                              yes: "รับทราบ"
                            }
                          });
                        }
                      });
                  }
                });
            } else {
              console.log("Can't checkout");
            }
          }
        }
      });
    },
    async removeShop(item) {
      try {
        this.$confirm({
          title: "ลบข้อมูล",
          message: `คุณต้องการลบ ${item.title} หรือไม่`,
          button: {
            yes: "ลบ",
            no: "ยกเลิก"
          },
          /**
           * Callback Function
           * @param {Boolean} confirm
           */
          callback: async confirm => {
            if (confirm) {
              await this.$store.dispatch("removeShop", item);
              await this.$store.dispatch("getThaichana");
            }
          }
        });
      } catch (e) {
        this.$store.dispatch("setDialog", {
          isShow: true,
          title: "Error",
          message: e.message
        });
      }
    },
    scanToAddShop() {
      try {
        var vm = this;
        liff.scanCode().then(async result => {
          var { appId, shopId } = await vm.extractUriParams(result.value);
          if (!appId.length || !shopId.length) {
            vm.$store.dispatch("setDialog", {
              isShow: true,
              title: "ข้อมูลร้านค้าผิดพลาด",
              message: "ดูเหมือนว่าข้อมูลที่ระบบอ่านได้ไม่ถูกต้องตามรูปแบบ."
            });
          } else {
            const {
              shopName,
              subcategory,
              businessType,
              canCheckin,
              status
            } = await vm.$store.dispatch("getThaichanaShopNameByToken", {
              appId: appId,
              shopId: shopId
            });

            await vm.$store.dispatch("setThaichanaShop", {
              userId: this.$store.getters.getProfile.userId,
              appId: appId,
              shopId: shopId,
              title: shopName,
              subcategory: subcategory,
              businessType: businessType,
              canCheckin: canCheckin,
              status: status,
              isCheckIn: false,
              canAutoCheckinOut: false
            });

            vm.$store.dispatch("getThaichana");

            vm.$forceUpdate();
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
    },
    async changeAutoChecInOutState(item) {
      await this.$store.dispatch("changeAutoModeState", item);
      await this.$store.dispatch("getThaichana");
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
