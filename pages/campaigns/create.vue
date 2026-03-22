<template>
  <v-container fluid class="pa-4">
    <v-row>
        <v-col cols="12" md="12"></v-col>
        <v-col cols="12" md="12">
            <div class="">
                <nuxt-link style="text-decoration: none; color: white;margin-left: 10px; margin-top: 40px;" icon to="/campaigns/all">
                    <v-icon large>mdi-arrow-left</v-icon>
                </nuxt-link>
            </div>
        </v-col>
    </v-row>
    <div class="d-flex align-center mb-4">
      <h2 class="text-h4 mb-0" style="margin: 10px;">Create Campaign</h2>
      <v-spacer />
      <nuxt-link to="/campaigns">
        <v-btn small text>Back</v-btn>
      </nuxt-link>
    </div>

    <v-alert v-if="successMessage" type="success" dense outlined class="mb-4">
      {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <v-card outlined class="pa-4">
      <v-form @submit.prevent="createCampaign">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.client_id"
              :items="clients"
              item-text="client_name"
              item-value="id"
              label="Client"
              outlined
              dense
              required
              @change="onClientChange"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.campaign_name"
              label="Campaign Name"
              outlined
              dense
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.media_url"
              label="Media URL"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.landing_url"
              label="Landing URL"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form.target_impressions"
              label="Target Impressions"
              type="number"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.start_date"
              label="Start Date"
              type="datetime-local"
              outlined
              dense
              required
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.end_date"
              label="End Date"
              type="datetime-local"
              outlined
              dense
              required
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="form.status"
              :items="['active', 'paused', 'ended']"
              label="Status"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <div class="d-flex">
          <v-btn color="primary" type="submit" :loading="saving" class="mr-2">
            Create Campaign
          </v-btn>
          <v-btn text @click="resetForm">Reset</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      saving: false,
      successMessage: "",
      errorMessage: "",
      clients: [],
      form: {
        client_id: "",
        client_name: "",
        campaign_name: "",
        media_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
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
        const { data } = await api.get("/api/clients");
        this.clients = data || [];
      } catch (error) {
        console.error("fetchClients error:", error);
        this.errorMessage = "Failed to load clients";
      }
    },

    onClientChange() {
      const selected = this.clients.find(
        c => Number(c.id) === Number(this.form.client_id)
      );
      this.form.client_name = selected ? selected.client_name : "";
    },

    async createCampaign() {
      try {
        this.saving = true;
        this.successMessage = "";
        this.errorMessage = "";

        const payload = {
          ...this.form,
          start_date: this.formatDateTime(this.form.start_date),
          end_date: this.formatDateTime(this.form.end_date)
        };

        const { data } = await api.post("/api/campaigns", payload);

        this.successMessage =
          `Campaign created successfully. QR Token: ${data.qr_token}`;

        this.resetForm();
      } catch (error) {
        console.error("createCampaign error:", error);
        this.errorMessage =
          error.response?.data?.message || "Failed to create campaign";
      } finally {
        this.saving = false;
      }
    },

    formatDateTime(value) {
      if (!value) return null;
      return value.replace("T", " ") + ":00";
    },

    resetForm() {
      this.form = {
        client_id: "",
        client_name: "",
        campaign_name: "",
        media_url: "",
        landing_url: "",
        target_impressions: 0,
        start_date: "",
        end_date: "",
        status: "active"
      };
    }
  }
};
</script>