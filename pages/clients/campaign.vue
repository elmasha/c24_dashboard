<template>
<v-card color="black" dark elevation="0" width="100%">

    <div class="ma-2 pa-0">
        <div class="">
            <v-row>
                <v-col cols="12" md="12"></v-col>
                <v-col cols="12" md="12">
                    <div class="">
                        <nuxt-link style="text-decoration: none; color: white;margin-left: 10px; margin-top: 40px;" icon to="/client-dashboard">
                            <v-icon large>mdi-arrow-left</v-icon>
                        </nuxt-link>
                    </div>
                </v-col>
            </v-row>

            <div class="client-dashboard">

                <div v-if="loading" class="loading">Loading dashboard...</div>

                <div v-else>
                    <div class="welcome" v-if="overview.client">
                        <h2> My Campaigns</h2>
                        <h5 style="color: #808080;">{{ overview.client.client_name }}</h5>
                        <h2></h2>

                    </div>

                    <v-row>
                        <v-col cols="12" md="12">
                            <div class="">

                                <div class="d-flex" style="margin-top: 10px;">
                                    <v-chip outlined color="green">
                                        <v-btn icon @click="grid=false">
                                            <v-icon>mdi-view-grid</v-icon>
                                        </v-btn>
                                        <v-btn icon @click="grid=true">
                                            <v-icon>mdi-format-list-bulleted-square</v-icon>
                                        </v-btn>

                                    </v-chip>

                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="12" v-show="!grid">
                            <div class="">
                                <div class="grid">
                                    <div v-for="campaign in overview.campaigns" :key="campaign.id">

                                        <v-card style="border-radius: 12px; color: white;" dark max-width="400">

                                            <div class="">

                                                <div class="d-flex">
                                                    <div style="margin: 12px;">
                                                        <v-chip outlined>{{ campaign.status }}</v-chip> <br>
                                                        <v-avatar size="40" color="green" style="margin: 10px;color: #000;">
                                                            {{ campaign.campaign_name.substring(0,2).toLocaleString() }}
                                                        </v-avatar>
                                                    </div>

                                                    <v-spacer />
                                                    <div class="text-center" style="margin: 12px;">
                                                        <!--  -->
                                                        <v-progress-circular max="100" rounded width="2" size="77" color="green" :value="campaign.conversion_rate">

                                                            {{ campaign.conversion_rate }} % <br>
                                                            Cr
                                                        </v-progress-circular>

                                                    </div>

                                                </div>
                                                <div style="margin: 12px;">
                                                    <h4 style="font-size: 0.8rem; color:#808080;"> Campaign : <br>
                                                        <b style="font-size: 1rem; color:#fff;"> {{campaign.campaign_name }}</b> <br>

                                                    </h4>
                                                </div>

                                                <p></p>
                                                <div class="d-flex" >
                                                    <div class="text-center" style="margin: 12px;">
                                                        <h4 style="font-size: 0.9rem; color:#808080;"> Impression <br>
                                                            <b style="font-size: 1rem; color:#fff;"> {{ numeral(campaign.delivered_impressions).format('0,0')  }}</b> <br>

                                                        </h4>
                                                    </div>
                                                    <v-spacer />
                                                    <div class="text-center" style="margin: 12px;">
                                                        <p style="font-size: 0.9rem;font-weight:200;color: #1A1B2B;">Qr Scans <br> <b style="font-weight: 500;">{{ campaign.total_scans }}</b></p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="d-flex text-center" style="font-size: 0.9rem; margin: 0px; padding: 10px;">
                                                <div>
                                                    Start date <br>
                                                    <b>{{ moment(campaign.start_date).format("MMM Do YY") }}</b>
                                                </div>
                                                <v-spacer />
                                                <div>
                                                    End date <br>
                                                    <b> {{ moment(campaign.end_date).format("MMM Do YY") }}</b>
                                                </div>
                                            </div>
                                            <v-card-actions style="border-radius: 12px; margin: 9px; padding: 12px;">
                                                <!-- <p>Status <br> <b style="color:green">{{ candidate.working_status }}</b></p> -->

                                                <v-spacer></v-spacer>
                                                <v-btn :to="`/view/${campaign.id}`" rounded small color="green" style="color: black;">
                                                    View campaign
                                                    <v-icon right>mdi-chevron-right</v-icon>
                                                </v-btn>
                                                <v-spacer></v-spacer>
                                            </v-card-actions>
                                        </v-card>

                                    </div>
                                </div>

                            </div>
                        </v-col>
                        <v-col cols="12" md="12" v-show="grid">

                            <!-- Campaigns table -->
                            <div class="section">

                                <v-simple-table>

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Campaign</th>
                                            <th>Status</th>
                                            <th>Impressions</th>
                                            <th>Qr Scans</th>
                                            <th>Conversion</th>
                                            <th>Start</th>
                                            <th>End</th>
                                            <th>View campaign</th>
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
                                                <div class="d-flex">
                                                    <nuxt-link :to="`/view/${campaign.id}`" style="text-decoration-line: none;color: #C6FF00;margin-top: 8px;">
                                                        View {{ campaign.campaign_name.substring(0,10).toLocaleString()+"..." }}
                                                    </nuxt-link>
                                                    <v-btn icon :to="`/view/${campaign.id}`">
                                                        <v-icon small color="green">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>

                                            </td>
                                        </tr>

                                        <tr v-if="!overview.campaigns.length">
                                            <td colspan="11">No campaigns found.</td>
                                        </tr>
                                    </tbody>

                                </v-simple-table>
                            </div>
                        </v-col>
                    </v-row>

                </div>

                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</v-card>
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
                    title: 'Dashboard',
                    icon: 'mdi-view-dashboard',
                    to: '/client-dashboard'
                },
                {
                    title: 'Campaign',
                    icon: 'mdi-bullhorn-outline',
                    to: '/clients/cam'
                },
                {
                    title: 'Admin',
                    icon: 'mdi-gavel'
                },
            ],
        };
    },
    components: {},

    async mounted() {
        await this.onResize();
        await this.loadDashboard();
        //  this.setupSocketListeners();
    },

    beforeDestroy() {

    },

    methods: {
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
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

                const [overviewRes] = await Promise.all([
                    api.post("/api/client-dashboard/overview", {
                        uid
                    }),

                ]);

                this.overview = overviewRes.data || {
                    client: null,
                    campaigns: []
                };

                console.log("Overview", this.overview)
                // join client room after client data is loaded

            } catch (error) {
                console.error("loadDashboard error:", error);
                this.errorMessage =
                    error.response;
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
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.client-dashboard {
    padding: 20px;
    width: 100%;
}

.loading {
    padding: 20px 0;
}

.welcome {
    margin-bottom: 20px;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    margin-bottom: 30px;
}

.metric-card {
    /* background: linear-gradient(to right,
            #0c0b03da,
            #c8ff0007,
            #c8ff003b,
            ); */
    background: linear-gradient(to top right, rgba(0, 0, 0, 0.726), rgba(0, 0, 0, 0.678), #C6FF00);
    border-radius: 18px;
    padding: 16px;
    color: #fff;
}

.metric-card h3 {
    margin: 0 0 10px;
    font-size: 14px;
    color: #666;
}

.metric-card p {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
}

.section {
    margin-top: 30px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

.charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.error {
    color: red;
    margin-top: 20px;
}

@media (max-width: 1200px) {
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .charts-grid {
        grid-template-columns: 1fr;
    }
}
</style>
