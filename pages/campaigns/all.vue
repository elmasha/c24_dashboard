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
          <h1 class="page-title" style="font-size: 0.8rem;">Campaign Management</h1>
        </div>
      </div>

      <v-spacer />

      <div class="d-flex align-center">
        <v-btn icon dark class="topbar-icon mr-2" @click="fetchCampaigns" :loading="loading">
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
              Manage campaigns, machines and client activity
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
        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="d-flex flex-wrap align-center">
            <div class="hero-copy " style="margin-left: 10px;">
              <div class="hero-kicker" style="margin-left: 0px;">Campaign Operations</div>
              <div class="hero-heading">
                Create, update, assign and monitor campaigns across your network
              </div>
              <div class="hero-subtext" style="margin-left: 0px;">
                Manage campaign delivery, status, machine assignment, and visibility from one place.
              </div>
            </div>

            <v-spacer />

            <div class="hero-actions mt-4 mt-md-0">
              <nuxt-link to="/campaigns/create" class="text-decoration-none">
                <v-btn class="mr-2 hero-btn-primary" color="#C6FF00" large>
                  <span class="black--text font-weight-bold">Create Campaign</span>
                </v-btn>
              </nuxt-link>

              <v-btn outlined large class="hero-btn-outline" @click="fetchCampaigns" :loading="loading">
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

        <!-- Campaigns Table -->
        <v-card class="panel-card pa-4" outlined>
          <div class="panel-head mb-3">
            <div>
              <div class="panel-kicker">Campaign Directory</div>
              <div class="panel-title">All Campaigns</div>
            </div>
          </div>

          <v-simple-table class="table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Target</th>
                <th>Delivered</th>
                <th>Machines</th>
                <th>Start</th>
                <th>End</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="campaign in campaigns" :key="campaign.id">
                <td>{{ campaign.id }}</td>
                <td>{{ campaign.linked_client_name || campaign.client_name }}</td>
                <td>{{ campaign.campaign_name }}</td>
                <td>
                  <span
                    class="status-pill"
                    :class="campaign.status === 'active' ? 'status-active' : 'status-inactive'"
                  >
                    {{ campaign.status }}
                  </span>
                </td>
                <td>{{ formatNumber(campaign.target_impressions) }}</td>
                <td>{{ formatNumber(campaign.delivered_impressions) }}</td>
                <td>{{ formatNumber(campaign.machine_count || 0) }}</td>
                <td>{{ campaign.start_date }}</td>
                <td>{{ campaign.end_date }}</td>
                <td class="text-right">
                  <div class="action-wrap">
                    <v-btn x-small text color="#C6FF00" class="mr-1 mb-1" @click="openEditDialog(campaign)">
                      Edit
                    </v-btn>

                    <v-btn x-small text color="#9be15d" class="mr-1 mb-1" @click="openAssignDialog(campaign)">
                      Assign
                    </v-btn>

                    <nuxt-link :to="`/view-campaign/${campaign.id}`" class="text-decoration-none">
                      <v-btn x-small text class="mr-1 mb-1 action-view-btn">
                        View
                      </v-btn>
                    </nuxt-link>

                    <v-btn
                      x-small
                      text
                      color="#ff6b6b"
                      class="mb-1"
                      :loading="deletingId === campaign.id"
                      @click="deleteCampaign(campaign)"
                    >
                      Delete
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr v-if="!campaigns.length">
                <td colspan="10">No campaigns found.</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </main>
    </div>

    <!-- Edit Campaign Dialog -->
    <v-dialog v-model="editDialog" max-width="900">
      <v-card class="dialog-card">
        <v-card-title class="d-flex align-center">
          <span class="text-h6">
            Edit Campaign
            <span v-if="editForm.campaign_name">
              - {{ editForm.campaign_name }}
            </span>
          </span>

          <v-spacer />

          <v-btn icon @click="closeEditDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-alert v-if="editErrorMessage" type="error" dense outlined class="mb-4">
            {{ editErrorMessage }}
          </v-alert>

          <div v-if="editLoading" class="py-4 dialog-loading">
            Loading campaign...
          </div>

          <v-form v-else>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.client_id"
                  :items="clients"
                  item-text="client_name"
                  item-value="id"
                  label="Client"
                  outlined
                  dense
                  dark
                  @change="onEditClientChange"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.campaign_name"
                  label="Campaign Name"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.media_url"
                  label="Media URL"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.landing_url"
                  label="Landing URL"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editForm.target_impressions"
                  label="Target Impressions"
                  type="number"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editForm.start_date"
                  label="Start Date"
                  type="datetime-local"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editForm.end_date"
                  label="End Date"
                  type="datetime-local"
                  outlined
                  dense
                  dark
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="editForm.status"
                  :items="['active', 'paused', 'ended']"
                  label="Status"
                  outlined
                  dense
                  dark
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="#C6FF00" class="black--text font-weight-bold" :loading="editSaving" @click="saveCampaignEdit">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign Machines Dialog -->
    <v-dialog v-model="assignDialog" max-width="950">
      <v-card class="dialog-card">
        <v-card-title class="d-flex align-center">
          <span class="text-h6">
            Assign Machines
            <span v-if="selectedCampaign">
              - {{ selectedCampaign.campaign_name }}
            </span>
          </span>

          <v-spacer />

          <v-btn icon @click="closeAssignDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-subtitle v-if="selectedCampaign">
          Currently assigned: {{ formatNumber(selectedCampaign.machine_count || 0) }}
        </v-card-subtitle>

        <v-card-text>
          <v-alert v-if="assignErrorMessage" type="error" dense outlined class="mb-4">
            {{ assignErrorMessage }}
          </v-alert>

          <div v-if="assignLoading" class="py-4 dialog-loading">
            Loading machines...
          </div>

          <div v-else>
            <v-simple-table class="table-dark">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Machine</th>
                  <th>UID</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="machine in machines" :key="machine.id">
                  <td>
                    <v-checkbox
                      v-model="selectedMachineIds"
                      :value="machine.id"
                      hide-details
                      dense
                      class="mt-0"
                    />
                  </td>
                  <td>{{ machine.machine_name }}</td>
                  <td>{{ machine.machine_uid }}</td>
                  <td>{{ machine.location_name }}</td>
                  <td>{{ machine.location_category }}</td>
                  <td>{{ machine.status }}</td>
                </tr>

                <tr v-if="!machines.length">
                  <td colspan="6">No machines found.</td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeAssignDialog">Cancel</v-btn>
          <v-btn color="#C6FF00" class="black--text font-weight-bold" :loading="assignSaving" @click="saveAssignments">
            Save Assignments
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      loading: false,
      deletingId: null,
      campaigns: [],
      clients: [],
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

      editDialog: false,
      editLoading: false,
      editSaving: false,
      editErrorMessage: "",
      editCampaignId: null,
      editForm: {
        client_id: "",
        client_name: "",
        campaign_name: "",
        media_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active"
      },

      assignDialog: false,
      assignLoading: false,
      assignSaving: false,
      assignErrorMessage: "",
      selectedCampaign: null,
      machines: [],
      selectedMachineIds: [],
      originalMachineIds: []
    };
  },

  mounted() {
    this.onResize();
    this.fetchCampaigns();
    this.fetchClients();
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

    async fetchCampaigns() {
      try {
        this.loading = true;
        this.errorMessage = "";

        const { data } = await api.get("/api/campaigns");
        this.campaigns = data || [];
      } catch (error) {
        console.error("fetchCampaigns error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load campaigns";
      } finally {
        this.loading = false;
      }
    },

    async fetchClients() {
      try {
        const { data } = await api.get("/api/clients");
        this.clients = data || [];
      } catch (error) {
        console.error("fetchClients error:", error);
      }
    },

    async deleteCampaign(campaign) {
      const confirmed = window.confirm(
        `Delete campaign "${campaign.campaign_name}"?`
      );
      if (!confirmed) return;

      try {
        this.deletingId = campaign.id;
        this.successMessage = "";
        this.errorMessage = "";

        const { data } = await api.delete(`/api/campaigns/${campaign.id}`);
        this.successMessage = data.message || "Campaign deleted successfully";

        await this.fetchCampaigns();
      } catch (error) {
        console.error("deleteCampaign error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to delete campaign";
      } finally {
        this.deletingId = null;
      }
    },

    async openEditDialog(campaign) {
      try {
        this.editDialog = true;
        this.editLoading = true;
        this.editSaving = false;
        this.editErrorMessage = "";
        this.editCampaignId = campaign.id;

        const { data } = await api.get(`/api/campaigns/${campaign.id}`);

        this.editForm = {
          client_id: data.client_id || "",
          client_name: data.linked_client_name || data.client_name || "",
          campaign_name: data.campaign_name || "",
          media_url: data.media_url || "",
          landing_url: data.landing_url || "",
          target_impressions: Number(data.target_impressions || 0),
          start_date: this.toInputDateTime(data.start_date),
          end_date: this.toInputDateTime(data.end_date),
          status: data.status || "active"
        };
      } catch (error) {
        console.error("openEditDialog error:", error);
        this.editErrorMessage =
          error.response?.data?.message || "Failed to load campaign";
      } finally {
        this.editLoading = false;
      }
    },

    closeEditDialog() {
      this.editDialog = false;
      this.editLoading = false;
      this.editSaving = false;
      this.editErrorMessage = "";
      this.editCampaignId = null;
      this.editForm = {
        client_id: "",
        client_name: "",
        campaign_name: "",
        media_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active"
      };
    },

    onEditClientChange() {
      const selected = this.clients.find(
        c => Number(c.id) === Number(this.editForm.client_id)
      );
      this.editForm.client_name = selected ? selected.client_name : "";
    },

    async saveCampaignEdit() {
      if (!this.editCampaignId) return;

      try {
        this.editSaving = true;
        this.editErrorMessage = "";

        const payload = {
          ...this.editForm,
          start_date: this.formatDateTime(this.editForm.start_date),
          end_date: this.formatDateTime(this.editForm.end_date)
        };

        const { data } = await api.put(
          `/api/campaigns/${this.editCampaignId}`,
          payload
        );

        this.successMessage =
          `${data.campaign_name || "Campaign"} updated successfully`;

        this.closeEditDialog();
        await this.fetchCampaigns();
      } catch (error) {
        console.error("saveCampaignEdit error:", error);
        this.editErrorMessage =
          error.response?.data?.message || "Failed to update campaign";
      } finally {
        this.editSaving = false;
      }
    },

    async openAssignDialog(campaign) {
      try {
        this.assignDialog = true;
        this.assignLoading = true;
        this.assignSaving = false;
        this.assignErrorMessage = "";
        this.selectedCampaign = { ...campaign };
        this.selectedMachineIds = [];
        this.originalMachineIds = [];

        const [machinesRes, assignedRes] = await Promise.all([
          api.get("/api/machines"),
          api.get(`/api/campaign-machines/${campaign.id}/machines`)
        ]);

        this.machines = machinesRes.data || [];

        const assignedMachineIds = (assignedRes.data || []).map(row =>
          Number(row.machine_id || row.id)
        );

        this.selectedMachineIds = [...assignedMachineIds];
        this.originalMachineIds = [...assignedMachineIds];
      } catch (error) {
        console.error("openAssignDialog error:", error);
        this.assignErrorMessage =
          error.response?.data?.message || "Failed to load machine assignments";
      } finally {
        this.assignLoading = false;
      }
    },

    closeAssignDialog() {
      this.assignDialog = false;
      this.assignLoading = false;
      this.assignSaving = false;
      this.assignErrorMessage = "";
      this.selectedCampaign = null;
      this.machines = [];
      this.selectedMachineIds = [];
      this.originalMachineIds = [];
    },

    async saveAssignments() {
      if (!this.selectedCampaign) return;

      try {
        this.assignSaving = true;
        this.assignErrorMessage = "";

        const currentIds = this.selectedMachineIds.map(id => Number(id));
        const originalIds = this.originalMachineIds.map(id => Number(id));

        const toAssign = currentIds.filter(id => !originalIds.includes(id));
        const toRemove = originalIds.filter(id => !currentIds.includes(id));

        for (const machineId of toAssign) {
          await api.post("/api/campaign-machines/assign", {
            campaign_id: this.selectedCampaign.id,
            machine_id: machineId
          });
        }

        for (const machineId of toRemove) {
          await api.post("/api/campaign-machines/remove", {
            campaign_id: this.selectedCampaign.id,
            machine_id: machineId
          });
        }

        this.successMessage = "Campaign assignments updated successfully";

        const updatedCount = currentIds.length;
        const campaignIndex = this.campaigns.findIndex(
          c => Number(c.id) === Number(this.selectedCampaign.id)
        );

        if (campaignIndex !== -1) {
          this.$set(this.campaigns, campaignIndex, {
            ...this.campaigns[campaignIndex],
            machine_count: updatedCount
          });
        }

        this.closeAssignDialog();
      } catch (error) {
        console.error("saveAssignments error:", error);
        this.assignErrorMessage =
          error.response?.data?.message || "Failed to save assignments";
      } finally {
        this.assignSaving = false;
      }
    },

    formatDateTime(value) {
      if (!value) return null;
      return value.replace("T", " ") + ":00";
    },

    toInputDateTime(value) {
      if (!value) return "";
      return String(value).slice(0, 16).replace(" ", "T");
    },

    formatNumber(value) {
      return Number(value || 0).toLocaleString();
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

.action-view-btn {
  color: #ffffff !important;
}

.status-pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-active {
  background: rgba(198, 255, 0, 0.12);
  color: #c6ff00;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.status-inactive {
  background: rgba(255, 255, 255, 0.06);
  color: #d6d6d6;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.text-decoration-none {
  text-decoration: none;
}

.dialog-card {
  background: linear-gradient(180deg, #111111, #090909) !important;
  color: #fff;
}

.dialog-loading {
  color: #bdbdbd;
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