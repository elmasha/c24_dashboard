<template>
<v-container fluid class="client-page pa-0">
    <v-app-bar flat color="transparent" height="72" class="client-topbar px-4">
        <div class="d-flex align-center">
            <v-menu offset-y v-if="showBurger">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon dark class="mr-3 topbar-icon" v-bind="attrs" v-on="on">
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>

                <v-list dark class="menu-list">
                    <v-list-item v-for="(item, index) in items_nav" :key="index" link @click="move(item.to)">
                        <v-list-item-icon>
                            <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <div>
                <div class="page-badge" style="margin-top: 18px;">Client Notifications</div>
            </div>
        </div>

        <v-spacer />

        <div class="d-flex align-center">
            <v-btn icon dark class="topbar-icon mr-2" @click="fetchNotifications" :loading="loading">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </div>
    </v-app-bar>

    <div class="client-layout">
        <aside class="client-sidebar" v-show="!showBurger">
            <div class="sidebar-card">
                <div class="sidebar-brand">
                    <div class="sidebar-brand-badge">Charge24 Client</div>
                    <div class="sidebar-brand-text">Notifications</div>
                </div>

                <div class="sidebar-profile">
                    <v-avatar size="54" color="#C6FF00" class="sidebar-avatar">
                        <span class="avatar-text">CL</span>
                    </v-avatar>

                    <div class="sidebar-user-name">{{ clientName }}</div>
                    <div class="sidebar-user-subtitle">
                        Track campaign alerts and updates
                    </div>
                </div>

                <v-list dark class="sidebar-list">
                    <v-list-item v-for="item in items_nav" :key="item.title" link class="sidebar-item" @click="move(item.to)">
                        <v-list-item-icon>
                            <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <div class="sidebar-footer">
                    <v-btn block outlined color="#C6FF00" class="logout-btn" @click="logout">
                        Logout
                    </v-btn>
                </div>
            </div>
        </aside>

        <main class="client-main">
            <v-card class="hero-panel pa-6 mb-5" outlined>
                <div class="d-flex flex-wrap align-center">
                    <div class="hero-copy" style="margin-left: 10px;">
                        <div class="hero-kicker">Notifications Center</div>
                        <!-- <div class="hero-heading">
                            Stay updated on your campaigns
                        </div> -->
                        <div class="hero-subtext">
                            See creation alerts, assignments, and campaign status changes in one place.
                        </div>
                    </div>

                    <v-spacer />

                    <div class="hero-actions mt-4 mt-md-0">
                        <v-btn
                            class="mr-2 hero-btn-primary"
                            color="#C6FF00"
                            small
                            :loading="markingAll"
                            @click="markAllRead"
                        >
                            <span class="black--text font-weight-bold">Mark all as read</span>
                        </v-btn>

                        <v-btn outlined small class="hero-btn-outline" @click="fetchNotifications" :loading="loading">
                            Refresh
                        </v-btn>
                    </div>
                </div>
            </v-card>

            <v-alert v-if="successMessage" type="success" dense outlined class="mb-4 dashboard-alert">
                {{ successMessage }}
            </v-alert>

            <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">
                {{ errorMessage }}
            </v-alert>

            <v-card class="panel-card pa-4" outlined>
                <div class="panel-head mb-3">
                    <div>
                        <div class="panel-kicker"></div>
                        <div class="panel-title">All Notifications</div>
                    </div>

                    <div class="notification-count">
                        {{ unreadCount }} unread
                    </div>
                </div>

                <div v-if="loading" class="loading-block">
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
                                <v-avatar size="42" color="#C6FF00">
                                    <v-icon color="black">{{ getNotificationIcon(notification.type) }}</v-icon>
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
                                        :color="Number(notification.is_read) === 0 ? '#C6FF00' : '#888888'"
                                    >
                                        {{ Number(notification.is_read) === 0 ? 'Unread' : 'Read' }}
                                    </v-chip>
                                </div>

                                <div class="notification-message">
                                    {{ notification.message }}
                                </div>

                                <div class="notification-meta">
                                    <span>{{ formatDate(notification.created_at) }}</span>
                                    <span class="notification-type">{{ notification.type }}</span>
                                </div>
                            </div>

                            <div class="notification-actions">
                                <v-btn
                                    v-if="Number(notification.is_read) === 0"
                                    x-small
                                    text
                                    color="#C6FF00"
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
        </main>
    </div>
</v-container>
</template>

<script>
import api from "@/services/api";
import moment from "moment";

export default {
    middleware: "auth",
    data() {
        return {
            moment,
            loading: false,
            markingAll: false,
            readingId: null,
            notifications: [],
            successMessage: "",
            errorMessage: "",
            showBurger: false,
            clientId: null,
            clientName: "Client",
            items_nav: [
                {
                    title: "Dashboard",
                    icon: "mdi-view-dashboard",
                    to: "client-dashboard"
                },
                {
                    title: "Campaign",
                    icon: "mdi-bullhorn-outline",
                    to: "clients/campaign"
                },
                {
                    title: "Machines",
                    icon: "mdi-cellphone-sound",
                    to: "clients/assigned-machine"
                },
                {
                    title: "Notifications",
                    icon: "mdi-bell-outline",
                    to: "clients/notifications"
                }
            ]
        };
    },

    computed: {
        unreadCount() {
            return (this.notifications || []).filter(n => Number(n.is_read) === 0).length;
        }
    },

    async mounted() {
    this.onResize();
    await this.resolveClient();

    if (this.clientId) {
        await this.fetchNotifications();
    }
  },

    methods: {
        logout() {
            this.$fire.auth.signOut();
            this.$router.push("/auth/client.login");
        },

        
        move(val) {
            this.$router.push(`/${val}`);
        },

        onResize() {
            this.showBurger = window.innerWidth < 950;
        },

        async resolveClient() {
            try {
                const currentUser = this.$fire.auth.currentUser;

                if (!currentUser) {
                    this.$router.push("/auth/client.login");
                    return;
                }

                const { data } = await api.post("/api/client-dashboard/overview", {
                    uid: currentUser.uid
                });

                if (data && data.client) {
                    this.clientId = data.client.id;
                    this.clientName = data.client.client_name || "Client";
                }

                console.log("Resolved client:", this.clientId, this.clientName);

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

                this.loading = true;
                this.errorMessage = "";

                const { data } = await api.get("/api/notifications/get", {
                    params: {
                        user_type: "client",
                        user_id: this.clientId
                    }
                });

                this.notifications = data || [];
            } catch (error) {
                console.error("fetchNotifications error:", error);
                this.errorMessage =
                    error.response?.data?.message || "Failed to load notifications";
            } finally {
                this.loading = false;
            }
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
                    error.response?.data?.message || "Failed to mark notification as read";
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
                    user_id: this.clientId
                });

                this.notifications = this.notifications.map(item => ({
                    ...item,
                    is_read: 1
                }));

                this.successMessage = "All notifications marked as read";
            } catch (error) {
                console.error("markAllRead error:", error);
                this.errorMessage =
                    error.response?.data?.message || "Failed to mark all notifications as read";
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
        }
    }
};
</script>

<style scoped>
.client-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top left, rgba(198, 255, 0, 0.06), transparent 22%),
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
    color: #c6ff00;
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
    color: #c6ff00 !important;
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
    color: #c6ff00;
    font-size: 12px;
    margin-bottom: 8px;
}
.hero-panel {
    border-radius: 24px;
    background:
        radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 28%),
        linear-gradient(135deg, #111111, #080808) !important;
    border: 1px solid rgba(198, 255, 0, 0.12) !important;
}
.hero-kicker {
    color: #c6ff00;
    font-size: 22px;
    margin-bottom: 10px;
}
.hero-heading {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.2;
    color: #fff;
}
.hero-subtext {
    color: #bcbcbc;
    margin-top: 12px;
    line-height: 1.7;
}
.hero-btn-outline {
    border-color: #c6ff00 !important;
    color: #c6ff00 !important;
}
.dashboard-alert {
    border-radius: 14px;
}
.panel-card {
    border-radius: 22px;
    background: linear-gradient(180deg, #111111, #090909) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.panel-kicker {
    color: #9ea59b;
    font-size: 12px;
    text-transform: uppercase;
    margin-left: 25px;
    margin-bottom: 4px;
}
.panel-title {
    font-size: 12px;
    font-weight: 700;
    color: #fff;
}
.notification-count {
    color: #c6ff00;
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
    color: #c6ff00;
}
.menu-list {
    background: #111111 !important;
    border: 1px solid rgba(198, 255, 0, 0.1);
    border-radius: 14px;
}
@media (max-width: 950px) {
    .client-layout {
        display: block;
    }
    .client-main {
        padding: 16px;
    }
    .hero-heading {
        font-size: 22px;
    }
    .notification-row {
        flex-direction: column;
    }
}
</style>