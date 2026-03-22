<template>
<div class="jobs-page">
    <h1>System Jobs</h1>

    <table class="table">
        <thead>
            <tr>
                <th>Job Name</th>
                <th>Status</th>
                <th>Updated At</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="job in jobs" :key="job.id">
                <td>{{ job.job_name }}</td>
                <td>{{ job.is_enabled ? "Running" : "Stopped" }}</td>
                <td>{{ job.updated_at }}</td>
                <td>
                    <button v-if="job.is_enabled" @click="toggleJob(job, false)">
                        Stop
                    </button>
                    <button v-else @click="toggleJob(job, true)">
                        Start
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            jobs: [],
            message: "",
            errorMessage: ""
        };
    },

    mounted() {
        this.fetchJobs();
    },

    methods: {
        async fetchJobs() {
            try {
                const {
                    data
                } = await api.get("/api/system-jobs");
                this.jobs = data;
            } catch (error) {
                this.errorMessage = "Failed to load jobs";
            }
        },

        async toggleJob(job, enabled) {
            try {
                const {
                    data
                } = await api.put(`/api/system-jobs/${job.job_name}`, {
                    is_enabled: enabled
                });

                this.message = `${data.job_name} ${enabled ? "started" : "stopped"} successfully`;
                this.errorMessage = "";
                await this.fetchJobs();
            } catch (error) {
                this.message = "";
                this.errorMessage = error.response ;
            }
        }
    }
};
</script>

<style scoped>
.jobs-page {
    padding: 20px;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #ddd;
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
