import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - let-me-check",
    title: "let-me-check",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Athiti:wght@200;400&display=swap"
      }
    ],
    script: [{ src: "https://static.line-scdn.net/liff/edge/2/sdk.js" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyDkputsF87YQw2yzradNkXC0VmsF1wT2IE",
          authDomain: "let-me-check-42804.firebaseapp.com",
          databaseURL:
            "https://let-me-check-42804-default-rtdb.asia-southeast1.firebasedatabase.app",
          projectId: "let-me-check-42804",
          storageBucket: "let-me-check-42804.appspot.com",
          messagingSenderId: "368360154687",
          appId: "1:368360154687:web:5884bf57a2b52dc455ba8a",
          measurementId: "G-WJB06E2Z57"
        },
        services: {
          firestore: true,
          functions: true,
          storage: true,
          database: true
        }
      }
    ],
    ["nuxt-material-design-icons"],
    [
      "nuxt-vuex-localstorage",
      {
        mode: "cookie",
        expireHours: 24,
        localStorage: ["localStorage"]
      }
    ]
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
