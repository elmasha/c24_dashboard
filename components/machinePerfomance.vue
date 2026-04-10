<template>
  <div>
    <v-simple-table class="machine-table">
      <thead>
        <tr>
          <th>Location</th>
          <th>Machine</th>
          <th>UID</th>

          <th>Category</th>
          <th>Impressions</th>
          <th>Interactions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id || row.machine_id">
          <td>{{ row.location_name || "-" }}</td>
          <td>{{ row.machine_name || "-" }}</td>
          <td>{{ row.machine_uid || "-" }}</td>
          <td>{{ row.location_category || "-" }}</td>

          <td>
            {{ formatNumber(row.total_impressions || row.impressions || 0) }}
          </td>
          <td>
            {{
              formatNumber(
                (row.total_impressions || row.impressions || 0) * 0.24
              )
            }}
          </td>
        </tr>

        <tr v-if="!rows || !rows.length">
          <td colspan="9">No machine performance found.</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    isVideo(url) {
      if (!url) return false;
      return /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);
    },

    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
  },
};
</script>

<style scoped>
.machine-table ::v-deep th {
  color: #73d843 !important;
  background: transparent !important;
  font-weight: 700;
  border-bottom: 1px solid rgba(198, 255, 0, 0.08) !important;
}

.machine-table ::v-deep td {
  color: #d4d4d4 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  vertical-align: middle;
}

.machine-table ::v-deep tr:hover {
  background: rgba(198, 255, 0, 0.03);
}

.machine-media-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.machine-media-thumb {
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(198, 255, 0, 0.12);
}

.machine-video-thumb {
  width: 90px;
  height: 60px;
  border-radius: 10px;
  background: #000;
  object-fit: cover;
  border: 1px solid rgba(198, 255, 0, 0.12);
}

.machine-media-empty {
  font-size: 12px;
  color: #9b9b9b;
}

.landing-link {
  color: #73d843;
  text-decoration: none;
  font-size: 13px;
}

.landing-link:hover {
  text-decoration: underline;
}
</style>