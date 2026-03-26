<template>
<div class="chart-card">
    <v-card light elevation="0" color="black">
        <h3>{{ title }}</h3>

    <apexchart type="line" height="350" :options="chartOptions" :series="series" />
    </v-card>
    
</div>
</template>

<script>
import moment from 'moment';
export default {
    name: "DailyImpressionsChart",
    data() {
        return {
          moment,
        }
    },
    props: {
        title: {
            type: String,
            default: "Daily Impressions"
        },
        rows: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        series() {
            return [{
                name: "Impressions",
                data: this.rows.map((row) => Number(row.impressions))
            }];
        },

        chartOptions() {
            return {
                chart: {
                    id: "daily-impressions-chart",
                    toolbar: {
                        show: false
                    }
                },
                xaxis: {
                    categories: this.rows.map((row) => this.moment(row.date).format("MMM Do YY")),
                    title: {
                        text: "Date"
                    }
                },
                yaxis: {
                    title: {
                        text: "Impressions"
                    }
                },
                stroke: {
                    curve: "smooth",
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    y: {
                        formatter: (value) => Number(value).toLocaleString()
                    }
                },
                noData: {
                    text: "No data available"
                }
            };
        }
    }
};
</script>

<style scoped>
.chart-card {
    background: #000;
    border-radius: 10px;
    padding: 16px;
    color: #fff;
}
</style>
