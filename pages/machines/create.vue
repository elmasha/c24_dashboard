<template>
<div class="create-machine-page" style="color: aliceblue;">
    <v-row>
        <v-col cols="12" md="12"></v-col>
        <v-col cols="12" md="12">
            <div class="">
                <nuxt-link style="text-decoration: none; color: white;margin-left: 10px; margin-top: 40px;" icon to="/machines">
                    <v-icon large>mdi-arrow-left</v-icon>
                </nuxt-link>
            </div>
        </v-col>
    </v-row>
    <h3 style="margin: 20px;">Add Machine</h3>
    <v-alert v-if="successMessage" type="success" dense outlined class="mb-4">
        {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
        {{ errorMessage }}
    </v-alert>
    <form @submit.prevent="createMachine" class="machine-form">
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
                <option value="">Select Category</option>
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
            <select v-model="form.status">
                <option value="offline">offline</option>
                <option value="online">online</option>
            </select>
        </div>

        <div>
            <label>Status Mode</label>
            <select v-model="form.status_mode">
                <option value="auto">auto</option>
                <option value="manual">manual</option>
            </select>
        </div>

        <button type="submit" :disabled="loading">
            {{ loading ? "Saving..." : "Add Machine" }}
        </button>
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
            loading: false,
            successMessage: "",
            errorMessage: "",
            form: {
                machine_uid: "",
                machine_name: "",
                location_name: "",
                location_category: "",
                visibility_rate: 0.6,
                slot_duration: 10,
                slots_per_loop: 6,
                status: "offline",
                status_mode: "auto"
            }
        };
    },

    methods: {
        async createMachine() {
            try {
                this.loading = true;
                this.successMessage = "";
                this.errorMessage = "";

                const {
                    data
                } = await api.post("/api/machines", this.form);

                this.successMessage = `Machine ${data.machine_name} created successfully`;

                this.form = {
                    machine_uid: "",
                    machine_name: "",
                    location_name: "",
                    location_category: "",
                    visibility_rate: 0.6,
                    slot_duration: 10,
                    slots_per_loop: 6,
                    status: "offline",
                    status_mode: "auto"
                };
            } catch (error) {
                console.error("createMachine error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to create machine";
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.create-machine-page {
    padding: 20px;
}

.machine-form {
    display: grid;
    gap: 12px;
    max-width: 600px;
}

v-text-field outlined,
select,
button {
    padding: 10px;
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
