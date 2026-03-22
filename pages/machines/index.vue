<template>
<div class="machines-page">

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

    <h1 style="margin: 20px;">Machines</h1>
    <v-alert v-if="successMessage" type="success" dense outlined class="mb-4">
        {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
        {{ errorMessage }}
    </v-alert>
    <div class="toolbar">
        <nuxt-link to="/machines/create">
            <v-btn>Add Machine</v-btn>
        </nuxt-link>

        <v-btn @click="fetchMachines">Refresh</v-btn>
    </div>

    <v-simple-table>
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
                <th>Actions</th>
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
                    <span :class="['badge', machine.status]">
                        {{ machine.status }}
                    </span>
                </td>
                <td>{{ machine.status_mode || 'auto' }}</td>
                <td>{{ machine.last_heartbeat || '-' }}</td>
                <td class="actions">
                    <nuxt-link :to="`/machines/${machine.id}`">
                        <v-btn>Edit</v-btn>
                    </nuxt-link>

                    <v-btn text color="green" @click="setMachineStatus(machine, 'online')" :disabled="loadingId === machine.id">
                        Set Online
                    </v-btn>

                    <v-btn text color="red" @click="setMachineStatus(machine, 'offline')" :disabled="loadingId === machine.id">
                        Set Offline
                    </v-btn>

                    <v-btn text color="amber" @click="setMachineAuto(machine)" :disabled="loadingId === machine.id">
                        Auto
                    </v-btn>

                    <v-btn text color="red" @click="deleteMachine(machine)" :disabled="loadingId === machine.id">
                        Delete
                    </v-btn>
                </td>
            </tr>

            <tr v-if="!machines.length">
                <td colspan="9">No machines found.</td>
            </tr>
        </tbody>
    </v-simple-table>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            machines: [],
            loadingId: null,
            successMessage: "",
            errorMessage: ""
        };
    },

    mounted() {
        this.fetchMachines();
    },

    methods: {
        async fetchMachines() {
            try {
                this.errorMessage = "";
                const {
                    data
                } = await api.get("/api/machines");
                this.machines = data;
            } catch (error) {
                console.error("fetchMachines error:", error);
                this.errorMessage =
                    error.response;
            }
        },

        async setMachineStatus(machine, status) {
            try {
                this.loadingId = machine.id;
                this.successMessage = "";
                this.errorMessage = "";

                const {
                    data
                } = await api.put(`/api/machines/${machine.id}/status`, {
                    status,
                    status_mode: "manual"
                });

                this.successMessage = `${data.machine_name || machine.machine_name} set to ${status} (manual mode)`;
                await this.fetchMachines();
            } catch (error) {
                console.error("setMachineStatus error:", error);
                this.errorMessage =
                    error.response;
            } finally {
                this.loadingId = null;
            }
        },

        async setMachineAuto(machine) {
            try {
                this.loadingId = machine.id;
                this.successMessage = "";
                this.errorMessage = "";

                const {
                    data
                } = await api.put(`/api/machines/${machine.id}/auto-mode`);

                this.successMessage = `${data.machine_name || machine.machine_name} returned to auto mode`;
                await this.fetchMachines();
            } catch (error) {
                console.error("setMachineAuto error:", error);
                this.errorMessage =
                    error.response;
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

                const {
                    data
                } = await api.delete(`/api/machines/${machine.id}`);

                this.successMessage = data.message || "Machine deleted successfully";
                await this.fetchMachines();
            } catch (error) {
                console.error("deleteMachine error:", error);
                this.errorMessage =
                    error.response;
            } finally {
                this.loadingId = null;
            }
        }
    }
};
</script>

<style scoped>
.machines-page {
    padding: 20px;
}

.toolbar {
    margin-bottom: 16px;
    display: flex;
    gap: 10px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    vertical-align: middle;
}

.actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

v-btn {
    padding: 8px 10px;
    cursor: pointer;
}

.success {
    color: green;
    margin-top: 16px;
}

.error {
    color: red;
    margin-top: 16px;
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 999px;
    color: #fff;
    text-transform: capitalize;
    font-size: 12px;
}

.badge.online {
    background: #16a34a;
}

.badge.offline {
    background: #dc2626;
}
</style>
