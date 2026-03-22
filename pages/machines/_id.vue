<template>
<div class="edit-machine-page">
    <h1>Edit Machine</h1>
    <v-alert v-if="successMessage" type="success" dense outlined class="mb-4">
        {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
        {{ errorMessage }}
    </v-alert>
    <div v-if="loading">Loading...</div>

    <form v-else @submit.prevent="updateMachine" class="machine-form">
        <div>
            <label>Machine UID</label>
            <v-text-field outlined v-model="form.machine_uid" type="text" required />
        </div>

        <div>
            <label>Machine Name</label>
            <v-text-field outlined v-model="form.machine_name" type="text" required />
        </div>

        <div>
            <label>Location Name</label>
            <v-text-field outlined v-model="form.location_name" type="text" required />
        </div>

        <div>
            <label>Location Category</label>
            <select v-model="form.location_category" required>
                <option value="airport">airport</option>
                <option value="mall">mall</option>
                <option value="club">club</option>
                <option value="restaurant">restaurant</option>
                <option value="shop">shop</option>
            </select>
        </div>

        <div>
            <label>Visibility Rate</label>
            <v-text-field outlined v-model.number="form.visibility_rate" type="number" step="0.01" min="0" max="1" />
        </div>

        <div>
            <label>Slot Duration (seconds)</label>
            <v-text-field outlined v-model.number="form.slot_duration" type="number" min="1" />
        </div>

        <div>
            <label>Slots Per Loop</label>
            <v-text-field outlined v-model.number="form.slots_per_loop" type="number" min="1" />
        </div>

        <div>
            <label>Status</label>
            <select v-model="form.status" style="color: aliceblue;">
                <option style="color: black;" value="offline">offline</option>
                <option style="color: black;" value="online">online</option>
            </select>
        </div>

        <div>
            <label>Status Mode</label>
            <select v-model="form.status_mode" style="color: aliceblue;">
                <option style="color: black;" value="auto">auto</option>
                <option style="color: black;" value="manual">manual</option>
            </select>
        </div>

        <div class="v-btns">
            <v-btn type="submit" :disabled="saving">
                {{ saving ? "Saving..." : "Update Machine" }}
            </v-btn>

            <nuxt-link to="/machines">
                <v-btn type="v-btn">Back</v-btn>
            </nuxt-link>
        </div>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            loading: true,
            saving: false,
            successMessage: "",
            errorMessage: "",
            form: {
                machine_uid: "",
                machine_name: "",
                location_name: "",
                location_category: "mall",
                visibility_rate: 0.6,
                slot_duration: 10,
                slots_per_loop: 6,
                status: "offline",
                status_mode: "auto"
            }
        };
    },

    mounted() {
        this.fetchMachine();
    },

    methods: {
        async fetchMachine() {
            try {
                const {
                    data
                } = await api.get(`/api/machines/${this.$route.params.id}`);
                this.form = {
                    machine_uid: data.machine_uid || "",
                    machine_name: data.machine_name || "",
                    location_name: data.location_name || "",
                    location_category: data.location_category || "mall",
                    visibility_rate: Number(data.visibility_rate || 0.6),
                    slot_duration: Number(data.slot_duration || 10),
                    slots_per_loop: Number(data.slots_per_loop || 6),
                    status: data.status || "offline",
                    status_mode: data.status_mode || "auto"
                };
            } catch (error) {
                console.error("fetchMachine error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to load machine";
            } finally {
                this.loading = false;
            }
        },

        async updateMachine() {
            try {
                this.saving = true;
                this.successMessage = "";
                this.errorMessage = "";

                const {
                    data
                } = await api.put(
                    `/api/machines/${this.$route.params.id}`,
                    this.form
                );

                this.successMessage = `${data.machine_name} updated successfully`;
            } catch (error) {
                console.error("updateMachine error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to update machine";
            } finally {
                this.saving = false;
            }
        }
    }
};
</script>

<style scoped>
.edit-machine-page {
    padding: 20px;
}

.machine-form {
    display: grid;
    gap: 12px;
    max-width: 600px;
}

v-text-field outlined,
select,
v-btn {
    padding: 10px;
}

.v-btns {
    display: flex;
    gap: 10px;
}

.success {
    color: green;
    margin-top: 16px;
}

.error {
    color: red;
    margin-top: 16px;
}
</style>
