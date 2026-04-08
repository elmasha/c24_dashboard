<template>
  <v-app dark class="" color="black" style="background-color: black">
    <v-main>
      <!-- Mobile drawer -->
      <v-navigation-drawer v-model="drawer" absolute left temporary>
        <v-list>
          <!-- <v-list-item class="px-1" v-if="overview.client">
                <v-list-item-avatar>
                    <v-avatar>
                        {{ overview.client.client_name.substring(0,2)}}
                    </v-avatar>
                </v-list-item-avatar>
            </v-list-item> -->

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6"> </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Files</v-list-item-title>
          </v-list-item>

          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Shared with me</v-list-item-title>
          </v-list-item>

          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Starred</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <Nuxt />
    </v-main>

    <v-footer app dark padless fixed class="dashboard-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <div class="footer-brand-badge">
            <img :src="logo" alt="" />
          </div>
          <div class="footer-brand-text">
            <h5 class="footer-title">Charge24</h5>
            <p class="footer-subtitle">Recharge your brand</p>
          </div>
        </div>

        <div class="footer-right">
          <span class="footer-copy">
            &copy; {{ new Date().getFullYear() }} All rights reserved
          </span>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import logo from "@/assets/logo.png";
export default {
  name: "DefaultLayout",
  mounted() {},
  data() {
    return {
      logo,
      windowSize: {
        x: null,
        y: null,
      },
      showBurger: false,
      clipped: false,
      auth_state: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-account",
          title: "Account",
          to: "/",
        },
        {
          icon: "mdi-wallet",
          title: "Wallet",
          to: "/inspire",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "",
      drawer: false,
    };
  },
  methods: {
    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };
      console.log("size", this.windowSize.x);
      if (this.windowSize.x < 950) {
        this.showBurger = true;
      } else {
        this.showBurger = false;
      }
      return this.windowSize;
    },
    logout() {
      this.$fire.auth.signOut();
      window.location.reload(true);
    },
  },
};
</script>

<style>
* {
  font-family: "Quicksand", sans-serif;
  scroll-behavior: smooth;
  overflow: hidden;
  /* color: #2b4601; */
}

.dashboard-footer {
  background: linear-gradient(90deg, #050505 0%, #0d0d0d 100%) !important;
  border-top: 1px solid rgba(198, 255, 0, 0.12);
  min-height: 72px;
  padding: 0 20px;
}

.footer-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-brand-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(198, 255, 0, 0.12);
  border: 1px solid rgba(198, 255, 0, 0.2);
  color: #73d843;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}

.footer-brand-text {
  display: flex;
  flex-direction: column;
}

.footer-title {
  margin: 0;
  color: #73d843;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
}

.footer-subtitle {
  margin: 2px 0 0;
  color: #9e9e9e;
  font-size: 12px;
}

.footer-right {
  display: flex;
  align-items: center;
}

.footer-copy {
  color: #d0d0d0;
  font-size: 13px;
}

@media (max-width: 600px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-right {
    width: 100%;
  }

  .footer-copy {
    font-size: 12px;
  }
}
</style>
