<template>
  <v-container fluid class="admin-page pa-0">
    <!-- Top bar -->
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
                <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <div>
          <div class="page-badge" style="margin-top: 18px">Admin Portal</div>
        </div>
      </div>

      <v-spacer />

      <div class="d-flex align-center">
        <v-btn
          icon
          dark
          class="topbar-icon mr-2"
          @click="fetchClients"
          :loading="loading"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar" v-show="!showBurger">
        <div class="sidebar-card">
          <div class="sidebar-brand">
            <div class="sidebar-brand-badge">Charge24</div>
            <div class="sidebar-brand-text">Admin Control</div>
          </div>

          <div class="sidebar-profile">
            <v-avatar size="54" color="#C6FF00" class="sidebar-avatar">
              <span class="avatar-text">AD</span>
            </v-avatar>

            <div class="sidebar-user-name">Operations Team</div>
            <div class="sidebar-user-subtitle">
              Manage clients, campaigns and delivery
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
                <v-icon color="#C6FF00">{{ item.icon }}</v-icon>
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
              color="#C6FF00"
              class="logout-btn"
              @click="logout"
            >
              Logout
            </v-btn>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="admin-main">
        <!-- Hero -->
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="d-flex flex-wrap align-center">
            <div class="hero-copy" style="margin-left: 10px">
              <div class="hero-kicker">Client Operations</div>
              <div class="hero-heading">
                Create, manage and maintain client accounts across the platform
              </div>
              <div class="hero-subtext">
                Control client onboarding, status, email records and Firebase
                UID mapping from one place.
              </div>
            </div>

            <v-spacer />

            <div class="hero-actions mt-4 mt-md-0">
              <v-btn
                class="mr-2 hero-btn-primary"
                color="#C6FF00"
                large
                @click="resetForm"
              >
                <span class="black--text font-weight-bold">New Client</span>
              </v-btn>

              <v-btn
                outlined
                large
                class="hero-btn-outline"
                @click="fetchClients"
                :loading="loading"
              >
                Refresh
              </v-btn>
            </div>
          </div>
        </v-card>

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

        <v-row>
          <!-- Form -->
          <v-col cols="12" lg="4">
            <v-card class="panel-card pa-4" outlined>
              <div class="panel-head mb-3">
                <div>
                  <div class="panel-kicker">Client Form</div>
                  <div class="panel-title">
                    {{ editingId ? "Edit Client" : "Create Client" }}
                  </div>
                </div>
              </div>

              <v-form @submit.prevent="submitClient">
                <div style="margin: 10px 0 18px">
                  <p>Client image</p>

                  <div class="client-image-wrap">
                    <div v-if="form.image_url" class="client-image-preview">
                      <v-img
                        :src="form.image_url"
                        cover
                        height="140"
                        width="140"
                      />
                    </div>

                    <div v-else class="client-image-upload">
                      <dropzone
                        id="foo"
                        ref="el"
                        style="
                          border-radius: 360px;
                          width: 140px;
                          height: 140px;
                          overflow: hidden;
                        "
                        @vdropzone-success="handleSuccess"
                        :options="options"
                        @vdropzone-complete="afterComplete"
                      ></dropzone>
                    </div>
                  </div>

                  <div v-if="form.image_url" style="margin-top: 10px">
                    <v-btn
                      x-small
                      text
                      color="#C6FF00"
                      @click="clearClientImage"
                    >
                      Remove image
                    </v-btn>
                  </div>
                </div>

                <v-text-field
                  v-model="form.client_name"
                  label="Client Name"
                  outlined
                  dense
                  dark
                  required
                />

                <v-text-field
                  v-model="form.email"
                  label="Email"
                  outlined
                  dense
                  dark
                />

                <v-text-field
                  v-model="form.firebase_uid"
                  label="Firebase UID"
                  outlined
                  dense
                  dark
                  required
                />

                <v-select
                  v-model="form.status"
                  :items="['active', 'inactive']"
                  label="Status"
                  outlined
                  dense
                  dark
                />

                <v-select
                  v-model="form.qr"
                  :items="['true', 'false']"
                  label="Qr Code"
                  outlined
                  dense
                  dark
                />

                <div class="d-flex">
                  <v-btn
                    color="#C6FF00"
                    class="black--text font-weight-bold mr-2"
                    type="submit"
                    :loading="saving"
                  >
                    {{ editingId ? "Update" : "Create" }}
                  </v-btn>

                  <v-btn text @click="resetForm"> Cancel </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>

          <!-- Table -->
          <v-col cols="12" lg="8">
            <v-card class="panel-card pa-4" outlined>
              <div class="panel-head mb-3">
                <div>
                  <div class="panel-kicker">Client Directory</div>
                  <div class="panel-title">All Clients</div>
                </div>
              </div>

              <v-simple-table class="table-dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Firebase UID</th>
                    <th>Qr code</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="client in clients" :key="client.id">
                    <td>{{ client.id }}</td>
                    <td>
                      <v-avatar
                        size="36"
                        :color="client.image_url ? 'transparent' : '#C6FF00'"
                      >
                        <template v-if="client.image_url">
                          <v-img :src="client.image_url" cover />
                        </template>
                        <template v-else>
                          <span class="table-avatar-text">
                            {{
                              (client.client_name || "")
                                .substring(0, 2)
                                .toUpperCase()
                            }}
                          </span>
                        </template>
                      </v-avatar>
                    </td>
                    <td>{{ client.client_name }}</td>
                    <td>{{ client.email || "-" }}</td>
                    <td class="uid-cell">{{ client.firebase_uid || "-" }}</td>
                    <td>
                      <span
                        class="status-pill"
                        :class="
                          String(client.show_qr) === 'true' ||
                          Number(client.show_qr) === 1
                            ? 'status-active'
                            : 'status-inactive'
                        "
                      >
                        {{
                          String(client.show_qr) === "true" ||
                          Number(client.show_qr) === 1
                            ? "enabled"
                            : "disabled"
                        }}
                      </span>
                    </td>
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
                    <td>{{ client.created_at }}</td>
                    <td class="text-right">
                      <div class="action-wrap">
                        <v-btn
                          x-small
                          text
                          color="#C6FF00"
                          class="mr-1 mb-1"
                          @click="editClient(client)"
                        >
                          Edit
                        </v-btn>

                        <v-btn
                          x-small
                          text
                          color="#ff6b6b"
                          class="mb-1"
                          :loading="deletingId === client.id"
                          @click="deleteClient(client)"
                        >
                          Delete
                        </v-btn>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!clients.length">
                    <td colspan="9">No clients found.</td>
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
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import { v1 as uuidv1 } from "uuid";

export default {
  // middleware: "auth",
  components: {
    Dropzone,
  },
  data() {
    return {
      options: {
        url: "http://httpbin.org/anything",
        maxFiles: 1,
        acceptedFiles: "image/*",
      },
      loading: false,
      saving: false,
      deletingId: null,
      editingId: null,
      successMessage: "",
      errorMessage: "",
      clients: [],
      showBurger: false,
      windowSize: {
        x: null,
        y: null,
      },
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
      ],
      form: {
        client_name: "",
        email: "",
        firebase_uid: "",
        status: "active",
        qr: "false",
        image_url: "",
      },
    };
  },

  mounted() {
    this.onResize();
    this.fetchClients();
  },

  methods: {
    handleSuccess(file, response) {
      console.log("File uploaded successfully!", response);
    },

    clearDropzone() {
      if (this.$refs.el && this.$refs.el.dropzone) {
        this.$refs.el.dropzone.removeAllFiles();
      }
    },

    async afterComplete(upload2) {
      const storageRef = this.$fire.storage.ref();
      const imageNameP = uuidv1();

      try {
        const file = upload2;
        const metadata = {
          contentType: file.type || "image/png",
        };

        const imageRef = storageRef.child(`clients/${imageNameP}.png`);
        await imageRef.put(file, metadata);
        const downloadURLP = await imageRef.getDownloadURL();

        this.form.image_url = downloadURLP;
        console.log("image url", downloadURLP);
      } catch (error) {
        console.log(error);
        this.errorMessage = "Failed to upload image";
      }
    },

    clearClientImage() {
      this.form.image_url = "";
      this.$nextTick(() => {
        this.clearDropzone();
      });
    },

    logout() {
      this.$fire.auth.signOut();
      window.location.reload(true);
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

    async fetchClients() {
      try {
        this.loading = true;
        this.errorMessage = "";

        const { data } = await api.get("/api/clients");
        this.clients = data || [];
        console.log("Fetched clients:", this.clients);
      } catch (error) {
        console.error("fetchClients error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to load clients";
      } finally {
        this.loading = false;
      }
    },

    async submitClient() {
      try {
        this.saving = true;
        this.successMessage = "";
        this.errorMessage = "";

        if (!this.form.client_name || !this.form.firebase_uid) {
          this.errorMessage = "Client name and Firebase UID are required";
          return;
        }

        const payload = {
          client_name: this.form.client_name,
          email: this.form.email,
          firebase_uid: this.form.firebase_uid,
          status: this.form.status,
          show_qr: this.form.qr === "true" ? 1 : 0,
          image_url: this.form.image_url,
        };

        if (this.editingId) {
          const { data } = await api.put(
            `/api/clients/${this.editingId}`,
            payload
          );

          this.successMessage = data.client_name
            ? `${data.client_name} updated successfully`
            : "Client updated successfully";
        } else {
          const { data } = await api.post("/api/clients", payload);

          this.successMessage = data.client_name
            ? `${data.client_name} created successfully`
            : "Client created successfully";
        }

        this.resetForm();
        await this.fetchClients();
      } catch (error) {
        console.error("submitClient error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to save client";
      } finally {
        this.saving = false;
      }
    },

    editClient(client) {
      this.successMessage = "";
      this.errorMessage = "";
      this.editingId = client.id;
      this.form = {
        client_name: client.client_name || "",
        email: client.email || "",
        firebase_uid: client.firebase_uid || "",
        status: client.status || "active",
        qr:
          String(client.show_qr) === "true" || Number(client.show_qr) === 1
            ? "true"
            : "false",
        image_url: client.image_url || "",
      };
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    async deleteClient(client) {
      const confirmed = window.confirm(
        `Delete client "${client.client_name}"?`
      );
      if (!confirmed) return;

      try {
        this.deletingId = client.id;
        this.successMessage = "";
        this.errorMessage = "";

        const { data } = await api.delete(`/api/clients/${client.id}`);

        this.successMessage = data.message || "Client deleted successfully";

        if (this.editingId === client.id) {
          this.resetForm();
        }

        await this.fetchClients();
      } catch (error) {
        console.error("deleteClient error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to delete client";
      } finally {
        this.deletingId = null;
      }
    },

    resetForm() {
      this.editingId = null;
      this.form = {
        client_name: "",
        email: "",
        firebase_uid: "",
        status: "active",
        qr: "false",
        image_url: "",
      };
      this.errorMessage = "";
      this.clearDropzone();
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
  color: #c6ff00;
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
  color: #c6ff00;
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
  border-color: #c6ff00 !important;
  color: #c6ff00 !important;
}

.dashboard-alert {
  border-radius: 14px;
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
  color: #c6ff00 !important;
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

.action-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
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
  color: #c6ff00;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.status-inactive {
  background: rgba(255, 255, 255, 0.06);
  color: #d6d6d6;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.uid-cell {
  max-width: 220px;
  word-break: break-all;
}

.client-image-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.client-image-preview {
  width: 140px;
  height: 140px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid rgba(198, 255, 0, 0.18);
}

.client-image-upload {
  width: 140px;
  height: 140px;
  overflow: hidden;
  border-radius: 50%;
}

.table-avatar-text {
  color: #000;
  font-size: 11px;
  font-weight: 800;
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
}
</style>