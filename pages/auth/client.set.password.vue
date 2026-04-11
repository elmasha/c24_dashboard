<template>
  <v-container fluid class="setup-page pa-0">
    <div class="setup-shell">
      <v-card class="setup-card pa-6" outlined>
        <div class="setup-header">
          <div class="setup-badge">Charge24 Client</div>
          <h1 class="setup-title">Create your account</h1>
          <p class="setup-subtitle">
            Set your password to activate your client account and access your
            dashboard.
          </p>
        </div>

        <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-alert
          v-if="successMessage"
          type="success"
          dense
          outlined
          class="mb-4"
        >
          {{ successMessage }}
        </v-alert>

        <v-form @submit.prevent="createAccount">
          <v-text-field
            v-model="form.email"
            label="Registered Email"
            type="email"
            outlined
            disabled
            dense
            dark
            readonly
            required
          />

          <v-text-field
            v-model="form.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            dark
            required
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
          />

          <v-text-field
            v-model="form.confirmPassword"
            label="Confirm Password"
            :type="showConfirmPassword ? 'text' : 'password'"
            outlined
            dense
            dark
            required
            :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showConfirmPassword = !showConfirmPassword"
          />

          <v-btn
            block
            large
            color="#C6FF00"
            class="black--text font-weight-bold mt-2"
            type="submit"
            :loading="loading"
          >
            Create Account
          </v-btn>
        </v-form>

        <div class="setup-footer">
          Already have an account?
          <nuxt-link to="/auth/client.login" class="setup-link">
            Sign in
          </nuxt-link>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api";

export default {
  auth: false,
  data() {
    return {
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: "",
      successMessage: "",
      form: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },

  mounted() {
    const emailFromQuery = this.$route.query.email || "";
    this.form.email = String(emailFromQuery).trim().toLowerCase();

    if (!this.form.email) {
      this.errorMessage = "Invalid setup link. Email is missing.";
    }
  },

  methods: {
    async createAccount() {
      this.errorMessage = "";
      this.successMessage = "";

      if (
        !this.form.email ||
        !this.form.password ||
        !this.form.confirmPassword
      ) {
        this.errorMessage = "All fields are required";
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = "Passwords do not match";
        return;
      }

      if (this.form.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters";
        return;
      }

      try {
        this.loading = true;

        const normalizedEmail = String(this.form.email).trim().toLowerCase();

        const { data: checkData } = await api.post("/api/clients/check-email", {
          email: normalizedEmail,
        });

        if (!checkData.exists) {
          this.errorMessage = "This email is not registered as a client";
          return;
        }

        if (checkData.client && checkData.client.firebase_uid) {
          this.errorMessage =
            "This account has already been set up. Please sign in instead.";
          return;
        }

        const userCredential =
          await this.$fire.auth.createUserWithEmailAndPassword(
            normalizedEmail,
            this.form.password
          );

        await api.post("/api/clients/link-firebase", {
          email: normalizedEmail,
          firebase_uid: userCredential.user.uid,
        });

        this.successMessage =
          "Account created successfully. Redirecting to login...";

        setTimeout(() => {
          this.$router.push("/auth/client.login");
        }, 1800);
      } catch (error) {
        console.error("createAccount error:", error);

        if (error.code === "auth/email-already-in-use") {
          this.errorMessage =
            "This email is already in use. Please sign in or contact support.";
        } else if (error.code === "auth/invalid-email") {
          this.errorMessage = "Please enter a valid email address";
        } else if (error.code === "auth/weak-password") {
          this.errorMessage = "Password is too weak";
        } else {
          this.errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to create account";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.setup-page {
  min-height: 100vh;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.08),
      transparent 22%
    ),
    linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
  color: #fff;
}

.setup-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.setup-card {
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.12) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}

.setup-header {
  margin-bottom: 20px;
}

.setup-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.22);
  color: #c6ff00;
  font-size: 12px;
  margin-bottom: 14px;
}

.setup-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: #fff;
}

.setup-subtitle {
  margin-top: 10px;
  color: #bcbcbc;
  line-height: 1.7;
}

.setup-footer {
  margin-top: 18px;
  color: #bcbcbc;
  text-align: center;
}

.setup-link {
  color: #c6ff00;
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 600px) {
  .setup-title {
    font-size: 24px;
  }

  .setup-shell {
    padding: 16px;
  }
}
</style>