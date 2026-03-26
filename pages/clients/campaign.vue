<template>
<v-container fluid class="campaigns-page pa-0">
    <div class="campaigns-shell">
        <!-- Top -->
        <div class="page-topbar" style="margin-top: 30px; margin-bottom: 20px;">
            <nuxt-link class="back-link" to="/client-dashboard">
                <v-icon color="#C6FF00" left>mdi-arrow-left</v-icon>
                Back to dashboard
            </nuxt-link>
        </div>

        <div class="campaigns-content">
            <div v-if="loading" class="loading-state">
                Loading campaigns...
            </div>

            <div v-else>
                <!-- Hero -->
                <v-card class="hero-panel pa-6 mb-5" outlined>
                    <div class="d-flex flex-wrap align-center">
                        <div class="hero-copy">
                            <div class="hero-kicker" style="margin-left: 17px;">Campaign Library</div>
                            <div class="hero-title">My Campaigns</div>
                            <div class="hero-subtitle" v-if="overview.client">
                                View all active and completed campaigns for
                                <strong>{{ overview.client.client_name }}</strong>, including impressions,
                                scans, conversion rate, and campaign duration.
                            </div>
                        </div>

                        <v-spacer />

                        <div class="hero-actions mt-4 mt-md-0">
                            <v-chip outlined color="#C6FF00" class="toggle-chip" style="margin-right: 10px;">
                                <v-btn icon small @click="grid = false">
                                    <v-icon color="#C6FF00">mdi-view-grid</v-icon>
                                </v-btn>
                                <v-btn icon small @click="grid = true">
                                    <v-icon color="#C6FF00">mdi-format-list-bulleted-square</v-icon>
                                </v-btn>
                            </v-chip>
                        </div>
                    </div>
                </v-card>

                <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
                    {{ errorMessage }}
                </v-alert>

                <!-- Card view -->
                <div class="campaign-grid" v-show="!grid">
                    <v-card v-for="campaign in overview.campaigns" :key="campaign.id" class="campaign-card" outlined>
                        <div class="campaign-card-top">
                            <div class="campaign-left">
                                <v-chip outlined small color="#C6FF00" class="status-chip" style="margin-left: 6px;">
                                    {{ campaign.status }}
                                </v-chip>

                                <v-avatar size="46" color="#C6FF00" class="campaign-avatar">
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
                            <div class="campaign-label">Campaign</div>
                            <div class="campaign-name">{{ campaign.campaign_name }}</div>

                            <div class="campaign-stats">
                                <div class="stat-box">
                                    <span>Impressions</span>
                                    <strong>{{ numeral(campaign.delivered_impressions).format("0,0") }}</strong>
                                </div>

                                <div class="stat-box">
                                    <span>QR Scans</span>
                                    <strong>{{ campaign.total_scans }}</strong>
                                </div>
                            </div>

                            <div class="campaign-dates">
                                <div class="date-box">
                                    <span>Start Date</span>
                                    <strong>{{ moment(campaign.start_date).format("MMM Do YY") }}</strong>
                                </div>

                                <div class="date-box">
                                    <span>End Date</span>
                                    <strong>{{ moment(campaign.end_date).format("MMM Do YY") }}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="campaign-card-footer">
                            <v-spacer />
                            <v-btn :to="`/view/${campaign.id}`" rounded small color="#C6FF00" class="black--text font-weight-bold">
                                View campaign
                                <v-icon right color="black">mdi-chevron-right</v-icon>
                            </v-btn>
                            <v-spacer />
                        </div>
                    </v-card>

                    <div v-if="!overview.campaigns.length" class="empty-state">
                        No campaigns found.
                    </div>
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
                                    <th>View Campaign</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="campaign in overview.campaigns" :key="campaign.id">
                                    <td>{{ campaign.id }}</td>
                                    <td>{{ campaign.campaign_name }}</td>
                                    <td>
                                        <span class="status-pill" :class="campaign.status === 'active' ? 'status-active' : 'status-default'">
                                            {{ campaign.status }}
                                        </span>
                                    </td>
                                    <td>{{ formatNumber(campaign.total_impressions) }}</td>
                                    <td>{{ formatNumber(campaign.total_scans) }}</td>
                                    <td>{{ campaign.conversion_rate }}%</td>
                                    <td>{{ moment(campaign.start_date).format("MMM Do YY") }}</td>
                                    <td>{{ moment(campaign.end_date).format("MMM Do YY") }}</td>
                                    <td>
                                        <div class="d-flex align-center">
                                            <nuxt-link :to="`/view/${campaign.id}`" class="campaign-link">
                                                View {{ campaign.campaign_name.substring(0, 10) + "..." }}
                                            </nuxt-link>
                                            <v-btn icon :to="`/view/${campaign.id}`">
                                                <v-icon small color="#C6FF00">mdi-arrow-right</v-icon>
                                            </v-btn>
                                        </div>
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

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
    </div>
</v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";

export default {
    data() {
        return {
            grid: false,
            numeral,
            moment,
            showBurger: false,
            loading: true,
            errorMessage: "",
            overview: {
                client: null,
                campaigns: []
            },
            deviceBreakdown: [],
            dailyGraph: {
                impressions: [],
                scans: []
            },
            socketRefreshTimer: null,
            items: [{
                    title: "Dashboard",
                    icon: "mdi-view-dashboard",
                    to: "/client-dashboard"
                },
                {
                    title: "Campaign",
                    icon: "mdi-bullhorn-outline",
                    to: "/clients/cam"
                },
                {
                    title: "Admin",
                    icon: "mdi-gavel"
                }
            ],
            windowSize: {
                x: null,
                y: null
            }
        };
    },

    async mounted() {
        await this.onResize();
        await this.loadDashboard();
    },

    methods: {
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
                     this.$router.push("/auth/client.login");
                    this.loading = false;
                    return;
                }

                const uid = currentUser.uid;

                const [overviewRes] = await Promise.all([
                    api.post("/api/client-dashboard/overview", {
                        uid
                    })
                ]);

                this.overview = overviewRes.data || {
                    client: null,
                    campaigns: []
                };
            } catch (error) {
                console.error("loadDashboard error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to load campaigns";
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
.campaigns-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top left, rgba(198, 255, 0, 0.06), transparent 22%),
        linear-gradient(180deg, #020202 0%, #0b0b0b 100%);
    color: #fff;
}

.campaigns-shell {
    padding: 24px;
}

.page-topbar {
    margin-bottom: 20px;
}

.back-link {
    display: inline-flex;
    align-items: center;
    color: #d8d8d8;
    text-decoration: none;
    font-weight: 500;
}

.back-link:hover {
    color: #c6ff00;
}

.campaigns-content {
    width: 100%;
}

.loading-state {
    padding: 20px 0;
    color: #bdbdbd;
}

.hero-panel {
    border-radius: 26px;
    background:
        radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 28%),
        linear-gradient(135deg, #111111, #080808) !important;
    border: 1px solid rgba(198, 255, 0, 0.12) !important;
}

.hero-copy {
    max-width: 760px;
}

.hero-kicker {
    color: #c6ff00;
    font-size: 13px;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
}

.hero-title {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.15;
    color: #fff;
}

.hero-subtitle {
    color: #bcbcbc;
    line-height: 1.7;
    margin-top: 12px;
    max-width: 760px;
}

.toggle-chip {
    background: rgba(255, 255, 255, 0.02);
}

.dashboard-alert {
    border-radius: 14px;
}

.campaign-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 20px;
}

.campaign-card {
    border-radius: 22px !important;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(198, 255, 0, 0.08) !important;
    padding: 18px;
    color: #fff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.campaign-card-top {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
}

.campaign-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.status-chip {
    margin-bottom: 12px;
}

.campaign-avatar {
    margin-top: 2px;
}

.campaign-avatar-text {
    color: #000;
    font-weight: 800;
}

.campaign-progress-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
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
    color: #9f9f9f;
}

.campaign-card-body {
    margin-bottom: 18px;
}

.campaign-label {
    color: #8c8c8c;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
}

.campaign-name {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
}

.campaign-stats,
.campaign-dates {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-bottom: 14px;
}

.stat-box,
.date-box {
    flex: 1;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
}

.stat-box span,
.date-box span {
    display: block;
    color: #8f8f8f;
    font-size: 12px;
    margin-bottom: 6px;
}

.stat-box strong,
.date-box strong {
    color: #fff;
    font-size: 15px;
}

.campaign-card-footer {
    display: flex;
    align-items: center;
}

.table-card {
    border-radius: 22px;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
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

.status-default {
    background: rgba(255, 255, 255, 0.06);
    color: #d6d6d6;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.campaign-link {
    text-decoration: none;
    color: #c6ff00;
}

.empty-state {
    padding: 24px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    color: #bdbdbd;
}

.error {
    color: red;
    margin-top: 20px;
}

@media (max-width: 900px) {
    .campaigns-shell {
        padding: 16px;
    }

    .hero-title {
        font-size: 26px;
    }

    .campaign-stats,
    .campaign-dates {
        flex-direction: column;
    }
}
</style>
