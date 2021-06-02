<template>
  <v-dialog v-model="getDialog.isShow" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5">
        {{ getDialog.title }}
      </v-card-title>
      <v-card-text v-html="getDialog.message"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="hideDialog()">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    getDialog() {
      return this.$store.getters.getDialog;
    }
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("setDialog", {
        isShow: false,
        title: "",
        message: ""
      });
    }
  }
};
</script>
