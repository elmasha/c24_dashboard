<template>
<div style="color: aliceblue;" >
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
    <h3 style="margin: 30px;">Traffic Configuration</h3>

    <v-alert v-if="successMessage" type="success" dense outlined class="mb-4">
        {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
        {{ errorMessage }}
    </v-alert>
    <v-row class="container">
        <v-col cols="12" md="6">
            <!-- CATEGORY PROFILES -->
            <section class="">
                <h2>Category Profiles</h2>

                <v-simple-table style="color: aliceblue;">
                    <thead>
                        <tr style="color: aliceblue;">
                            <th>Category</th>
                            <th>Base Audience</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="row in categories" :key="row.id">
                            <td>{{ row.category }}</td>
                            <td>
                                <v-text-field outlined style="color: aliceblue;" type="number" min="0" v-model.number="row.base_audience" />
                            </td>
                            <td>
                                <v-btn @click="updateCategory(row)">Update</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </section>
        </v-col>
        <v-col cols="12" md="6">
            <!-- DAY WEIGHTS -->
            <section class="" style="color: aliceblue;">
                <h2>Day Weights</h2>

                <v-simple-table>
                    <thead>
                        <tr>
                            <th>Day Number</th>
                            <th>Day</th>
                            <th>Weight</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="row in dayWeights" :key="row.id">
                            <td>{{ row.day_number }}</td>
                            <td>{{ dayName(row.day_number) }}</td>
                            <td>
                                <v-text-field outlined style="color: aliceblue;" type="number" step="0.01" min="0" v-model.number="row.weight" />
                            </td>
                            <td>
                                <v-btn @click="updateDayWeight(row)">Update</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </section>

        </v-col>
    </v-row>

    <!-- TIME WEIGHTS -->
    <section class="container">
        <h2>Category Time Weights</h2>

        <div class="filter-box">
            <label>Select Category</label>
            <select v-model="selectedCategory" @change="fetchTimeWeightsByCategory" style="color: aliceblue;">
                <option value="">All Categories</option>
                <option value="airport">airport</option>
                <option value="mall">mall</option>
                <option value="club">club</option>
                <option value="restaurant">restaurant</option>
                <option value="shop">shop</option>
                <option value="event">event</option>
            </select>
        </div>

        <div class="create-box" style="color: aliceblue;">
            <h3>Add Time Weight</h3>

            <div class="form-grid text-white" style="color: aliceblue;">
                <div style="color: aliceblue;">
                    <label>Category</label>
                    <select v-model="timeForm.category">
                        <option value="airport">airport</option>
                        <option value="mall">mall</option>
                        <option value="club">club</option>
                        <option value="restaurant">restaurant</option>
                        <option value="shop">shop</option>
                        <option value="event">event</option>
                    </select>
                </div>

                <div style="color: aliceblue;">
                    <label>Start Hour</label>
                    <v-text-field outlined style="color: aliceblue;" type="number" min="0" max="23" v-model.number="timeForm.start_hour" />
                </div>

                <div style="color: aliceblue;">
                    <label>End Hour</label>
                    <v-text-field outlined style="color: aliceblue;" type="number" min="1" max="24" v-model.number="timeForm.end_hour" />
                </div>

                <div style="color: aliceblue;">
                    <label>Weight</label>
                    <v-text-field outlined style="color: aliceblue;" type="number" step="0.01" min="0" v-model.number="timeForm.weight" />
                </div>
            </div>

            <v-btn @click="createTimeWeight">
                Add Time Weight
            </v-btn>
        </div>

        <v-simple-table  style="color: aliceblue;">
            <thead>
                <tr style="color: aliceblue;">
                    <th style="color: aliceblue;">Category</th>
                    <th>Start Hour</th>
                    <th>End Hour</th>
                    <th>Weight</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody style="color: aliceblue;">
                <tr v-for="row in timeWeights" :key="row.id">
                    <td>
                        <select v-model="row.category" style="color: aliceblue;">
                            <option value="airport">airport</option>
                            <option value="mall">mall</option>
                            <option value="club">club</option>
                            <option value="restaurant">restaurant</option>
                            <option value="shop">shop</option>
                            <option value="event">event</option>
                        </select>
                    </td>
                    <td>
                        <v-text-field outlined style="color: aliceblue;" type="number" min="0" max="23" v-model.number="row.start_hour" />
                    </td>
                    <td>
                        <v-text-field outlined style="color: aliceblue;" type="number" min="1" max="24" v-model.number="row.end_hour" />
                    </td>
                    <td>
                        <v-text-field outlined style="color: aliceblue;" type="number" step="0.01" min="0" v-model.number="row.weight" />
                    </td>
                    <td class="actions">
                        <v-btn @click="updateTimeWeight(row)">Update</v-btn>
                        <v-btn @click="deleteTimeWeight(row.id)" color="red">Delete</v-btn>
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </section>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            categories: [],
            dayWeights: [],
            timeWeights: [],
            selectedCategory: "",
            successMessage: "",
            errorMessage: "",
            timeForm: {
                category: "mall",
                start_hour: 0,
                end_hour: 6,
                weight: 1
            }
        };
    },

    mounted() {
        this.fetchCategories();
        this.fetchDayWeights();
        this.fetchTimeWeights();
    },

    methods: {
        async fetchCategories() {
            try {
                const {
                    data
                } = await api.get("/api/traffic-config/categories");
                this.categories = data;
            } catch (error) {
                this.handleError(error, "Failed to load category profiles");
            }
        },

        async fetchDayWeights() {
            try {
                const {
                    data
                } = await api.get("/api/traffic-config/days");
                this.dayWeights = data;
            } catch (error) {
                this.handleError(error, "Failed to load day weights");
            }
        },

        async fetchTimeWeights() {
            try {
                const {
                    data
                } = await api.get("/api/traffic-config/times");
                this.timeWeights = data;
            } catch (error) {
                this.handleError(error, "Failed to load time weights");
            }
        },

        async fetchTimeWeightsByCategory() {
            try {
                if (!this.selectedCategory) {
                    await this.fetchTimeWeights();
                    return;
                }

                const {
                    data
                } = await api.get(
                    `/api/traffic-config/times/category/${this.selectedCategory}`
                );
                this.timeWeights = data;
            } catch (error) {
                this.handleError(error, "Failed to load category time weights");
            }
        },

        async updateCategory(row) {
            try {
                await api.put(`/api/traffic-config/categories/${row.category}`, {
                    base_audience: row.base_audience
                });

                this.successMessage = `Updated ${row.category} base audience`;
                this.errorMessage = "";
            } catch (error) {
                this.handleError(error, "Failed to update category profile");
            }
        },

        async updateDayWeight(row) {
            try {
                await api.put(`/api/traffic-config/days/${row.day_number}`, {
                    weight: row.weight
                });

                this.successMessage = `Updated ${this.dayName(row.day_number)} weight`;
                this.errorMessage = "";
            } catch (error) {
                this.handleError(error, "Failed to update day weight");
            }
        },

        async createTimeWeight() {
            try {
                await api.post("/api/traffic-config/times", this.timeForm);

                this.successMessage = "Time weight added successfully";
                this.errorMessage = "";

                this.timeForm = {
                    category: "mall",
                    start_hour: 0,
                    end_hour: 6,
                    weight: 1
                };

                await this.fetchTimeWeightsByCategory();
            } catch (error) {
                this.handleError(error, "Failed to add time weight");
            }
        },

        async updateTimeWeight(row) {
            try {
                await api.put(`/api/traffic-config/times/${row.id}`, {
                    category: row.category,
                    start_hour: row.start_hour,
                    end_hour: row.end_hour,
                    weight: row.weight
                });

                this.successMessage = "Time weight updated successfully";
                this.errorMessage = "";
            } catch (error) {
                this.handleError(error, "Failed to update time weight");
            }
        },

        async deleteTimeWeight(id) {
            const confirmed = window.confirm("Delete this time weight?");
            if (!confirmed) return;

            try {
                await api.delete(`/api/traffic-config/times/${id}`);

                this.successMessage = "Time weight deleted successfully";
                this.errorMessage = "";

                await this.fetchTimeWeightsByCategory();
            } catch (error) {
                this.handleError(error, "Failed to delete time weight");
            }
        },

        dayName(dayNumber) {
            const names = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];
            return names[dayNumber] || "-";
        },

        handleError(error, fallback) {
            console.error(error);
            this.successMessage = "";
            this.errorMessage = error.response.data.message || fallback;
        }
    }
};
</script>

<style scoped>
.traffic-config-page {
    padding: 20px;
    color: #fff;
}

.section {
    margin-top: 30px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

v-text-field outlined,
select,
v-btn {
    padding: 8px;
}

.filter-box,
.create-box {
    margin-top: 15px;
    margin-bottom: 20px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 12px;
}

.actions {
    display: flex;
    gap: 8px;
}

.success {
    color: green;
    margin-top: 20px;
}

.error {
    color: red;
    margin-top: 20px;
}
</style>
