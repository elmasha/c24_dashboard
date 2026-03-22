<template>
  <v-card outlined class="pa-4" color="black">
    <h3 class="mb-4">{{ title }}</h3>

    <apexchart
      type="pie"
      height="320"
      :options="chartOptions"
      :series="series"
    />
  </v-card>
</template>

<script>
export default {
  name: "DevicePieChart",

  props: {
    title: {
      type: String,
      default: "Device Breakdown"
    },
    rows: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    series() {
      return (this.rows || []).map(row => Number(row.scans || 0));
    },

    chartOptions() {
      return {
        labels: (this.rows || []).map(row => row.device_name),
        legend: {
          position: "bottom"
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val.toFixed(1)}%`
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