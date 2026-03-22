<template>
  <div class="chart-card">
    <h3>{{ title }}</h3>

    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
export default {
  name: "DailyScansChart",

  props: {
    title: {
      type: String,
      default: "Daily Scans"
    },
    rows: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    series() {
      return [
        {
          name: "Scans",
          data: this.rows.map((row) => Number(row.scans || 0))
        }
      ];
    },

    chartOptions() {
      return {
        chart: {
          id: "daily-scans-chart",
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: this.rows.map((row) => row.date),
          title: {
            text: "Date"
          }
        },
        yaxis: {
          title: {
            text: "Scans"
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: (value) => Number(value || 0).toLocaleString()
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
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
}
</style>