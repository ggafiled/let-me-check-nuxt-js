<template>
  <div>
    <v-app-bar color="primary" dense dark>
      <v-toolbar-title>Register</v-toolbar-title>
    </v-app-bar>
    <v-container class="pt-0 pb-0">
      <v-row>
        <v-col cols="12">
          <div class="mt-8 text-primary text-title text-center">
            Step 1 of 2
          </div>
        </v-col>
        <v-col cols="12">
          <div class="text-center p-0">
            <img
              v-if="getProfile.pictureUrl"
              :src="getProfile.pictureUrl"
              alt=""
              srcset=""
              width="155"
              class="rounded-circle"
            />
            <img
              v-else
              src="~/assets/placeholder.jpg"
              alt=""
              srcset=""
              width="155"
              class="rounded-circle"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <div
            v-if="getProfile.displayName"
            class="p-0 text-center text-capitalize"
          >
            {{ getProfile.displayName }}
          </div>
          <div v-else class="p-0 text-center text-capitalize">
            Display name
          </div>
        </v-col>
        <v-col cols="12">
          <v-form>
            <v-text-field
              v-model="form.firstName"
              label="Firstname"
              autocomplete="off"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.lastName"
              label="Lastname"
              autocomplete="off"
              required
            ></v-text-field>
            <div class="gender-group d-flex">
              <p>Gender</p>
              <div
                class="circle"
                :class="form.gender == 1 ? 'active' : ''"
                @click="chooseGender(1)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xmlns:svgjs="http://svgjs.com/svgjs"
                  version="1.1"
                  width="21"
                  height="24"
                  x="0"
                  y="0"
                  viewBox="0 0 512 512"
                  style="enable-background:new 0 0 512 512"
                  xml:space="preserve"
                  class=""
                >
                  <g>
                    <g xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path
                          d="M376.264,290.173c66.314-66.293,66.314-174.16,0-240.453c-66.314-66.294-174.214-66.294-240.529,0    c-66.314,66.293-66.314,174.16,0,240.453c28.07,28.061,63.591,44.24,100.254,48.546v56.923h-40.018    c-11.051,0-20.009,8.956-20.009,20.003s8.958,20.003,20.009,20.003h40.018v56.348c0.001,11.047,8.959,20.003,20.011,20.003    c11.051,0,20.009-8.956,20.009-20.003v-56.348h40.019c11.051,0,20.009-8.956,20.009-20.003s-8.958-20.003-20.009-20.003h-40.019    V338.72C312.673,334.413,348.194,318.234,376.264,290.173z M164.033,261.884c-50.711-50.695-50.711-133.181,0-183.876    c50.71-50.693,133.221-50.696,183.934,0c50.711,50.695,50.711,133.181,0,183.876C297.256,312.578,214.744,312.578,164.033,261.884    z"
                          fill="#ffffff"
                          data-original="#000000"
                          style=""
                          class=""
                        />
                      </g>
                    </g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                    <g xmlns="http://www.w3.org/2000/svg"></g>
                  </g>
                </svg>
              </div>
              <p>Female</p>
              <div
                class="circle"
                :class="form.gender == 2 ? 'active' : ''"
                @click="chooseGender(2)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xmlns:svgjs="http://svgjs.com/svgjs"
                  version="1.1"
                  width="20"
                  height="20"
                  x="0"
                  y="0"
                  viewBox="0 0 384 384"
                  style="enable-background:new 0 0 512 512"
                  xml:space="preserve"
                >
                  <g>
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      d="m383.792969 13.9375c-.175781-1.378906-.480469-2.707031-.984375-3.953125-.015625-.03125-.015625-.074219-.023438-.113281 0-.007813-.007812-.015625-.015625-.023438-.554687-1.3125-1.3125-2.503906-2.167969-3.609375-.210937-.261719-.417968-.519531-.640624-.765625-.914063-1.03125-1.90625-1.984375-3.058594-2.761718-.03125-.023438-.070313-.03125-.101563-.054688-1.113281-.734375-2.34375-1.289062-3.632812-1.726562-.320313-.113282-.632813-.210938-.960938-.296876-1.351562-.367187-2.742187-.632812-4.207031-.632812h-112c-8.832031 0-16 7.167969-16 16s7.167969 16 16 16h73.367188l-95.496094 95.496094c-25.464844-20.367188-56.816406-31.496094-89.871094-31.496094-79.398438 0-144 64.601562-144 144s64.601562 144 144 144 144-64.601562 144-144c0-33.039062-11.121094-64.382812-31.503906-89.871094l95.503906-95.503906v73.375c0 8.832031 7.167969 16 16 16s16-7.167969 16-16v-112c0-.335938-.078125-.65625-.097656-.984375-.023438-.367187-.0625-.71875-.109375-1.078125zm-239.792969 338.0625c-61.761719 0-112-50.238281-112-112s50.238281-112 112-112c29.902344 0 58.054688 11.640625 79.222656 32.734375 21.136719 21.210937 32.777344 49.363281 32.777344 79.265625 0 61.761719-50.238281 112-112 112zm0 0"
                      fill="#ffffff"
                      data-original="#000000"
                      style=""
                    />
                  </g>
                </svg>
              </div>
              <p>Male</p>
            </div>
            <v-btn
              rounded
              color="primary"
              dark
              class="w-100 mt-8 text-bold"
              @click="next()"
              >Next</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMsg: ""
    };
  },
  methods: {
    chooseGender(gender) {
      this.form.gender = gender;
    },
    validate() {
      let valid = true;
      var errors = [];
      const validatorFields = ["firstName", "lastName", "gender"];
      validatorFields.forEach(field => {
        if (this.form[field] == "") {
          valid = false;
          errors.push(`${field} can not be null`);
        }
      });
      if (!valid) {
        this.errorMsg = errors.map(err => err).join("<br/>");
        this.$store.dispatch("setDialog", {
          isShow: true,
          title: "Form error",
          message: this.errorMsg
        });
      }
      console.log(this.errorMsg);
      return valid;
    },
    next() {
      if (this.validate()) {
        this.$store.dispatch("setRegister", this.form);
        this.$router.push("register/step2");
      }
    }
  },
  computed: {
    getProfile() {
      return this.$store.getters.getProfile;
    },
    form() {
      return this.$store.getters.getRegister;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-form {
  padding: 0 10px;
}
.gender-group {
  p {
    margin-bottom: 0px;
    margin-right: 20px;
    align-self: center;
  }

  p:not(:first-child) {
    margin-left: 8px;
  }
  .circle {
    width: 45px;
    height: 45px;
    color: #fff;
    position: relative;
    border-radius: 50%;
    background: rgba(#000, $alpha: 0.3);

    &.active {
      background: #1a56be;
    }

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
