import colors from 'vuetify/es5/util/colors'

export default {
  ssr: true,
  
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '',
    title: "Charge24 dashboard",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.png' },
       {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css'
    }
    ]
  },
  publicRuntimeConfig: {
    UUID: process.env.UUID
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  
  plugins: [{ src: "@/plugins/apexcharts.js", mode: "client" }, { src: "@/plugins/video.js", mode: "client" },
  { src: "@/plugins/vue-core-video-player.js", mode: "client" },{ src: "@/plugins/qr.js", mode: "client" }],

  router: {
  middleware: ['auth']
  },
  components: true,


   googleFonts: {
    download: true,
    families: {
      Quicksand: true,
    },
    display: "Quicksand",
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    "@nuxtjs/google-fonts",
    '@nuxtjs/moment',
    '@nuxtjs/dayjs'
  ],

  dayjs: {
  locales: ["en"],
  defaultLocale: "en",
  plugins: ["relativeTime"]
},
  /*
  ** Nuxt.js modules
  */
 // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
           apiKey: "AIzaSyDVUTX5BhQZBjvwMdCphgQoXfa9A3oS2iQ",
          authDomain: "charge24-ke.firebaseapp.com",
          projectId: "charge24-ke",
          storageBucket: "charge24-ke.firebasestorage.app",
          messagingSenderId: "820130856535",
          appId: "1:820130856535:web:02a408b7b746d0d8ff2d12",
          measurementId: "G-2FTT3W361H"
        },
        services: {
          auth: {
            persistence: "local", // default
            initialize: {
                nAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION",
                subscribeManually: false,
            },
            ssr: false, // default
        }, // authentication
        firestore: true, // firestoreDb
        storage: true, // storage./ Just as example. Can be any other service.
        }
      }
    ]
  ],
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: "#05F3DF",
          green: "#73D843",
          green2: "#00ff04",
          black:"#000",
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.blue.darken2,
          accent: "#05F3DF",
          green: "#73D843",
          green2: "#00ff04",
          black:"#000",
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
 build: {
    extend(config) {
      config.stats = {
        warningsFilter: /@charset must precede/
      }
    }
  }
}
