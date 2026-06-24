<template>
  <div class="location-performance">
    <v-simple-table class="performance-table" dark>
      <thead>
        <tr>
          <th>Location</th>
          <th>Category</th>
          <th class="text-right">Machines</th>
          <th class="text-right">Impressions</th>
           <th class="text-right">Interactions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.location_name">
          <td>
            <div class="d-flex align-center">
              <v-avatar size="36" color="#1a1a1a" class="mr-3" style="border: 1px solid rgba(198, 255, 0, 0.2);">
                <v-icon color="#73D843" small>mdi-map-marker</v-icon>
              </v-avatar>
              <div class="location-name">{{ row.location_name }}</div>
            </div>
          </td>
          <td>
            <v-chip x-small outlined color="#73D843">
              {{ row.location_category }}
            </v-chip>
          </td>
          <td class="text-right metric-value">
            {{ formatNumber(row.machine_count) }}
          </td>
          <td class="text-right metric-value">
            {{ formatNumber(row.total_impressions) }}
          </td>
          <td class="text-right metric-value">
            {{ formatNumber(
              Math.floor((row.total_impressions) * 0.24)
            ) }}
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="4" class="text-center empty-state">
            No locations found for the selected period.
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import numerical from 'numeral';
export default {
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      numerical,
    };
  },
  methods: {
    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
  },
};
</script>

<style scoped>
.location-performance { width: 100%; }
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
.location-name { color: #fff; font-weight: 600; font-size: 14px; }
.metric-value { color: #fff; font-weight: 700; font-size: 14px; }
.empty-state { color: #888; padding: 40px !important; }
</style>