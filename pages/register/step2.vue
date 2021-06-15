<template>
  <div>
    <v-app-bar color="primary" dense dark>
      <v-toolbar-title>Register</v-toolbar-title>
    </v-app-bar>
    <v-container class="pt-0 pb-0">
      <v-row>
        <v-col cols="12">
          <div class="mt-8 text-primary text-title text-center">
            Step 2 of 2
          </div>
        </v-col>
        <v-col cols="12">
          <v-form>
            <p class="text-center text-title mb-0">Setup more a bit...</p>
            <v-text-field
              v-model="form.email"
              label="Email"
              autocomplete="off"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.mobileNumber"
              label="Mobile Number"
              autocomplete="off"
              :rules="mobileNumberRules"
              required
              @keypress="isNumber($event)"
            ></v-text-field>
            <p class="text-center text-title p-0 mb-0">Work Profile</p>
            <v-text-field
              v-model="form.position"
              label="Position"
              autocomplete="off"
            ></v-text-field>
            <v-btn
              rounded
              color="primary"
              dark
              class="w-100 mt-8 text-bold"
              @click="next()"
              >Next</v-btn
            >
            <div
              class="w-100 text-center my-btn text-primary mt-4 text-bold"
              @click="back()"
            >
              Back
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  // middleware: ["RedirectToShop"],
  data() {
    return {
      errorMsg: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail must be valid"
      ],
      mobileNumberRules: [
        v => !!v || "Mobile Number is required",
        v => /0[0-9]{8,9}$/i.test(v) || "Mobile Number must be valid"
      ]
    };
  },
  computed: {
    form() {
      return this.$store.getters.getRegister;
    }
  },
  methods: {
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    validate() {
      let valid = true;
      var errors = [];
      const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const mobileNumberFormat = /0[0-9]{8,9}$/i;
      const validatorFields = ["email", "mobileNumber"];
      validatorFields.forEach(field => {
        if (this.form[field] == "") {
          valid = false;
          errors.push(`${field} can not be null`);
        }
      });

      if (!emailFormat.test(String(this.form["email"]).toLowerCase())) {
        valid = false;
        errors.push(`Email format incorrect`);
      }

      if (
        !mobileNumberFormat.test(
          String(this.form["mobileNumber"]).toLowerCase()
        )
      ) {
        valid = false;
        errors.push(`Mobile Number format incorrect`);
      }

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
    async next() {
      if (this.validate()) {
        this.$store.dispatch("setRegister", this.form);
        this.$store.dispatch("saveRegister", {
          ...this.$store.getters.getRegister,
          ...this.$store.getters.getProfile
        });
        this.$router.push("/register/done");
      }
    },
    back() {
      this.$router.push("/register");
    }
  },
  created() {
    if (this.$auth.$storage.getLocalStorage("authenticated")) {
      this.$router.push("/myshop");
    }
  },
  head() {
    return {
      title: "Register Profile"
    };
  }
};
</script>

<style lang="scss" scoped>
.v-form {
  padding: 0 10px;
}
.my-btn {
}
</style>
