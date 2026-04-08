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
          <div class="page-badge" style="margin-top: 18px">Admin Portal</div>
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
              Manage machines, campaigns and delivery
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
          <nuxt-link class="back-link" to="/machines">
            <v-icon color="#73D843" left>mdi-arrow-left</v-icon>
            Back to machines
          </nuxt-link>
        </div>

        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="hero-copy">
            <div class="hero-kicker">Machine Settings</div>
            <div class="hero-heading">
              Update machine details, location data and operating mode
            </div>
            <div class="hero-subtext">
              Edit playback settings, visibility rate, location category and
              status information for this machine.
            </div>
          </div>
        </v-card>

        <!-- Status summary -->
        <v-row class="mb-4">
          <v-col cols="12" md="6" lg="4">
            <v-card class="status-summary-card pa-4" outlined>
              <div class="status-summary-label">Current Status</div>
              <div class="mt-2">
                <span
                  class="status-pill"
                  :class="
                    form.status === 'online'
                      ? 'status-online'
                      : 'status-offline'
                  "
                >
                  {{ form.status }}
                </span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <v-card class="status-summary-card pa-4" outlined>
              <div class="status-summary-label">Status Mode</div>
              <div class="mt-2">
                <span
                  class="mode-pill"
                  :class="
                    form.status_mode === 'manual' ? 'mode-manual' : 'mode-auto'
                  "
                >
                  {{ form.status_mode }}
                </span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <v-card class="status-summary-card pa-4" outlined>
              <div class="status-summary-label">Location Category</div>
              <div class="status-summary-value mt-2">
                {{ form.location_category || "-" }}
              </div>
            </v-card>
          </v-col>
        </v-row>

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
              <div class="panel-kicker">Machine Form</div>
              <div class="panel-title">Edit Machine Details</div>
            </div>
          </div>

          <div v-if="loading" class="loading-state">Loading machine...</div>

          <v-form v-else @submit.prevent="updateMachine">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.machine_uid"
                  label="Machine UID"
                  outlined
                  dense
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.machine_name"
                  label="Machine Name"
                  outlined
                  dense
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.location_name"
                  label="Location Name"
                  outlined
                  dense
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.location_category"
                  :items="['airport', 'mall', 'club', 'restaurant', 'shop']"
                  label="Location Category"
                  outlined
                  dense
                  dark
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.visibility_rate"
                  label="Visibility Rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.slot_duration"
                  label="Slot Duration (seconds)"
                  type="number"
                  min="1"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.slots_per_loop"
                  label="Slots Per Loop"
                  type="number"
                  min="1"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.status"
                  :items="['offline', 'online']"
                  label="Status"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.status_mode"
                  :items="['auto', 'manual']"
                  label="Status Mode"
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
                {{ saving ? "Saving..." : "Update Machine" }}
              </v-btn>

              <nuxt-link to="/machines" class="text-decoration-none">
                <v-btn text> Back </v-btn>
              </nuxt-link>
            </div>
          </v-form>
        </v-card>
      </main>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      loading: true,
      saving: false,
      successMessage: "",
      errorMessage: "",
      showBurger: false,
      windowSize: {
        x: window.innerWidth,
        y: window.innerHeight,
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
        // {
        //   title: "Traffic Config",
        //   icon: "mdi-cogs",
        //   to: "traffic-config"
        // }
      ],
      form: {
        machine_uid: "",
        machine_name: "",
        location_name: "",
        location_category: "mall",
        visibility_rate: 0.6,
        slot_duration: 10,
        slots_per_loop: 6,
        status: "offline",
        status_mode: "auto",
      },
    };
  },

  mounted() {
    this.onResize();
    this.fetchMachine();
  },

  methods: {
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

    async fetchMachine() {
      try {
        const { data } = await api.get(
          `/api/machines/${this.$route.params.id}`
        );
        this.form = {
          machine_uid: data.machine_uid || "",
          machine_name: data.machine_name || "",
          location_name: data.location_name || "",
          location_category: data.location_category || "mall",
          visibility_rate: Number(data.visibility_rate || 0.6),
          slot_duration: Number(data.slot_duration || 10),
          slots_per_loop: Number(data.slots_per_loop || 6),
          status: data.status || "offline",
          status_mode: data.status_mode || "auto",
        };
      } catch (error) {
        console.error("fetchMachine error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load machine";
      } finally {
        this.loading = false;
      }
    },

    async updateMachine() {
      try {
        this.saving = true;
        this.successMessage = "";
        this.errorMessage = "";

        const { data } = await api.put(
          `/api/machines/${this.$route.params.id}`,
          this.form
        );

        this.successMessage = `${data.machine_name} updated successfully`;
      } catch (error) {
        console.error("updateMachine error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to update machine";
      } finally {
        this.saving = false;
      }
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

.loading-state {
  color: #bdbdbd;
  padding: 10px 0;
}

.text-decoration-none {
  text-decoration: none;
}

.status-summary-card {
  border-radius: 18px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.08) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.status-summary-label {
  font-size: 12px;
  color: #ababab;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.status-summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  text-transform: capitalize;
}

.status-pill,
.mode-pill {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-online {
  background: rgba(124, 255, 138, 0.12);
  color: #7cff8a;
  border: 1px solid rgba(124, 255, 138, 0.2);
}

.status-offline {
  background: rgba(255, 107, 107, 0.12);
  color: #ff7b7b;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.mode-auto {
  background: rgba(198, 255, 0, 0.12);
  color: #73d843;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.mode-manual {
  background: rgba(255, 213, 79, 0.12);
  color: #ffd54f;
  border: 1px solid rgba(255, 213, 79, 0.18);
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