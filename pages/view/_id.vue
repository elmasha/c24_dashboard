<template>
<div class="campaign-detail-page">
    <!-- Top header -->
    <div class="detail-topbar" style="margin-top: 30px;">
        <nuxt-link class="back-link" to="/clients/campaign">
            <v-icon color="#C6FF00" left>mdi-arrow-left</v-icon>
            Back to campaigns
        </nuxt-link>
    </div>

    <div v-if="loading" class="loading-state">
        Loading campaign...
    </div>

    <div v-else-if="campaign">
        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
            <div class="d-flex flex-wrap align-center">
                <div class="hero-copy">
                    <div class="hero-kicker" style="margin-left: 10px;">Campaign Report</div>
                    <div class="hero-title">{{ campaign.campaign_name }}</div>
                    <div class="hero-subtitle">
                        View campaign delivery, scans, device engagement, media preview, and assigned machine QR access points.
                    </div>
                </div>

                <v-spacer />

                <div class="hero-status-wrap mt-4 mt-md-0">
                    <v-chip outlined color="#C6FF00" class="status-chip" style="margin-right: 10px;">
                        {{ campaign.status }}
                    </v-chip>
                </div>
            </div>
        </v-card>

        <!-- Summary cards -->
        <div class="summary-grid">
            <div class="summary-card summary-highlight">
                <div class="summary-label">Campaign Name</div>
                <div class="summary-value">{{ campaign.campaign_name }}</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">Client</div>
                <div class="summary-value">{{ campaign.client_name }}</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">Total Impressions</div>
                <div class="summary-value">{{ numeral(campaign.total_impressions).format("0,0") }}</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">Total Scans</div>
                <div class="summary-value">{{ campaign.total_scans }}</div>
            </div>

            <div class="summary-card">
                <div class="summary-label">Conversion Rate</div>
                <div class="summary-value">{{ campaign.conversion_rate }}%</div>
            </div>

            <div class="summary-card qr-summary-card">
                <div class="summary-label">Campaign QR</div>
                <div class="qr-wrap">
                    <div :id="`campaign-qr-${campaign.id}`" class="qr-download-box">
                        <qr-code :text="getUrl(campaign.qr_token)" size="92" />
                    </div>

                    <v-btn icon small class="qr-download-btn" @click="downloadQr(`campaign-qr-${campaign.id}`, `${campaign.campaign_name}-qr`)">
                        <v-icon color="#C6FF00">mdi-download</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Info + Media -->
        <v-row class="mt-2">
            <v-col cols="12" md="4">
                <v-card class="panel-card pa-5" outlined>
                    <div class="panel-kicker">Campaign Details</div>
                    <div class="panel-title">Campaign Info</div>

                    <div class="info-block">
                        <div class="info-row">
                            <div class="info-box">
                                <span>Start Date</span>
                                <strong>{{ moment(campaign.start_date).format("MMM Do YY") }}</strong>
                            </div>
                            <div class="info-box">
                                <span>End Date</span>
                                <strong>{{ moment(campaign.end_date).format("MMM Do YY") }}</strong>
                            </div>
                        </div>

                        <div class="info-link-box">
                            <span>Landing URL</span>
                            <a :href="campaign.landing_url" target="_blank">
                                {{ campaign.landing_url }}
                            </a>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="panel-card pa-5" outlined>
                    <div class="panel-kicker">Creative Preview</div>
                    <div class="panel-title">Campaign Media</div>

                    <div class="player-container" v-if="campaign && campaign.media_url">
                        <video class="campaign-video" muted playsinline controls @mouseenter="playPreview('mainVideo')" @mouseleave="pausePreview('mainVideo')" ref="mainVideo">
                            <source :src="campaign.media_url" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="panel-card pa-5" outlined>
                    <div class="panel-kicker">Playback Preview</div>
                    <div class="panel-title">Media on Screen</div>

                    <div class="player-container" v-if="campaign && campaign.media_url">
                        <video class="campaign-video" muted playsinline controls @mouseenter="playPreview('screenVideo')" @mouseleave="pausePreview('screenVideo')" ref="screenVideo">
                            <source :src="campaign.media_url" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Charts -->
        <v-row class="mt-2">
            <v-col cols="12" md="4">
                <v-card class="panel-card pa-4" outlined>
                    <div class="panel-kicker">Trend</div>
                    <div class="panel-title">Daily Impressions</div>
                    <apexchart type="line" height="320" :options="impressionsChartOptions" :series="impressionsSeries" />
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="panel-card pa-4" outlined>
                    <div class="panel-kicker">Trend</div>
                    <div class="panel-title">Daily Scans</div>
                    <apexchart type="bar" height="320" :options="scansChartOptions" :series="scansSeries" />
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="panel-card pa-4" outlined>
                    <div class="panel-kicker">Breakdown</div>
                    <div class="panel-title">Device Breakdown</div>
                    <apexchart type="pie" height="320" :options="devicePieOptions" :series="devicePieSeries" />
                </v-card>
            </v-col>
        </v-row>

        <!-- Assigned machines -->
        <div class="section-block">
            <div class="section-head">
                <div>
                    <div class="section-kicker">Distribution</div>
                    <h2 class="section-title">Assigned Machines</h2>
                </div>
            </div>

            <v-card class="table-card pa-2" outlined>
                <v-simple-table class="client-table">
                    <thead>
                        <tr>
                            <th>Machine</th>
                            <th>UID</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="machine in assignedMachines" :key="machine.id">
                            <td>{{ machine.machine_name }}</td>
                            <td>{{ machine.machine_uid }}</td>
                            <td>{{ machine.location_name }}</td>
                            <td>{{ machine.location_category }}</td>
                            <td>
                                <div class="machine-qr-box">

                                    <div class="machine-qr-actions">
                                        <v-btn icon small class="qr-download-btn" @click="downloadQr(`machine-qr-${machine.machine_uid}`, `${campaign.campaign_name}-${machine.machine_uid}-qr`)">
                                            <v-icon color="#C6FF00">mdi-download</v-icon>
                                        </v-btn>
                                        <v-btn icon small class="qr-download-btn" @click="(qr_dialog = true), ( machine_uid = machine.machine_uid), (qr_token = machine.qr_token)">
                                            <v-icon color="#C6FF00">mdi-eye</v-icon>
                                        </v-btn>
                                        <a :href="getUrl2(campaign.qr_token, machine.machine_uid)" target="_blank">
                                            <v-icon color="#C6FF00">mdi-link-variant</v-icon>
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!assignedMachines.length">
                            <td colspan="5">No machines assigned</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-card>
        </div>

        <!-- Daily data tables -->
        <v-row class="mt-4">
            <v-col cols="12" md="6">
                <v-card class="table-card pa-3" outlined>
                    <div class="panel-kicker">History</div>
                    <div class="panel-title mb-3">Daily Impressions</div>

                    <v-simple-table class="client-table">
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
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="table-card pa-3" outlined>
                    <div class="panel-kicker">History</div>
                    <div class="panel-title mb-3">Daily Scans</div>

                    <v-simple-table class="client-table">
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
                </v-card>
            </v-col>
        </v-row>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <v-dialog v-model="qr_dialog">
        <v-card color="black"  class="container" max-width="400">
          <v-card-actions>
            <v-spacer/>
            <v-btn icon color="red" @click="qr_dialog = false">
              <v-icon red>mdi-close</v-icon>
            </v-btn>
             <v-spacer/>
          </v-card-actions>
            <div class="machine-qr-box" v-if="campaign && campaign.qr_token">
                <div :id="`machine-qr-${machine_uid}`" class="qr-download-box">
                    <qr-code :text="getUrl2(campaign.qr_token, machine_uid)" size="240" />
                </div>
                {{ campaign.qr_token +""+ machine_uid }}
                <div class="machine-qr-actions">
                    <v-btn icon small class="qr-download-btn" @click="downloadQr(`machine-qr-${machine_uid}`, `${campaign.campaign_name}-${machine_uid}-qr`)">
                        <v-icon color="#C6FF00">mdi-download</v-icon>
                    </v-btn>

                </div>
            </div>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import Vue from "vue";
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";
import html2canvas from "html2canvas";
import VueQRCodeComponent from "vue-qrcode-component";

Vue.component("qr-code", VueQRCodeComponent);

export default {
    data() {
        return {
            qr_token: null,
            machine_uid: null,
            qr_dialog: false,
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
        getUrl2(val, val2) {
            return "https://adengine-production-f766.up.railway.app/scan/" + val + "?m=" + val2;
        },

        getUrl(val) {
            return "https://adengine-production-f766.up.railway.app/scan/" + val + "?m=MACH_003";
        },

        playPreview(refName) {
            const video = this.$refs[refName];
            if (video) {
                video.play().catch(() => {});
            }
        },

        pausePreview(refName) {
            const video = this.$refs[refName];
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        },

        async downloadQr(elementId, fileName = "qr-code") {
            try {
                const target = document.getElementById(elementId);
                if (!target) return;

                const canvas = await html2canvas(target, {
                    backgroundColor: "#ffffff",
                    scale: 10
                });

                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = `${fileName}.png`;
                link.click();
                this.qr_dialog = false;
            } catch (error) {
                console.error("downloadQr error:", error);
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
                    },
                    foreColor: "#c8c8c8"
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
                    foreColor: "#c8c8c8"
                },
                theme: {
                    mode: "dark"
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

        devicePieOptions() {
            return {
                labels: (this.deviceBreakdown || []).map(row => row.device_name),
                legend: {
                    position: "bottom",
                    labels: {
                        colors: "#d0d0d0"
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
    }
};
</script>

<style scoped>
.campaign-detail-page {
    min-height: 100vh;
    padding: 24px;
    background:
        radial-gradient(circle at top left, rgba(198, 255, 0, 0.06), transparent 22%),
        linear-gradient(180deg, #020202 0%, #0b0b0b 100%);
    color: #fff;
}

.detail-topbar {
    margin-bottom: 20px;
}

.back-link {
    display: inline-flex;
    align-items: center;
    color: #d9d9d9;
    text-decoration: none;
    font-weight: 500;
}

.back-link:hover {
    color: #c6ff00;
}

.loading-state {
    color: #b9b9b9;
    padding: 20px 0;
}

.hero-panel {
    border-radius: 26px;
    background:
        radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 28%),
        linear-gradient(135deg, #111111, #080808) !important;
    border: 1px solid rgba(198, 255, 0, 0.12) !important;
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

.status-chip {
    font-weight: 600;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-bottom: 28px;
}

.summary-card {
    border-radius: 20px;
    padding: 18px;
    background: linear-gradient(180deg, #111111, #090909);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.summary-highlight {
    background: linear-gradient(135deg, rgba(198, 255, 0, 0.13), #0d0d0d 55%, #090909);
    border: 1px solid rgba(198, 255, 0, 0.12);
}

.summary-label {
    color: #9d9d9d;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 10px;
    letter-spacing: 0.6px;
}

.summary-value {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
}

.qr-summary-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.qr-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.qr-download-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 14px;
    background: #ffffff;
}

.qr-download-btn {
    margin-top: 8px;
}

.panel-card,
.table-card {
    border-radius: 22px;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-kicker {
    color: #98a18f;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 4px;
}

.panel-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 14px;
}

.info-block {
    margin-top: 10px;
}

.info-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.info-box {
    flex: 1;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    padding: 14px;
}

.info-box span,
.info-link-box span {
    display: block;
    color: #909090;
    font-size: 12px;
    margin-bottom: 6px;
}

.info-box strong {
    color: #fff;
    font-size: 15px;
}

.info-link-box {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    padding: 14px;
}

.info-link-box a {
    color: #c6ff00;
    text-decoration: none;
    word-break: break-all;
}

.player-container {
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 16px;
}

.campaign-video {
    width: 100%;
    max-height: 420px;
    border-radius: 16px;
    background: #000;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.campaign-video:hover {
    transform: scale(1.03);
}

.section-block {
    margin-top: 28px;
}

.section-head {
    margin-bottom: 14px;
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

.machine-qr-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.machine-qr-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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

.error {
    color: red;
    margin-top: 20px;
}

@media (max-width: 1200px) {
    .summary-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 900px) {
    .summary-grid {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 26px;
    }

    .info-row {
        flex-direction: column;
    }
}
</style>
