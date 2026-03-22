<template>
<v-card color="black" dark elevation="0" width="100%">
    <div style="margin-top: 20px;"></div>
    <div class="ma-2 pa-0">
        <div class="">

            <v-row>
                <v-col cols="12" md="12"></v-col>
                <v-col cols="12" md="12">
                    <div class="">
                        <nuxt-link style="text-decoration: none; color: white;margin-left: 10px;" icon to="/client-dashboard">
                            <v-icon large>mdi-arrow-left</v-icon>
                        </nuxt-link>
                    </div>
                </v-col>
                <v-col cols="12" md="12">
                    <div class="">

                        <div class="d-flex" style="margin: 14px;">
                            <h2>Assigned & Top Performing Machines</h2>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12" md="12">

                    <MachinePerfomance title="" :rows="machinePerformance" />
                </v-col>
            </v-row>

        </div>
    </div>
</v-card>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";
import MachinePerfomance from "../../components/machinePerfomance.vue";

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
            machinePerformance: [],
        };
    },
    components: {
        MachinePerfomance
    },

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
                const [machinePerfRes] = await Promise.all([

                    api.post("/api/analytics/machine-performance", {
                        uid
                    })
                ]);
                this.machinePerformance = machinePerfRes.data || [];

                console.log("Overview", this.machinePerformance)
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
