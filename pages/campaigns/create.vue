<template>
  <v-container fluid class="admin-page pa-0">
    <!-- Top bar -->
    <v-app-bar flat color="transparent" height="72" class="admin-topbar px-4">
      <div class="d-flex align-center">
        <v-menu offset-y v-if="showBurger">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark class="mr-3 topbar-icon" v-bind="attrs" v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list dark class="menu-list">
            <v-list-item
              v-for="(item, index) in items_nav"
              :key="index"
              link
              @click="move(item.to)"
            >
              <v-list-item-icon>
                <v-icon color="#73D843">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <div>
          <div class="page-badge">Admin Portal</div>
          <h1 class="page-title" style="font-size: 0.9rem">Create Campaign</h1>
        </div>
      </div>

      <v-spacer />
    </v-app-bar>

    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar" v-show="!showBurger">
        <div class="sidebar-card">
          <div class="sidebar-brand">
            <div class="sidebar-brand-badge">Charge24</div>
            <div class="sidebar-brand-text">Admin Control</div>
          </div>

          <div class="sidebar-profile">
            <v-avatar size="54" color="#73D843" class="sidebar-avatar">
              <span class="avatar-text">AD</span>
            </v-avatar>

            <div class="sidebar-user-name">Operations Team</div>
            <div class="sidebar-user-subtitle">
              Create and manage campaign delivery
            </div>
          </div>

          <v-list dark class="sidebar-list">
            <v-list-item
              v-for="item in items_nav"
              :key="item.title"
              link
              class="sidebar-item"
              @click="move(item.to)"
            >
              <v-list-item-icon>
                <v-icon color="#73D843">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="sidebar-footer">
            <v-btn block outlined color="#73D843" class="logout-btn">
              Logout
            </v-btn>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="admin-main">
        <div class="page-topbar">
          <nuxt-link class="back-link" to="/campaigns/all">
            <v-icon color="#73D843" left>mdi-arrow-left</v-icon>
            Back to campaigns
          </nuxt-link>
        </div>

        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="hero-copy">
            <div class="hero-kicker" style="margin-left: 12px">
              Campaign Setup
            </div>
            <div class="hero-heading">
              Create a new campaign for delivery across your machine network
            </div>
            <div class="hero-subtext">
              Define the client, media, landing page, schedule, target
              impressions and status before launching.
            </div>
          </div>
        </v-card>

        <v-alert
          v-if="successMessage"
          type="success"
          dense
          outlined
          class="mb-4 dashboard-alert"
        >
          {{ successMessage }}
        </v-alert>

        <v-alert
          v-if="errorMessage"
          type="error"
          dense
          outlined
          class="mb-4 dashboard-alert"
        >
          {{ errorMessage }}
        </v-alert>

        <v-card class="panel-card pa-5" outlined>
          <div class="panel-head mb-4">
            <div>
              <div class="panel-kicker"></div>
              <div class="panel-title">New Campaign Details</div>
            </div>
          </div>

          <v-form @submit.prevent="createCampaign">
            <v-row>
              <v-col cols="12" md="6">
                <div style="margin: 10px">
                  <p>Campaign image</p>
                  <v-avatar color="green" size="140">
                    <dropzone
                      id="foo"
                      ref="el"
                      style="border-radius: 360px"
                      @vdropzone-success="handleSuccess"
                      :options="options"
                      @vdropzone-complete="afterComplete"
                    ></dropzone>
                  </v-avatar>
                </div>

                <div>
                  <label for="">Select Client</label>
                  <v-select
                    v-model="form.client_id"
                    :items="clients"
                    item-text="client_name"
                    item-value="id"
                    label="Select Client"
                    outlined
                    dense
                    dark
                    required
                    @change="onClientChange"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6"> </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.campaign_name"
                  label="Campaign Name"
                  outlined
                  dense
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.media_url"
                  label="Media URL"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.landing_url"
                  label="Landing URL"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.target_impressions"
                  label="Target Impressions"
                  type="number"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.start_date"
                  label="Start Date"
                  type="date"
                  outlined
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.end_date"
                  label="End Date"
                  type="date"
                  outlined
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="form.status"
                  :items="['active', 'paused', 'ended']"
                  label="Status"
                  outlined
                  dense
                  dark
                />
              </v-col>
            </v-row>

            <div class="form-actions">
              <v-btn
                color="#73D843"
                class="black--text font-weight-bold mr-2"
                type="submit"
                :loading="saving"
              >
                Create Campaign
              </v-btn>

              <v-btn text @click="resetForm"> Reset </v-btn>
            </div>
          </v-form>
        </v-card>
      </main>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api";
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import { v1 as uuidv1 } from "uuid";

export default {
  components: {
    Dropzone,
  },
  data() {
    return {
      options: {
        url: "http://httpbin.org/anything",
      },
      saving: false,
      successMessage: "",
      errorMessage: "",
      clients: [],
      showBurger: false,
      windowSize: {
        x: null,
        y: null,
      },
      items_nav: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "admin/dashboard",
        },
        {
          title: "Campaign",
          icon: "mdi-bullhorn-outline",
          to: "campaigns/all",
        },
        {
          title: "Machines",
          icon: "mdi-cellphone-sound",
          to: "machines",
        },
        {
          title: "Clients",
          icon: "mdi-account-group-outline",
          to: "clients",
        },
        {
          title: "Traffic Config",
          icon: "mdi-cogs",
          to: "traffic-config",
        },
      ],
      form: {
        client_id: "",
        client_name: "",
        campaign_name: "",
        media_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active",
        image_url: "",
      },
    };
  },

  mounted() {
    this.onResize();
    this.fetchClients();
  },

  methods: {
    handleSuccess(file, response) {
      // Handle success event here
      console.log("File uploaded successfully!", response);
      this.snackbar = true;
      this.snackbarText = "File uploaded";
    },
    clearDropzone() {
      this.$refs.el.dropzone.removeAllFiles();
    },
    async afterComplete(upload2) {
      const storageRef = this.$fire.storage.ref();
      const imageNameP = uuidv1();

      try {
        const file = upload2;
        const metadata = {
          contentType: file.type || "image/png",
        };

        const imageRef = storageRef.child(`clients/${imageNameP}.png`);
        await imageRef.put(file, metadata);
        const downloadURLP = await imageRef.getDownloadURL();

        this.form.image_url = downloadURLP;
        console.log("image url", downloadURLP);
      } catch (error) {
        console.log(error);
        this.errorMessage = "Failed to upload image";
      }
    },
    move(val) {
      this.$router.push(`/${val}`);
    },

    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };
      this.showBurger = this.windowSize.x < 950;
      return this.windowSize;
    },

    async fetchClients() {
      try {
        const { data } = await api.get("/api/clients");
        this.clients = data || [];
        console.log("clients", this.clients);
      } catch (error) {
        console.error("fetchClients error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load clients";
      }
    },

    onClientChange() {
      const selected = this.clients.find(
        (c) => Number(c.id) === Number(this.form.client_id)
      );
      this.form.client_name = selected ? selected.client_name : "";
      this.form.show_qr = selected ? selected.show_qr : "";
      console.log("selected client", selected);
    },

    async createCampaign() {
      try {
        this.saving = true;
        this.successMessage = "";
        this.errorMessage = "";

        const payload = {
          client_id: Number(this.form.client_id),
          client_name: this.form.client_name,
          campaign_name: this.form.campaign_name,
          media_url: this.form.media_url,
          target_impressions: Number(this.form.target_impressions),
          status: this.form.status,
          show_qr: this.form.qr === "true" ? 1 : 0,
          image_url: this.form.image_url,
          landing_url: this.form.landing_url,
          start_date: this.formatDateTime(this.form.start_date),
          end_date: this.formatDateTime(this.form.end_date),
        };

        console.log("payload", payload);
        const { data } = await api.post("/api/campaigns", payload);

        this.successMessage = `Campaign created successfully. QR Token: ${data.qr_token}`;

        this.resetForm();
      } catch (error) {
        console.error("createCampaign error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to create campaign";
      } finally {
        this.saving = false;
      }
    },

    formatDateTime(value) {
      if (!value) return null;
      return value.replace("T", " ") + ":00";
    },

    resetForm() {
      this.form = {
        client_id: "",
        client_name: "",
        campaign_name: "",
        media_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active",
      };
    },
  },
};
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 22%
    ),
    linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
  color: #fff;
}

.admin-topbar {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid rgba(198, 255, 0, 0.08);
}

.topbar-icon {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(198, 255, 0, 0.08);
}

.menu-list {
  background: #111111 !important;
  border: 1px solid rgba(198, 255, 0, 0.1);
  border-radius: 14px;
}

.admin-layout {
  display: flex;
  min-height: calc(100vh - 72px);
}

.admin-sidebar {
  width: 290px;
  padding: 16px;
}

.sidebar-card {
  height: 100%;
  border-radius: 24px;
  background: linear-gradient(180deg, #101010, #070707);
  border: 1px solid rgba(198, 255, 0, 0.12);
  padding: 18px;
}

.sidebar-brand {
  margin-bottom: 24px;
}

.sidebar-brand-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.22);
  color: #73d843;
  font-size: 12px;
  margin-bottom: 10px;
}

.sidebar-brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.sidebar-profile {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 20px;
  text-align: center;
}

.sidebar-avatar {
  margin-bottom: 12px;
}

.avatar-text {
  color: #000;
  font-weight: 800;
}

.sidebar-user-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.sidebar-user-subtitle {
  color: #a8a8a8;
  font-size: 13px;
  margin-top: 4px;
}

.sidebar-list {
  background: transparent !important;
}

.sidebar-item {
  border-radius: 12px;
  margin-bottom: 6px;
}

.sidebar-item:hover {
  background: rgba(198, 255, 0, 0.06);
}

.sidebar-footer {
  margin-top: 24px;
}

.logout-btn {
  border-color: rgba(198, 255, 0, 0.35) !important;
  color: #73d843 !important;
}

.admin-main {
  flex: 1;
  padding: 20px;
}

.page-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.2);
  color: #73d843;
  font-size: 12px;
  margin-bottom: 8px;
}

.page-title {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.page-topbar {
  margin-bottom: 18px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #d8d8d8;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  color: #73d843;
}

.hero-panel {
  border-radius: 24px;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 28%
    ),
    linear-gradient(135deg, #111111, #080808) !important;
  border: 1px solid rgba(198, 255, 0, 0.14) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}

.hero-copy {
  max-width: 760px;
}

.hero-kicker {
  color: #73d843;
  font-size: 13px;
  margin-bottom: 10px;
  letter-spacing: 0.4px;
}

.hero-heading {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  max-width: 720px;
}

.hero-subtext {
  color: #bcbcbc;
  margin-top: 12px;
  max-width: 760px;
  line-height: 1.7;
}

.dashboard-alert {
  border-radius: 14px;
}

.panel-card {
  border-radius: 22px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.1) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-kicker {
  color: #9ea59b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.form-actions {
  margin-top: 8px;
  display: flex;
  align-items: center;
}

@media (max-width: 960px) {
  .admin-layout {
    display: block;
  }

  .admin-main {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .hero-heading {
    font-size: 22px;
  }
}
</style>