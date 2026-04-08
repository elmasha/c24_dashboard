<template>
  <div>
    <v-simple-table class="machine-table">
      <thead>
        <tr>
          <th>Machine</th>
          <th>UID</th>
          <th>Location</th>
          <th>Category</th>
          <th>Campaign</th>
          <th>Media</th>
          <th>Landing URL</th>
          <th>Impressions</th>
          <th>Interactions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id || row.machine_id">
          <td>{{ row.machine_name || "-" }}</td>
          <td>{{ row.machine_uid || "-" }}</td>
          <td>{{ row.location_name || "-" }}</td>
          <td>{{ row.location_category || "-" }}</td>
          <td>{{ row.campaign_name || "-" }}</td>

          <td>
            <div class="machine-media-preview">
              <template v-if="row.image_url">
                <v-img
                  :src="row.image_url"
                  width="90"
                  height="60"
                  class="machine-media-thumb"
                  cover
                />
              </template>

              <template v-else-if="row.media_url && isVideo(row.media_url)">
                <video class="machine-video-thumb" muted playsinline controls>
                  <source :src="row.media_url" />
                  Your browser does not support the video tag.
                </video>
              </template>

              <template v-else-if="row.media_url">
                <v-img
                  :src="row.media_url"
                  width="90"
                  height="60"
                  class="machine-media-thumb"
                  cover
                />
              </template>

              <template v-else>
                <div class="machine-media-empty">No media</div>
              </template>
            </div>
          </td>

          <td>
            <a
              v-if="row.landing_url"
              :href="row.landing_url"
              target="_blank"
              class="landing-link"
            >
              Open link
            </a>
            <span v-else>-</span>
          </td>

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
  color: #c6ff00 !important;
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
  color: #c6ff00;
  text-decoration: none;
  font-size: 13px;
}

.landing-link:hover {
  text-decoration: underline;
}
</style>