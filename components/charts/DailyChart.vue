<template>
  <div class="chart-card">
    <h3>{{ title }}</h3>

    <apexchart
      :type="type"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
export default {
  name: "DailyChart",

  props: {
    title: {
      type: String,
      default: "Daily Chart"
    },
    type: {
      type: String,
      default: "line"
    },
    rows: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: "impressions"
    },
    label: {
      type: String,
      default: "Value"
    }
  },

  computed: {
    series() {
      return [
        {
          name: this.label,
          data: this.rows.map((row) => Number(row[this.valueKey] || 0))
        }
      ];
    },

    chartOptions() {
      return {
        chart: {
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
            text: this.label
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