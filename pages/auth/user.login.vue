<template>
  <v-container fluid class="login-page pa-0">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Logo / Brand -->
        <div class="brand-section">
          <div class="brand-badge">Charge24</div>
          <h1 class="brand-title">Client Portal</h1>
          <p class="brand-subtitle">Sign in to view your campaigns and performance</p>
        </div>

        <!-- Alert Messages -->
        <v-alert
          v-if="errorMessage"
          type="error"
          dense
          outlined
          class="mb-4 login-alert"
          dismissible
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Login Form -->
        <v-form @submit.prevent="handleLogin" ref="loginForm">
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            dark
            dense
            required
            prepend-inner-icon="mdi-email-outline"
            class="login-input mb-4"
            :rules="[v => !!v || 'Email is required']"
          />

          <v-text-field
            v-model="form.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dark
            dense
            required
            prepend-inner-icon="mdi-lock-outline"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            class="login-input mb-6"
            :rules="[v => !!v || 'Password is required']"
          />

          <v-btn
            block
            color="#73D843"
            class="black--text font-weight-bold login-btn"
            type="submit"
            :loading="loading"
            :disabled="!form.email || !form.password"
          >
            Sign In
          </v-btn>
        </v-form>

        <!-- Footer -->
        <div class="login-footer">
          <p>Don't have access? <a href="#" @click.prevent="contactAdmin">Contact your admin</a></p>
          <p class="powered">Powered by Charge24</p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  layout: "blank", // Use a blank layout with no nav/sidebar

  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      showPassword: false,
      loading: false,
      errorMessage: "",
    };
  },

  methods: {
    async handleLogin() {
      if (!this.$refs.loginForm.validate()) return;

      this.loading = true;
      this.errorMessage = "";

      try {
        const result = await this.$fire.auth.signInWithEmailAndPassword(
          this.form.email,
          this.form.password
        );

        const token = await result.user.getIdToken();

        // Optional: verify with backend
        // await this.$axios.post("/api/auth/verify", { token });

        this.$router.push("/client-dashboard");
      } catch (error) {
        console.error("Login error:", error);
        const messages = {
          "auth/user-not-found": "No account found with this email",
          "auth/wrong-password": "Incorrect password",
          "auth/invalid-email": "Invalid email address",
          "auth/user-disabled": "This account has been disabled",
        };
        this.errorMessage = messages[error.code] || "Failed to sign in. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    contactAdmin() {
      window.location.href = "mailto:support@charge24.com";
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: radial-gradient(
      circle at top left,
      rgba(198, 255, 0, 0.06),
      transparent 40%
    ),
    linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.login-card {
  background: linear-gradient(180deg, #111111, #0a0a0a);
  border: 1px solid rgba(198, 255, 0, 0.12);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.brand-section {
  text-align: center;
  margin-bottom: 32px;
}

.brand-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.22);
  color: #73d843;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.brand-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px 0;
}

.brand-subtitle {
  color: #9d9d9d;
  font-size: 14px;
  margin: 0;
}

.login-alert {
  border-radius: 12px;
  background: rgba(255, 82, 82, 0.08) !important;
  border-color: rgba(255, 82, 82, 0.2) !important;
}

.login-input ::v-deep .v-input__slot {
  background: rgba(255, 255, 255, 0.03) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
}

.login-input ::v-deep .v-label {
  color: #888 !important;
}

.login-input ::v-deep input {
  color: #fff !important;
}

.login-input ::v-deep .v-icon {
  color: #73d843 !important;
}

.login-btn {
  border-radius: 12px;
  padding: 12px 0;
  font-size: 15px;
  letter-spacing: 0.3px;
  box-shadow: 0 8px 24px rgba(115, 216, 67, 0.2);
}

.login-btn:hover {
  box-shadow: 0 10px 30px rgba(115, 216, 67, 0.3);
}

.login-footer {
  margin-top: 28px;
  text-align: center;
}

.login-footer p {
  color: #888;
  font-size: 13px;
  margin: 0 0 8px 0;
}

.login-footer a {
  color: #73d843;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}

.powered {
  color: #555 !important;
  font-size: 12px !important;
  margin-top: 16px !important;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
  .brand-title {
    font-size: 24px;
  }
}
</style>