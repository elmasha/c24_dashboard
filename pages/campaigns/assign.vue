<template>
<div class="assign-page">
    <h1>Assign Campaign to Machines</h1>

    <div class="top-section">
        <div>
            <label>Select Campaign</label>
            <select v-model="selectedCampaignId" @change="onCampaignChange">
                <option value="">Select Campaign</option>
                <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                    {{ campaign.campaign_name }} - {{ campaign.linked_client_name || campaign.client_name }}
                </option>
            </select>
        </div>
    </div>

    <div v-if="selectedCampaignId" class="content-grid">
        <div class="machines-panel">
            <h2>Available Machines</h2>

            <table border="1" cellpadding="8" cellspacing="0" width="100%">
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
                            <input type="checkbox" :value="machine.id" v-model="selectedMachineIds" />
                        </td>
                        <td>{{ machine.machine_name }}</td>
                        <td>{{ machine.machine_uid }}</td>
                        <td>{{ machine.location_name }}</td>
                        <td>{{ machine.location_category }}</td>
                        <td>
                            <div v-if="machine.status == 'online'" style="background-color:green;color:white">{{ machine.status }}</div>
                            <div v-if="machine.status == 'offline'" style="background-color:red;color:white">{{ machine.status }}</div>
                        </td>

                    </tr>
                </tbody>
            </table>

            <br />

            <button @click="assignSelectedMachines" :disabled="loading">
                {{ loading ? "Assigning..." : "Assign Selected Machines" }}
            </button>
        </div>

        <div class="assigned-panel">
            <h2>Assigned Machines</h2>

            <table border="1" cellpadding="8" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Machine</th>
                        <th>UID</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="assigned in assignedMachines" :key="assigned.id">
                        <td>{{ assigned.machine_name }}</td>
                        <td>{{ assigned.machine_uid }}</td>
                        <td>{{ assigned.location_name }}</td>
                        <td>{{ assigned.location_category }}</td>
                        <td>
                            <button @click="removeAssignedMachine(assigned.machine_id)">
                                Remove
                            </button>
                        </td>
                    </tr>

                    <tr v-if="!assignedMachines.length">
                        <td colspan="5">No machines assigned yet.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            campaigns: [],
            machines: [],
            assignedMachines: [],
            selectedCampaignId: "",
            selectedMachineIds: [],
            loading: false,
            successMessage: "",
            errorMessage: ""
        };
    },

    mounted() {
        this.fetchCampaigns();
        this.fetchMachines();
    },

    methods: {
        async fetchCampaigns() {
            try {
                const {
                    data
                } = await api.get("/api/campaigns");
                this.campaigns = data;
            } catch (error) {
                console.error("fetchCampaigns error:", error);
                this.errorMessage = "Failed to load campaigns";
            }
        },

        async fetchMachines() {
            try {
                const {
                    data
                } = await api.get("/api/machines");
                this.machines = data;
            } catch (error) {
                console.error("fetchMachines error:", error);
                this.errorMessage = "Failed to load machines";
            }
        },

        async onCampaignChange() {
            this.selectedMachineIds = [];
            this.successMessage = "";
            this.errorMessage = "";

            if (!this.selectedCampaignId) {
                this.assignedMachines = [];
                return;
            }

            await this.fetchAssignedMachines();
        },

        async fetchAssignedMachines() {
            try {
                const {
                    data
                } = await api.get(
                    `/api/campaign-machines/${this.selectedCampaignId}/machines`
                );
                this.assignedMachines = data;
            } catch (error) {
                console.error("fetchAssignedMachines error:", error);
                this.errorMessage = "Failed to load assigned machines";
            }
        },

        async assignSelectedMachines() {
            if (!this.selectedCampaignId) {
                this.errorMessage = "Please select a campaign";
                return;
            }

            if (!this.selectedMachineIds.length) {
                this.errorMessage = "Please select at least one machine";
                return;
            }

            this.loading = true;
            this.successMessage = "";
            this.errorMessage = "";

            try {
                for (const machineId of this.selectedMachineIds) {
                    await api.post("/api/campaign-machines/assign", {
                        campaign_id: this.selectedCampaignId,
                        machine_id: machineId
                    });
                }

                this.successMessage = "Machines assigned successfully";
                this.selectedMachineIds = [];
                await this.fetchAssignedMachines();
            } catch (error) {
                console.error("assignSelectedMachines error:", error);
                this.errorMessage =
                    error.response ;
            } finally {
                this.loading = false;
            }
        },

        async removeAssignedMachine(machineId) {
            try {
                await api.post("/api/campaign-machines/remove", {
                    campaign_id: this.selectedCampaignId,
                    machine_id: machineId
                });

                this.successMessage = "Machine removed successfully";
                await this.fetchAssignedMachines();
            } catch (error) {
                console.error("removeAssignedMachine error:", error);
                this.errorMessage =  error.response ;
            }
        }
    }
};
</script>

<style scoped>
.assign-page {
    padding: 20px;
}

.top-section {
    margin-bottom: 20px;
    max-width: 500px;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.machines-panel,
.assigned-panel {
    overflow-x: auto;
}

select,
button {
    padding: 10px;
}

.success {
    color: green;
    margin-top: 15px;
}

.error {
    color: red;
    margin-top: 15px;
}
</style>
