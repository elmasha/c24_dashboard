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
                  Assigned & Top Performing Locations
                </div>
                <div class="hero-subtitle">
                  View the locations delivering your campaigns, their
                  performance, levels, media, and which placements are
                  generating the strongest results.
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

          <div class="summary-strip mb-5">
            <div class="summary-card">
              <div class="summary-label">Locations</div>
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
          </div>

          <v-card class="table-card pa-4" outlined>
            <div class="panel-head mb-3">
              <div>
                <div class="panel-kicker"></div>
                <div class="panel-title">Location Breakdown</div>
              </div>
            </div>

            <MachinePerfomance title="" :rows="machinePerformance" />
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

export default {
  components: {
    MachinePerfomance,
  },

  data() {
    return {
      grid: false,
      numeral,
      moment,
      showBurger: false,
      loading: true,
      errorMessage: "",
      overview: {
        client: null,
        campaigns: [],
      },
      deviceBreakdown: [],
      dailyGraph: {
        impressions: [],
        scans: [],
      },
      socketRefreshTimer: null,
      machinePerformance: [],
      windowSize: {
        x: null,
        y: null,
      },
    };
  },

  async mounted() {
    await this.onResize();
    await this.loadDashboard();
  },

  methods: {
    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };
      this.showBurger = this.windowSize.x < 950;
      return this.windowSize;
    },

    async loadDashboard() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const currentUser = this.$fire.auth.currentUser;

        if (!currentUser) {
          this.errorMessage = "User not logged in";
          this.$router.push("/auth/client.login");
          this.loading = false;
          return;
        }

        const uid = currentUser.uid;

        const [machinePerfRes] = await Promise.all([
          api.post("/api/analytics/machine-performance", {
            uid,
          }),
        ]);

        this.machinePerformance = machinePerfRes.data || [];
      } catch (error) {
        console.error("loadDashboard error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load machine performance";
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

.summary-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.panel-kicker {
  color: #99a38c;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
}

.panel-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 900px) {
  .machines-shell {
    padding: 16px;
  }

  .hero-title {
    font-size: 26px;
  }

  .summary-strip {
    grid-template-columns: 1fr;
  }
}
</style>