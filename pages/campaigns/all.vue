<template>
<v-container fluid class="pa-4">
    <v-row>
        <v-col cols="12" md="12"></v-col>
        <v-col cols="12" md="12">
            <div class="">
                <nuxt-link style="text-decoration: none; color: white;margin-left: 10px; margin-top: 40px;" icon to="/admin/dashboard">
                    <v-icon large>mdi-arrow-left</v-icon>
                </nuxt-link>
            </div>
        </v-col>
    </v-row>
    <div class="d-flex align-center mb-4">
        <h2 style="margin: 20px;" class="text-h4 mb-0">Campaigns</h2>
        <v-spacer />

        <nuxt-link to="/campaigns/create">
            <v-btn small class="mr-2">Create Campaign</v-btn>
        </nuxt-link>

        <v-btn small @click="fetchCampaigns" :loading="loading">Refresh</v-btn>
    </div>

    <v-alert v-if="successMessage" type="success" dense outlined class="mb-4">
        {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
        {{ errorMessage }}
    </v-alert>

    <v-card outlined class="pa-2">
        <v-simple-table>
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
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="campaign in campaigns" :key="campaign.id">
                    <td>{{ campaign.id }}</td>
                    <td>{{ campaign.linked_client_name || campaign.client_name }}</td>
                    <td>{{ campaign.campaign_name }}</td>
                    <td>{{ campaign.status }}</td>
                    <td>{{ formatNumber(campaign.target_impressions) }}</td>
                    <td>{{ formatNumber(campaign.delivered_impressions) }}</td>
                    <td>{{ formatNumber(campaign.machine_count || 0) }}</td>
                    <td>{{ campaign.start_date }}</td>
                    <td>{{ campaign.end_date }}</td>
                    <td>
                        <div class="d-flex flex-wrap">
                            <v-btn x-small text color="primary" class="mr-1 mb-1" @click="openEditDialog(campaign)">
                                Edit
                            </v-btn>

                            <v-btn x-small text color="secondary" class="mr-1 mb-1" @click="openAssignDialog(campaign)">
                                Assign
                            </v-btn>

                            <nuxt-link :to="`/view-campaign/${campaign.id}`">
                                <v-btn x-small text class="mr-1 mb-1">
                                    View
                                </v-btn>
                            </nuxt-link>

                            <v-btn x-small text color="error" class="mb-1" :loading="deletingId === campaign.id" @click="deleteCampaign(campaign)">
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

    <!-- Edit Campaign Dialog -->
    <v-dialog v-model="editDialog" max-width="900">
        <v-card>
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

                <div v-if="editLoading" class="py-4">
                    Loading campaign...
                </div>

                <v-form v-else>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-select v-model="editForm.client_id" :items="clients" item-text="client_name" item-value="id" label="Client" outlined dense @change="onEditClientChange" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="editForm.campaign_name" label="Campaign Name" outlined dense />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="editForm.media_url" label="Media URL" outlined dense />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="editForm.landing_url" label="Landing URL" outlined dense />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model.number="editForm.target_impressions" label="Target Impressions" type="number" outlined dense />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="editForm.start_date" label="Start Date" type="datetime-local" outlined dense />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="editForm.end_date" label="End Date" type="datetime-local" outlined dense />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="editForm.status" :items="['active', 'paused', 'ended']" label="Status" outlined dense />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn text @click="closeEditDialog">Cancel</v-btn>
                <v-btn color="primary" :loading="editSaving" @click="saveCampaignEdit">
                    Save Changes
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Assign Machines Dialog -->
    <v-dialog v-model="assignDialog" max-width="950">
        <v-card>
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

                <div v-if="assignLoading" class="py-4">
                    Loading machines...
                </div>

                <div v-else>
                    <v-simple-table>
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
                                    <v-checkbox v-model="selectedMachineIds" :value="machine.id" hide-details dense class="mt-0" />
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
                <v-btn color="primary" :loading="assignSaving" @click="saveAssignments">
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
        this.fetchCampaigns();
        this.fetchClients();
    },

    methods: {
        async fetchCampaigns() {
            try {
                this.loading = true;
                this.errorMessage = "";

                const {
                    data
                } = await api.get("/api/campaigns");
                this.campaigns = data || [];
            } catch (error) {
                console.error("fetchCampaigns error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to load campaigns";
            } finally {
                this.loading = false;
            }
        },

        async fetchClients() {
            try {
                const {
                    data
                } = await api.get("/api/clients");
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

                const {
                    data
                } = await api.delete(`/api/campaigns/${campaign.id}`);
                this.successMessage = data.message || "Campaign deleted successfully";

                await this.fetchCampaigns();
            } catch (error) {
                console.error("deleteCampaign error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to delete campaign";
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

                const {
                    data
                } = await api.get(`/api/campaigns/${campaign.id}`);

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
                    error.response.data.message || "Failed to load campaign";
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

                const {
                    data
                } = await api.put(
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
                    error.response.data.message || "Failed to update campaign";
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
                this.selectedCampaign = {
                    ...campaign
                };
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
                    error.response.data.message || "Failed to load machine assignments";
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
                    error.response.data.message || "Failed to save assignments";
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
