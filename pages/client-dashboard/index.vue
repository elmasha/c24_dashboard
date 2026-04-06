<template>
<v-container fluid class="client-page pa-0">
    <!-- Top bar -->
    <v-app-bar flat color="transparent" height="72" class="client-topbar px-4">
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

            <div v-if="overview.client">
                <div class="page-badge" style="margin-top: 18px;">
                    {{ overview.client.client_name }} Portal
                </div>
            </div>
        </div>

        <v-spacer />

        <div class="d-flex align-center">
            <div class="d-flex">
                    <v-btn icon dark class="topbar-icon mr-2" to="/client-dashboard/notification" v-if="unreadCount > 0">
                <v-icon>mdi-bell-outline</v-icon>
                
                {{ unreadCount > 0 ? unreadCount : '' }}
                <!-- From Uiverse.io by risabbir --> 
<div class="warp-loader" v-if="unreadCount > 0">
  <div class="ring"></div>
  <div class="ring"></div>
  <div class="ring"></div>
  <div class="ring"></div>
  <div class="core-glow"></div>
</div>

            </v-btn>
            
            </div>
            

            <v-btn icon dark class="topbar-icon" @click="loadDashboard" :loading="loading">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn  v-show="showBurger" icon dark class="topbar-icon ml-2" @click="logout" >
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </div>
    </v-app-bar>

    <div class="client-layout">
        <!-- Side navigation -->
        <aside class="client-sidebar" v-show="!showBurger">
            <div class="sidebar-card">
                <div class="sidebar-brand">
                    <div class="sidebar-brand-badge">Charge24 client dashboard</div>
                    <div class="sidebar-brand-text"></div>
                </div>

                <div class="sidebar-profile" v-if="overview.client">
                    <v-avatar
                        size="52"
                        :color="overview.client.image_url ? 'transparent' : '#C6FF00'"
                        class="sidebar-avatar client-logo-avatar"
                    >
                        <template v-if="overview.client.image_url">
                            <v-img :src="overview.client.image_url" cover />
                        </template>
                        <template v-else>
                            <span class="avatar-text">
                                {{ (overview.client.client_name || '').substring(0, 2).toUpperCase() }}
                            </span>
                        </template>
                    </v-avatar>

                    <div class="sidebar-client-name">
                        {{ overview.client.client_name }}
                    </div>
                    <div class="sidebar-client-subtitle" style="margin-left: 12px;">
                        Performance overview
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
                    <v-btn block outlined color="#C6FF00" class="logout-btn" @click="logout">
                        Logout
                    </v-btn>
                </div>
            </div>
        </aside>

        <!-- Main dashboard -->
        <main class="client-main" v-resize="onResize">
            <div v-if="loading" class="loading-state">
                Loading dashboard...
            </div>

            <div v-else>
                <!-- Welcome banner -->
                <v-card class="welcome-banner pa-6 mb-5" outlined>
                    <div class="d-flex flex-wrap align-center">
                        <div class="welcome-copy">
                            <div class="welcome-kicker" style="margin-left: 12px;">Campaign Reporting</div>
                            <!-- <div class="welcome-title">
                                See how your campaigns are performing across impressions, scans, and conversions
                            </div> -->
                            <div class="welcome-subtitle">
                                Track delivery trends, audience device breakdown, and campaign results in one place.
                            </div>
                        </div>

                        <v-spacer />

                        <div class="welcome-actions mt-4 mt-md-0" style="margin-right: 10px;">
                            <v-btn color="#C6FF00" class="black--text font-weight-bold mr-2" to="/clients/campaign">
                                View Campaigns
                            </v-btn>
                        </div>
                    </div>
                </v-card>

                <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
                    {{ errorMessage }}
                </v-alert>

                <!-- Metrics -->
                <div class="metrics-grid text-center">
                    <div class="metric-card metric-primary">
                        <div class="metric-label">Impressions Today</div>
                        <div class="metric-value" style="color: #C6FF00;">
                            {{ formatNumber((overview.metrics && overview.metrics.impressions_today) || 0) }}
                        </div>
                    </div>

                    <div class="metric-card metric-primary">
                        <div class="metric-label">Interactions Today</div>
                        <div class="metric-value" style="color: #C6FF00;">
                            {{ numeral((overview.metrics && overview.metrics.impressions_today * 0.24) || 0).format("0,0") }}
                        </div>
                    </div>

                    <div class="metric-card metric-primary">
                        <div class="metric-label">Total Impressions</div>
                        <div class="metric-value">
                            {{ millify((overview.metrics && overview.metrics.total_impressions) || 0) }}
                        </div>
                    </div>

                    <div class="metric-card metric-primary">
                        <div class="metric-label">Total Interactions</div>
                        <div class="metric-value">
                            {{ millify((overview.metrics && overview.metrics.total_impressions * 0.24) || 0) }}
                        </div>
                    </div>

                    <div class="metric-card" v-show="showQrEnabled">
                        <div class="metric-label">Total Scans</div>
                        <div class="metric-value">
                            {{ formatNumber((overview.metrics && overview.metrics.total_scans) || 0) }}
                        </div>
                    </div>

                    <div class="metric-card" v-show="showQrEnabled">
                        <div class="metric-label">Conversion Rate</div>
                        <div class="metric-value">
                            {{ (overview.metrics && overview.metrics.overall_conversion_rate) || 0 }}%
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-label">Active Campaigns</div>
                        <div class="metric-value">
                            {{ (overview.metrics && overview.metrics.active_campaigns) || 0 }}
                        </div>
                    </div>

                    <div class="metric-card" v-show="false">
                        <div class="metric-label">Total Campaigns</div>
                        <div class="metric-value">
                            {{ (overview.metrics && overview.metrics.total_campaigns) || 0 }}
                        </div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="section-block">
                    <div class="section-head">
                        <div>
                            <div class="section-kicker"></div>
                            <h2 class="section-title">Delivery & engagement</h2>
                        </div>
                    </div>

                    <v-row>
                        <v-col cols="12" lg="12" md="12">
                            <v-card class="panel-card pa-4" outlined color="black">
                                <div class="panel-title-wrap">
                                    <div class="panel-kicker"></div>
                                    <div class="panel-title">Daily Impressions</div>
                                </div>
                                <apexchart type="line" height="320" :options="impressionsChartOptions" :series="impressionsSeries" />
                            </v-card>
                        </v-col>

                        <v-col cols="12" lg="4" md="6" v-show="showQrEnabled">
                            <v-card class="panel-card pa-4" outlined color="black">
                                <div class="panel-title-wrap">
                                    <div class="panel-kicker"></div>
                                    <div class="panel-title">Daily QR Scans</div>
                                </div>
                                <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                            </v-card>
                        </v-col>

                        <v-col cols="12" lg="4" md="6" v-show="showQrEnabled">
                            <v-card class="panel-card pa-4" outlined color="black">
                                <div class="panel-title-wrap">
                                    <div class="panel-kicker"></div>
                                    <div class="panel-title">Audience Devices</div>
                                </div>
                                <DevicePieChart title="Campaign Device Breakdown" :rows="deviceBreakdown" />
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <v-btn color="#C6FF00" class="black--text" @click="exportToCSV">
                    Export CSV
                </v-btn>

                <!-- Campaign section -->
                <div class="section-block">
                    <div class="section-head">
                        <div>
                            <div class="section-kicker"></div>
                            <h2 class="section-title">Your campaigns</h2>
                        </div>

                        <div class="view-toggle">
                            <v-chip outlined color="#C6FF00" class="toggle-chip">
                                <v-btn icon small @click="grid = false">
                                    <v-icon color="#C6FF00">mdi-view-grid</v-icon>
                                </v-btn>
                                <v-btn icon small @click="grid = true">
                                    <v-icon color="#C6FF00">mdi-format-list-bulleted-square</v-icon>
                                </v-btn>
                            </v-chip>
                        </div>
                    </div>

                    <!-- Card view -->
                    <div class="campaign-grid" v-show="!grid">
                        <v-card v-for="campaign in overview.campaigns" :key="campaign.id" class="campaign-card" outlined>
                            <div v-if="campaign.image_url" class="campaign-image-wrap" v-show="false">
                                <v-img :src="campaign.image_url" height="170" cover class="campaign-image" />
                            </div>

                            <div class="campaign-card-top">
                                <div class="campaign-avatar-wrap">
                                    <v-avatar
                                        size="48"
                                        :color="campaign.image_url ? 'transparent' : '#C6FF00'"
                                        class="campaign-image-avatar"
                                    >
                                        <template v-if="campaign.image_url" >
                                            <v-img :src="campaign.image_url" cover />
                                        </template>
                                        <template v-else>
                                            <span class="campaign-avatar-text">
                                                {{ (campaign.campaign_name || '').substring(0, 2).toUpperCase() }}
                                            </span>
                                        </template>
                                    </v-avatar>
                                </div>

                                <v-spacer />

                                <div class="campaign-progress-wrap">
                                    <v-progress-circular max="100" width="5" size="78" color="#C6FF00" :value="campaign.conversion_rate">
                                        <div class="progress-label">
                                            <strong>{{ campaign.conversion_rate }}%</strong>
                                            <span>CR</span>
                                        </div>
                                    </v-progress-circular>
                                </div>
                            </div>

                            <div class="campaign-card-body">
                                <div class="campaign-name-label">Campaign</div>
                                <div class="campaign-name">{{ campaign.campaign_name }}</div>

                                <div class="campaign-metrics-row">
                                    <div class="campaign-mini-metric">
                                        <span>Impressions</span>
                                        <strong>{{ numeral(campaign.delivered_impressions || campaign.total_impressions).format("0,0") }}</strong>
                                    </div>

                                    <div class="campaign-mini-metric">
                                        <span>Interactions</span>
                                        <strong>{{ numeral((campaign.delivered_impressions || campaign.total_impressions) * 0.24).format("0,0") }}</strong>
                                    </div>
                                </div>

                                <div class="campaign-dates-row">
                                    <div class="campaign-date-box">
                                        <span>Start</span>
                                        <strong>{{ moment(campaign.start_date).format("MMM Do YY") }}</strong>
                                    </div>

                                    <div class="campaign-date-box">
                                        <span>End</span>
                                        <strong>{{ moment(campaign.end_date).format("MMM Do YY") }}</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="campaign-card-footer">
                                <v-chip outlined small color="#C6FF00" style="margin-left: 10px;">
                                    {{ campaign.status }}
                                </v-chip>

                                <v-spacer />

                                <v-btn :to="`/campaign-view/${campaign.id}`" rounded small color="#C6FF00" class="black--text font-weight-bold" style="margin-right: 10px;">
                                    View campaign
                                    <v-icon right color="black">mdi-chevron-right</v-icon>
                                </v-btn>
                            </div>
                        </v-card>
                    </div>

                    <!-- Table view -->
                    <div v-show="grid">
                        <v-card class="table-card pa-2" outlined>
                            <v-simple-table class="client-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Campaign</th>
                                        <th>Status</th>
                                        <th>Impressions</th>
                                        <th>Interactions</th>
                                        <th>QR Scans</th>
                                        <th>Conversion</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>View</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="campaign in overview.campaigns" :key="campaign.id">
                                        <td>{{ campaign.id }}</td>
                                        <td>
                                            <v-avatar
                                                size="36"
                                                :color="campaign.image_url ? 'transparent' : '#C6FF00'"
                                            >
                                                <template v-if="campaign.image_url">
                                                    <v-img :src="campaign.image_url" cover />
                                                </template>
                                                <template v-else>
                                                    <span class="table-avatar-text">
                                                        {{ (campaign.campaign_name || '').substring(0, 2).toUpperCase() }}
                                                    </span>
                                                </template>
                                            </v-avatar>
                                        </td>
                                        <td>{{ campaign.campaign_name }}</td>
                                        <td>{{ campaign.status }}</td>
                                        <td>{{ formatNumber(campaign.total_impressions) }}</td>
                                        <td>{{ numeral(campaign.total_impressions * 0.24).format("0,0") }}</td>
                                        <td>{{ formatNumber(campaign.total_scans) }}</td>
                                        <td>{{ campaign.conversion_rate }}%</td>
                                        <td>{{ moment(campaign.start_date).format("MMM Do YY") }}</td>
                                        <td>{{ moment(campaign.end_date).format("MMM Do YY") }}</td>
                                        <td>
                                            <nuxt-link :to="`/campaign-view/${campaign.id}`" class="campaign-link">
                                                View {{ campaign.campaign_name.substring(0, 10) + "..." }}
                                            </nuxt-link>
                                        </td>
                                    </tr>

                                    <tr v-if="!overview.campaigns.length">
                                        <td colspan="11">No campaigns found.</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card>
                    </div>
                </div>
            </div>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </main>
    </div>
</v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";
import DevicePieChart from "../../components/charts/DevicePieChart.vue";
import { millify } from "millify";

export default {
    middleware: "auth",
    components: {
        DevicePieChart
    },

    data() {
        return {
            millify,
            grid: false,
            numeral,
            drawer: false,
            moment,
            loading: true,
            errorMessage: "",
            items_nav: [
                {
                    title: "Dashboard",
                    icon: "mdi-view-dashboard",
                    to: "client-dashboard"
                },
                {
                    title: "Campaign",
                    icon: "mdi-bullhorn-outline",
                    to: "clients/campaign"
                },
                {
                    title: "Machines",
                    icon: "mdi-cellphone-sound",
                    to: "clients/assigned-machine"
                },
                {
                    title: "Notifications",
                    icon: "mdi-bell",
                    to: "client-dashboard/notification"
                }
            ],
            overview: {
                client: null,
                metrics: {
                    total_impressions: 0,
                    total_scans: 0,
                    overall_conversion_rate: 0,
                    active_campaigns: 0,
                    total_campaigns: 0,
                    impressions_today: 0
                },
                campaigns: []
            },
            deviceBreakdown: [],
            dailyGraph: {
                impressions: [],
                scans: []
            },
            showBurger: false,
            windowSize: {
                x: null,
                y: null
            },
            notifications: [],
        };
    },

    computed: {
        unreadCount() {
            return (this.notifications || []).filter(n => Number(n.is_read) === 0).length;
        },
        showQrEnabled() {
            if (!this.overview.client) return false;
            return String(this.overview.client.qr) === "true" ||
                String(this.overview.client.show_qr) === "true" ||
                Number(this.overview.client.qr) === 1 ||
                Number(this.overview.client.show_qr) === 1;
        },

        impressionsSeries() {
            return [{
                name: "Impressions",
                data: (this.dailyGraph.impressions || []).map(row =>
                    Number(row.impressions || 0)
                )
            }];
        },

        scansSeries() {
            return [{
                name: "Scans",
                data: (this.dailyGraph.scans || []).map(row =>
                    Number(row.scans || 0)
                )
            }];
        },

        impressionsChartOptions() {
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
                stroke: {
                    curve: "smooth",
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: (this.dailyGraph.impressions || []).map(row =>
                        this.moment(row.date).format("MMM Do YY")
                    ),
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
                    theme: "dark",
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
                    categories: (this.dailyGraph.scans || []).map(row =>
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
        }
    },

    async mounted() {
        this.onResize();
        await this.loadDashboard();
        await this.resolveClient();

    if (this.clientId) {
        await this.fetchNotifications();
    }
    },

    methods: {
        async resolveClient() {
            try {
                const currentUser = this.$fire.auth.currentUser;

                if (!currentUser) {
                    this.$router.push("/auth/client.login");
                    return;
                }

                const { data } = await api.post("/api/client-dashboard/overview", {
                    uid: currentUser.uid
                });

                if (data && data.client) {
                    this.clientId = data.client.id;
                    this.clientName = data.client.client_name || "Client";
                }

                console.log("Resolved client:", this.clientId, this.clientName);

            } catch (error) {
                console.error("resolveClient error:", error);
            }
        },

        async fetchNotifications() {
            try {
                if (!this.clientId) {
                    this.errorMessage = "Client not resolved";
                    return;
                }

                this.loading = true;
                this.errorMessage = "";

                const { data } = await api.get("/api/notifications/get", {
                    params: {
                        user_type: "client",
                        user_id: this.clientId
                    }
                });

                this.notifications = data || [];
            } catch (error) {
                console.error("fetchNotifications error:", error);
                this.errorMessage =
                    error.response?.data?.message || "Failed to load notifications";
            } finally {
                this.loading = false;
            }
        },
        exportToCSV() {
            const rows = this.overview.campaigns || [];

            if (!rows.length) return;

            const headers = [
                "Campaign Name",
                "Status",
                "Total Impressions",
                "Total Interactions",
                "Total Scans",
                "Qr Conversion Rate",
                "Start Date",
                "End Date"
            ];

            const csvRows = [
                headers.join(","),
                ...rows.map(row => [
                    `"${row.campaign_name || ""}"`,
                    `"${row.status || ""}"`,
                    row.total_impressions || 0,
                    Math.floor((row.total_impressions * 0.24)) || 0,
                    row.total_scans || 0,
                    row.conversion_rate || 0,
                    `"${moment(row.start_date).format("MMM Do YY") || ""}"`,
                    `"${moment(row.end_date).format("MMM Do YY") || ""}"`
                ].join(","))
            ];

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;"
            });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "client-campaign-report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        logout() {
            this.$fire.auth.signOut();
            this.$router.push("/auth/client.login");
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
            this.loading = true;
            this.errorMessage = "";

            try {
                const currentUser = this.$fire.auth.currentUser;

                if (!currentUser) {
                    this.errorMessage = "User not logged in";
                   /// this.$router.push("/auth/client.login");
                    this.loading = false;
                    return;
                }

                const uid = currentUser.uid;

                const [overviewRes, dailyGraphRes, deviceRes] = await Promise.all([
                    api.post("/api/client-dashboard/overview", { uid }),
                    api.post("/api/client-dashboard/daily-graph", { uid }),
                    api.post("/api/client-dashboard/device-breakdown", { uid })
                ]);

                this.overview = overviewRes.data || {
                    client: null,
                    metrics: {
                        total_impressions: 0,
                        total_scans: 0,
                        overall_conversion_rate: 0,
                        active_campaigns: 0,
                        total_campaigns: 0,
                        impressions_today: 0
                    },
                    campaigns: []
                };

                this.dailyGraph = dailyGraphRes.data || {
                    impressions: [],
                    scans: []
                };

                this.deviceBreakdown = deviceRes.data || [];
                console.log("Loaded dashboard data:", {
                    overview: this.overview,
                    dailyGraph: this.dailyGraph,
                    deviceBreakdown: this.deviceBreakdown
                });
            } catch (error) {
                console.error("loadDashboard error:", error);
                this.errorMessage = error.response?.data?.message || "Failed to load dashboard";
            } finally {
                this.loading = false;
            }
        },

        formatNumber(value) {
            return Number(value || 0).toLocaleString();
        }
    }
};
</script>

<style scoped>
/* From Uiverse.io by risabbir */ 
.warp-loader {
    border-radius: 70px;
  position: relative;
  width: 14px;
  height: 14px;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(0, 255, 255, 0.15) 30%,
    transparent 70%
  );
  animation: pulse 2.2s ease-out infinite;
  opacity: 0;
  box-shadow:
    0 0 12px #00d1ff66,
    0 0 24px #00d1ff33;
  border: 2px solid rgba(0, 255, 255, 0.2);
}

.ring:nth-child(1) {
  animation-delay: 0s;
}
.ring:nth-child(2) {
  animation-delay: 0.4s;
}
.ring:nth-child(3) {
  animation-delay: 0.8s;
}
.ring:nth-child(4) {
  animation-delay: 1.2s;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 1;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.15;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px; /* Reduced size for the core glow */
  height: 4px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle at center, #00e5ff, #0099cc);
  box-shadow:
    0 0 25px #00e5ff,
    0 0 60px #00e5ff88,
    0 0 100px #00e5ff33;
  animation: corePulse 1.6s ease-in-out infinite;
}

@keyframes corePulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}


.client-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top left, rgba(198, 255, 0, 0.06), transparent 22%),
        linear-gradient(180deg, #020202 0%, #0b0b0b 100%);
    color: #fff;
}

.client-topbar {
    background: transparent !important;
    box-shadow: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.topbar-icon {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(198, 255, 0, 0.08);
}

.client-layout {
    display: flex;
    min-height: calc(100vh - 72px);
}

.client-sidebar {
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

.client-logo-avatar {
    overflow: hidden;
    border: 1px solid rgba(198, 255, 0, 0.18);
}

.avatar-text {
    color: #000;
    font-weight: 800;
}

.sidebar-client-name {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
}

.sidebar-client-subtitle {
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

.client-main {
    flex: 1;
    padding: 20px;
}

.page-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(198, 255, 0, 0.1);
    border: 1px solid rgba(198, 255, 0, 0.22);
    color: #c6ff00;
    font-size: 12px;
    margin-bottom: 8px;
}

.page-title {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    color: #fff;
}

.loading-state {
    padding: 30px 0;
    color: #b8b8b8;
}

.welcome-banner {
    border-radius: 26px;
    background:
        radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 28%),
        linear-gradient(135deg, #111111, #080808) !important;
    border: 1px solid rgba(198, 255, 0, 0.12) !important;
}

.welcome-copy {
    max-width: 760px;
}

.welcome-kicker {
    color: #c6ff00;
    font-size: 25px;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
}

.welcome-title {
    font-size: 18px;
    font-weight: 800;
    line-height: 1.2;
    color: #fff;
}

.welcome-subtitle {
    color: #bcbcbc;
    line-height: 1.7;
    margin-top: 12px;
}

.dashboard-alert {
    border-radius: 14px;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 30px;
}

.metric-card {
    border-radius: 20px;
    padding: 20px;
    background: linear-gradient(180deg, #111111, #090909);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.metric-primary {
    background: linear-gradient(135deg, rgba(198, 255, 0, 0.13), #0d0d0d 58%, #090909);
    border: 1px solid rgba(198, 255, 0, 0.12);
}

.metric-label {
    color: #a5a5a5;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 10px;
}

.metric-value {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
}

.section-block {
    margin-top: 22px;
    margin-bottom: 28px;
}

.section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    flex-wrap: wrap;
}

.section-kicker {
    color: #99a38c;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
}

.section-title {
    font-size: 24px;
    font-weight: 800;
    color: #fff;
    margin: 0;
}

.panel-card,
.table-card {
    border-radius: 22px;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-title-wrap {
    margin-bottom: 12px;
}

.panel-kicker {
    color: #9aa590;
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

.view-toggle {
    display: flex;
    align-items: center;
}

.toggle-chip {
    background: rgba(255, 255, 255, 0.02);
}

.campaign-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 20px;
}

.campaign-card {
    border-radius: 22px !important;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(198, 255, 0, 0.08) !important;
    padding: 18px;
    color: #fff;
    overflow: hidden;
}

.campaign-image-wrap {
    margin: -18px -18px 16px -18px;
}

.campaign-image {
    border-radius: 22px 22px 0 0;
}

.campaign-card-top {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.campaign-image-avatar {
    overflow: hidden;
    border: 1px solid rgba(198, 255, 0, 0.18);
}

.campaign-avatar-text {
    color: #000;
    font-weight: 800;
}

.table-avatar-text {
    color: #000;
    font-size: 11px;
    font-weight: 800;
}

.progress-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.1;
}

.progress-label strong {
    font-size: 14px;
    color: #fff;
}

.progress-label span {
    font-size: 11px;
    color: #a9a9a9;
}

.campaign-card-body {
    margin-bottom: 18px;
}

.campaign-name-label {
    color: #8b8b8b;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 6px;
}

.campaign-name {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
}

.campaign-metrics-row,
.campaign-dates-row {
    display: flex;
    gap: 14px;
    justify-content: space-between;
    margin-bottom: 14px;
}

.campaign-mini-metric,
.campaign-date-box {
    flex: 1;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
}

.campaign-mini-metric span,
.campaign-date-box span {
    display: block;
    color: #8f8f8f;
    font-size: 12px;
    margin-bottom: 6px;
}

.campaign-mini-metric strong,
.campaign-date-box strong {
    color: #fff;
    font-size: 15px;
}

.campaign-card-footer {
    display: flex;
    align-items: center;
}

.client-table ::v-deep th {
    color: #c6ff00 !important;
    background: transparent !important;
    font-weight: 700;
    border-bottom: 1px solid rgba(198, 255, 0, 0.08) !important;
}

.client-table ::v-deep td {
    color: #d4d4d4 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.client-table ::v-deep tr:hover {
    background: rgba(198, 255, 0, 0.03);
}

.campaign-link {
    text-decoration: none;
    color: #c6ff00;
}

.menu-list {
    background: #111111 !important;
    border: 1px solid rgba(198, 255, 0, 0.1);
    border-radius: 14px;
}

.error {
    color: red;
    margin-top: 20px;
}

@media (max-width: 1200px) {
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 950px) {
    .client-layout {
        display: block;
    }

    .client-main {
        padding: 16px;
    }

    .welcome-title {
        font-size: 24px;
    }

    .metrics-grid {
        grid-template-columns: 1fr;
    }
}
</style>