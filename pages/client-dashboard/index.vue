<template>
  <v-container fluid class="client-page pa-0">
    <v-app-bar flat color="transparent" height="72" class="client-topbar px-4">
      <div class="d-flex align-center">
        <v-menu offset-y v-if="showBurger">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark class="mr-1 topbar-icon" v-bind="attrs" v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list dark class="menu-list">
            <v-list-item
              v-for="(item, index) in items_nav"
              :key="index"
              link
              @click="move(item.to)"
            >
              <v-list-item-icon>
                <v-icon color="#73D843">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <div v-if="overview.client">
          <div class="page-badge" style="margin-top: 18px">
            {{ overview.client.client_name }} Portal
          </div>
        </div>
      </div>

      <v-spacer />

      <div class="d-flex align-center">
        <div class="d-flex">
          <v-menu offset-y max-height="700">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                dark
                class="topbar-icon mr-2"
              >
                <v-icon>mdi-bell-outline</v-icon>
                {{ unreadCount > 0 ? unreadCount : "" }}

                <div class="warp-loader" v-if="unreadCount > 0">
                  <div class="ring"></div>
                  <div class="ring"></div>
                  <div class="ring"></div>
                  <div class="ring"></div>
                  <div class="core-glow"></div>
                </div>
              </v-btn>
            </template>

            <v-alert
              v-if="successMessage"
              type="success"
              dense
              outlined
              class="mb-4 dashboard-alert"
            >
              {{ successMessage }}
            </v-alert>

            <v-alert
              v-if="errorMessage"
              type="error"
              dense
              outlined
              class="mb-4 dashboard-alert"
            >
              {{ errorMessage }}
            </v-alert>

            <v-card class="panel-card pa-4" outlined>
              <div class="panel-head mb-3">
                <div>
                  <div class="panel-kicker"></div>
                  <div class="panel-title">All Notifications</div>
                </div>

                <div class="notification-count" style="margin-right: 18px">
                  {{ unreadCount }} unread
                </div>
              </div>

              <v-card-actions>
                <v-btn
                  small
                  style="color: black"
                  color="#73D843"
                  :loading="markingAll"
                  @click="markAllRead"
                >
                  <v-icon>mdi-check-all</v-icon>
                  Mark all as read
                </v-btn>
              </v-card-actions>

              <div v-if="notificationsLoading" class="loading-block">
                Loading notifications...
              </div>

              <div v-else-if="!notifications.length" class="empty-state">
                No notifications found.
              </div>

              <div v-else class="notifications-list">
                <v-card
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-card mb-3"
                  outlined
                  :class="{ unread: Number(notification.is_read) === 0 }"
                >
                  <div class="notification-row">
                    <div class="notification-icon-wrap">
                      <v-avatar size="42" color="#73D843">
                        <v-icon color="black">{{
                          getNotificationIcon(notification.type)
                        }}</v-icon>
                      </v-avatar>
                    </div>

                    <div class="notification-content">
                      <div class="notification-topline">
                        <div class="notification-title">
                          {{ notification.title }}
                        </div>

                        <v-chip
                          x-small
                          outlined
                          :color="
                            Number(notification.is_read) === 0
                              ? '#73D843'
                              : '#888888'
                          "
                        >
                          {{
                            Number(notification.is_read) === 0
                              ? "Unread"
                              : "Read"
                          }}
                        </v-chip>
                      </div>

                      <div class="notification-message">
                        {{ notification.message }}
                      </div>

                      <div class="notification-meta">
                        <span>{{ formatDate(notification.created_at) }}</span>
                        <span class="notification-type">{{
                          notification.type
                        }}</span>
                      </div>
                    </div>

                    <div class="notification-actions">
                      <v-btn
                        v-if="Number(notification.is_read) === 0"
                        x-small
                        text
                        color="#73D843"
                        :loading="readingId === notification.id"
                        @click="markRead(notification)"
                      >
                        Mark read
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </div>
            </v-card>
          </v-menu>
        </div>

        <v-btn
          icon
          dark
          class="topbar-icon"
          @click="loadDashboard"
          :loading="loading"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>

        <v-btn
          v-show="showBurger"
          icon
          dark
          class="topbar-icon ml-1"
          @click="logout"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <div class="client-layout">
      <aside class="client-sidebar" v-show="!showBurger">
        <div class="sidebar-card">
          <div class="sidebar-brand">
            <div class="sidebar-brand-badge">Charge24 client dashboard</div>
            <div class="sidebar-brand-text"></div>
          </div>

          <div class="sidebar-profile" v-if="overview.client">
            <v-avatar
              size="52"
              :color="overview.client.image_url ? 'transparent' : '#73D843'"
              class="sidebar-avatar client-logo-avatar"
            >
              <template v-if="overview.client.image_url">
                <v-img :src="overview.client.image_url" cover />
              </template>
              <template v-else>
                <span class="avatar-text">
                  {{
                    (overview.client.client_name || "")
                      .substring(0, 2)
                      .toUpperCase()
                  }}
                </span>
              </template>
            </v-avatar>

            <div class="sidebar-client-name">
              {{ overview.client.client_name }}
            </div>
            <div class="sidebar-client-subtitle" style="margin-left: 12px">
              Performance overview
            </div>
          </div>

          <v-list dark class="sidebar-list">
            <v-list-item
              v-for="item in items_nav"
              :key="item.title"
              link
              class="sidebar-item"
              @click="move(item.to)"
            >
              <v-list-item-icon>
                <v-icon color="#73D843">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="sidebar-footer">
            <v-btn
              block
              outlined
              color="#73D843"
              class="logout-btn"
              @click="logout"
            >
              Logout
            </v-btn>
          </div>
        </div>
      </aside>

      <main class="client-main" v-resize="onResize">
        <div v-if="loading" class="loading-state">Loading dashboard...</div>

        <div v-else>
          <v-card class="welcome-banner pa-6 mb-5" outlined>
            <div class="d-flex flex-wrap align-center">
              <div class="welcome-copy">
                <div class="welcome-kicker" style="margin-left: 12px">
                  Campaign Reporting
                </div>
                <div class="welcome-subtitle">
                  See how your campaigns are performing across impressions,
                  scans, and conversions
                </div>
              </div>

              <v-spacer />

              <div
                class="welcome-actions mt-4 mt-md-0"
                style="margin-right: 10px"
              >
                <v-btn
                  color="#73D843"
                  class="black--text font-weight-bold mr-2"
                  to="/clients/campaign"
                >
                  View Campaigns
                </v-btn>
              </div>
            </div>
          </v-card>

          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            outlined
            class="mb-4 dashboard-alert"
          >
            {{ errorMessage }}
          </v-alert>

          <div class="metrics-grid text-center">
            <div class="metric-card metric-primary">
              <div class="metric-label">Impressions Today</div>
              <div class="metric-value" style="color: #73d843">
                {{ formatNumber(overview.metrics.impressions_today) }}
              </div>
            </div>

            <div class="metric-card metric-primary">
              <div class="metric-label">Interactions Today</div>
              <div class="metric-value" style="color: #73d843">
                {{
                  numeral(
                    Math.floor((overview.metrics.impressions_today || 0) * 0.24)
                  ).format("0,0")
                }}
              </div>
            </div>

            <div class="metric-card metric-primary">
              <div class="metric-label">Total Impressions</div>
              <div class="metric-value">
                {{ millify(overview.metrics.total_impressions || 0) }}
              </div>
            </div>

            <div class="metric-card metric-primary">
              <div class="metric-label">Total Interactions</div>
              <div class="metric-value">
                {{
                  millify(
                    Math.floor((overview.metrics.total_impressions || 0) * 0.24)
                  )
                }}
              </div>
            </div>

            <div class="metric-card" v-show="showQrEnabled">
              <div class="metric-label">Total Scans</div>
              <div class="metric-value">
                {{ formatNumber(overview.metrics.total_scans || 0) }}
              </div>
            </div>

            <div class="metric-card" v-show="showQrEnabled">
              <div class="metric-label">Conversion Rate</div>
              <div class="metric-value">
                {{ overview.metrics.overall_conversion_rate || 0 }}%
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-label">Active Campaigns</div>
              <div class="metric-value">
                {{ overview.metrics.active_campaigns || 0 }}
              </div>
            </div>
          </div>

          <div class="section-block">
            <div class="section-head">
              <div>
                <div class="section-kicker"></div>
                <h2 class="section-title">Delivery & engagement</h2>
              </div>
            </div>

            <v-row>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-select
                  v-model="selectedRange"
                  :items="rangeOptions"
                  item-text="text"
                  item-value="value"
                  label="Filter date Range"
                  outlined
                  dense
                  dark
                  @change="onRangeChange"
                />
              </v-col>

              <v-col cols="12" lg="12" md="12">
                <v-card class="panel-card pa-4" outlined color="black">
                  <div class="panel-title-wrap">
                    <div class="panel-kicker"></div>
                    <div class="panel-title">{{ rangeText }} Impressions</div>
                  </div>
                  <apexchart
                    :key="'impressions-' + chartRenderKey"
                    type="line"
                    height="500"
                    :options="impressionsChartOptions"
                    :series="impressionsSeries"
                  />
                </v-card>
              </v-col>

              <v-col cols="12" lg="4" md="6" v-show="showQrEnabled">
                <v-card class="panel-card pa-4" outlined color="black">
                  <div class="panel-title-wrap">
                    <div class="panel-kicker"></div>
                    <div class="panel-title">{{ rangeText }} QR Scans</div>
                  </div>
                  <apexchart
                    :key="'scans-' + chartRenderKey"
                    type="bar"
                    height="320"
                    :options="scansChartOptions"
                    :series="scansSeries"
                  />
                </v-card>
              </v-col>

              <v-col cols="12" lg="4" md="6" v-show="showQrEnabled">
                <v-card class="panel-card pa-4" outlined color="black">
                  <div class="panel-title-wrap">
                    <div class="panel-kicker"></div>
                    <div class="panel-title">Audience Devices</div>
                  </div>
                  <DevicePieChart
                    title="Campaign Device Breakdown"
                    :rows="deviceBreakdown"
                  />
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-btn color="#73D843" class="black--text" @click="exportToCSV">
            Export CSV
          </v-btn>

          <div class="section-block">
            <div class="section-head">
              <div>
                <div class="section-kicker"></div>
                <h2 class="section-title">Your campaigns</h2>
              </div>

              <div class="view-toggle">
                <v-chip outlined color="#73D843" class="toggle-chip">
                  <v-btn icon small @click="grid = false">
                    <v-icon color="#73D843">mdi-view-grid</v-icon>
                  </v-btn>
                  <v-btn icon small @click="grid = true">
                    <v-icon color="#73D843"
                      >mdi-format-list-bulleted-square</v-icon
                    >
                  </v-btn>
                </v-chip>
              </div>
            </div>

            <div
              class="campaign-grid"
              v-show="!grid"
              style="max-height: 900px; overflow-y: auto"
            >
              <v-card
                v-for="campaign in overview.campaigns"
                :key="campaign.id"
                class="campaign-card"
                outlined
              >
                <div class="campaign-card-top">
                  <div class="campaign-avatar-wrap">
                    <v-avatar
                      size="48"
                      :color="campaign.image_url ? 'transparent' : '#73D843'"
                      class="campaign-image-avatar"
                    >
                      <template v-if="campaign.image_url">
                        <v-img :src="campaign.image_url" cover />
                      </template>
                      <template v-else>
                        <span class="campaign-avatar-text">
                          {{
                            (campaign.campaign_name || "")
                              .substring(0, 2)
                              .toUpperCase()
                          }}
                        </span>
                      </template>
                    </v-avatar>
                  </div>

                  <v-spacer />

                  <div class="campaign-progress-wrap" v-show="showQrEnabled">
                    <v-progress-circular
                      max="100"
                      width="5"
                      size="78"
                      color="#73D843"
                      :value="campaign.conversion_rate"
                    >
                      <div class="progress-label">
                        <strong>{{ campaign.conversion_rate }}%</strong>
                        <span>CR</span>
                      </div>
                    </v-progress-circular>
                  </div>
                </div>

                <div class="campaign-card-body">
                  <div class="campaign-name-label">Campaign</div>
                  <div class="campaign-name">{{ campaign.campaign_name }}</div>

                  <div class="campaign-metrics-row">
                    <div class="campaign-mini-metric">
                      <span>Impressions</span>
                      <strong>{{
                        numeral(
                          campaign.delivered_impressions ||
                            campaign.total_impressions
                        ).format("0,0")
                      }}</strong>
                    </div>

                    <div class="campaign-mini-metric">
                      <span>Interactions</span>
                      <strong>{{
                        numeral(
                          (campaign.delivered_impressions ||
                            campaign.total_impressions) * 0.24
                        ).format("0,0")
                      }}</strong>
                    </div>
                  </div>

                  <div class="campaign-dates-row">
                    <div class="campaign-date-box">
                      <span>Start</span>
                      <strong>{{
                        moment(campaign.start_date).format("MMM Do YY")
                      }}</strong>
                    </div>

                    <div class="campaign-date-box">
                      <span>End</span>
                      <strong>{{
                        moment(campaign.end_date).format("MMM Do YY")
                      }}</strong>
                    </div>
                  </div>
                </div>

                <div class="campaign-card-footer">
                  <v-chip
                    outlined
                    small
                    color="#73D843"
                    style="margin-left: 10px"
                  >
                    {{ campaign.status }}
                  </v-chip>

                  <v-spacer />

                  <v-btn
                    :to="`/campaign-view/${campaign.id}`"
                    rounded
                    small
                    color="#73D843"
                    class="black--text font-weight-bold"
                    style="margin-right: 10px"
                  >
                    View campaign
                    <v-icon right color="black">mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </div>

            <div v-show="grid">
              <v-card class="table-card pa-2" outlined>
                <v-simple-table class="client-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Campaign</th>
                      <th>Status</th>
                      <th>Impressions</th>
                      <th>Interactions</th>
                      <th v-show="showQrEnabled">QR Scans</th>
                      <th v-show="showQrEnabled">Conversion</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>View</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="campaign in overview.campaigns"
                      :key="campaign.id"
                    >
                      <td>
                        <v-avatar
                          size="36"
                          :color="
                            campaign.image_url ? 'transparent' : '#73D843'
                          "
                        >
                          <template v-if="campaign.image_url">
                            <v-img :src="campaign.image_url" cover />
                          </template>
                          <template v-else>
                            <span class="table-avatar-text">
                              {{
                                (campaign.campaign_name || "")
                                  .substring(0, 2)
                                  .toUpperCase()
                              }}
                            </span>
                          </template>
                        </v-avatar>
                      </td>
                      <td>{{ campaign.campaign_name }}</td>
                      <td>{{ campaign.status }}</td>
                      <td>{{ formatNumber(campaign.total_impressions) }}</td>
                      <td>
                        {{
                          numeral(campaign.total_impressions * 0.24).format(
                            "0,0"
                          )
                        }}
                      </td>
                      <td v-show="showQrEnabled">
                        {{ formatNumber(campaign.total_scans) }}
                      </td>
                      <td v-show="showQrEnabled">
                        {{ campaign.conversion_rate }}%
                      </td>
                      <td>
                        {{ moment(campaign.start_date).format("MMM Do YY") }}
                      </td>
                      <td>
                        {{ moment(campaign.end_date).format("MMM Do YY") }}
                      </td>
                      <td>
                        <nuxt-link
                          :to="`/campaign-view/${campaign.id}`"
                          class="campaign-link"
                        >
                          View
                          {{
                            (campaign.campaign_name || "").substring(0, 10) +
                            "..."
                          }}
                        </nuxt-link>
                      </td>
                    </tr>

                    <tr v-if="!overview.campaigns.length">
                      <td colspan="11">No campaigns found.</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
            </div>
          </div>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </main>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import numeral from "numeral";
import DevicePieChart from "../../components/charts/DevicePieChart.vue";
import { millify } from "millify";

export default {
  middleware: "auth",
  components: {
    DevicePieChart,
  },

  data() {
    return {
      readingId: null,
      markingAll: false,
      millify,
      grid: false,
      numeral,
      moment,
      loading: true,
      notificationsLoading: false,
      errorMessage: "",
      successMessage: "",
      selectedRange: "",
      chartRenderKey: 0,
      rangeOptions: [
        { text: "General impressions", value: "" },
        { text: "This week", value: "week" },
        { text: "Last 7 Days", value: "7d" },
        { text: "Last 30 Days", value: "30d" },
        { text: "This Month", value: "month" },
      ],
      items_nav: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "client-dashboard",
        },
        {
          title: "Campaign",
          icon: "mdi-bullhorn-outline",
          to: "clients/campaign",
        },
        {
          title: "Locations",
          icon: "mdi-cellphone-marker",
          to: "clients/assigned-machine",
        },
        {
          title: "Notifications",
          icon: "mdi-bell",
          to: "client-dashboard/notification",
        },
      ],
      overview: {
        client: null,
        metrics: {
          total_impressions: 0,
          total_scans: 0,
          overall_conversion_rate: 0,
          active_campaigns: 0,
          total_campaigns: 0,
          impressions_today: 0,
          range: "7d",
        },
        campaigns: [],
      },
      allDailyGraph: {
        impressions: [],
        scans: [],
      },
      dailyGraph: {
        impressions: [],
        scans: [],
      },
      deviceBreakdown: [],
      showBurger: false,
      windowSize: { x: null, y: null },
      notifications: [],
      clientId: null,
      clientName: "",
    };
  },

  computed: {
    unreadCount() {
      return (this.notifications || []).filter((n) => Number(n.is_read) === 0)
        .length;
    },

    showQrEnabled() {
      if (!this.overview.client) return false;
      return (
        String(this.overview.client.qr) === "true" ||
        String(this.overview.client.show_qr) === "true" ||
        Number(this.overview.client.qr) === 1 ||
        Number(this.overview.client.show_qr) === 1
      );
    },

    rangeText() {
      const found = this.rangeOptions.find(
        (item) => item.value === this.selectedRange
      );
      return found ? found.text : "Daily";
    },

    impressionsSeries() {
      return [
        {
          name: "Impressions",
          data: (this.dailyGraph.impressions || []).map((row) =>
            Number(row.impressions || 0)
          ),
        },
      ];
    },

    scansSeries() {
      return [
        {
          name: "Scans",
          data: (this.dailyGraph.scans || []).map((row) =>
            Number(row.scans || 0)
          ),
        },
      ];
    },

    impressionsChartOptions() {
      return {
        chart: {
          toolbar: { show: false },
          foreColor: "#73D843",
        },
        theme: { mode: "dark" },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: (this.dailyGraph.impressions || []).map(
            (row) => row.label || "-"
          ),
          title: { text: "Date" },
          labels: {
            rotate: -45,
            hideOverlappingLabels: true,
          },
        },
        yaxis: {
          title: { text: "Impressions" },
          labels: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: (_value, { dataPointIndex }) => {
              const row = this.dailyGraph.impressions[dataPointIndex];
              return row?.label || "-";
            },
          },
          y: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        noData: { text: "No impression data" },
      };
    },

    scansChartOptions() {
      return {
        chart: {
          toolbar: { show: false },
          foreColor: "#bdbdbd",
        },
        theme: { mode: "dark" },
        dataLabels: { enabled: false },
        xaxis: {
          categories: (this.dailyGraph.scans || []).map(
            (row) => row.label || "-"
          ),
          title: { text: "Date" },
          labels: {
            rotate: -45,
            hideOverlappingLabels: true,
          },
        },
        yaxis: {
          title: { text: "Scans" },
          labels: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: (_value, { dataPointIndex }) => {
              const row = this.dailyGraph.scans[dataPointIndex];
              return row?.label || "-";
            },
          },
          y: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        noData: { text: "No scan data" },
      };
    },
  },

  async mounted() {
    this.onResize();
    await this.loadDashboard();
    await this.resolveClient();

    if (this.clientId) {
      await this.fetchNotifications();
    }
  },

  methods: {
    async markRead(notification) {
      try {
        this.readingId = notification.id;
        this.successMessage = "";
        this.errorMessage = "";

        await api.put(`/api/notifications/${notification.id}/read`);
        notification.is_read = 1;
        this.successMessage = "Notification marked as read";
      } catch (error) {
        console.error("markRead error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Failed to mark notification as read";
      } finally {
        this.readingId = null;
      }
    },

    async markAllRead() {
      try {
        this.markingAll = true;
        this.successMessage = "";
        this.errorMessage = "";

        await api.put("/api/notifications/read-all", {
          user_type: "client",
          user_id: this.clientId,
        });

        this.notifications = this.notifications.map((item) => ({
          ...item,
          is_read: 1,
        }));

        this.successMessage = "All notifications marked as read";
      } catch (error) {
        console.error("markAllRead error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Failed to mark all notifications as read";
      } finally {
        this.markingAll = false;
      }
    },

    formatDate(value) {
      return value ? moment(value).format("MMM Do YYYY, h:mm A") : "-";
    },

    getNotificationIcon(type) {
      if (type === "campaign_created") return "mdi-bullhorn";
      if (type === "campaign_assigned") return "mdi-monitor-dashboard";
      if (type === "campaign_status_changed") return "mdi-refresh-circle";
      return "mdi-bell-outline";
    },

    async resolveClient() {
      try {
        const currentUser = this.$fire.auth.currentUser;
        if (!currentUser) {
          this.$router.push("/auth/client.login");
          return;
        }

        const { data } = await api.post("/api/client-dashboard/overview", {
          uid: currentUser.uid,
          range: this.selectedRange,
        });

        if (data && data.client) {
          this.clientId = data.client.id;
          this.clientName = data.client.client_name || "Client";
        }
      } catch (error) {
        console.error("resolveClient error:", error);
      }
    },

    async fetchNotifications() {
      try {
        if (!this.clientId) {
          this.errorMessage = "Client not resolved";
          return;
        }

        this.notificationsLoading = true;

        const { data } = await api.get("/api/notifications/get", {
          params: {
            user_type: "client",
            user_id: this.clientId,
          },
        });

        this.notifications = data || [];
      } catch (error) {
        console.error("fetchNotifications error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load notifications";
      } finally {
        this.notificationsLoading = false;
      }
    },

    exportToCSV() {
      const rows = this.overview.campaigns || [];
      if (!rows.length) return;

      const headers = [
        "Campaign Name",
        "Status",
        "Total Impressions",
        "Total Interactions",
        "Total Scans",
        "Qr Conversion Rate",
        "Start Date",
        "End Date",
      ];

      const csvRows = [
        headers.join(","),
        ...rows.map((row) =>
          [
            `"${row.campaign_name || ""}"`,
            `"${row.status || ""}"`,
            row.total_impressions || 0,
            Math.floor((row.total_impressions || 0) * 0.24) || 0,
            row.total_scans || 0,
            row.conversion_rate || 0,
            `"${moment(row.start_date).format("MMM Do YY") || ""}"`,
            `"${moment(row.end_date).format("MMM Do YY") || ""}"`,
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `client-campaign-report-${this.selectedRange}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    logout() {
      this.$fire.auth.signOut();
      this.$router.push("/auth/client.login");
    },

    move(val) {
      this.$router.push(`/${val}`);
    },

    onResize() {
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };
      this.showBurger = this.windowSize.x < 950;
      return this.windowSize;
    },

    normalizeLabel(rawLabel) {
      if (!rawLabel) return null;

      const formats = [
        "YYYY-MM-DD",
        "YYYY-M-D",
        "MMM DD",
        "MMM D",
        "MMM Do YY",
        "MMM Do YYYY",
        "YYYY-MM",
        "YYYY-[W]WW",
      ];

      const parsed = moment(rawLabel, formats, true);
      if (parsed.isValid()) {
        return parsed.format("YYYY-MM-DD");
      }

      const fallback = moment(rawLabel);
      return fallback.isValid() ? fallback.format("YYYY-MM-DD") : null;
    },

    formatLabelForChart(rawLabel) {
      if (!rawLabel) return "-";

      const parsed = moment(
        rawLabel,
        ["YYYY-MM-DD", "YYYY-M-D", "YYYY-MM", "YYYY-[W]WW"],
        true
      );

      if (parsed.isValid()) {
        return parsed.format("MMM DD");
      }

      return rawLabel;
    },

    groupRowsByLabel(rows = [], valueKey = "impressions") {
      const grouped = {};

      rows.forEach((row) => {
        const rawLabel = row.label;
        if (!rawLabel) return;

        const normalizedKey = this.normalizeLabel(rawLabel) || rawLabel;

        if (!grouped[normalizedKey]) {
          grouped[normalizedKey] = {
            sort_key: normalizedKey,
            label: this.formatLabelForChart(normalizedKey),
            [valueKey]: 0,
          };
        }

        grouped[normalizedKey][valueKey] += Number(row[valueKey] || 0);
      });

      return Object.values(grouped).sort((a, b) => {
        if (a.sort_key < b.sort_key) return -1;
        if (a.sort_key > b.sort_key) return 1;
        return 0;
      });
    },

    applyGraphFilter() {
      const today = moment().startOf("day");
      let startDate = null;

      if (this.selectedRange === "7d") {
        startDate = today.clone().subtract(6, "days");
      } else if (this.selectedRange === "30d") {
        startDate = today.clone().subtract(29, "days");
      } else if (this.selectedRange === "week") {
        startDate = today.clone().startOf("isoWeek");
      } else if (this.selectedRange === "month") {
        startDate = today.clone().startOf("month");
      }

      const filterRows = (rows = [], valueKey = "impressions") => {
        const filtered = rows.filter((row) => {
          const normalized = this.normalizeLabel(row.label);
          if (!normalized) return false;
          const rowMoment = moment(normalized);
          return !startDate || rowMoment.isSameOrAfter(startDate, "day");
        });

        return this.groupRowsByLabel(filtered, valueKey);
      };

      this.dailyGraph = {
        impressions: filterRows(this.allDailyGraph.impressions, "impressions"),
        scans: filterRows(this.allDailyGraph.scans, "scans"),
      };
    },

    async loadSummaryData() {
      this.selectedRange = this.selectedRange || "";
      try {
        const currentUser = this.$fire.auth.currentUser;
        if (!currentUser) return;

        const uid = currentUser.uid;

        const [overviewRes, deviceRes] = await Promise.all([
          api.post("/api/client-dashboard/overview", {
            uid,
            range: this.selectedRange,
          }),
          api.post("/api/client-dashboard/device-breakdown", {
            uid,
            range: this.selectedRange,
          }),
        ]);

        this.overview = overviewRes.data || this.overview;
        this.deviceBreakdown = deviceRes.data || [];
      } catch (error) {
        console.error("loadSummaryData error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to update dashboard";
      }
    },

    onRangeChange() {
      this.applyGraphFilter();
      this.chartRenderKey += 1;
      this.loadSummaryData();
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

        const [overviewRes, dailyGraphRes, deviceRes] = await Promise.all([
          api.post("/api/client-dashboard/overview", {
            uid,
            range: this.selectedRange,
          }),
          api.post("/api/client-dashboard/daily-graph", {
            uid,
          }),
          api.post("/api/client-dashboard/device-breakdown", {
            uid,
            range: this.selectedRange,
          }),
        ]);

        this.overview = overviewRes.data || {
          client: null,
          metrics: {
            total_impressions: 0,
            total_scans: 0,
            overall_conversion_rate: 0,
            active_campaigns: 0,
            total_campaigns: 0,
            impressions_today: 0,
            range: this.selectedRange,
          },
          campaigns: [],
        };

        this.allDailyGraph = dailyGraphRes.data || {
          impressions: [],
          scans: [],
        };

        this.applyGraphFilter();
        this.chartRenderKey += 1;
        this.deviceBreakdown = deviceRes.data || [];
      } catch (error) {
        console.error("loadDashboard error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load dashboard";
      } finally {
        this.loading = false;
      }
    },

    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
  },
};
</script>

<style scoped>
.warp-loader {
  border-radius: 70px;
  position: relative;
  width: 14px;
  height: 14px;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(0, 255, 255, 0.15) 30%,
    transparent 70%
  );
  animation: pulse 2.2s ease-out infinite;
  opacity: 0;
  box-shadow: 0 0 12px #00d1ff66, 0 0 24px #00d1ff33;
  border: 2px solid rgba(0, 255, 255, 0.2);
}

.ring:nth-child(1) {
  animation-delay: 0s;
}
.ring:nth-child(2) {
  animation-delay: 0.4s;
}
.ring:nth-child(3) {
  animation-delay: 0.8s;
}
.ring:nth-child(4) {
  animation-delay: 1.2s;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 1;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.15;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle at center, #00e5ff, #0099cc);
  box-shadow: 0 0 25px #00e5ff, 0 0 60px #00e5ff88, 0 0 100px #00e5ff33;
  animation: corePulse 1.6s ease-in-out infinite;
}

@keyframes corePulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.client-page {
  min-height: 100vh;
  background: radial-gradient(
      circle at top left,
      rgba(198, 255, 0, 0.06),
      transparent 22%
    ),
    linear-gradient(180deg, #020202 0%, #0b0b0b 100%);
  color: #fff;
}

.client-topbar {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.topbar-icon {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(198, 255, 0, 0.08);
}

.client-layout {
  display: flex;
  min-height: calc(100vh - 72px);
}

.client-sidebar {
  width: 290px;
  padding: 16px;
}

.sidebar-card {
  height: 100%;
  border-radius: 24px;
  background: linear-gradient(180deg, #101010, #070707);
  border: 1px solid rgba(198, 255, 0, 0.12);
  padding: 18px;
}

.sidebar-brand {
  margin-bottom: 24px;
}

.sidebar-brand-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.22);
  color: #73d843;
  font-size: 12px;
  margin-bottom: 10px;
}

.sidebar-brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.sidebar-profile {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 20px;
  text-align: center;
}

.sidebar-avatar {
  margin-bottom: 12px;
}

.client-logo-avatar {
  overflow: hidden;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.avatar-text {
  color: #000;
  font-weight: 800;
}

.sidebar-client-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.sidebar-client-subtitle {
  color: #a8a8a8;
  font-size: 13px;
  margin-top: 4px;
}

.sidebar-list {
  background: transparent !important;
}

.sidebar-item {
  border-radius: 12px;
  margin-bottom: 6px;
}

.sidebar-item:hover {
  background: rgba(198, 255, 0, 0.06);
}

.sidebar-footer {
  margin-top: 24px;
}

.logout-btn {
  border-color: rgba(198, 255, 0, 0.35) !important;
  color: #73d843 !important;
}

.client-main {
  flex: 1;
  padding: 20px;
}

.page-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.22);
  color: #73d843;
  font-size: 12px;
  margin-bottom: 8px;
}

.loading-state {
  padding: 30px 0;
  color: #b8b8b8;
}

.welcome-banner {
  border-radius: 26px;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 28%
    ),
    linear-gradient(135deg, #111111, #080808) !important;
  border: 1px solid rgba(198, 255, 0, 0.12) !important;
}

.welcome-copy {
  max-width: 760px;
}

.welcome-kicker {
  color: #73d843;
  font-size: 25px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.welcome-subtitle {
  color: #bcbcbc;
  line-height: 1.7;
  margin-top: 12px;
}

.dashboard-alert {
  border-radius: 14px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.metric-card {
  border-radius: 20px;
  padding: 20px;
  background: linear-gradient(180deg, #111111, #090909);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.metric-primary {
  background: linear-gradient(
    135deg,
    rgba(198, 255, 0, 0.13),
    #0d0d0d 58%,
    #090909
  );
  border: 1px solid rgba(198, 255, 0, 0.12);
}

.metric-label {
  color: #a5a5a5;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
}

.section-block {
  margin-top: 22px;
  margin-bottom: 28px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
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

.panel-card,
.table-card {
  border-radius: 22px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-title-wrap {
  margin-bottom: 12px;
}

.panel-kicker {
  color: #9aa590;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.view-toggle {
  display: flex;
  align-items: center;
}

.toggle-chip {
  background: rgba(255, 255, 255, 0.02);
}

.campaign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
}

.campaign-card {
  border-radius: 22px !important;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.08) !important;
  padding: 18px;
  color: #fff;
  overflow: hidden;
}

.campaign-card-top {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.campaign-image-avatar {
  overflow: hidden;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.campaign-avatar-text {
  color: #000;
  font-weight: 800;
}

.table-avatar-text {
  color: #000;
  font-size: 11px;
  font-weight: 800;
}

.progress-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.progress-label strong {
  font-size: 14px;
  color: #fff;
}

.progress-label span {
  font-size: 11px;
  color: #a9a9a9;
}

.campaign-card-body {
  margin-bottom: 18px;
}

.campaign-name-label {
  color: #8b8b8b;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.campaign-name {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.campaign-metrics-row,
.campaign-dates-row {
  display: flex;
  gap: 14px;
  justify-content: space-between;
  margin-bottom: 14px;
}

.campaign-mini-metric,
.campaign-date-box {
  flex: 1;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}

.campaign-mini-metric span,
.campaign-date-box span {
  display: block;
  color: #8f8f8f;
  font-size: 12px;
  margin-bottom: 6px;
}

.campaign-mini-metric strong,
.campaign-date-box strong {
  color: #fff;
  font-size: 15px;
}

.campaign-card-footer {
  display: flex;
  align-items: center;
}

.client-table ::v-deep th {
  color: #73d843 !important;
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

.campaign-link {
  text-decoration: none;
  color: #73d843;
}

.menu-list {
  background: #111111 !important;
  border: 1px solid rgba(198, 255, 0, 0.1);
  border-radius: 14px;
}

.error {
  color: red;
  margin-top: 20px;
}

.notification-count {
  color: #73d843;
  font-size: 13px;
}

.loading-block,
.empty-state {
  color: #bdbdbd;
  padding: 20px 0;
}

.notification-card {
  border-radius: 18px !important;
  background: linear-gradient(180deg, #111111, #0b0b0b) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.notification-card.unread {
  border: 1px solid rgba(198, 255, 0, 0.22) !important;
}

.notification-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
}

.notification-content {
  flex: 1;
}

.notification-topline {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.notification-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.notification-message {
  color: #cfcfcf;
  line-height: 1.6;
  margin-bottom: 10px;
}

.notification-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: #8f8f8f;
  font-size: 12px;
}

.notification-type {
  color: #73d843;
}

@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 950px) {
  .client-layout {
    display: block;
  }

  .client-main {
    padding: 16px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .notification-row {
    flex-direction: column;
  }
}
</style>