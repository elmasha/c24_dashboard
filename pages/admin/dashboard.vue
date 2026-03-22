<template>
<v-card fluid class="pa-4" color="black">
    <v-app-bar color="#000" dark height="50">
        <v-menu top :close-on-click="closeOnClick">
            <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon dark v-bind="attrs" v-on="on"></v-app-bar-nav-icon>

            </template>

            <v-list>
                <v-list-item v-for="(item, index) in items_nav" :key="index">
                    <v-list-item-icon>
                        <v-icon @click="move(item.to)">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title @click="move(item.to)">{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-toolbar-title></v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-filter</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

    </v-app-bar>
    <div class="d-flex align-center mb-4">
        <div>
            <h3 class="text-h4 mb-0">Admin Dashboard</h3>
           
        </div>

        <v-spacer />
         <v-btn icon @click="loadDashboard()" :loading="loading">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        <!-- <v-btn small @click="loadDashboard" >
            Refresh
        </v-btn> -->
    </div>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
        {{ errorMessage }}
    </v-alert>

    <div>
        <div v-show="false">
            <v-navigation-drawer floating elevation="0" style="border-radius: 12px; background-color: #2b4601;margin: 10px;" dark permanent :mini-variant="100">
                <v-list>
                    <v-list-item v-for="item in items_nav" :key="item.title" link>
                        <v-list-item-icon>
                            <v-icon @click="move(item.to)">{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block>
                            Logout
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>
        </div>
        <div>
            <!-- Top metric cards -->
            <v-row v-resize="onResize">
                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Impressions Today</div>
                        <div class="metric-value">
                            {{ formatNumber(metrics.impressions_today) }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Scans Today</div>
                        <div class="metric-value">
                            {{ formatNumber(metrics.scans_today) }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Impressions This Month</div>
                        <div class="metric-value">
                            {{ formatNumber(metrics.impressions_month) }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Scans This Month</div>
                        <div class="metric-value">
                            {{ formatNumber(metrics.scans_month) }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Conversion Rate</div>
                        <div class="metric-value">
                            {{ metrics.conversion_rate || 0 }}%
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Total Clients</div>
                        <div class="metric-value">
                            {{ formatNumber(totalClients) }}
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-1">
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-card outlined class="pa-4 metric-card">
                        <div class="metric-title">Active Clients</div>
                        <div class="metric-value">
                            {{ formatNumber(activeClients) }}
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Charts -->
            <v-row class="mt-2">
                <v-col cols="12" lg="8">
                    <v-card outlined class="pa-4 mb-4" color="black" light>
                        <div class="text-h6 mb-3">Daily Impressions</div>

                        <daily-impressions-chart :rows="dailyImpressions"></daily-impressions-chart>
                        <!-- <apexchart type="line" height="320" :options="impressionsChartOptions" :series="impressionsSeries" /> -->
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card outlined class="pa-4 mb-4" color="black" light>
                        <div class="text-h6 mb-3">Device Breakdown</div>
                        <apexchart type="pie" height="320" :options="devicePieOptions" :series="devicePieSeries" />
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-resize="onResize">
                <v-col cols="12" lg="8">
                    <v-card outlined class="pa-4" color="black" light>
                        <div class="text-h6 mb-3">Daily Scans</div>
                        <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card outlined class="pa-4">
                        <div class="text-h6 mb-3">Top Machines</div>

                        <v-simple-table dense>
                            <thead>
                                <tr>
                                    <th>Machine</th>
                                    <th>UID</th>
                                    <th class="text-right">Scans</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="machine in topMachines" :key="machine.machine_uid">
                                    <td>{{ machine.machine_name }}</td>
                                    <td>{{ machine.machine_uid }}</td>
                                    <td class="text-right">{{ formatNumber(machine.scans) }}</td>
                                </tr>
                                <tr v-if="!topMachines.length">
                                    <td colspan="3">No machine data</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Clients preview -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card outlined class="pa-4">
                        <div class="d-flex align-center mb-3">
                            <div class="text-h6">Clients</div>
                            <v-spacer />
                            <nuxt-link to="/clients">
                                <v-btn small text>View All</v-btn>
                            </nuxt-link>
                        </div>

                        <v-simple-table dense>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Client Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="client in clients.slice(0, 5)" :key="client.id">
                                    <td>{{ client.id }}</td>
                                    <td>{{ client.client_name }}</td>
                                    <td>{{ client.email || "-" }}</td>
                                    <td>{{ client.status }}</td>
                                </tr>
                                <tr v-if="!clients.length">
                                    <td colspan="4">No clients found.</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>

</v-card>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import DailyImpressionsChart from "../../components/charts/DailyImpressionsChart.vue";

export default {
    data() {
        return {
            items_nav: [{
                    title: 'Dashboard',
                    icon: 'mdi-view-dashboard',
                    to: 'admin/dashboard'
                },
                {
                    title: 'Campaign',
                    icon: 'mdi-bullhorn-outline',
                    to: 'campaigns/all'
                },
                {
                    title: 'Machines',
                    icon: 'mdi-cellphone-sound',
                    to: 'machines'
                },
                {
                    title: 'Clients',
                    icon: 'mdi-account-group-outline',
                    to: 'clients'
                },
                {
                    title: 'Traffic Config',
                    icon: 'mdi-cogs',
                    to: 'traffic-config'
                },
            ],
            moment,
            loading: false,
            errorMessage: "",
            metrics: {
                impressions_today: 0,
                scans_today: 0,
                impressions_month: 0,
                scans_month: 0,
                conversion_rate: 0
            },
            dailyImpressions: [],
            dailyScans: [],
            deviceBreakdown: [],
            topMachines: [],
            clients: [],
            socketRefreshTimer: null,
            windowSize: {
                x: null,
                y: null,
            },
        };
    },

    computed: {
        totalClients() {
            return (this.clients || []).length;
        },

        activeClients() {
            return (this.clients || []).filter(
                client => client.status === "active"
            ).length;
        },

        impressionsSeries() {
            return [{
                name: "Impressions",
                data: (this.dailyImpressions || []).map(row =>
                    Number(row.impressions || 0)
                )
            }];
        },

        scansSeries() {
            return [{
                name: "Scans",
                data: (this.dailyScans || []).map(row =>
                    Number(row.scans || 0)
                )
            }];
        },

        impressionsChartOptions() {
            return {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                stroke: {
                    curve: "smooth",
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: (this.dailyImpressions || []).map(row => row.date),
                    title: {
                        text: "Date"
                    }
                },
                yaxis: {
                    title: {
                        text: "Impressions"
                    },
                    labels: {
                        formatter: value => Number(value || 0).toLocaleString()
                    }
                },
                tooltip: {
                    y: {
                        formatter: value => Number(value || 0).toLocaleString()
                    }
                },
                noData: {
                    text: "No impression data"
                }
            };
        },

        scansChartOptions() {
            return {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: (this.dailyScans || []).map(row => moment(row.date).format("MMM Do YY")),
                    title: {
                        text: "Date"
                    }
                },
                yaxis: {
                    title: {
                        text: "Scans"
                    },
                    labels: {
                        formatter: value => Number(value || 0).toLocaleString()
                    }
                },
                tooltip: {
                    y: {
                        formatter: value => Number(value || 0).toLocaleString()
                    }
                },
                noData: {
                    text: "No scan data"
                }
            };
        },

        devicePieSeries() {
            return (this.deviceBreakdown || []).map(row =>
                Number(row.scans || 0)
            );
        },

        devicePieOptions() {
            return {
                labels: (this.deviceBreakdown || []).map(row => row.device_name),
                legend: {
                    position: "bottom"
                },
                dataLabels: {
                    enabled: true,
                    formatter: val => `${val.toFixed(1)}%`
                },
                tooltip: {
                    y: {
                        formatter: value => Number(value || 0).toLocaleString()
                    }
                },
                noData: {
                    text: "No device data"
                }
            };
        }
    },

    async mounted() {
        this.loadDashboard();

    },

    components: {

        DailyImpressionsChart
    },
    beforeDestroy() {
        this.removeSocketListeners();

        if (this.socketRefreshTimer) {
            clearTimeout(this.socketRefreshTimer);
            this.socketRefreshTimer = null;
        }
    },

    methods: {
        move(val) {
            this.$router.push(`/${val}`)
        },
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };

            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
            console.log("size", this.windowSize.x);
            return this.windowSize;
        },
        onResize2() {

            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };

            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
            console.log("size", this.windowSize.x);
            return this.showBurger;
        },
        async loadDashboard() {
            try {
                this.loading = true;
                this.errorMessage = "";

                const [
                    metricsRes,
                    impressionsRes,
                    scansRes,
                    devicesRes,
                    machinesRes,
                    clientsRes
                ] = await Promise.all([
                    api.get("/api/analytics/global-metrics"),
                    api.get("/api/analytics/daily-impressions-graph"),
                    api.get("/api/analytics/daily-scans-graph"),
                    api.get("/api/analytics/device-breakdown"),
                    api.get("/api/analytics/top-machines"),
                    api.get("/api/clients")
                ]);

                this.metrics = metricsRes.data || {
                    impressions_today: 0,
                    scans_today: 0,
                    impressions_month: 0,
                    scans_month: 0,
                    conversion_rate: 0
                };

                this.dailyImpressions = impressionsRes.data;
                this.dailyScans = scansRes.data;
                this.deviceBreakdown = devicesRes.data;
                this.topMachines = machinesRes.data;
                this.clients = clientsRes.data;
                console.log(this.dailyImpressions)
            } catch (error) {
                console.error("loadDashboard error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to load admin dashboard";
            } finally {
                this.loading = false;
            }
        },

        setupSocketListeners() {
            if (!this.$socket) return;

            this.$socket.emit("join-admin");

            this.$socket.on("machine-status-updated", this.handleLiveEvent);
            this.$socket.on("qr-scan-recorded", this.handleLiveEvent);
            this.$socket.on("simulation-impression", this.handleLiveEvent);
        },

        removeSocketListeners() {
            if (!this.$socket) return;

            this.$socket.off("machine-status-updated", this.handleLiveEvent);
            this.$socket.off("qr-scan-recorded", this.handleLiveEvent);
            this.$socket.off("simulation-impression", this.handleLiveEvent);
        },

        handleLiveEvent(payload) {
            console.log("admin live event", payload);
            this.debouncedRefreshDashboard();
        },

        debouncedRefreshDashboard() {
            if (this.socketRefreshTimer) {
                clearTimeout(this.socketRefreshTimer);
            }

            this.socketRefreshTimer = setTimeout(() => {
                this.loadDashboard();
            }, 800);
        },

        formatNumber(value) {
            return Number(value || 0).toLocaleString();
        }
    },
};
</script>

<style scoped>
.metric-card {
    min-height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.metric-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.metric-value {
    font-size: 28px;
    font-weight: 700;
}
</style>
