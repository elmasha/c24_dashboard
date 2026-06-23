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
            <v-list-item v-for="(item, index) in items_nav" :key="index" link @click="move(item.to)">
              <v-list-item-icon><v-icon color="#73D843">{{ item.icon }}</v-icon></v-list-item-icon>
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
        <v-btn icon dark class="topbar-icon mr-2" @click="refreshCurrentTab" :loading="loading">
          <v-icon>mdi-refresh</v-icon>
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
            <v-avatar size="54" color="#73D843" class="sidebar-avatar">
              <span class="avatar-text">AD</span>
            </v-avatar>
            <div class="sidebar-user-name">Operations Team</div>
            <div class="sidebar-user-subtitle">Manage clients, users and delivery</div>
          </div>
          <v-list dark class="sidebar-list">
            <v-list-item v-for="item in items_nav" :key="item.title" link class="sidebar-item" @click="move(item.to)">
              <v-list-item-icon><v-icon color="#73D843">{{ item.icon }}</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>{{ item.title }}</v-list-item-title></v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="sidebar-footer">
            <v-btn block outlined color="#73D843" class="logout-btn" @click="logout">Logout</v-btn>
          </div>
        </div>
      </aside>

      <main class="admin-main">
        <v-card class="hero-panel pa-6 mb-5" outlined>
          <div class="d-flex flex-wrap align-center">
            <div class="hero-copy" style="margin-left: 10px">
              <div class="hero-kicker">Platform Operations</div>
              <div class="hero-heading">Create, manage and maintain accounts across the platform</div>
              <div class="hero-subtext">Control client onboarding, user access, and dashboard permissions from one place.</div>
            </div>
          </div>
        </v-card>

        <v-alert v-if="successMessage" type="success" dense outlined class="mb-4 dashboard-alert">{{ successMessage }}</v-alert>
        <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4 dashboard-alert">{{ errorMessage }}</v-alert>

        <v-tabs v-model="activeTab" dark background-color="transparent" color="#73D843" slider-color="#73D843" class="mb-4">
          <v-tab>Clients</v-tab>
          <v-tab>Users</v-tab>
          <v-tab>User-Client Links</v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab" style="background: transparent;">
          <!-- ═══════════════════ TAB 1: CLIENTS ═══════════════════ -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" lg="4">
                <v-card class="panel-card pa-4" outlined>
                  <div class="panel-head mb-3">
                    <div>
                      <div class="panel-kicker">Client Form</div>
                      <div class="panel-title">{{ editingClientId ? "Edit Client" : "Create Client" }}</div>
                    </div>
                  </div>
                  <v-form @submit.prevent="submitClient">
                    <div style="margin: 10px 0 18px">
                      <p>Client image</p>
                      <div class="client-image-wrap">
                        <div v-if="formClient.image_url" class="client-image-preview">
                          <v-img :src="formClient.image_url" cover height="140" width="140" />
                        </div>
                        <div v-else class="client-image-upload">
                          <dropzone id="client-dropzone" ref="clientDropzone" style="border-radius: 360px; width: 140px; height: 140px; overflow: hidden;"
                            @vdropzone-success="handleSuccess" :options="options" @vdropzone-complete="afterComplete"></dropzone>
                        </div>
                      </div>
                      <div v-if="formClient.image_url" style="margin-top: 10px">
                        <v-btn x-small text color="#73D843" @click="clearClientImage">Remove image</v-btn>
                      </div>
                    </div>

                    <v-text-field v-model="formClient.client_name" label="Client Name" outlined dense dark required />
                    <v-text-field v-model="formClient.email" label="Email" type="email" outlined dense dark required />
                    <v-select v-model="formClient.status" :items="['active', 'inactive']" label="Status" outlined dense dark />
                    <v-select v-model="formClient.show_qr" :items="[{ text: 'Enabled', value: 1 }, { text: 'Disabled', value: 0 }]" item-text="text" item-value="value" label="QR Code" outlined dense dark />

                    <div class="d-flex">
                      <v-btn color="#73D843" class="black--text font-weight-bold mr-2" type="submit" :loading="savingClient">{{ editingClientId ? "Update" : "Create" }}</v-btn>
                      <v-btn text @click="resetClientForm">Cancel</v-btn>
                    </div>
                  </v-form>
                </v-card>
              </v-col>

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
                        <th>ID</th><th>Image</th><th>Client Name</th><th>Email</th><th>Setup</th><th>QR</th><th>Status</th><th class="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="client in clients" :key="client.id">
                        <td>{{ client.id }}</td>
                        <td>
                          <v-avatar size="36" :color="client.image_url ? 'transparent' : '#73D843'">
                            <v-img v-if="client.image_url" :src="client.image_url" cover />
                            <span v-else class="table-avatar-text">{{ (client.client_name || "").substring(0, 2).toUpperCase() }}</span>
                          </v-avatar>
                        </td>
                        <td>{{ client.client_name }}</td>
                        <td>{{ client.email || "-" }}</td>
                        <td><span class="status-pill" :class="client.firebase_uid ? 'status-active' : 'status-inactive'">{{ client.firebase_uid ? "completed" : "pending" }}</span></td>
                        <td><span class="status-pill" :class="Number(client.show_qr) === 1 ? 'status-active' : 'status-inactive'">{{ Number(client.show_qr) === 1 ? "enabled" : "disabled" }}</span></td>
                        <td><span class="status-pill" :class="client.status === 'active' ? 'status-active' : 'status-inactive'">{{ client.status }}</span></td>
                        <td class="text-right">
                          <div class="action-wrap">
                            <v-btn x-small text color="#73D843" class="mr-1 mb-1" @click="editClient(client)">Edit</v-btn>
                            <v-btn x-small text color="#9be15d" class="mr-1 mb-1" :loading="resendingId === client.id" @click="resendSetupLink(client)">Resend Link</v-btn>
                            <v-btn x-small text color="#ff6b6b" class="mb-1" :loading="deletingClientId === client.id" @click="deleteClient(client)">Delete</v-btn>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!clients.length"><td colspan="8">No clients found.</td></tr>
                    </tbody>
                  </v-simple-table>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- ═══════════════════ TAB 2: USERS ═══════════════════ -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" lg="4">
                <v-card class="panel-card pa-4" outlined>
                  <div class="panel-head mb-3">
                    <div>
                      <div class="panel-kicker">User Form</div>
                      <div class="panel-title">{{ editingUserId ? "Edit User" : "Create User" }}</div>
                    </div>
                  </div>

                  <!-- CREATE USER: Select client first, then auto-copy firebase_uid -->
                  <v-form @submit.prevent="submitUser">
                    <v-text-field v-model="formUser.full_name" label="Full Name" outlined dense dark required />
                    <v-text-field v-model="formUser.email" label="Email" type="email" outlined dense dark required />
                    <v-text-field v-model="formUser.phone" label="Phone" outlined dense dark />

                    <!-- Select client(s) - firebase_uid auto-copied from here -->
                    <v-autocomplete
                      v-model="formUser.client_ids"
                      :items="clientsWithFirebase"
                      item-text="client_name"
                      item-value="id"
                      label="Assign to Client(s) *"
                      outlined
                      dense
                      dark
                      multiple
                      chips
                      required
                      :disabled="editingUserId !== null"
                      hint="User will share the client's Firebase login"
                      persistent-hint
                      class="mb-2"
                    >
                      <template v-slot:item="{ item }">
                        <div>
                          {{ item.client_name }}
                          <span class="grey--text text-caption ml-2">
                            {{ item.firebase_uid ? "(has login)" : "(no login yet)" }}
                          </span>
                        </div>
                      </template>
                    </v-autocomplete>

                    <!-- Show selected client's firebase_uid (read-only) -->
                    <v-text-field
                      v-if="selectedClientFirebaseUid && !editingUserId"
                      v-model="selectedClientFirebaseUid"
                      label="Shared Firebase UID (auto-copied from client)"
                      outlined
                      dense
                      dark
                      readonly
                      disabled
                      class="mb-2"
                    />

                    <v-alert
                      v-if="clientsWithoutFirebase.length && !editingUserId"
                      type="warning"
                      dense
                      text
                      class="mb-3"
                      color="#ff6b6b"
                    >
                      <strong>Note:</strong> These clients have no Firebase UID set yet:
                      {{ clientsWithoutFirebase.map(c => c.client_name).join(', ') }}.
                      They must log in first.
                    </v-alert>

                    <v-select v-model="formUser.role" :items="['viewer', 'editor', 'admin']" label="User Role" outlined dense dark />

                    <div class="d-flex">
                      <v-btn color="#73D843" class="black--text font-weight-bold mr-2" type="submit" :loading="savingUser">{{ editingUserId ? "Update" : "Create" }}</v-btn>
                      <v-btn text @click="resetUserForm">Cancel</v-btn>
                    </div>
                  </v-form>
                </v-card>
              </v-col>

              <v-col cols="12" lg="8">
                <v-card class="panel-card pa-4" outlined>
                  <div class="panel-head mb-3">
                    <div>
                      <div class="panel-kicker">User Directory</div>
                      <div class="panel-title">All Users</div>
                    </div>
                  </div>
                  <v-simple-table class="table-dark">
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Linked Clients</th><th class="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>
                          <v-avatar size="32" color="#73D843" class="mr-2">
                            <span class="table-avatar-text">{{ (user.full_name || "").substring(0, 2).toUpperCase() }}</span>
                          </v-avatar>
                          {{ user.full_name }}
                        </td>
                        <td>{{ user.email }}</td>
                        <td><span class="status-pill" :class="user.role === 'admin' ? 'status-active' : 'status-inactive'">{{ user.role }}</span></td>
                        <td><span class="status-pill" :class="user.status === 'active' ? 'status-active' : 'status-inactive'">{{ user.status }}</span></td>
                        <td>{{ user.linked_clients || "-" }}</td>
                        <td class="text-right">
                          <div class="action-wrap">
                            <v-btn x-small text color="#73D843" class="mr-1 mb-1" @click="editUser(user)">Edit</v-btn>
                            <v-btn x-small text color="#ff6b6b" class="mb-1" :loading="deletingUserId === user.id" @click="deleteUser(user)">Delete</v-btn>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!users.length"><td colspan="7">No users found.</td></tr>
                    </tbody>
                  </v-simple-table>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- ═══════════════════ TAB 3: USER-CLIENT LINKS ═══════════════════ -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" lg="4">
                <v-card class="panel-card pa-4" outlined>
                  <div class="panel-head mb-3">
                    <div>
                      <div class="panel-kicker">Assignment Form</div>
                      <div class="panel-title">Link User to Client</div>
                    </div>
                  </div>
                  <v-form @submit.prevent="submitAssignment">
                    <v-autocomplete v-model="assignmentForm.user_id" :items="users" item-text="full_name" item-value="id" label="Select User" outlined dense dark required clearable />
                    <v-autocomplete v-model="assignmentForm.client_id" :items="clientsWithFirebase" item-text="client_name" item-value="id" label="Select Client" outlined dense dark required clearable />
                    <v-select v-model="assignmentForm.role" :items="['admin', 'editor', 'viewer']" label="Client Role" outlined dense dark />
                    <div class="d-flex">
                      <v-btn color="#73D843" class="black--text font-weight-bold mr-2" type="submit" :loading="savingAssignment">Assign</v-btn>
                      <v-btn text @click="resetAssignmentForm">Cancel</v-btn>
                    </div>
                  </v-form>
                </v-card>
              </v-col>

              <v-col cols="12" lg="8">
                <v-card class="panel-card pa-4" outlined>
                  <div class="panel-head mb-3">
                    <div>
                      <div class="panel-kicker">Active Links</div>
                      <div class="panel-title">User-Client Assignments</div>
                    </div>
                  </div>
                  <v-simple-table class="table-dark">
                    <thead>
                      <tr>
                        <th>ID</th><th>User</th><th>Email</th><th>Client</th><th>Role</th><th>Date</th><th class="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="link in userClients" :key="link.id">
                        <td>{{ link.id }}</td>
                        <td>{{ link.full_name }}</td>
                        <td>{{ link.email }}</td>
                        <td>{{ link.client_name }}</td>
                        <td><span class="status-pill" :class="link.role === 'admin' ? 'status-active' : 'status-inactive'">{{ link.role }}</span></td>
                        <td>{{ new Date(link.created_at).toLocaleDateString() }}</td>
                        <td class="text-right">
                          <v-btn x-small text color="#ff6b6b" :loading="deletingLinkId === link.id" @click="removeAssignment(link)">Remove</v-btn>
                        </td>
                      </tr>
                      <tr v-if="!userClients.length"><td colspan="7">No assignments found.</td></tr>
                    </tbody>
                  </v-simple-table>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
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
  components: { Dropzone },
  data() {
    return {
      activeTab: 0,
      options: { url: "http://httpbin.org/anything", maxFiles: 1, acceptedFiles: "image/*" },
      loading: false,
      showBurger: false,
      windowSize: { x: null, y: null },

      // ─── Clients ───
      clients: [],
      savingClient: false,
      deletingClientId: null,
      resendingId: null,
      editingClientId: null,
      formClient: { client_name: "", email: "", status: "active", show_qr: 0, image_url: "" },

      // ─── Users ───
      users: [],
      savingUser: false,
      deletingUserId: null,
      editingUserId: null,
      // REMOVED: firebase_uid from form - auto-copied from client
      formUser: { full_name: "", email: "", phone: "", client_ids: [], role: "viewer" },

      // ─── Assignments ───
      userClients: [],
      savingAssignment: false,
      deletingLinkId: null,
      assignmentForm: { user_id: null, client_id: null, role: "viewer" },

      successMessage: "",
      errorMessage: "",

      items_nav: [
        { title: "Dashboard", icon: "mdi-view-dashboard", to: "admin/dashboard" },
        { title: "Campaign", icon: "mdi-bullhorn-outline", to: "campaigns/all" },
        { title: "Machines", icon: "mdi-cellphone-sound", to: "machines" },
        { title: "Clients", icon: "mdi-account-group-outline", to: "clients" },
      ],
    };
  },

  computed: {
    // Clients that have firebase_uid set (can have users assigned)
    clientsWithFirebase() {
      return this.clients.filter(c => c.firebase_uid);
    },
    // Clients without firebase_uid (need to login first)
    clientsWithoutFirebase() {
      return this.clients.filter(c => !c.firebase_uid);
    },
    // Show selected client's firebase_uid for preview
    selectedClientFirebaseUid() {
      if (!this.formUser.client_ids || !this.formUser.client_ids.length) return "";
      const firstClient = this.clients.find(c => c.id === this.formUser.client_ids[0]);
      return firstClient ? firstClient.firebase_uid : "";
    }
  },

  mounted() {
    this.onResize();
    this.fetchClients();
    this.fetchUsers();
    this.fetchUserClients();
  },

  methods: {
    refreshCurrentTab() {
      if (this.activeTab === 0) this.fetchClients();
      else if (this.activeTab === 1) this.fetchUsers();
      else if (this.activeTab === 2) this.fetchUserClients();
    },

    // ─── Dropzone ───
    handleSuccess(file, response) { console.log("Uploaded", response); },
    clearDropzone() { if (this.$refs.clientDropzone?.dropzone) this.$refs.clientDropzone.dropzone.removeAllFiles(); },
    async afterComplete(uploadedFile) {
      const storageRef = this.$fire.storage.ref();
      const imageName = uuidv1();
      try {
        const metadata = { contentType: uploadedFile.type || "image/png" };
        const imageRef = storageRef.child(`clients/${imageName}.png`);
        await imageRef.put(uploadedFile, metadata);
        this.formClient.image_url = await imageRef.getDownloadURL();
      } catch (error) { this.errorMessage = "Failed to upload image"; }
    },
    clearClientImage() { this.formClient.image_url = ""; this.$nextTick(() => this.clearDropzone()); },

    // ─── Navigation ───
    logout() { this.$fire.auth.signOut(); window.location.reload(true); },
    move(val) { this.$router.push(`/${val}`); },
    onResize() { this.windowSize = { x: window.innerWidth, y: window.innerHeight }; this.showBurger = this.windowSize.x < 950; },

    // ─── Clients ───
    async fetchClients() {
      try {
        this.loading = true;
        const { data } = await api.get("/api/clients");
        this.clients = data || [];
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to load clients"; }
      finally { this.loading = false; }
    },
    async submitClient() {
      try {
        this.savingClient = true;
        this.successMessage = ""; this.errorMessage = "";
        if (!this.formClient.client_name || !this.formClient.email) { this.errorMessage = "Client name and email are required"; return; }
        const payload = { ...this.formClient, show_qr: Number(this.formClient.show_qr) };
        if (this.editingClientId) {
          const { data } = await api.put(`/api/clients/${this.editingClientId}`, payload);
          this.successMessage = `${data.client_name} updated successfully`;
        } else {
          const { data } = await api.post("/api/clients", payload);
          this.successMessage = data.message || "Client created successfully";
        }
        this.resetClientForm();
        await this.fetchClients();
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to save client"; }
      finally { this.savingClient = false; }
    },
    editClient(client) {
      this.editingClientId = client.id;
      this.formClient = { client_name: client.client_name || "", email: client.email || "", status: client.status || "active", show_qr: Number(client.show_qr || 0), image_url: client.image_url || "" };
      this.$nextTick(() => this.clearDropzone());
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async deleteClient(client) {
      if (!window.confirm(`Delete client "${client.client_name}"?`)) return;
      try {
        this.deletingClientId = client.id;
        await api.delete(`/api/clients/${client.id}`);
        this.successMessage = "Client deleted successfully";
        if (this.editingClientId === client.id) this.resetClientForm();
        await this.fetchClients();
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to delete client"; }
      finally { this.deletingClientId = null; }
    },
    async resendSetupLink(client) {
      try {
        this.resendingId = client.id;
        const { data } = await api.post(`/api/clients/${client.id}/resend-setup-link`);
        this.successMessage = data.message || "Setup link sent successfully";
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to resend link"; }
      finally { this.resendingId = null; }
    },
    resetClientForm() {
      this.editingClientId = null;
      this.formClient = { client_name: "", email: "", status: "active", show_qr: 0, image_url: "" };
      this.clearDropzone();
    },

    // ─── Users ───
    async fetchUsers() {
      try {
        this.loading = true;
        const { data } = await api.get("/api/users/users");
        this.users = data || [];
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to load users"; }
      finally { this.loading = false; }
    },
    async submitUser() {
      try {
        this.savingUser = true;
        this.successMessage = ""; this.errorMessage = "";

        if (this.editingUserId) {
          // UPDATE: Only full_name, phone, role, status
          if (!this.formUser.full_name) { this.errorMessage = "Full name is required"; return; }
          const payload = {
            full_name: this.formUser.full_name,
            phone: this.formUser.phone,
            role: this.formUser.role,
            status: this.formUser.status
          };
          const { data } = await api.put(`/api/users/${this.editingUserId}`, payload);
          this.successMessage = `${data.full_name} updated successfully`;
        } else {
          // CREATE: Must have client_ids, firebase_uid auto-copied from client
          if (!this.formUser.full_name || !this.formUser.email) {
            this.errorMessage = "Full name and email are required";
            return;
          }
          if (!this.formUser.client_ids || !this.formUser.client_ids.length) {
            this.errorMessage = "At least one client must be selected";
            return;
          }
          // Check selected clients have firebase_uid
          const selectedClients = this.clients.filter(c => this.formUser.client_ids.includes(c.id));
          const missingFirebase = selectedClients.filter(c => !c.firebase_uid);
          if (missingFirebase.length) {
            this.errorMessage = `Selected client(s) missing Firebase UID: ${missingFirebase.map(c => c.client_name).join(', ')}`;
            return;
          }

          const payload = {
            email: this.formUser.email,
            full_name: this.formUser.full_name,
            phone: this.formUser.phone,
            role: this.formUser.role,
            client_ids: this.formUser.client_ids
          };
          const { data } = await api.post("/api/users/", payload);
          this.successMessage = `${data.user.full_name} created and linked to client(s)`;
        }

        this.resetUserForm();
        await this.fetchUsers();
      } catch (error) {
        this.errorMessage = error.response.data.message ;
      } finally {
        this.savingUser = false;
      }
    },
    editUser(user) {
      this.editingUserId = user.id;
      // Only editable fields: full_name, phone, role, status
      this.formUser = {
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "viewer",
        status: user.status || "active",
        client_ids: [] // Not editable on update
      };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async deleteUser(user) {
      if (!window.confirm(`Delete user "${user.full_name}"?`)) return;
      try {
        this.deletingUserId = user.id;
        await api.delete(`/api/users/users/${user.id}`);
        this.successMessage = "User deleted successfully";
        if (this.editingUserId === user.id) this.resetUserForm();
        await this.fetchUsers();
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to delete user"; }
      finally { this.deletingUserId = null; }
    },
    resetUserForm() {
      this.editingUserId = null;
      // REMOVED: firebase_uid field
      this.formUser = { full_name: "", email: "", phone: "", client_ids: [], role: "viewer" };
    },

    // ─── User-Client Assignments ───
    async fetchUserClients() {
      try {
        this.loading = true;
        const { data } = await api.get("/api/users/user-clients");
        this.userClients = data || [];
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to load assignments"; }
      finally { this.loading = false; }
    },
    async submitAssignment() {
      try {
        this.savingAssignment = true;
        this.successMessage = ""; this.errorMessage = "";
        if (!this.assignmentForm.user_id || !this.assignmentForm.client_id) { this.errorMessage = "User and Client are required"; return; }
        const { data } = await api.post("/api/users/user-clients", this.assignmentForm);
        this.successMessage = data.message || "Assigned successfully";
        this.resetAssignmentForm();
        await this.fetchUserClients();
        await this.fetchUsers();
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to assign"; }
      finally { this.savingAssignment = false; }
    },
    async removeAssignment(link) {
      if (!window.confirm(`Remove ${link.full_name}'s access to ${link.client_name}?`)) return;
      try {
        this.deletingLinkId = link.id;
        await api.delete(`/api/users/user-clients/${link.id}`);
        this.successMessage = "Assignment removed successfully";
        await this.fetchUserClients();
        await this.fetchUsers();
      } catch (error) { this.errorMessage = error.response?.data?.message || "Failed to remove assignment"; }
      finally { this.deletingLinkId = null; }
    },
    resetAssignmentForm() {
      this.assignmentForm = { user_id: null, client_id: null, role: "viewer" };
    },
  },
};
</script>

<style scoped>
/* ─── Keep all your existing styles exactly as they were ─── */
.admin-page {
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 22%), linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
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
.sidebar-brand { margin-bottom: 24px; }
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
.sidebar-avatar { margin-bottom: 12px; }
.avatar-text { color: #000; font-weight: 800; }
.sidebar-user-name { font-size: 16px; font-weight: 700; color: #fff; }
.sidebar-user-subtitle { color: #a8a8a8; font-size: 13px; margin-top: 4px; }
.sidebar-list { background: transparent !important; }
.sidebar-item { border-radius: 12px; margin-bottom: 6px; }
.sidebar-item:hover { background: rgba(198, 255, 0, 0.06); }
.sidebar-footer { margin-top: 24px; }
.logout-btn {
  border-color: rgba(198, 255, 0, 0.35) !important;
  color: #73d843 !important;
}
.admin-main { flex: 1; padding: 20px; }
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
.hero-panel {
  border-radius: 24px;
  background: radial-gradient(circle at top right, rgba(198, 255, 0, 0.08), transparent 28%), linear-gradient(135deg, #111111, #080808) !important;
  border: 1px solid rgba(198, 255, 0, 0.14) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}
.hero-copy { max-width: 760px; }
.hero-kicker { color: #73d843; font-size: 13px; margin-bottom: 10px; letter-spacing: 0.4px; }
.hero-heading { font-size: 28px; font-weight: 800; line-height: 1.2; color: #fff; max-width: 720px; }
.hero-subtext { color: #bcbcbc; margin-top: 12px; max-width: 760px; line-height: 1.7; }
.hero-btn-primary { font-weight: 700; }
.hero-btn-outline { border-color: #73d843 !important; color: #73d843 !important; }
.dashboard-alert { border-radius: 14px; }
.panel-card {
  border-radius: 22px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.1) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}
.panel-head { display: flex; align-items: center; justify-content: space-between; }
.panel-kicker { color: #9ea59b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
.panel-title { font-size: 20px; font-weight: 700; color: #fff; }
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
.table-dark ::v-deep tr:hover { background: rgba(198, 255, 0, 0.03); }
.action-wrap { display: flex; flex-wrap: wrap; justify-content: flex-end; }
.status-pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}
.status-active { background: rgba(198, 255, 0, 0.12); color: #73d843; border: 1px solid rgba(198, 255, 0, 0.18); }
.status-inactive { background: rgba(255, 255, 255, 0.06); color: #d6d6d6; border: 1px solid rgba(255, 255, 255, 0.08); }
.table-avatar-text { color: #000; font-size: 11px; font-weight: 800; }
.client-image-wrap { display: flex; align-items: center; justify-content: flex-start; }
.client-image-preview {
  width: 140px;
  height: 140px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid rgba(198, 255, 0, 0.18);
}
.client-image-upload { width: 140px; height: 140px; overflow: hidden; border-radius: 50%; }

@media (max-width: 960px) {
  .admin-layout { display: block; }
  .admin-main { padding: 16px; }
  .hero-heading { font-size: 22px; }
}
</style>