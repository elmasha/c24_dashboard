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
                <div class="page-badge" style="margin-top: 18px;">{{ overview.client.client_name  }} Portal</div>

            </div>
        </div>

        <v-spacer />

        <div class="d-flex align-center">
            <v-btn icon dark class="topbar-icon mr-2">
                <v-icon>mdi-bell-outline</v-icon>
            </v-btn>

            <v-btn icon dark class="topbar-icon" @click="loadDashboard" :loading="loading">
                <v-icon>mdi-refresh</v-icon>
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
                    <v-avatar size="52" color="#C6FF00" class="sidebar-avatar">
                        <span class="avatar-text">
                            {{ overview.client.client_name.substring(0, 2).toUpperCase() }}
                        </span>
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
                            <div class="welcome-title">
                                See how your campaigns are performing across impressions, scans, and conversions
                            </div>
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
                <div class="metrics-grid">
                    <div class="metric-card metric-primary">
                        <div class="metric-label">Total Impressions</div>
                        <div class="metric-value">
                            {{ formatNumber((overview.metrics && overview.metrics.total_impressions) || 0) }}
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-label">Total Scans</div>
                        <div class="metric-value">
                            {{ formatNumber((overview.metrics && overview.metrics.total_scans) || 0) }}
                        </div>
                    </div>

                    <div class="metric-card">
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

                    <div class="metric-card">
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
                            <div class="section-kicker">Performance Trends</div>
                            <h2 class="section-title">Delivery & engagement</h2>
                        </div>
                    </div>

                    <v-row>
                        <v-col cols="12" lg="4">
                            <v-card class="panel-card pa-4" outlined color="black">
                                <div class="panel-title-wrap">
                                    <div class="panel-kicker">Trend</div>
                                    <div class="panel-title">Daily Impressions</div>
                                </div>
                                <apexchart type="line" height="320" :options="impressionsChartOptions" :series="impressionsSeries" />
                            </v-card>
                        </v-col>

                        <v-col cols="12" lg="4">
                            <v-card class="panel-card pa-4" outlined color="black">
                                <div class="panel-title-wrap">
                                    <div class="panel-kicker">Trend</div>
                                    <div class="panel-title">Daily QR Scans</div>
                                </div>
                                <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                            </v-card>
                        </v-col>

                        <v-col cols="12" lg="4">
                            <v-card class="panel-card pa-4" outlined color="black">
                                <div class="panel-title-wrap">
                                    <div class="panel-kicker">Breakdown</div>
                                    <div class="panel-title">Audience Devices</div>
                                </div>
                                <DevicePieChart title="Campaign Device Breakdown" :rows="deviceBreakdown" />
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <!-- Campaign section header -->
                <div class="section-block">
                    <div class="section-head">
                        <div>
                            <div class="section-kicker">Campaign Performance</div>
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
                            <div class="campaign-card-top">
                                <div class="campaign-avatar-wrap">
                                    <v-avatar size="48" color="#C6FF00">
                                        <span class="campaign-avatar-text">
                                            {{ campaign.campaign_name.substring(0, 2).toUpperCase() }}
                                        </span>
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
                                        <strong>{{ numeral(campaign.delivered_impressions).format("0,0") }}</strong>
                                    </div>

                                    <div class="campaign-mini-metric">
                                        <span>QR Scans</span>
                                        <strong>{{ campaign.total_scans }}</strong>
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

                                <v-btn :to="`/view-campaign/${campaign.id}`" rounded small color="#C6FF00" class="black--text font-weight-bold" style="margin-right: 10px;">
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
                                        <th>Campaign</th>
                                        <th>Status</th>
                                        <th>Impressions</th>
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
                                        <td>{{ campaign.campaign_name }}</td>
                                        <td>{{ campaign.status }}</td>
                                        <td>{{ formatNumber(campaign.total_impressions) }}</td>
                                        <td>{{ formatNumber(campaign.total_scans) }}</td>
                                        <td>{{ campaign.conversion_rate }}%</td>
                                        <td>{{ moment(campaign.start_date).format("MMM Do YY") }}</td>
                                        <td>{{ moment(campaign.end_date).format("MMM Do YY") }}</td>
                                        <td>
                                            <nuxt-link :to="`/view-campaign/${campaign.id}`" class="campaign-link">
                                                View {{ campaign.campaign_name.substring(0, 10) + "..." }}
                                            </nuxt-link>
                                        </td>
                                    </tr>

                                    <tr v-if="!overview.campaigns.length">
                                        <td colspan="9">No campaigns found.</td>
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

export default {
    middleware: 'auth',
    components: {
        DevicePieChart
    },

    data() {
        return {
            grid: false,
            numeral,
            drawer: false,
            moment,
            loading: true,
            errorMessage: "",
            items_nav: [{
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
                    title: "Notification",
                    icon: "mdi-bell",
                    to: "clients/assigned-machine"
                }
            ],
            overview: {
                client: null,
                metrics: {
                    total_impressions: 0,
                    total_scans: 0,
                    overall_conversion_rate: 0,
                    active_campaigns: 0,
                    total_campaigns: 0
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
            }
        };
    },

    computed: {
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
            this.loading = true;
            this.errorMessage = "";

            try {
                const currentUser = this.$fire.auth.currentUser;

                if (!currentUser) {
                    this.errorMessage = "User not logged in";
                    this.loading = false;
                    return;
                }

                const uid = currentUser.uid;

                const [overviewRes, dailyGraphRes, deviceRes] = await Promise.all([
                    api.post("/api/client-dashboard/overview", {
                        uid
                    }),
                    api.post("/api/client-dashboard/daily-graph", {
                        uid
                    }),
                    api.post("/api/client-dashboard/device-breakdown", {
                        uid
                    })
                ]);

                this.overview = overviewRes.data || {
                    client: null,
                    metrics: {
                        total_impressions: 0,
                        total_scans: 0,
                        overall_conversion_rate: 0,
                        active_campaigns: 0,
                        total_campaigns: 0
                    },
                    campaigns: []
                };

                this.dailyGraph = dailyGraphRes.data || {
                    impressions: [],
                    scans: []
                };

                this.deviceBreakdown = deviceRes.data || [];
            } catch (error) {
                console.error("loadDashboard error:", error);
                this.errorMessage = error.response.data.message || "Failed to load dashboard";
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
    font-size: 13px;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
}

.welcome-title {
    font-size: 30px;
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
}

.campaign-card-top {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.campaign-avatar-text {
    color: #000;
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
