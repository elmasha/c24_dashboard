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
                    <v-list-item v-for="(item, index) in items_nav" :key="index" link @click="move(item.to)">
                        <v-list-item-icon>
                            <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <div>
                <div class="page-badge" style="font-size:0.6rem">Charge24 Portal</div>
            </div>
        </div>

        <v-spacer />

        <div class="d-flex align-center">
            <v-btn icon dark class="topbar-icon mr-2">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon dark class="topbar-icon mr-2">
                <v-icon>mdi-filter-variant</v-icon>
            </v-btn>

            <v-btn icon dark class="topbar-icon" @click="loadDashboard" :loading="loading">
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

                    <div class="sidebar-user-name" style="margin-left: 20px;">Operations Team</div>
                    <div class="sidebar-user-subtitle">
                        Monitor campaigns, machines and client activity
                    </div>
                </div>

                <v-list dark class="sidebar-list">
                    <v-list-item v-for="item in items_nav" :key="item.title" link class="sidebar-item" @click="move(item.to)">
                        <v-list-item-icon>
                            <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <div class="sidebar-footer">
                    <v-btn block outlined color="#C6FF00" class="logout-btn" @click="logout()">
                        Logout
                    </v-btn>
                </div>
            </div>
        </aside>

        <!-- Main -->
        <main class="admin-main">
            <!-- Hero -->
            <v-row class="mb-5">
                <v-col cols="12">
                    <v-card class="hero-panel pa-6" outlined>
                        <div class="d-flex flex-wrap align-center">
                            <div class="hero-copy">
                                <div class="hero-kicker" style="margin-left: 20px;">Operations Overview</div>
                                <div class="hero-heading">
                                    Monitor delivery, traffic, client growth, and machine activity from one place
                                </div>
                                <div class="hero-subtext">
                                    Get a live operational snapshot of impressions, scans, clients, devices, and machine performance across the network.
                                </div>
                            </div>

                            <v-spacer />

                            <div class="hero-actions mt-4 mt-md-0" style="margin-right: 20px;">
                                <nuxt-link to="/campaigns" class="text-decoration-none">
                                    <v-btn class="mr-2 hero-btn-primary" color="#C6FF00" large>
                                        <span class="black--text font-weight-bold">Campaigns</span>
                                    </v-btn>
                                </nuxt-link>

                                <nuxt-link to="/clients" class="text-decoration-none">
                                    <v-btn outlined large class="hero-btn-outline">
                                        Clients
                                    </v-btn>
                                </nuxt-link>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
                {{ errorMessage }}
            </v-alert>

            <!-- Metric cards -->
            <v-row>
                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card class="metric-card metric-highlight" outlined>
                        <div class="metric-label">Impressions Today</div>
                        <div class="metric-number">{{ formatNumber(metrics.impressions_today) }}</div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card class="metric-card" outlined>
                        <div class="metric-label">Scans Today</div>
                        <div class="metric-number">{{ formatNumber(metrics.scans_today) }}</div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card class="metric-card" outlined>
                        <div class="metric-label">Impressions This Month</div>
                        <div class="metric-number">{{ formatNumber(metrics.impressions_month) }}</div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card class="metric-card" outlined>
                        <div class="metric-label">Scans This Month</div>
                        <div class="metric-number">{{ formatNumber(metrics.scans_month) }}</div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card class="metric-card" outlined>
                        <div class="metric-label">Conversion Rate</div>
                        <div class="metric-number">{{ metrics.conversion_rate || 0 }}%</div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="2">
                    <v-card class="metric-card" outlined>
                        <div class="metric-label">Total Clients</div>
                        <div class="metric-number">{{ formatNumber(totalClients) }}</div>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-1 mb-3">
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-card class="metric-card small-metric-card" outlined>
                        <div class="metric-label">Active Clients</div>
                        <div class="metric-number">{{ formatNumber(activeClients) }}</div>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Charts row 1 -->
            <v-row>
                <v-col cols="12" lg="8">
                    <v-card class="panel-card pa-4 mb-4" outlined>
                        <div class="panel-head">
                            <div>
                                <div class="panel-kicker">Performance Trend</div>
                                <div class="panel-title">Daily Impressions</div>
                            </div>
                        </div>

                        <daily-impressions-chart :rows="dailyImpressions" />
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card class="panel-card pa-4 mb-4" outlined>
                        <div class="panel-head">
                            <div>
                                <div class="panel-kicker">Audience Analysis</div>
                                <div class="panel-title">Device Breakdown</div>
                            </div>
                        </div>

                        <apexchart type="pie" height="320" :options="devicePieOptions" :series="devicePieSeries" />
                    </v-card>
                </v-col>
            </v-row>

            <!-- Charts row 2 -->
            <v-row>
                <v-col cols="12" lg="8">
                    <v-card class="panel-card pa-4" outlined>
                        <div class="panel-head">
                            <div>
                                <div class="panel-kicker">Interaction Trend</div>
                                <div class="panel-title">Daily Scans</div>
                            </div>
                        </div>

                        <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card class="panel-card pa-4" outlined>
                        <div class="panel-head">
                            <div>
                                <div class="panel-kicker">Machine Ranking</div>
                                <div class="panel-title">Top Machines</div>
                            </div>
                        </div>

                        <v-simple-table dense class="table-dark">
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
                    <v-card class="panel-card pa-4" outlined>
                        <div class="panel-head mb-3">
                            <div>
                                <div class="panel-kicker">Client Overview</div>
                                <div class="panel-title">Recent Clients</div>
                            </div>

                            <nuxt-link to="/clients" class="text-decoration-none">
                                <v-btn text color="#C6FF00">View All</v-btn>
                            </nuxt-link>
                        </div>

                        <v-simple-table dense class="table-dark">
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
                                    <td>
                                        <span class="status-pill" :class="client.status === 'active' ? 'status-active' : 'status-inactive'">
                                            {{ client.status }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="!clients.length">
                                    <td colspan="4">No clients found.</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row>
        </main>
    </div>
</v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import DailyImpressionsChart from "../../components/charts/DailyImpressionsChart.vue";

export default {
    middleware: "auth",
    components: {
        DailyImpressionsChart
    },

    data() {
        return {
            items_nav: [{
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
                // {
                //     title: "Traffic Config",
                //     icon: "mdi-cogs",
                //     to: "admin/dashboard"
                // }
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
            showBurger: false,
            windowSize: {
                x: window.innerWidth,
                y: window.innerHeight
            }
        };
    },

    computed: {
        totalClients() {
            return (this.clients || []).length;
        },

        activeClients() {
            return (this.clients || []).filter(client => client.status === "active").length;
        },

        scansSeries() {
            return [{
                name: "Scans",
                data: (this.dailyScans || []).map(row => Number(row.scans || 0))
            }];
        },

        scansChartOptions() {
            return {
                chart: {
                    toolbar: {
                        show: false
                    },
                    foreColor: "#bdbdbd"
                },
                theme: {
                    mode: "dark"
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: (this.dailyScans || []).map(row =>
                        moment(row.date).format("MMM Do YY")
                    ),
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
                    theme: "dark",
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
            return (this.deviceBreakdown || []).map(row => Number(row.scans || 0));
        },

        devicePieOptions() {
            return {
                labels: (this.deviceBreakdown || []).map(row => row.device_name),
                legend: {
                    position: "bottom",
                    labels: {
                        colors: "#d2d2d2"
                    }
                },
                theme: {
                    mode: "dark"
                },
                dataLabels: {
                    enabled: true,
                    formatter: val => `${val.toFixed(1)}%`
                },
                tooltip: {
                    theme: "dark",
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
        this.onResize();
        this.loadDashboard();
    },

    beforeDestroy() {
        this.removeSocketListeners();

        if (this.socketRefreshTimer) {
            clearTimeout(this.socketRefreshTimer);
            this.socketRefreshTimer = null;
        }
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
                y: window.innerHeight
            };
            this.showBurger = this.windowSize.x < 950;
            return this.windowSize;
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

                this.dailyImpressions = impressionsRes.data || [];
                this.dailyScans = scansRes.data || [];
                this.deviceBreakdown = devicesRes.data || [];
                this.topMachines = machinesRes.data || [];
                this.clients = clientsRes.data || [];
            } catch (error) {
                console.error("loadDashboard error:", error);
                this.errorMessage =
                    error.respons.data.message || "Failed to load admin dashboard";
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

.metric-card {
    min-height: 122px;
    border-radius: 18px;
    padding: 20px !important;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(198, 255, 0, 0.1) !important;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.metric-highlight {
    background: linear-gradient(135deg, rgba(198, 255, 0, 0.14), #0d0d0d 55%, #090909) !important;
}

.small-metric-card {
    min-height: 108px;
}

.metric-label {
    font-size: 12px;
    color: #ababab;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
}

.metric-number {
    font-size: 28px;
    font-weight: 800;
    color: #ffffff;
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
    margin-bottom: 14px;
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

    .metric-number {
        font-size: 24px;
    }
}
</style>
