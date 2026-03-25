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
          <div class="page-badge" style="margin-top: 18px;">Admin Portal</div>
        </div>
      </div>

      <v-spacer />

      <div class="d-flex align-center">
        <v-btn icon dark class="topbar-icon mr-2" @click="refreshMachines">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <div class="admin-layout" v-resize="onResize">
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
                <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="sidebar-footer">
            <v-btn block outlined color="#C6FF00" class="logout-btn" @click="logout">
              Logout
            </v-btn>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="admin-main">
        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="d-flex flex-wrap align-center">
            <div class="hero-copy" style="margin-left: 10px;">
              <div class="hero-kicker">Machine Operations</div>
              <div class="hero-heading">
                Monitor machine status, control availability, and manage deployment points
              </div>
              <div class="hero-subtext">
                View machine health, location, category, heartbeat activity, and quickly switch between manual and auto operation modes.
              </div>
            </div>

            <v-spacer />

            <div class="hero-actions mt-4 mt-md-0">
              <nuxt-link to="/machines/create" class="text-decoration-none">
                <v-btn class="mr-2 hero-btn-primary" color="#C6FF00" large>
                  <span class="black--text font-weight-bold">Add Machine</span>
                </v-btn>
              </nuxt-link>

              <v-btn outlined large class="hero-btn-outline" @click="refreshMachines" style="margin-right:12px">
                Refresh
              </v-btn>
            </div>
          </div>
        </v-card>

        <v-alert v-if="successMessage" type="success" dense outlined class="mb-4 dashboard-alert">
          {{ successMessage }}
        </v-alert>

        <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
          {{ errorMessage }}
        </v-alert>

        <!-- Machines table -->
        <v-card class="panel-card pa-4" outlined>
          <div class="panel-head mb-3 search-head">
            <div>
              <div class="panel-kicker">Deployment Directory</div>
              <div class="panel-title">All Machines</div>
            </div>

            <div class="search-box-wrap">
              <v-text-field
                v-model="searchQuery"
                dense
                outlined
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
                label="Search UID, name, location, category"
                class="machine-search"
                @keyup.enter="searchMachines"
                @change="searchMachines"
                @click:clear="clearSearch"
              />
              <v-btn color="#C6FF00" class="black--text font-weight-bold ml-2" @click="searchMachines">
                Search
              </v-btn>
            </div>
          </div>

          <v-simple-table class="table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Machine</th>
                <th>UID</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Mode</th>
                <th>Last Heartbeat</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="machine in machines" :key="machine.id">
                <td>{{ machine.id }}</td>
                <td>{{ machine.machine_name }}</td>
                <td>{{ machine.machine_uid }}</td>
                <td>{{ machine.location_name }}</td>
                <td>{{ machine.location_category }}</td>
                <td>
                  <span
                    class="status-pill"
                    :class="machine.status === 'online' ? 'status-online' : 'status-offline'"
                  >
                    {{ machine.status }}
                  </span>
                </td>
                <td>
                  <span
                    class="mode-pill"
                    :class="machine.status_mode === 'manual' ? 'mode-manual' : 'mode-auto'"
                  >
                    {{ machine.status_mode || 'auto' }}
                  </span>
                </td>
                <td>{{ machine.last_heartbeat || '-' }}</td>
                <td class="text-right">
                  <div class="action-wrap">
                    <nuxt-link :to="`/machines/${machine.id}`" class="text-decoration-none">
                      <v-btn x-small text color="#C6FF00" class="mr-1 mb-1">
                        Edit
                      </v-btn>
                    </nuxt-link>

                    <v-btn
                      x-small
                      text
                      color="#7CFF8A"
                      class="mr-1 mb-1"
                      @click="setMachineStatus(machine, 'online')"
                      :disabled="loadingId === machine.id"
                    >
                      Set Online
                    </v-btn>

                    <v-btn
                      x-small
                      text
                      color="#FF7B7B"
                      class="mr-1 mb-1"
                      @click="setMachineStatus(machine, 'offline')"
                      :disabled="loadingId === machine.id"
                    >
                      Set Offline
                    </v-btn>

                    <v-btn
                      x-small
                      text
                      color="#FFD54F"
                      class="mr-1 mb-1"
                      @click="setMachineAuto(machine)"
                      :disabled="loadingId === machine.id"
                    >
                      Auto
                    </v-btn>

                    <v-btn
                      x-small
                      text
                      color="#ff6b6b"
                      class="mb-1"
                      @click="deleteMachine(machine)"
                      :disabled="loadingId === machine.id"
                    >
                      Delete
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr v-if="!machines.length">
                <td colspan="9">
                  {{ searchActive ? "No machines match your search." : "No machines found." }}
                </td>
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
  middleware: "auth",
  data() {
    return {
      machines: [],
      loadingId: null,
      successMessage: "",
      errorMessage: "",
      showBurger: false,
      searchQuery: "",
      searchActive: false,
      windowSize: {
        x: null,
        y: null
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
        }
      ]
    };
  },

  mounted() {
    this.onResize();
    this.fetchMachines();
  },

  methods: {
    logout() {
      this.$fire.auth.signOut();
      window.location.reload(true);
    },

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

    async fetchMachines() {
      try {
        this.errorMessage = "";
        const { data } = await api.get("/api/machines");
        this.machines = data || [];
        this.searchActive = false;
      } catch (error) {
        console.error("fetchMachines error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load machines";
      }
    },

    async searchMachines() {
      try {
        this.errorMessage = "";

        if (!this.searchQuery || !this.searchQuery.trim()) {
          await this.fetchMachines();
          return;
        }

        const { data } = await api.get("/api/machines/search", {
          params: {
            q: this.searchQuery.trim()
          }
        });

        this.machines = data || [];
        console.log(data);
        this.searchActive = true;
      } catch (error) {
        console.error("searchMachines error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to search machines";
      }
    },

    async clearSearch() {
      this.searchQuery = "";
      await this.fetchMachines();
    },

    async refreshMachines() {
      if (this.searchQuery && this.searchQuery.trim()) {
        await this.searchMachines();
      } else {
        await this.fetchMachines();
      }
    },

    async setMachineStatus(machine, status) {
      try {
        this.loadingId = machine.id;
        this.successMessage = "";
        this.errorMessage = "";

        const { data } = await api.put(`/api/machines/${machine.id}/status`, {
          status,
          status_mode: "manual"
        });

        this.successMessage = `${data.machine_name || machine.machine_name} set to ${status} (manual mode)`;
        await this.refreshMachines();
      } catch (error) {
        console.error("setMachineStatus error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to update machine status";
      } finally {
        this.loadingId = null;
      }
    },

    async setMachineAuto(machine) {
      try {
        this.loadingId = machine.id;
        this.successMessage = "";
        this.errorMessage = "";

        const { data } = await api.put(`/api/machines/${machine.id}/auto-mode`);

        this.successMessage = `${data.machine_name || machine.machine_name} returned to auto mode`;
        await this.refreshMachines();
      } catch (error) {
        console.error("setMachineAuto error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to set auto mode";
      } finally {
        this.loadingId = null;
      }
    },

    async deleteMachine(machine) {
      const confirmed = window.confirm(
        `Delete machine "${machine.machine_name}"?`
      );
      if (!confirmed) return;

      try {
        this.loadingId = machine.id;
        this.successMessage = "";
        this.errorMessage = "";

        const { data } = await api.delete(`/api/machines/${machine.id}`);

        this.successMessage = data.message || "Machine deleted successfully";
        await this.refreshMachines();
      } catch (error) {
        console.error("deleteMachine error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to delete machine";
      } finally {
        this.loadingId = null;
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

.hero-btn-primary {
  font-weight: 700;
}

.hero-btn-outline {
  border-color: #c6ff00 !important;
  color: #c6ff00 !important;
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

.search-head {
  gap: 16px;
  flex-wrap: wrap;
}

.search-box-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.machine-search {
  min-width: 320px;
  max-width: 420px;
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
  flex-wrap: wrap;
  justify-content: flex-end;
}

.status-pill,
.mode-pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-online {
  background: rgba(124, 255, 138, 0.12);
  color: #7CFF8A;
  border: 1px solid rgba(124, 255, 138, 0.2);
}

.status-offline {
  background: rgba(255, 107, 107, 0.12);
  color: #FF7B7B;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.mode-auto {
  background: rgba(198, 255, 0, 0.12);
  color: #c6ff00;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.mode-manual {
  background: rgba(255, 213, 79, 0.12);
  color: #FFD54F;
  border: 1px solid rgba(255, 213, 79, 0.18);
}

.text-decoration-none {
  text-decoration: none;
}

@media (max-width: 960px) {
  .admin-layout {
    display: block;
  }

  .admin-main {
    padding: 16px;
  }

  .hero-heading {
    font-size: 22px;
  }

  .machine-search {
    min-width: 100%;
    max-width: 100%;
  }

  .search-box-wrap {
    width: 100%;
  }
}
</style>