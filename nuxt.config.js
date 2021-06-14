require("dotenv").config();
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
  plugins: [
    {
      src: "~/plugins/vue-confirm-dialog.js",
      mode: "client"
    }
  ],

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
          apiKey: process.env.API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          databaseURL: process.env.DATABASE_URL,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING_SENDER_ID,
          appId: process.env.APP_ID,
          measurementId: process.env.MEASUREMENT_ID
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
        localStorage: ["localStorage"]
      }
    ],
    ["cookie-universal-nuxt", { alias: "cookiz" }],
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/proxy"
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {},
  auth: {
    localStorage: {
      prefix: "auth."
    },
    cookie: {
      prefix: "auth.",
      options: {
        secure: true
      }
    }
  },
  axios: {
    // proxy: true,
    // proxyHeaders: true
  },

  proxy: {
    // "/api/v1": {
    //   target: "https://api.line.me/",
    //   pathRewrite: { "^/api/v1": "" },
    //   changeOrigin: true
    // }
  },
  vue: {
    config: {
      productionTip: true,
      devtools: false
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vue-confirm-dialog", "line"],
    extend(config, {}) {
      config.node = {
        fs: "empty"
      };
    }
  },
  serverMiddleware: [
    {
      path: "/cronjob-thaichana",
      handler: "~/server-middleware/cronjob-thaichana.js"
    },
    {
      path: "/push-message",
      handler: "~/server-middleware/push-message.js"
    }
  ]
};
