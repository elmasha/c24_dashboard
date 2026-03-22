<template>
<v-card color="black" dark elevation="0">
    <v-app-bar color="#000" dark height="50">
        <v-menu top :close-on-click="closeOnClick">
            <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon v-show="showBurger" dark v-bind="attrs" v-on="on"></v-app-bar-nav-icon>

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

    <div class="">
        <div class="d-flex">
            <div v-show="!showBurger">
                <!-- Desktop drawer -->
                <v-navigation-drawer floating elevation="0" style="border-radius: 12px; background-color: #2b4601;margin: 10px;" dark parmernent mini-variant="100">

                    <!-- <v-list-item class="px-1" v-if="overview.client">
                            <v-list-item-avatar>
                                <v-avatar color="green">
                                    <b style="color: black;"> {{ overview.client.client_name.substring(0,2)}}</b>
                                </v-avatar>
                            </v-list-item-avatar>
                        </v-list-item> -->

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

            <!-- Main dashboard -->
            <div class="client-dashboard" v-resize="onResize">

                <div v-if="loading" class="loading">Loading dashboard...</div>

                <div v-else>
                    <div class="welcome" v-if="overview.client">
                        <h2>{{ overview.client.client_name }} Dashboard</h2>
                        <h2></h2>
                        <v-btn icon @click="loadDashboard()"><v-icon>mdi-refresh</v-icon></v-btn>
                    </div>

                    <!-- Top metrics -->
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <h3>Total Impressions</h3>
                            <p>{{ formatNumber((overview.metrics && overview.metrics.total_impressions) || 0) }}</p>
                        </div>

                        <div class="metric-card">
                            <h3>Total Scans</h3>
                            <p>{{ formatNumber((overview.metrics && overview.metrics.total_scans) || 0) }}</p>
                        </div>

                        <div class="metric-card">
                            <h3>Conversion Rate</h3>
                            <p>{{ (overview.metrics && overview.metrics.overall_conversion_rate) || 0 }}%</p>
                        </div>

                        <div class="metric-card">
                            <h3>Active Campaigns</h3>
                            <p>{{ (overview.metrics && overview.metrics.active_campaigns) || 0 }}</p>
                        </div>

                        <div class="metric-card">
                            <h3>Total Campaigns</h3>
                            <p>{{ (overview.metrics && overview.metrics.total_campaigns) || 0 }}</p>
                        </div>
                    </div>

                    <!-- Daily charts -->
                    <div class="section">
                        <h2></h2>

                        <v-row v-resize="onResize">
                            <v-col cols="12" md="4">
                                <v-card outlined class="pa-4" color="black" light>
                                    <h3 class="mb-4 text-white" style="color: #808080;">Daily Impressions</h3>
                                    <apexchart type="line" height="320" :options="impressionsChartOptions" :series="impressionsSeries" />
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-card outlined class="pa-4 text-white" color="black" light>
                                    <h3 class="mb-4" style="color: #808080;">Daily Qr Scans</h3>
                                    <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-card outlined class="pa-4" color="black" light>
                                        <DevicePieChart title="Campaign Device Breakdown" :rows="deviceBreakdown" />
                                </v-card>
                            </v-col>

                        </v-row>

                    </div>

                    <v-row>
                        <v-col cols="12" md="12">
                            <div class="">
                                <h2>Campaign Performance</h2>

                                <div class="d-flex" style="margin-top: 20px;">
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

                                        <v-card style="border-radius: 12px; color: white;" dark>

                                            <div class="container">

                                                <div class="d-flex">
                                                    <div>

                                                        <v-avatar size="40" color="green" style="margin: 10px;color: #000;">
                                                            {{ campaign.campaign_name.substring(0,2).toLocaleString() }}
                                                        </v-avatar>
                                                    </div>

                                                    <v-spacer />
                                                    <div class="text-center">
                                                        <!--  -->
                                                        <v-progress-circular max="100" rounded width="2" size="77" color="green" :value="campaign.conversion_rate">

                                                            {{ campaign.conversion_rate }} % <br>
                                                            Cr
                                                        </v-progress-circular>

                                                    </div>

                                                </div>
                                                <div>
                                                    <h4 style="font-size: 0.8rem; color:#808080;"> Campaign : <br>
                                                        <b style="font-size: 1rem; color:#fff;"> {{campaign.campaign_name }}</b> <br>

                                                    </h4>
                                                </div>

                                                <p></p>
                                                <div class="d-flex">
                                                    <div class="text-center">
                                                        <h4 style="font-size: 0.9rem; color:#808080;"> Impression <br>
                                                            <b style="font-size: 1rem; color:#fff;"> {{ numeral(campaign.delivered_impressions).format('0,0')  }}</b> <br>

                                                        </h4>
                                                    </div>
                                                    <v-spacer />
                                                    <div class="text-center">
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
                                                <v-chip outlined>{{ campaign.status }}</v-chip>
                                                <v-spacer></v-spacer>
                                                <v-btn :to="`/view-campaign/${campaign.id}`" rounded small color="green" style="color: black;">
                                                    View campaign
                                                    <v-icon right>mdi-chevron-right</v-icon>
                                                </v-btn>
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
                                            <td>{{ campaign.start_date }}</td>
                                            <td>{{ campaign.end_date }}</td>
                                            <td>
                                                <nuxt-link :to="`/view-campaign/${campaign.id}`" style="text-decoration-line: none;color: #C6FF00;">
                                                    View {{ campaign.campaign_name.substring(0,10).toLocaleString()+"..." }}
                                                </nuxt-link>
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
import DevicePieChart from "../../components/charts/DevicePieChart.vue";

export default {
    data() {
        return {
            grid: false,
            numeral,
            drawer: false,
            moment,
            loading: true,
            errorMessage: "",
            items_nav: [{
                    title: 'Dashboard',
                    icon: 'mdi-view-dashboard',
                    to: 'client-dashboard'
                },
                {
                    title: 'Campaign',
                    icon: 'mdi-bullhorn-outline',
                    to: 'clients/campaign'
                },
                {
                    title: 'Machines',
                    icon: 'mdi-cellphone-sound',
                    to: 'clients/assigned-machine'
                },
                {
                    title: 'Notification',
                    icon: 'mdi-bell',
                    to: 'clients/assigned-machine'
                },
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
            socketRefreshTimer: null,
            showBurger: false
        };
    },
    components: {
        DevicePieChart
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
                    categories: (this.dailyGraph.impressions || []).map(row => this.moment(row.date).format("MMM Do YY")),
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
                    categories: (this.dailyGraph.scans || []).map(row => moment(row.date).format("MMM Do YY")),
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
        }
    },

    async mounted() {
        // await this.onResize();
        await this.loadDashboard();
        //  this.setupSocketListeners();
    },

    beforeDestroy() {

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
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
                console.log(this.showBurger);
            } else {
                this.showBurger = false;
                console.log(this.showBurger);
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
