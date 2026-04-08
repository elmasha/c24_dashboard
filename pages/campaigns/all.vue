<template>
  <v-container fluid class="admin-page pa-0">
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

      <div class="d-flex align-center">
        <v-btn
          icon
          dark
          class="topbar-icon mr-2"
          @click="fetchCampaigns"
          :loading="loading"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <div class="admin-layout">
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
                <v-icon color="#73D843">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="sidebar-footer">
            <v-btn
              block
              outlined
              color="#73D843"
              class="logout-btn"
              @click="logout"
            >
              Logout
            </v-btn>
          </div>
        </div>
      </aside>

      <main class="admin-main">
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="d-flex flex-wrap align-center">
            <div class="hero-copy" style="margin-left: 10px">
              <div class="hero-kicker" style="margin-left: 0px">
                Campaign Operations
              </div>
              <div class="hero-heading">
                Create, update, assign and monitor campaigns across your network
              </div>
              <div class="hero-subtext" style="margin-left: 0px">
                Manage campaign delivery, status, machine assignment, and
                visibility from one place.
              </div>
            </div>

            <v-spacer />

            <div class="hero-actions mt-4 mt-md-0">
              <nuxt-link to="/campaigns/create" class="text-decoration-none">
                <v-btn class="mr-2 hero-btn-primary" color="#73D843" large>
                  <span class="black--text font-weight-bold">
                    Create Campaign
                  </span>
                </v-btn>
              </nuxt-link>

              <v-btn
                outlined
                large
                class="hero-btn-outline"
                @click="fetchCampaigns"
                :loading="loading"
                style="margin-right: 12px"
              >
                Refresh
              </v-btn>
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
                <th>Image</th>
                <th>Client</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>QR</th>
                <th>Target</th>
                <th>Delivered</th>
                <th>Interactions</th>
                <th>Machines</th>
                <th>Start</th>
                <th>End</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="campaign in campaigns" :key="campaign.id">
                <td>{{ campaign.id }}</td>
                <td>
                  <v-avatar
                    size="38"
                    :color="campaign.image_url ? 'transparent' : '#73D843'"
                  >
                    <template v-if="campaign.image_url">
                      <v-img :src="campaign.image_url" cover />
                    </template>
                    <template v-else>
                      <span class="table-avatar-text">
                        {{
                          (campaign.campaign_name || "")
                            .substring(0, 2)
                            .toUpperCase()
                        }}
                      </span>
                    </template>
                  </v-avatar>
                </td>
                <td>
                  {{ campaign.linked_client_name || campaign.client_name }}
                </td>
                <td>{{ campaign.campaign_name }}</td>
                <td>
                  <span
                    class="status-pill"
                    :class="
                      campaign.status === 'active'
                        ? 'status-active'
                        : 'status-inactive'
                    "
                  >
                    {{ campaign.status }}
                  </span>
                </td>
                <td>
                  <span
                    class="status-pill"
                    :class="
                      Number(campaign.show_qr) === 1
                        ? 'status-active'
                        : 'status-inactive'
                    "
                  >
                    {{
                      Number(campaign.show_qr) === 1 ? "enabled" : "disabled"
                    }}
                  </span>
                </td>
                <td>{{ formatNumber(campaign.target_impressions) }}</td>
                <td>{{ formatNumber(campaign.delivered_impressions) }}</td>
                <td>
                  {{
                    numeral(
                      (campaign.delivered_impressions || 0) * 0.24
                    ).format("0,0")
                  }}
                </td>
                <td>{{ formatNumber(campaign.machine_count || 0) }}</td>
                <td>{{ campaign.start_date }}</td>
                <td>{{ campaign.end_date }}</td>
                <td class="text-right">
                  <div class="action-wrap">
                    <v-btn
                      x-small
                      text
                      color="#73D843"
                      class="mr-1 mb-1"
                      @click="openEditDialog(campaign)"
                    >
                      Edit
                    </v-btn>

                    <v-btn
                      x-small
                      text
                      color="#9be15d"
                      class="mr-1 mb-1"
                      @click="openAssignDialog(campaign)"
                    >
                      Assign
                    </v-btn>

                    <nuxt-link
                      :to="`/view/${campaign.id}`"
                      class="text-decoration-none"
                    >
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
                <td colspan="13">No campaigns found.</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </main>
    </div>

    <v-dialog v-model="editDialog" max-width="960">
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
          <v-alert
            v-if="editErrorMessage"
            type="error"
            dense
            outlined
            class="mb-4"
          >
            {{ editErrorMessage }}
          </v-alert>

          <div v-if="editLoading" class="py-4 dialog-loading">
            Loading campaign...
          </div>

          <v-form v-else>
            <v-row>
              <v-col cols="12" md="6">
                <div class="campaign-image-section">
                  <div class="image-label">Campaign Image</div>

                  <div class="campaign-image-wrap">
                    <div
                      v-if="editForm.image_url"
                      class="campaign-image-preview"
                    >
                      <v-img
                        :src="editForm.image_url"
                        cover
                        height="140"
                        width="140"
                      />
                    </div>

                    <div v-else class="campaign-image-upload text-center">
                      <dropzone
                        id="edit-campaign-dropzone"
                        ref="editCampaignDropzone"
                        class="campaign-dropzone"
                        @vdropzone-success="handleCampaignImageSuccess"
                        :options="campaignImageOptions"
                        @vdropzone-complete="afterEditCampaignImageComplete"
                      >
                        <br />
                        <br />
                        <h4 style="color: black">
                          Drop image or Click to Upload
                        </h4>
                        <v-icon color="black">mdi-cloud-upload</v-icon>
                      </dropzone>
                    </div>
                  </div>

                  <div v-if="editForm.image_url" style="margin-top: 10px">
                    <v-btn
                      x-small
                      text
                      color="#73D843"
                      @click="clearEditCampaignImage"
                    >
                      Remove image
                    </v-btn>
                  </div>
                </div>
              </v-col>

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
                  v-model="editForm.image_url"
                  label="Image URL"
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

              <v-col cols="12" md="4">
                <v-select
                  v-model="editForm.show_qr"
                  :items="[
                    { text: 'Enabled', value: '1' },
                    { text: 'Disabled', value: '0' },
                  ]"
                  item-text="text"
                  item-value="value"
                  label="QR Visibility"
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
          <v-btn
            color="#73D843"
            class="black--text font-weight-bold"
            :loading="editSaving"
            @click="saveCampaignEdit"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="assignDialog" max-width="1200">
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
          Currently assigned:
          {{ formatNumber(selectedCampaign.machine_count || 0) }}<br />
          Available online machines only. You can also add optional per-machine
          overrides.
        </v-card-subtitle>

        <v-card-text>
          <v-alert
            v-if="assignErrorMessage"
            type="error"
            dense
            outlined
            class="mb-4"
          >
            {{ assignErrorMessage }}
          </v-alert>

          <div v-if="assignLoading" class="py-4 dialog-loading">
            Loading machines...
          </div>

          <div v-else style="max-height: 560px; overflow-y: auto">
            <v-simple-table class="table-dark">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Machine</th>
                  <th>UID</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Override Media URL</th>
                  <th>Override Image URL</th>
                  <th>Override Landing URL</th>
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
                  <td>
                    <b style="color: green">{{ machine.status }}</b>
                  </td>
                  <td>
                    <v-text-field
                      v-model="machineOverrides[machine.id].media_url"
                      dense
                      outlined
                      hide-details
                      dark
                      placeholder="Optional media URL"
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model="machineOverrides[machine.id].image_url"
                      dense
                      outlined
                      hide-details
                      dark
                      placeholder="Optional image URL"
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model="machineOverrides[machine.id].landing_url"
                      dense
                      outlined
                      hide-details
                      dark
                      placeholder="Optional landing URL"
                    />
                  </td>
                </tr>

                <tr v-if="!machines.length">
                  <td colspan="9">No online machines found.</td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeAssignDialog">Cancel</v-btn>
          <v-btn
            color="#73D843"
            class="black--text font-weight-bold"
            :loading="assignSaving"
            @click="saveAssignments"
          >
            Save Assignments
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/services/api";
import numeral from "numeral";
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import { v1 as uuidv1 } from "uuid";

export default {
  middleware: "auth",
  components: {
    Dropzone,
  },
  data() {
    return {
      numeral,
      loading: false,
      deletingId: null,
      campaigns: [],
      clients: [],
      successMessage: "",
      errorMessage: "",
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
      ],

      campaignImageOptions: {
        url: "http://httpbin.org/anything",
        maxFiles: 1,
        acceptedFiles: "image/*",
      },

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
        image_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active",
        show_qr: "0",
      },

      assignDialog: false,
      assignLoading: false,
      assignSaving: false,
      assignErrorMessage: "",
      selectedCampaign: null,
      machines: [],
      selectedMachineIds: [],
      originalMachineIds: [],
      machineOverrides: {},
      originalMachineOverrides: {},
    };
  },

  mounted() {
    this.onResize();
    this.fetchCampaigns();
    this.fetchClients();
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
        y: window.innerHeight,
      };
      this.showBurger = this.windowSize.x < 950;
      return this.windowSize;
    },

    handleCampaignImageSuccess(file, response) {
      console.log("Campaign image uploaded", response);
    },

    clearEditCampaignDropzone() {
      if (
        this.$refs.editCampaignDropzone &&
        this.$refs.editCampaignDropzone.dropzone
      ) {
        this.$refs.editCampaignDropzone.dropzone.removeAllFiles();
      }
    },

    async afterEditCampaignImageComplete(uploadedFile) {
      const storageRef = this.$fire.storage.ref();
      const imageName = uuidv1();

      try {
        const metadata = {
          contentType: uploadedFile.type || "image/png",
        };

        const imageRef = storageRef.child(`campaigns/${imageName}.png`);
        await imageRef.put(uploadedFile, metadata);
        const downloadURL = await imageRef.getDownloadURL();

        this.editForm.image_url = downloadURL;
      } catch (error) {
        console.error(error);
        this.editErrorMessage = "Failed to upload campaign image";
      }
    },

    clearEditCampaignImage() {
      this.editForm.image_url = "";
      this.$nextTick(() => {
        this.clearEditCampaignDropzone();
      });
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
          image_url: data.image_url || "",
          landing_url: data.landing_url || "",
          target_impressions: Number(data.target_impressions || 0),
          start_date: this.toInputDateTime(data.start_date),
          end_date: this.toInputDateTime(data.end_date),
          status: data.status || "active",
          show_qr: String(Number(data.show_qr || 0)),
        };

        this.$nextTick(() => {
          this.clearEditCampaignDropzone();
        });
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
        image_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active",
        show_qr: "0",
      };
      this.$nextTick(() => {
        this.clearEditCampaignDropzone();
      });
    },

    onEditClientChange() {
      const selected = this.clients.find(
        (c) => Number(c.id) === Number(this.editForm.client_id)
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
          show_qr: Number(this.editForm.show_qr),
          start_date: this.formatDateTime(this.editForm.start_date),
          end_date: this.formatDateTime(this.editForm.end_date),
        };

        const { data } = await api.put(
          `/api/campaigns/${this.editCampaignId}`,
          payload
        );

        this.successMessage = `${
          data.campaign_name || "Campaign"
        } updated successfully`;

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

    initializeMachineOverrides(machineList, assignedRows = []) {
      const overrides = {};
      const originalOverrides = {};

      machineList.forEach((machine) => {
        const assigned = assignedRows.find(
          (row) => Number(row.machine_id || row.id) === Number(machine.id)
        );

        const machineOverride = {
          media_url: assigned?.override_media_url || "",
          image_url: assigned?.override_image_url || "",
          landing_url: assigned?.override_landing_url || "",
        };

        overrides[machine.id] = { ...machineOverride };
        originalOverrides[machine.id] = { ...machineOverride };
      });

      this.machineOverrides = overrides;
      this.originalMachineOverrides = originalOverrides;
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
        this.machineOverrides = {};
        this.originalMachineOverrides = {};

        const [machinesRes, assignedRes] = await Promise.all([
          api.get("/api/machines"),
          api.get(`/api/campaign-machines/${campaign.id}/machines`),
        ]);

        const allMachines = machinesRes.data || [];
        this.machines = allMachines.filter(
          (machine) => String(machine.status).toLowerCase() === "online"
        );

        const assignedRows = assignedRes.data || [];
        const assignedMachineIds = assignedRows.map((row) =>
          Number(row.machine_id || row.id)
        );

        this.selectedMachineIds = [...assignedMachineIds];
        this.originalMachineIds = [...assignedMachineIds];

        this.initializeMachineOverrides(this.machines, assignedRows);
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
      this.machineOverrides = {};
      this.originalMachineOverrides = {};
    },

    hasOverrideChanged(machineId) {
      const current = this.machineOverrides[machineId] || {
        media_url: "",
        image_url: "",
        landing_url: "",
      };

      const original = this.originalMachineOverrides[machineId] || {
        media_url: "",
        image_url: "",
        landing_url: "",
      };

      return (
        (current.media_url || "") !== (original.media_url || "") ||
        (current.image_url || "") !== (original.image_url || "") ||
        (current.landing_url || "") !== (original.landing_url || "")
      );
    },

    async saveAssignments() {
      if (!this.selectedCampaign) return;

      try {
        this.assignSaving = true;
        this.assignErrorMessage = "";

        const currentIds = this.selectedMachineIds.map((id) => Number(id));
        const originalIds = this.originalMachineIds.map((id) => Number(id));

        const toAssign = currentIds.filter((id) => !originalIds.includes(id));
        const toRemove = originalIds.filter((id) => !currentIds.includes(id));
        const stillAssigned = currentIds.filter((id) =>
          originalIds.includes(id)
        );
        const toUpdate = stillAssigned.filter((id) =>
          this.hasOverrideChanged(id)
        );

        for (const machineId of toAssign) {
          const override = this.machineOverrides[machineId] || {};

          await api.post("/api/campaign-machines/assign", {
            campaign_id: this.selectedCampaign.id,
            machine_id: machineId,
            media_url: override.media_url || null,
            image_url: override.image_url || null,
            landing_url: override.landing_url || null,
          });
        }

        for (const machineId of toUpdate) {
          const override = this.machineOverrides[machineId] || {};

          await api.post("/api/campaign-machines/assign", {
            campaign_id: this.selectedCampaign.id,
            machine_id: machineId,
            media_url: override.media_url || null,
            image_url: override.image_url || null,
            landing_url: override.landing_url || null,
          });
        }

        for (const machineId of toRemove) {
          await api.post("/api/campaign-machines/remove", {
            campaign_id: this.selectedCampaign.id,
            machine_id: machineId,
          });
        }

        this.successMessage = "Campaign assignments updated successfully";

        const updatedCount = currentIds.length;
        const campaignIndex = this.campaigns.findIndex(
          (c) => Number(c.id) === Number(this.selectedCampaign.id)
        );

        if (campaignIndex !== -1) {
          this.$set(this.campaigns, campaignIndex, {
            ...this.campaigns[campaignIndex],
            machine_count: updatedCount,
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

.hero-btn-primary {
  font-weight: 700;
}

.hero-btn-outline {
  border-color: #73d843 !important;
  color: #73d843 !important;
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
  color: #73d843 !important;
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
  color: #73d843;
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

.table-avatar-text {
  color: #000;
  font-size: 11px;
  font-weight: 800;
}

.campaign-image-section {
  margin-bottom: 12px;
}

.image-label {
  color: #d8d8d8;
  margin-bottom: 10px;
  font-size: 14px;
}

.campaign-image-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.campaign-image-preview {
  width: 140px;
  height: 140px;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.campaign-image-upload {
  width: 140px;
  height: 140px;
  overflow: hidden;
  border-radius: 18px;
}

.campaign-dropzone {
  width: 140px;
  height: 140px;
  background-color: white;
  overflow: hidden;
  border-radius: 18px;
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
}
</style>