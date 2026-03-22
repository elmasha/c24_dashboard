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
                <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <div>
          <div class="page-badge">Admin Portal</div>
          <h1 class="page-title" style="font-size: 1rem;">Traffic Configuration</h1>
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
            <v-avatar size="54" color="#C6FF00" class="sidebar-avatar">
              <span class="avatar-text">AD</span>
            </v-avatar>

            <div class="sidebar-user-name">Operations Team</div>
            <div class="sidebar-user-subtitle">
              Tune audience flow and delivery weighting
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
                <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="sidebar-footer">
            <v-btn block outlined color="#C6FF00" class="logout-btn">
              Logout
            </v-btn>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="admin-main">
        <div class="page-topbar">
          <nuxt-link class="back-link" to="/admin/dashboard">
            <v-icon color="#C6FF00" left>mdi-arrow-left</v-icon>
            Back to dashboard
          </nuxt-link>
        </div>

        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="hero-copy" style="margin-left: 10px;">
            <div class="hero-kicker" style="margin-left: 10px;">Delivery Engine Settings</div>
            <div class="hero-heading">
              Configure category profiles, day weights, and time-based traffic behavior
            </div>
            <div class="hero-subtext">
              Adjust how audience and delivery estimates behave across locations, days,
              and hourly slots to improve campaign pacing and reporting quality.
            </div>
          </div>
        </v-card>

        <v-alert v-if="successMessage" type="success" dense outlined class="mb-4 dashboard-alert">
          {{ successMessage }}
        </v-alert>

        <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
          {{ errorMessage }}
        </v-alert>

        <v-row>
          <!-- Category profiles -->
          <v-col cols="12" lg="6">
            <v-card class="panel-card pa-4 mb-4" outlined>
              <div class="panel-head mb-3">
                <div>
                  <div class="panel-kicker">Audience Baselines</div>
                  <div class="panel-title">Category Profiles</div>
                </div>
              </div>

              <div class="table-scroll">
                <v-simple-table class="table-dark traffic-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Base Audience</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in categories" :key="row.id">
                      <td>{{ row.category }}</td>
                      <td>
                        <v-text-field
                          v-model.number="row.base_audience"
                          type="number"
                          min="0"
                          dense
                          outlined
                          dark
                          hide-details
                        />
                      </td>
                      <td>
                        <v-btn small color="#C6FF00" class="black--text font-weight-bold" @click="updateCategory(row)">
                          Update
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-card>
          </v-col>

          <!-- Day weights -->
          <v-col cols="12" lg="6">
            <v-card class="panel-card pa-4 mb-4" outlined>
              <div class="panel-head mb-3">
                <div>
                  <div class="panel-kicker">Weekly Behaviour</div>
                  <div class="panel-title">Day Weights</div>
                </div>
              </div>

              <div class="table-scroll">
                <v-simple-table class="table-dark traffic-table">
                  <thead>
                    <tr>
                      <th>Day Number</th>
                      <th>Day</th>
                      <th>Weight</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in dayWeights" :key="row.id">
                      <td>{{ row.day_number }}</td>
                      <td>{{ dayName(row.day_number) }}</td>
                      <td>
                        <v-text-field
                          v-model.number="row.weight"
                          type="number"
                          step="0.01"
                          min="0"
                          dense
                          outlined
                          dark
                          hide-details
                        />
                      </td>
                      <td>
                        <v-btn small color="#C6FF00" class="black--text font-weight-bold" @click="updateDayWeight(row)">
                          Update
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Time weights -->
        <v-card class="panel-card pa-4" outlined>
          <div class="panel-head mb-4">
            <div>
              <div class="panel-kicker">Hourly Behaviour</div>
              <div class="panel-title">Category Time Weights</div>
            </div>
          </div>

          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <label class="field-label">Select Category</label>
              <v-select
                v-model="selectedCategory"
                :items="['airport', 'mall', 'club', 'restaurant', 'shop', 'event']"
                label="Filter Category"
                outlined
                dense
                dark
                clearable
                @change="fetchTimeWeightsByCategory"
              />
            </v-col>
          </v-row>

          <v-card class="inner-card pa-4 mb-4" outlined>
            <div class="panel-kicker">Create Rule</div>
            <div class="panel-title small-title mb-4">Add Time Weight</div>

            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="timeForm.category"
                  :items="['airport', 'mall', 'club', 'restaurant', 'shop', 'event']"
                  label="Category"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="timeForm.start_hour"
                  label="Start Hour"
                  type="number"
                  min="0"
                  max="23"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="timeForm.end_hour"
                  label="End Hour"
                  type="number"
                  min="1"
                  max="24"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="timeForm.weight"
                  label="Weight"
                  type="number"
                  step="0.01"
                  min="0"
                  outlined
                  dense
                  dark
                />
              </v-col>
            </v-row>

            <v-btn color="#C6FF00" class="black--text font-weight-bold" @click="createTimeWeight">
              Add Time Weight
            </v-btn>
          </v-card>

          <div class="table-scroll">
            <v-simple-table class="table-dark traffic-table wide-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Start Hour</th>
                  <th>End Hour</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in timeWeights" :key="row.id">
                  <td>
                    <v-select
                      v-model="row.category"
                      :items="['airport', 'mall', 'club', 'restaurant', 'shop', 'event']"
                      dense
                      outlined
                      dark
                      hide-details
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="row.start_hour"
                      type="number"
                      min="0"
                      max="23"
                      dense
                      outlined
                      dark
                      hide-details
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="row.end_hour"
                      type="number"
                      min="1"
                      max="24"
                      dense
                      outlined
                      dark
                      hide-details
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="row.weight"
                      type="number"
                      step="0.01"
                      min="0"
                      dense
                      outlined
                      dark
                      hide-details
                    />
                  </td>
                  <td class="actions">
                    <v-btn small color="#C6FF00" class="black--text font-weight-bold" @click="updateTimeWeight(row)">
                      Update
                    </v-btn>
                    <v-btn small color="#ff6b6b" text @click="deleteTimeWeight(row.id)">
                      Delete
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
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
      categories: [],
      dayWeights: [],
      timeWeights: [],
      selectedCategory: "",
      successMessage: "",
      errorMessage: "",
      showBurger: false,
      windowSize: {
        x: window.innerWidth,
        y: window.innerHeight
      },
      items_nav: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "admin/dashboard"
        },
        {
          title: "Campaign",
          icon: "mdi-bullhorn-outline",
          to: "campaigns/all"
        },
        {
          title: "Machines",
          icon: "mdi-cellphone-sound",
          to: "machines"
        },
        {
          title: "Clients",
          icon: "mdi-account-group-outline",
          to: "clients"
        },
        {
          title: "Traffic Config",
          icon: "mdi-cogs",
          to: "traffic-config"
        }
      ],
      timeForm: {
        category: "mall",
        start_hour: 0,
        end_hour: 6,
        weight: 1
      }
    };
  },

  mounted() {
    this.onResize();
    this.fetchCategories();
    this.fetchDayWeights();
    this.fetchTimeWeights();
  },

  methods: {
    move(val) {
      this.$router.push(`/${val}`);
    },

    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight
      };
      this.showBurger = this.windowSize.x < 950;
      return this.windowSize;
    },

    async fetchCategories() {
      try {
        const { data } = await api.get("/api/traffic-config/categories");
        this.categories = data;
      } catch (error) {
        this.handleError(error, "Failed to load category profiles");
      }
    },

    async fetchDayWeights() {
      try {
        const { data } = await api.get("/api/traffic-config/days");
        this.dayWeights = data;
      } catch (error) {
        this.handleError(error, "Failed to load day weights");
      }
    },

    async fetchTimeWeights() {
      try {
        const { data } = await api.get("/api/traffic-config/times");
        this.timeWeights = data;
      } catch (error) {
        this.handleError(error, "Failed to load time weights");
      }
    },

    async fetchTimeWeightsByCategory() {
      try {
        if (!this.selectedCategory) {
          await this.fetchTimeWeights();
          return;
        }

        const { data } = await api.get(
          `/api/traffic-config/times/category/${this.selectedCategory}`
        );
        this.timeWeights = data;
      } catch (error) {
        this.handleError(error, "Failed to load category time weights");
      }
    },

    async updateCategory(row) {
      try {
        await api.put(`/api/traffic-config/categories/${row.category}`, {
          base_audience: row.base_audience
        });

        this.successMessage = `Updated ${row.category} base audience`;
        this.errorMessage = "";
      } catch (error) {
        this.handleError(error, "Failed to update category profile");
      }
    },

    async updateDayWeight(row) {
      try {
        await api.put(`/api/traffic-config/days/${row.day_number}`, {
          weight: row.weight
        });

        this.successMessage = `Updated ${this.dayName(row.day_number)} weight`;
        this.errorMessage = "";
      } catch (error) {
        this.handleError(error, "Failed to update day weight");
      }
    },

    async createTimeWeight() {
      try {
        await api.post("/api/traffic-config/times", this.timeForm);

        this.successMessage = "Time weight added successfully";
        this.errorMessage = "";

        this.timeForm = {
          category: "mall",
          start_hour: 0,
          end_hour: 6,
          weight: 1
        };

        await this.fetchTimeWeightsByCategory();
      } catch (error) {
        this.handleError(error, "Failed to add time weight");
      }
    },

    async updateTimeWeight(row) {
      try {
        await api.put(`/api/traffic-config/times/${row.id}`, {
          category: row.category,
          start_hour: row.start_hour,
          end_hour: row.end_hour,
          weight: row.weight
        });

        this.successMessage = "Time weight updated successfully";
        this.errorMessage = "";
      } catch (error) {
        this.handleError(error, "Failed to update time weight");
      }
    },

    async deleteTimeWeight(id) {
      const confirmed = window.confirm("Delete this time weight?");
      if (!confirmed) return;

      try {
        await api.delete(`/api/traffic-config/times/${id}`);

        this.successMessage = "Time weight deleted successfully";
        this.errorMessage = "";

        await this.fetchTimeWeightsByCategory();
      } catch (error) {
        this.handleError(error, "Failed to delete time weight");
      }
    },

    dayName(dayNumber) {
      const names = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      return names[dayNumber] || "-";
    },

    handleError(error, fallback) {
      console.error(error);
      this.successMessage = "";
      this.errorMessage = error.response?.data?.message || fallback;
    }
  }
};
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 22%),
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
  color: #c6ff00;
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
  color: #c6ff00 !important;
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
  color: #c6ff00;
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
  color: #c6ff00;
}

.hero-panel {
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 28%),
    linear-gradient(135deg, #111111, #080808) !important;
  border: 1px solid rgba(198, 255, 0, 0.14) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}

.hero-copy {
  max-width: 760px;
}

.hero-kicker {
  color: #c6ff00;
  font-size: 13px;
  margin-bottom: 10px;
  letter-spacing: 0.4px;
}

.hero-heading {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  max-width: 760px;
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

.inner-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(198, 255, 0, 0.08) !important;
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

.small-title {
  font-size: 18px;
}

.field-label {
  display: block;
  font-size: 13px;
  color: #aeb5a7;
  margin-bottom: 8px;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.traffic-table {
  min-width: 720px;
}

.wide-table {
  min-width: 980px;
}

.table-dark ::v-deep th {
  color: #c6ff00 !important;
  background: transparent !important;
  font-weight: 700;
  border-bottom: 1px solid rgba(198, 255, 0, 0.08) !important;
}

.table-dark ::v-deep td {
  color: #d4d4d4 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  vertical-align: middle !important;
}

.table-dark ::v-deep tr:hover {
  background: rgba(198, 255, 0, 0.03);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
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