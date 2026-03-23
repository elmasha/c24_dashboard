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
          <h1 class="page-title">System Jobs</h1>
        </div>
      </div>

      <v-spacer />

      <div class="d-flex align-center">
        <v-btn icon dark class="topbar-icon mr-2" @click="fetchJobs">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
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
              Manage background jobs and automation flow
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
          <div class="hero-copy">
            <div class="hero-kicker">Automation Control</div>
            <div class="hero-heading">
              Start and stop system jobs that power background platform operations
            </div>
            <div class="hero-subtext">
              Monitor scheduled processes and control which jobs are currently active across the platform.
            </div>
          </div>
        </v-card>

        <v-alert v-if="message" type="success" dense outlined class="mb-4 dashboard-alert">
          {{ message }}
        </v-alert>

        <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
          {{ errorMessage }}
        </v-alert>

        <v-card class="panel-card pa-4" outlined>
          <div class="panel-head mb-3">
            <div>
              <div class="panel-kicker">Background Services</div>
              <div class="panel-title">System Jobs</div>
            </div>
          </div>

          <v-simple-table class="table-dark">
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Status</th>
                <th>Updated At</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="job in jobs" :key="job.id">
                <td>{{ job.job_name }}</td>
                <td>
                  <span
                    class="status-pill"
                    :class="job.is_enabled ? 'status-running' : 'status-stopped'"
                  >
                    {{ job.is_enabled ? "Running" : "Stopped" }}
                  </span>
                </td>
                <td>{{ job.updated_at }}</td>
                <td class="text-right">
                  <div class="action-wrap">
                    <v-btn
                      v-if="job.is_enabled"
                      small
                      text
                      color="#ff6b6b"
                      @click="toggleJob(job, false)"
                    >
                      Stop
                    </v-btn>

                    <v-btn
                      v-else
                      small
                      text
                      color="#7CFF8A"
                      @click="toggleJob(job, true)"
                    >
                      Start
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr v-if="!jobs.length">
                <td colspan="4">No jobs found.</td>
              </tr>
            </tbody>
          </v-simple-table>
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
      jobs: [],
      message: "",
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
          title: "System Jobs",
          icon: "mdi-cog-refresh-outline",
          to: "system-jobs"
        }
      ]
    };
  },

  mounted() {
    this.onResize();
    this.fetchJobs();
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

    async fetchJobs() {
      try {
        this.errorMessage = "";
        const { data } = await api.get("/api/system-jobs");
        this.jobs = data || [];
      } catch (error) {
        this.errorMessage = "Failed to load jobs";
      }
    },

    async toggleJob(job, enabled) {
      try {
        const { data } = await api.put(`/api/system-jobs/${job.job_name}`, {
          is_enabled: enabled
        });

        this.message = `${data.job_name} ${enabled ? "started" : "stopped"} successfully`;
        this.errorMessage = "";
        await this.fetchJobs();
      } catch (error) {
        this.message = "";
        this.errorMessage =
          error.response?.data?.message || "Failed to update job";
      }
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

.table-dark ::v-deep th {
  color: #c6ff00 !important;
  background: transparent !important;
  font-weight: 700;
  border-bottom: 1px solid rgba(198, 255, 0, 0.08) !important;
}

.table-dark ::v-deep td {
  color: #d4d4d4 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.table-dark ::v-deep tr:hover {
  background: rgba(198, 255, 0, 0.03);
}

.action-wrap {
  display: flex;
  justify-content: flex-end;
}

.status-pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-running {
  background: rgba(124, 255, 138, 0.12);
  color: #7cff8a;
  border: 1px solid rgba(124, 255, 138, 0.2);
}

.status-stopped {
  background: rgba(255, 107, 107, 0.12);
  color: #ff7b7b;
  border: 1px solid rgba(255, 107, 107, 0.2);
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