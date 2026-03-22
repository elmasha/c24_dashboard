<template>
<div class="campaign-detail-page container">
    <v-row>
        <v-col cols="12" md="12"></v-col>
        <v-col cols="12" md="12">
            <div class="">
                <nuxt-link style="text-decoration: none; color: white;margin-left: 10px; margin-top: 40px;" icon to="/clients/campaign">
                    <v-icon large>mdi-arrow-left</v-icon>
                </nuxt-link>
            </div>
        </v-col>
    </v-row>
    <br>
    <h2 style="margin: 20px;">Campaign Detail</h2>

    <div v-if="loading">Loading...</div>

    <div v-else-if="campaign">
        <div class="summary-grid">
            <div class="card">
                <p>Campaign Name</p>
                <h3>{{ campaign.campaign_name }}</h3>
            </div>

            <div class="card">
                <p>Client</p>
                <h3>{{ campaign.client_name }}</h3>
            </div>

            <div class="card">
                <p>Status</p>
                <h3>{{ campaign.status }}</h3>
            </div>

           

            <div class="card">
                <p>Total Impressions</p>
                <h3>{{ numeral(campaign.total_impressions).format("0,0") }}</h3>
            </div>

            <div class="card">
                <p>Total Scans</p>
                <h3>{{ campaign.total_scans }}</h3>
            </div>

            <div class="card">
                <p>Conversion Rate</p>
                <h3>{{ campaign.conversion_rate }}%</h3>
            </div>

            <div class="card">
                <p>QR Token</p>
                <div class="">
                   
                    <qr-code style="margin-left: 12px;" :text="getUrl(campaign.qr_token)" size="90" />

                    <!-- <p>{{getUrl(campaign.qr_token)  }}</p> -->
                </div>

            </div>
        </div>

        <div class="container">
            <v-row>
                <v-col cols="12" md="4">
                    <h2 style="color: gray;">Campaign Info</h2>
                    <div class="details-section">

                        <div class="d-flex">
                            <p><strong>Start Date: <br></strong> {{moment(campaign.start_date).format("MMM Do YY") }}</p>
                            <v-spacer />
                            <p><strong>End Date: <br></strong> {{ moment(campaign.end_date).format("MMM Do YY") }}</p>
                            <v-spacer />
                        </div>
                        <!-- <p><strong>Media URL:</strong> {{ campaign.media_url || "-" }}</p> -->
                        <p><strong>Landing URL:</strong> <br><a :href="campaign.landing_url" style="color: greenyellow; text-decoration-line: none;">{{ campaign.landing_url }}</a></p>

                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <h4>Media On Machine</h4>
                    <div class="player-container" v-if="campaign && campaign.media_url">
                        <video ref="campaignVideo" :src="campaign.media_url" class="campaign-video" muted playsinline controls @mouseenter="playPreview" @mouseleave="pausePreview">
                            <source />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <h4>POF media</h4>
                    <div class="player-container" v-if="campaign && campaign.media_url">
                        <video ref="campaignVideo" class="campaign-video" muted playsinline controls @mouseenter="playPreview" @mouseleave="pausePreview">
                            <source :src="campaign.media_url" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </v-col>
            </v-row>

        </div>

        <br />
        <v-row>
            <v-col cols="12" md="4">
                <v-card outlined class="pa-4" light color="black">
                    <h3 class="mb-4" style="color: gray;">Daily Impressions</h3>
                    <apexchart type="line" height="320" :options="impressionsChartOptions" :series="impressionsSeries" />
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card outlined class="pa-4" light color="black">
                    <h3 class="mb-4" style="color: gray;">Daily Scans</h3>
                    <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card outlined class="pa-4" light color="black">
                    <h3 class="mb-4" style="color: gray;">Device Breakdown</h3>
                    <apexchart type="pie" height="320" :options="devicePieOptions" :series="devicePieSeries" />
                </v-card>
            </v-col>
        </v-row>
        <br />

        <div class="details-section">
            <h2 style="margin: 20px; color: gray;">Assigned Machines</h2>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>
                                <h4>Machine</h4>
                            </th>
                            <th>
                                <h4>UID</h4>
                            </th>
                            <th>
                                <h4>Location</h4>
                            </th>
                            <th>
                                <h4>Category</h4>
                            </th>
                             <th>
                                <h4>Qr code</h4>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="machine in assignedMachines" :key="machine.id">
                            <td>{{ machine.machine_name }}</td>
                            <td>{{ machine.machine_uid }}</td>
                            <td>{{ machine.location_name }}</td>
                            <td>{{ machine.location_category }}</td>
                            <td><qr-code style="margin-left: 12px;" :text="getUrl2(campaign.qr_token,machine.machine_uid)" size="90" /> <br>
                                   <a :href="getUrl2(campaign.qr_token,machine.machine_uid)"><v-icon>mdi-link</v-icon></a></td>
                        </tr>
                        <tr v-if="!assignedMachines.length">
                            <td colspan="4">No machines assigned</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>

        <!-- Daily charts -->
        <div class="section">
            <div class="charts-grid">

            </div>
        </div>

        <!-- Device pie chart -->
        <div class="section mt-6">
            <div class="charts-grid-single">

            </div>
        </div>

        <v-row>
            <v-col cols="12" md="6">
                <div class="details-section">
                    <h2 style="margin: 20px; color: gray;">Daily Impressions</h2>

                    <v-simple-table border="1" cellpadding="8" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Impressions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in dailyMetrics.impressions" :key="'imp-' + row.date">
                                <td>{{ moment(row.date).format("yyyy MMM DD") }}</td>
                                <td>{{ row.impressions }}</td>
                            </tr>
                            <tr v-if="!dailyMetrics.impressions.length">
                                <td colspan="2">No impression data</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <div class="details-section">
                    <h2 style="margin: 20px; color: gray;">Daily Scans</h2>

                    <v-simple-table border="1" cellpadding="8" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Scans</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in dailyMetrics.scans" :key="'scan-' + row.date">
                                <td>{{ moment(row.date).format("yyyy MMM DD") }}</td>
                                <td>{{ row.scans }}</td>
                            </tr>
                            <tr v-if="!dailyMetrics.scans.length">
                                <td colspan="2">No scan data</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </div>
            </v-col>
        </v-row>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
</template>

<script>
import Vue from "vue";
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";
import VueQRCodeComponent from "vue-qrcode-component";
// import html2canvas from "html2canvas";
// import jspdf from "jspdf";
// Register the Vue component
Vue.component("qr-code", VueQRCodeComponent);

export default {
    data() {
        return {
            numeral,
            moment,
            loading: true,
            errorMessage: "",
            campaign: null,
            assignedMachines: [],
            deviceBreakdown: [],
            dailyMetrics: {
                impressions: [],
                scans: []
            },
            dailyGraph: {
                impressions: [],
                scans: []
            }
        };
    },

    mounted() {
        this.fetchCampaignDetail();
    },

    methods: {
        getUrl2(val,val2) {
            let link = "https://adengine-production-f766.up.railway.app/scan/" + val + "?m="+val2
            return link;
        },
        getUrl(val) {
            let link = "https://adengine-production-f766.up.railway.app/scan/" + val + "?m=MACH_003"
            return link;
        },
        playPreview() {
            const video = this.$refs.campaignVideo;
            if (video) {
                video.play().catch(() => {});
            }
        },

        pausePreview() {
            const video = this.$refs.campaignVideo;
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        },
        async fetchCampaignDetail() {
            this.loading = true;
            this.errorMessage = "";

            try {
                const campaignId = this.$route.params.id;

                const [summaryRes, machinesRes, dailyRes, deviceRes] = await Promise.all([
                    api.get(`/api/analytics/campaign-summary/${campaignId}`),
                    api.get(`/api/campaign-machines/${campaignId}/machines`),
                    api.get(`/api/analytics/campaign/${campaignId}/daily-metrics`),
                    api.get(`/api/analytics/campaign-device-breakdown/${campaignId}`)
                ]);

                this.campaign = summaryRes.data;
                this.assignedMachines = machinesRes.data || [];
                this.dailyMetrics = dailyRes.data || {
                    impressions: [],
                    scans: []
                };
                this.dailyGraph = dailyRes.data || {
                    impressions: [],
                    scans: []
                };
                this.deviceBreakdown = deviceRes.data || [];
            } catch (error) {
                console.error("fetchCampaignDetail error:", error);
                this.errorMessage =
                    error.response.data.message || "Failed to load campaign detail";
            } finally {
                this.loading = false;
            }
        }
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

        devicePieSeries() {
            return (this.deviceBreakdown || []).map(row =>
                Number(row.scans || 0)
            );
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
                    categories: (this.dailyGraph.scans || []).map(row =>
                        this.moment(row.date).format("MMM Do YY")
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
                    y: {
                        formatter: value => Number(value || 0).toLocaleString()
                    }
                },
                noData: {
                    text: "No scan data"
                }
            };
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
    }
};
</script>

<style scoped>
.player-container {
    width: 100%;
    margin: 20px 0 30px 0;
    overflow: hidden;
    border-radius: 12px;
}

.campaign-video {
    width: 100%;
    max-height: 500px;
    border-radius: 12px;
    background: #000;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.campaign-video:hover {
    transform: scale(1.04);
}

.campaign-detail-page {
    padding: 20px;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 25px;
}

.card {
    background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.726), rgba(0, 0, 0, 0.678), #C6FF00);
    padding: 15px;
    border-radius: 8px;
}

.details-section {
    margin-top: 30px;
}

.error {
    color: red;
    margin-top: 20px;
}

.charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.charts-grid-single {
    display: grid;
    grid-template-columns: 1fr;
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
