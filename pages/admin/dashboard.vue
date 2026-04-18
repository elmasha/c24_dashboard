<template>
  <v-container fluid class="admin-page pa-0">
    <v-app-bar flat color="transparent" height="72" class="admin-topbar px-4">
      <div class="d-flex align-center">
        <v-menu offset-y v-if="showBurger">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark class="mr-3 topbar-icon" v-bind="attrs" v-on="on">
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

        <div>
          <div class="page-badge" style="font-size: 0.6rem; margin-top: 18px">
            Charge24 Portal
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

                <div class="notification-count">{{ unreadCount }} unread</div>
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

    <div class="admin-layout">
      <aside class="admin-sidebar" v-show="!showBurger">
        <div class="sidebar-card">
          <div class="sidebar-brand">
            <div class="sidebar-brand-badge">Charge24</div>
            <div class="sidebar-brand-text">Admin Control</div>
          </div>

          <div class="sidebar-profile">
            <v-avatar size="70" color="#000" class="sidebar-avatar">
              <v-img :src="logo" contain height="70" />
            </v-avatar>

            <div class="sidebar-user-name" style="margin-left: 20px">
              Operations Team
            </div>
            <div class="sidebar-user-subtitle">
              Monitor campaigns, machines and client activity
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

      <main class="admin-main" v-resize="onResize">
        <v-row class="mb-5">
          <v-col cols="12">
            <v-card class="hero-panel pa-6" outlined>
              <div class="d-flex flex-wrap align-center">
                <div class="hero-copy">
                  <div class="hero-kicker" style="margin-left: 20px">
                    Operations Overview
                  </div>
                  <div class="hero-heading">
                    Monitor delivery, traffic, client growth, and machine
                    activity from one place
                  </div>
                  <div class="hero-subtext">
                    Get a live operational snapshot of impressions, scans,
                    clients, devices, and machine performance across the
                    network.
                  </div>
                </div>

                <v-spacer />

                <div
                  class="hero-actions mt-4 mt-md-0"
                  style="margin-right: 20px"
                >
                  <nuxt-link to="/campaigns/all" class="text-decoration-none">
                    <v-btn class="mr-2 hero-btn-primary" color="#73D843" large>
                      <span class="black--text font-weight-bold"
                        >Campaigns</span
                      >
                    </v-btn>
                  </nuxt-link>

                  <nuxt-link to="/clients" class="text-decoration-none">
                    <v-btn outlined large class="hero-btn-outline">
                      Clients
                    </v-btn>
                  </nuxt-link>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          v-if="errorMessage"
          type="error"
          dense
          outlined
          class="mb-4 dashboard-alert"
        >
          {{ errorMessage }}
        </v-alert>

        <v-row class="text-center">
          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card metric-highlight" outlined>
              <div class="metric-label">Total Impressions</div>
              <div class="metric-number">
                {{ millify(metrics.total_impressions) }}
              </div>
              <div>
                <p style="color: gray; font-size: 0.8rem">
                  {{ numeral(metrics.total_impressions).format("0,0") }}
                </p>
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card metric-highlight" outlined>
              <div class="metric-label">Total Interactions</div>
              <div class="metric-number">
                {{ millify(metrics.total_impressions * 0.27) }}
              </div>
              <div>
                <p style="color: gray; font-size: 0.8rem">
                  {{ numeral(metrics.total_impressions * 0.27).format("0,0") }}
                </p>
              </div>
            </v-card>
          </v-col>

          <!-- <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card metric-highlight" outlined>
              <div class="metric-label">{{ rangeText }} Impressions</div>
              <div class="metric-number">
                {{ millify(metrics.impressions_month) }}
              </div>
              <div>
                <p style="color: gray; font-size: 0.8rem">
                  {{ numeral(metrics.impressions_month).format("0,0") }}
                </p>
              </div>
            </v-card>
          </v-col> -->

          <!-- <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card metric-highlight" outlined>
              <div class="metric-label">{{ rangeText }} Interactions</div>
              <div class="metric-number">
                {{ millify(metrics.impressions_month * 0.27) }}
              </div>
              <div>
                <p style="color: gray; font-size: 0.8rem">
                  {{ numeral(metrics.impressions_month * 0.27).format("0,0") }}
                </p>
              </div>
            </v-card>
          </v-col> -->

          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card" outlined>
              <div class="metric-label">Daily Impressions</div>
              <div class="metric-number">
                {{ numeral(metrics.impressions_today).format("0,0") }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card" outlined>
              <div class="metric-label">Daily Interactions</div>
              <div class="metric-number">
                {{ numeral(metrics.impressions_today * 0.2).format("0,0") }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card" outlined>
              <div class="metric-label">Scans Today</div>
              <div class="metric-number">
                {{ formatNumber(metrics.scans_today) }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card" outlined>
              <div class="metric-label">{{ rangeText }} Scans</div>
              <div class="metric-number">
                {{ formatNumber(metrics.scans_month) }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="2" v-show="false">
            <v-card class="metric-card" outlined>
              <div class="metric-label">Conversion Rate</div>
              <div class="metric-number">
                {{ metrics.conversion_rate || 0 }}%
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="2">
            <v-card class="metric-card" outlined>
              <div class="metric-label">Total Clients</div>
              <div class="metric-number">{{ formatNumber(totalClients) }}</div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="3">
            <v-card class="metric-card small-metric-card" outlined>
              <div class="metric-label">Active Clients</div>
              <div class="metric-number">{{ formatNumber(activeClients) }}</div>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3">
            <v-select
              v-model="selectedRange"
              :items="rangeOptions"
              item-text="text"
              item-value="value"
              label="Analytics Range"
              outlined
              dense
              dark
              @change="onRangeChange"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="8" md="8">
            <v-card class="panel-card pa-4 mb-4" outlined light>
              <div class="panel-head">
                <div>
                  <div class="panel-title" style="margin-bottom: 18px">
                    {{ rangeText }} Impressions
                  </div>
                </div>
              </div>

              <apexchart
                :key="'admin-impressions-' + chartRenderKey"
                type="line"
                height="320"
                :options="impressionsChartOptions"
                :series="impressionsSeries"
              />
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" md="5">
            <v-card class="panel-card pa-4 mb-4" outlined>
              <div class="panel-head">
                <div>
                  <div class="panel-title">Device Breakdown</div>
                </div>
              </div>

              <apexchart
                type="pie"
                height="320"
                :options="devicePieOptions"
                :series="devicePieSeries"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="8" md="8">
            <v-card class="panel-card pa-4" outlined>
              <div class="panel-head">
                <div>
                  <div class="panel-kicker"></div>
                  <div class="panel-title">{{ rangeText }} Scans</div>
                </div>
              </div>

              <apexchart
                :key="'admin-scans-' + chartRenderKey"
                type="bar"
                height="320"
                :options="scansChartOptions"
                :series="scansSeries"
              />
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" md="4">
            <v-card class="panel-card pa-4" outlined>
              <div class="panel-head">
                <div>
                  <div class="panel-kicker"></div>
                  <div class="panel-title">Top Machines</div>
                </div>
              </div>

              <v-simple-table dense class="table-dark">
                <thead>
                  <tr>
                    <th>Machine</th>
                    <th>UID</th>
                    <th class="text-right">Scans</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="machine in topMachines" :key="machine.machine_uid">
                    <td>{{ machine.machine_name }}</td>
                    <td>{{ machine.machine_uid }}</td>
                    <td class="text-right">
                      {{ formatNumber(machine.scans) }}
                    </td>
                  </tr>
                  <tr v-if="!topMachines.length">
                    <td colspan="3">No machine data</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="panel-card pa-4" outlined>
              <div class="panel-head mb-3">
                <div>
                  <div class="panel-kicker"></div>
                  <div class="panel-title">Recent Clients</div>
                </div>

                <nuxt-link to="/clients" class="text-decoration-none">
                  <v-btn text color="#73D843">View All</v-btn>
                </nuxt-link>
              </div>

              <v-simple-table dense class="table-dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in clients.slice(0, 5)" :key="client.id">
                    <td>{{ client.id }}</td>
                    <td>{{ client.client_name }}</td>
                    <td>{{ client.email || "-" }}</td>
                    <td>
                      <span
                        class="status-pill"
                        :class="
                          client.status === 'active'
                            ? 'status-active'
                            : 'status-inactive'
                        "
                      >
                        {{ client.status }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!clients.length">
                    <td colspan="4">No clients found.</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </main>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";
import { millify } from "millify";
import numeral from "numeral";
import logo from "@/assets/logo.png";

export default {
  name: "Dashboard",
  middleware: "auth",

  data() {
    return {
      logo,
      numeral,
      millify,
      items_nav: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "admin/dashboard",
        },
        {
          title: "Campaign",
          icon: "mdi-bullhorn-outline",
          to: "campaigns/all",
        },
        {
          title: "Machines",
          icon: "mdi-cellphone-sound",
          to: "machines",
        },
        {
          title: "Clients",
          icon: "mdi-account-group-outline",
          to: "clients",
        },
        {
          title: "Notifications",
          icon: "mdi-bell-outline",
          to: "admin/notification",
        },
      ],
      UIDl: "SktPIKvFTuganVRJnLAZeSzzTzL2",
      moment,
      loading: false,
      notificationsLoading: false,
      errorMessage: "",
      successMessage: "",
      selectedRange: "",
      chartRenderKey: 0,
      rangeOptions: [
        { text: "General impressions", value: "" },
        { text: "This Week", value: "week" },
        { text: "Last 7 Days", value: "7d" },
        { text: "Last 30 Days", value: "30d" },
        { text: "This Month", value: "month" },
      ],
      metrics: {
        impressions_today: 0,
        scans_today: 0,
        impressions_month: 0,
        scans_month: 0,
        conversion_rate: 0,
        total_impressions: 0,
      },
      allDailyImpressions: [],
      allDailyScans: [],
      dailyImpressions: [],
      dailyScans: [],
      deviceBreakdown: [],
      topMachines: [],
      clients: [],
      socketRefreshTimer: null,
      showBurger: false,
      windowSize: {
        x: null,
        y: null,
      },
      notifications: [],
      readingId: null,
      markingAll: false,
      clientId: null,
      clientName: "",
    };
  },

  computed: {
    unreadCount() {
      return (this.notifications || []).filter((n) => Number(n.is_read) === 0)
        .length;
    },

    totalClients() {
      return (this.clients || []).length;
    },

    activeClients() {
      return (this.clients || []).filter((client) => client.status === "active")
        .length;
    },

    rangeText() {
      if (!this.selectedRange) return "General";
      const found = this.rangeOptions.find(
        (item) => item.value === this.selectedRange
      );
      return found ? found.text : "General";
    },

    scansSeries() {
      return [
        {
          name: "Scans",
          data: (this.dailyScans || []).map((row) => Number(row.scans || 0)),
        },
      ];
    },

    scansChartOptions() {
      return {
        chart: {
          toolbar: {
            show: false,
          },
          foreColor: "#bdbdbd",
        },
        theme: {
          mode: "dark",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: (this.dailyScans || []).map((row) => row.label || "-"),
          title: {
            text: "Date",
          },
          labels: {
            rotate: -45,
            hideOverlappingLabels: true,
          },
        },
        yaxis: {
          title: {
            text: "Scans",
          },
          labels: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: (_value, { dataPointIndex }) => {
              const row = this.dailyScans[dataPointIndex];
              return row?.label || "-";
            },
          },
          y: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        noData: {
          text: "No scan data",
        },
      };
    },

    devicePieSeries() {
      return (this.deviceBreakdown || []).map((row) => Number(row.scans || 0));
    },

    devicePieOptions() {
      return {
        labels: (this.deviceBreakdown || []).map((row) => row.device_name),
        legend: {
          position: "bottom",
          labels: {
            colors: "#d2d2d2",
          },
        },
        theme: {
          mode: "dark",
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val.toFixed(1)}%`,
        },
        tooltip: {
          theme: "dark",
          y: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        noData: {
          text: "No device data",
        },
      };
    },

    impressionsSeries() {
      return [
        {
          name: "Impressions",
          data: (this.dailyImpressions || []).map((row) =>
            Number(row.impressions || 0)
          ),
        },
      ];
    },

    impressionsChartOptions() {
      return {
        chart: {
          toolbar: {
            show: false,
          },
          foreColor: "#73D843",
        },
        theme: {
          mode: "dark",
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: (this.dailyImpressions || []).map(
            (row) => row.label || "-"
          ),
          title: {
            text: "Date",
          },
          labels: {
            rotate: -45,
            hideOverlappingLabels: true,
          },
        },
        yaxis: {
          title: {
            text: "Impressions",
          },
          labels: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: (_value, { dataPointIndex }) => {
              const row = this.dailyImpressions[dataPointIndex];
              return row?.label || "-";
            },
          },
          y: {
            formatter: (value) => Number(value || 0).toLocaleString(),
          },
        },
        noData: {
          text: "No impression data",
        },
      };
    },
  },

  async mounted() {
    this.onResize();
    await this.loadDashboard();
    await this.resolveClient();
    await this.fetchNotifications();
  },

  beforeDestroy() {
    this.removeSocketListeners();

    if (this.socketRefreshTimer) {
      clearTimeout(this.socketRefreshTimer);
      this.socketRefreshTimer = null;
    }
  },

  methods: {
    normalizeLabel(rawLabel) {
      if (!rawLabel) return null;

      const parsed = this.moment(
        rawLabel,
        [
          "YYYY-MM-DD",
          "YYYY-M-D",
          "YYYY-MM",
          "YYYY-[W]WW",
          "MMM DD",
          "MMM D",
          "MMM Do YY",
          "MMM Do YYYY",
        ],
        true
      );

      if (parsed.isValid()) {
        return parsed.format("YYYY-MM-DD");
      }

      const fallback = this.moment(rawLabel);
      return fallback.isValid() ? fallback.format("YYYY-MM-DD") : null;
    },

    formatLabelForChart(rawLabel) {
      if (!rawLabel) return "-";

      const parsed = this.moment(
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
      const today = this.moment().startOf("day");
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

          const rowMoment = this.moment(normalized);
          return !startDate || rowMoment.isSameOrAfter(startDate, "day");
        });

        return this.groupRowsByLabel(filtered, valueKey);
      };

      this.dailyImpressions = filterRows(
        this.allDailyImpressions,
        "impressions"
      );
      this.dailyScans = filterRows(this.allDailyScans, "scans");
    },

    async loadSummaryData() {
      try {
        const [metricsRes, devicesRes, machinesRes] = await Promise.all([
          api.get("/api/analytics/global-metrics", {
            params: { range: this.selectedRange },
          }),
          api.get("/api/analytics/device-breakdown", {
            params: { range: this.selectedRange },
          }),
          api.get("/api/analytics/top-machines", {
            params: { range: this.selectedRange },
          }),
        ]);

        this.metrics = metricsRes.data || this.metrics;
        this.deviceBreakdown = devicesRes.data || [];
        this.topMachines = machinesRes.data || [];
      } catch (error) {
        console.error("loadSummaryData error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to update admin dashboard";
      }
    },

    onRangeChange() {
      this.applyGraphFilter();
      this.chartRenderKey += 1;
      this.loadSummaryData();
    },

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
          user_type: "admin",
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
          this.$router.push("/auth/admin.login");
          return;
        }

        if (currentUser.uid !== this.UIDl) {
          this.$fire.auth.signOut();
          this.$router.push("/auth/admin.login");
          return;
        }

        console.log("Admin user authenticated with UID:", currentUser.uid);
      } catch (error) {
        console.error("resolveClient error:", error);
      }
    },

    async fetchNotifications() {
      try {
        this.notificationsLoading = true;
        this.errorMessage = "";

        const { data } = await api.get("/api/notifications/get", {
          params: {
            user_type: "admin",
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

    async logout() {
      this.$fire.auth.signOut();
      this.$router.push("/auth/admin.login");
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

    async loadDashboard() {
      try {
        this.loading = true;
        this.errorMessage = "";

        const [
          metricsRes,
          impressionsRes,
          scansRes,
          devicesRes,
          machinesRes,
          clientsRes,
        ] = await Promise.all([
          api.get("/api/analytics/global-metrics", {
            params: { range: this.selectedRange },
          }),
          api.get("/api/analytics/daily-impressions-graph"),
          api.get("/api/analytics/daily-scans-graph"),
          api.get("/api/analytics/device-breakdown", {
            params: { range: this.selectedRange },
          }),
          api.get("/api/analytics/top-machines", {
            params: { range: this.selectedRange },
          }),
          api.get("/api/clients"),
        ]);

        this.metrics = metricsRes.data || {
          impressions_today: 0,
          scans_today: 0,
          impressions_month: 0,
          scans_month: 0,
          conversion_rate: 0,
          total_impressions: 0,
        };

        this.allDailyImpressions = impressionsRes.data || [];
        this.allDailyScans = scansRes.data || [];
        this.applyGraphFilter();
        this.chartRenderKey += 1;

        this.deviceBreakdown = devicesRes.data || [];
        this.topMachines = machinesRes.data || [];
        this.clients = clientsRes.data || [];
      } catch (error) {
        console.error("loadDashboard error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load admin dashboard";
      } finally {
        this.loading = false;
      }
    },

    setupSocketListeners() {
      if (!this.$socket) return;

      this.$socket.emit("join-admin");
      this.$socket.on("machine-status-updated", this.handleLiveEvent);
      this.$socket.on("qr-scan-recorded", this.handleLiveEvent);
      this.$socket.on("simulation-impression", this.handleLiveEvent);
    },

    removeSocketListeners() {
      if (!this.$socket) return;

      this.$socket.off("machine-status-updated", this.handleLiveEvent);
      this.$socket.off("qr-scan-recorded", this.handleLiveEvent);
      this.$socket.off("simulation-impression", this.handleLiveEvent);
    },

    handleLiveEvent(payload) {
      console.log("admin live event", payload);
      this.debouncedRefreshDashboard();
    },

    debouncedRefreshDashboard() {
      if (this.socketRefreshTimer) {
        clearTimeout(this.socketRefreshTimer);
      }

      this.socketRefreshTimer = setTimeout(() => {
        this.loadDashboard();
      }, 800);
    },

    formatNumber(value) {
      return Number(value || 0).toLocaleString();
    },
  },
};
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 22%
    ),
    linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
  color: #fff;
}

.admin-topbar {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid rgba(198, 255, 0, 0.08);
}

.topbar-icon {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(198, 255, 0, 0.08);
}

.menu-list {
  background: #111111 !important;
  border: 1px solid rgba(198, 255, 0, 0.1);
  border-radius: 14px;
}

.admin-layout {
  display: flex;
  min-height: calc(100vh - 72px);
}

.admin-sidebar {
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

.avatar-text {
  color: #000;
  font-weight: 800;
}

.sidebar-user-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.sidebar-user-subtitle {
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

.admin-main {
  flex: 1;
  padding: 20px;
}

.page-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.2);
  color: #73d843;
  font-size: 12px;
  margin-bottom: 8px;
}

.page-title {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.hero-panel {
  border-radius: 24px;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 28%
    ),
    linear-gradient(135deg, #111111, #080808) !important;
  border: 1px solid rgba(198, 255, 0, 0.14) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}

.hero-copy {
  max-width: 760px;
}

.hero-kicker {
  color: #73d843;
  font-size: 13px;
  margin-bottom: 10px;
  letter-spacing: 0.4px;
}

.hero-heading {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  max-width: 720px;
}

.hero-subtext {
  color: #bcbcbc;
  margin-top: 12px;
  max-width: 760px;
  line-height: 1.7;
}

.hero-btn-primary {
  font-weight: 700;
}

.hero-btn-outline {
  border-color: #73d843 !important;
  color: #73d843 !important;
}

.dashboard-alert {
  border-radius: 14px;
}

.metric-card {
  min-height: 122px;
  border-radius: 18px;
  padding: 20px !important;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.1) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-highlight {
  background: linear-gradient(
    135deg,
    rgba(198, 255, 0, 0.14),
    #0d0d0d 55%,
    #090909
  ) !important;
}

.small-metric-card {
  min-height: 108px;
}

.metric-label {
  font-size: 12px;
  color: #ababab;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.metric-number {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
}

.panel-card {
  border-radius: 22px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.1) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.panel-kicker {
  color: #9ea59b;
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

.table-dark ::v-deep th {
  color: #73d843 !important;
  background: transparent !important;
  font-weight: 700;
  border-bottom: 1px solid rgba(198, 255, 0, 0.08) !important;
}

.table-dark ::v-deep td {
  color: #d4d4d4 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.table-dark ::v-deep tr:hover {
  background: rgba(198, 255, 0, 0.03);
}

.status-pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-active {
  background: rgba(198, 255, 0, 0.12);
  color: #73d843;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.status-inactive {
  background: rgba(255, 255, 255, 0.06);
  color: #d6d6d6;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.text-decoration-none {
  text-decoration: none;
}

.loading-block,
.empty-state {
  color: #bdbdbd;
  padding: 20px 0;
}

.notification-count {
  color: #73d843;
  font-size: 13px;
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

@media (max-width: 960px) {
  .admin-layout {
    display: block;
  }

  .admin-main {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .hero-heading {
    font-size: 22px;
  }

  .metric-number {
    font-size: 24px;
  }

  .notification-row {
    flex-direction: column;
  }
}
</style>