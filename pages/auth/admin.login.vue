<template>
  <v-container fluid class="login-page">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card class="login-card pa-6" outlined>
          <div class="d-flex" style="margin: 30px">
            <v-spacer />
            <nuxt-link to="/">
              <v-icon>mdi-home</v-icon>
            </nuxt-link>
            <v-spacer />
          </div>
          <div class="text-center mb-6">
            <div class="login-badge">Charge24 Admin</div>
            <h1 class="login-title">Admin Login</h1>
            <p class="login-subtitle">
              Sign in to manage campaigns, machines, clients, and analytics.
            </p>
          </div>

          <v-alert v-if="errorMessage" type="error" dense outlined class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <v-form @submit.prevent="loginAdmin">
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              dense
              dark
              required
            />

            <v-text-field
              v-model="form.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPassword = !showPassword"
              outlined
              dense
              dark
              required
            />

            <v-btn
              block
              large
              color="#73D843"
              class="black--text font-weight-bold mt-2"
              :loading="loading"
              type="submit"
            >
              Sign In
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <nuxt-link to="/" class="back-link"> Back to Home </nuxt-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AdminLoginPage",

  data() {
    return {
      loading: false,
      showPassword: false,
      errorMessage: "",
      form: {
        email: "",
        password: "",
      },
      UIDI: "SktPIKvFTuganVRJnLAZeSzzTzL2",
    };
  },

  methods: {
    async loginAdmin() {
      this.loading = true;
      this.errorMessage = "";

      try {
        let that = this;
        const mAuth = this.$fire.auth;
        mAuth
          .signInWithEmailAndPassword(this.form.email, this.form.password)
          .catch(function (error) {
            // that.snackbarText = error.message;
            // that.snackbar = true;
            console.error(error.message);
          })
          .then((user) => {
            //we are signed in

            if (user && user.user && user.user.uid === that.UIDI) {
              console.log("Admin user authenticated with UID:", user.user.uid);
              that.$router.push("/admin/dashboard");
            } else {
              console.log(
                "Non-admin user attempted to log in with UID:",
                user ? user.user.uid : "No user"
              );
              that.errorMessage = "Unauthorized: You do not have admin access.";
              this.$fire.auth.signOut();
              this.$router.push("/auth/admin.login");
              // window.location.reload(true);
            }
          });
      } catch (error) {
        console.error("loginAdmin error:", error);
        this.errorMessage = error.message || "Failed to sign in as admin";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #050505, #101010);
}

.fill-height {
  min-height: 100vh;
}

.login-card {
  border-radius: 18px;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.15) !important;
}

.login-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.25);
  color: #73d843;
  font-size: 13px;
  margin-bottom: 12px;
}

.login-title {
  color: #fff;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #bdbdbd;
  margin-bottom: 0;
}

.back-link {
  color: #73d843;
  text-decoration: none;
}
</style>
