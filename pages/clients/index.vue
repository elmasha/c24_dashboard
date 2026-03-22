<template light>
  <v-container fluid class="pa-4">

    <v-row>
                <v-col cols="12" md="12"></v-col>
                <v-col cols="12" md="12">
                    <div class="">
                        <nuxt-link style="text-decoration: none; color: white;margin-left: 10px; margin-top: 40px;" icon to="/admin/dashboard">
                            <v-icon large>mdi-arrow-left</v-icon>
                        </nuxt-link>
                    </div>
                </v-col>
            </v-row>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4 mb-0" style="margin: 20px;">Clients</h1>
      <v-spacer />
      <v-btn small class="mr-2" @click="resetForm">
        New Client
      </v-btn>
      <v-btn small @click="fetchClients" :loading="loading">
        Refresh
      </v-btn>
    </div>

    <v-alert
      v-if="successMessage"
      type="success"
      dense
      outlined
      class="mb-4"
    >
      {{ successMessage }}
    </v-alert>

    <v-alert
      v-if="errorMessage"
      type="error"
      dense
      outlined
      class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>

    <v-row>
      <!-- Form -->
      <v-col cols="12" lg="4">
        <v-card outlined class="pa-4">
          <div class="text-h6 mb-4">
            {{ editingId ? "Edit Client" : "Create Client" }}
          </div>

          <v-form @submit.prevent="submitClient">
            <v-text-field
              v-model="form.client_name"
              label="Client Name"
              outlined
              dense
              required
            />

            <v-text-field
              v-model="form.email"
              label="Email"
              outlined
              dense
            />

            <v-text-field
              v-model="form.firebase_uid"
              label="Firebase UID"
              outlined
              dense
              required
            />

            <v-select
              v-model="form.status"
              :items="['active', 'inactive']"
              label="Status"
              outlined
              dense
            />

            <div class="d-flex">
              <v-btn
                color="primary"
                type="submit"
                :loading="saving"
                class="mr-2"
              >
                {{ editingId ? "Update" : "Create" }}
              </v-btn>

              <v-btn text @click="resetForm">
                Cancel
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- Table -->
      <v-col cols="12" lg="8">
        <v-card outlined class="pa-2">
          <v-simple-table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Email</th>
                <th>Firebase UID</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="client in clients" :key="client.id">
                <td>{{ client.id }}</td>
                <td>{{ client.client_name }}</td>
                <td>{{ client.email || "-" }}</td>
                <td class="uid-cell">{{ client.firebase_uid || "-" }}</td>
                <td>{{ client.status }}</td>
                <td>{{ client.created_at }}</td>
                <td>
                  <div class="d-flex flex-wrap">
                    <v-btn
                      x-small
                      text
                      color="primary"
                      class="mr-1 mb-1"
                      @click="editClient(client)"
                    >
                      Edit
                    </v-btn>

                    <v-btn
                      x-small
                      text
                      color="error"
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
                <td colspan="7">No clients found.</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      loading: false,
      saving: false,
      deletingId: null,
      editingId: null,
      successMessage: "",
      errorMessage: "",
      clients: [],
      form: {
        client_name: "",
        email: "",
        firebase_uid: "",
        status: "active"
      }
    };
  },

  mounted() {
    this.fetchClients();
  },

  methods: {
    async fetchClients() {
      try {
        this.loading = true;
        this.errorMessage = "";

        const { data } = await api.get("/api/clients");
        this.clients = data || [];
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

        if (this.editingId) {
          const { data } = await api.put(
            `/api/clients/${this.editingId}`,
            this.form
          );

          this.successMessage =
            data?.client_name
              ? `${data.client_name} updated successfully`
              : "Client updated successfully";
        } else {
          const { data } = await api.post("/api/clients", this.form);

          this.successMessage =
            data?.client_name
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
        status: client.status || "active"
      };
      window.scrollTo({ top: 0, behavior: "smooth" });
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

        this.successMessage =
          data?.message || "Client deleted successfully";

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
        status: "active"
      };
      this.errorMessage = "";
    }
  }
};
</script>

<style scoped>
.uid-cell {
  max-width: 220px;
  word-break: break-all;
}
</style>