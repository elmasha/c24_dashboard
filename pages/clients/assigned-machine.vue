<template>
  <v-container fluid class="machines-page pa-0">
    <div class="machines-shell">
      <div class="page-topbar" style="margin-top: 30px; margin-bottom: 20px">
        <nuxt-link class="back-link" to="/client-dashboard">
          <v-icon color="#73D843" left>mdi-arrow-left</v-icon>
          Back to dashboard
        </nuxt-link>
      </div>

      <div class="machines-content">
        <div v-if="loading" class="loading-state">
          Loading locations and performance...
        </div>

        <div v-else>
          <v-card class="hero-panel pa-6 mb-5" outlined>
            <div class="d-flex flex-wrap align-center">
              <div class="hero-copy">
                <div class="hero-kicker" style="margin-left: 19px">
                  Location Performance
                </div>
                <div class="hero-title">
                  Assigned Machines per Location & Top Performing Locations
                </div>
                <div class="hero-subtitle">
                  Select a date range to see how your machines and locations are performing.
                </div>
              </div>

              <v-spacer />

              <div class="hero-actions mt-4 mt-md-0" style="margin-right: 18px">
                <v-btn
                  color="#73D843"
                  class="black--text font-weight-bold"
                  @click="loadDashboard"
                  :loading="loading"
                >
                  Refresh
                </v-btn>
              </div>
            </div>
          </v-card>

          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            outlined
            class="mb-4 dashboard-alert"
          >
            {{ errorMessage }}
          </v-alert>

          <!-- Date Range Picker -->
          <v-card class="panel-card pa-4 mb-4" outlined>
            <div class="panel-title-wrap mb-3">
              <div class="panel-kicker"></div>
              <div class="panel-title">Filter by Date Range</div>
            </div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Start Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      dark
                    />
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    @input="startDateMenu = false"
                    color="#73D843"
                    dark
                  />
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-menu
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      label="End Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      dark
                    />
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    @input="endDateMenu = false"
                    color="#73D843"
                    dark
                  />
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6" md="4" class="d-flex align-center">
                <v-btn
                  color="#73D843"
                  class="black--text font-weight-bold"
                  @click="applyDateFilter"
                  :disabled="!startDate || !endDate"
                >
                  Apply Filter
                </v-btn>
                <v-btn
                  text
                  color="#73D843"
                  class="ml-2"
                  @click="clearDateFilter"
                  v-if="startDate || endDate"
                >
                  Clear
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <!-- Summary Stats -->
          <div class="summary-strip mb-5">
            <div class="summary-card">
              <div class="summary-label">Machines</div>
              <div class="summary-value">
                {{ formatNumber(machinePerformance.length) }}
              </div>
            </div>

            <div class="summary-card" v-if="machinePerformance.length">
              <div class="summary-label">Top Machine</div>
              <div class="summary-value text-truncate">
                {{ machinePerformance[0].machine_name || "-" }}
              </div>
            </div>

            <div class="summary-card" v-if="machinePerformance.length">
              <div class="summary-label">Top Location</div>
              <div class="summary-value text-truncate">
                {{ machinePerformance[0].location_name || "-" }}
              </div>
            </div>

            <div class="summary-card" v-if="periodLabel">
              <div class="summary-label">Period</div>
              <div class="summary-value" style="font-size: 14px;">
                {{ periodLabel }}
              </div>
            </div>
          </div>

          <!-- Machine Performance Table -->
          <v-card class="table-card pa-4" outlined>
            <div class="panel-head mb-3">
              <div>
                <div class="panel-kicker"></div>
                <div class="panel-title">Machine Performance</div>
              </div>
            </div>

            <MachinePerfomance title="" :rows="machinePerformance" />
          </v-card>

          <!-- Location Performance Table -->
          <v-card class="table-card pa-4 mt-4" outlined>
            <div class="panel-head mb-3">
              <div>
                <div class="panel-kicker"></div>
                <div class="panel-title">Location Performance</div>
              </div>
            </div>

            <LocationPerformance title="" :rows="locationPerformance" />
          </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";
import MachinePerfomance from "../../components/machinePerfomance.vue";
import LocationPerformance from "../../components/LocationPerformance.vue";

export default {
  components: {
    MachinePerfomance,
    LocationPerformance,
  },

  data() {
    return {
      user: null,
      clientUid: null,
      loading: true,
      errorMessage: "",
      startDate: "",
      endDate: "",
      startDateMenu: false,
      endDateMenu: false,
      machinePerformance: [],
      locationPerformance: [],
      windowSize: { x: null, y: null },
    };
  },

  computed: {
    periodLabel() {
      if (this.startDate && this.endDate) {
        return `${moment(this.startDate).format("MMM DD, YYYY")} - ${moment(this.endDate).format("MMM DD, YYYY")}`;
      }
      return "";
    },
  },

  async mounted() {
    this.onResize();
    await this.fetchCurrentUser();
    if (this.clientUid) {
      await this.loadDashboard();
    }
  },

  methods: {
    async fetchCurrentUser() {
      const currentUser = this.$fire.auth.currentUser;
      
      if (!currentUser) {
        this.$router.push("/auth/client.login");
        return;
      }

      try {
        const { data } = await api.post("/api/users/by-uid", {
          uid: currentUser.uid,
        });
        
        this.clientUid = data.client_uid || currentUser.uid;
        this.user = data;
        
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.errorMessage = "Failed to load user data";
      }
    },

    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };
      this.showBurger = this.windowSize.x < 950;
    },

    applyDateFilter() {
      this.loadDashboard();
    },

    clearDateFilter() {
      this.startDate = "";
      this.endDate = "";
      this.loadDashboard();
    },

    async loadDashboard() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const params = {};
        if (this.startDate && this.endDate) {
          params.start_date = this.startDate;
          params.end_date = this.endDate;
        }

        const [machinePerfRes, locationPerfRes] = await Promise.all([
          api.post("/api/machines/client-performance", { uid: this.clientUid }, { params }),
          api.post("/api/machines/client-locations", { uid: this.clientUid }, { params }),
        ]);

        this.machinePerformance = machinePerfRes.data?.machines || [];
        this.locationPerformance = locationPerfRes.data?.locations || [];
        
      } catch (error) {
        console.error("loadDashboard error:", error);
        this.errorMessage = error.response?.data?.message || "Failed to load performance data";
      } finally {
        this.loading = false;
      }
    },

    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
  },
};
</script>

<style scoped>
.machines-page {
  min-height: 100vh;
  background: radial-gradient(
      circle at top left,
      rgba(198, 255, 0, 0.06),
      transparent 22%
    ),
    linear-gradient(180deg, #020202 0%, #0b0b0b 100%);
  color: #fff;
}

.machines-shell {
  padding: 24px;
}

.page-topbar {
  margin-bottom: 20px;
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

.machines-content {
  width: 100%;
}

.loading-state {
  padding: 20px 0;
  color: #bdbdbd;
}

.hero-panel {
  border-radius: 26px;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 28%
    ),
    linear-gradient(135deg, #111111, #080808) !important;
  border: 1px solid rgba(198, 255, 0, 0.12) !important;
}

.hero-copy {
  max-width: 760px;
}

.hero-kicker {
  color: #73d843;
  font-size: 13px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.15;
  color: #fff;
}

.hero-subtitle {
  color: #bcbcbc;
  line-height: 1.7;
  margin-top: 12px;
  max-width: 760px;
}

.dashboard-alert {
  border-radius: 14px;
}

.panel-card {
  border-radius: 22px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-title-wrap {
  margin-bottom: 12px;
}

.panel-kicker {
  color: #9aa590;
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

.summary-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.summary-card {
  border-radius: 20px;
  padding: 18px;
  background: linear-gradient(180deg, #111111, #090909);
  border: 1px solid rgba(198, 255, 0, 0.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.summary-label {
  color: #9d9d9d;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 10px;
  letter-spacing: 0.6px;
}

.summary-value {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-card {
  border-radius: 22px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 900px) {
  .machines-shell {
    padding: 16px;
  }

  .hero-title {
    font-size: 20px;
  }

  .summary-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .summary-strip {
    grid-template-columns: 1fr;
  }
}
</style>