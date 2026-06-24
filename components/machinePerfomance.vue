<template>
  <div class="machine-performance">
    <v-simple-table class="performance-table" dark>
      <thead>
        <tr>
          <th>Machine</th>
          <th>Location</th>
          <th>Category</th>
          <th class="text-right">Impressions</th>
          <th class="text-right">Interactions</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.machine_id">
          <td>
            <div class="d-flex align-center">
              <v-avatar size="36" color="#73D843" class="mr-3">
                <span class="avatar-text">
                  {{ (row.machine_name || "").substring(0, 2).toUpperCase() }}
                </span>
              </v-avatar>
              <div>
                <div class="machine-name">{{ row.machine_name }}</div>
                <div class="machine-uid">{{ row.machine_uid }}</div>
              </div>
            </div>
          </td>
          <td>{{ row.location_name }}</td>
          <td>
            <v-chip x-small outlined color="#73D843">
              {{ row.location_category }}
            </v-chip>
          </td>
          <td class="text-right metric-value">
            {{ formatNumber(row.total_impressions) }}
          </td>
          <td class="text-right metric-value">
            {{ formatNumber(
              Math.floor((row.total_impressions) * 0.24)
            ) }}
          </td>
          <td>
            <v-chip
              x-small
              :color="row.status === 'online' ? '#73D843' : '#888888'"
              text-color="black"
            >
              {{ row.status }}
            </v-chip>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="5" class="text-center empty-state">
            No machines found for the selected period.
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
  },
};
</script>

<style scoped>
.machine-performance { width: 100%; }
.performance-table ::v-deep th {
  color: #73D843 !important;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(198, 255, 0, 0.12) !important;
  background: transparent !important;
}
.performance-table ::v-deep td {
  color: #d4d4d4 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 16px !important;
}
.performance-table ::v-deep tr:hover { background: rgba(198, 255, 0, 0.04) !important; }
.avatar-text { color: #000; font-size: 12px; font-weight: 800; }
.machine-name { color: #fff; font-weight: 600; font-size: 14px; }
.machine-uid { color: #888; font-size: 11px; }
.metric-value { color: #fff; font-weight: 700; font-size: 14px; }
.empty-state { color: #888; padding: 40px !important; }
</style>