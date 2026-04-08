<template>
  <v-container fluid class="home-page pa-0">
    <!-- Hero -->
    <section class="hero-section">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="hero-content">
              <div class="d-flex">
                <v-avatar size="58" class="mr-3">
                  <v-img :src="logo" contain />
                </v-avatar>
                <div class="hero-badge">
                  Charge24 Digital Advertising Platform
                </div>
              </div>
              <br />

              <h1 class="hero-title">
                Deliver Measurable Reach, Better Visibility, and Smarter
                Campaign Execution
              </h1>

              <p class="hero-subtitle">
                Charge24 helps brands and operators deliver verified
                impressions, stronger audience visibility, machine-level
                performance tracking, and clearer campaign reporting from one
                unified platform.
              </p>

              <div class="hero-actions">
                <nuxt-link to="/admin/dashboard">
                  <v-btn
                    color="#73D843"
                    dark
                    large
                    class="mr-3 mb-2 black--text hero-btn-primary"
                  >
                    Go to Admin Dashboard
                  </v-btn>
                </nuxt-link>

                <nuxt-link to="/client-dashboard">
                  <v-btn outlined large class="mb-2 hero-btn-outline">
                    Client Dashboard
                  </v-btn>
                </nuxt-link>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="hero-card pa-6" outlined>
              <div class="mock-header mb-4">
                <div class="mock-dot"></div>
                <div class="mock-dot"></div>
                <div class="mock-dot"></div>
              </div>

              <div class="mock-metrics">
                <div class="mock-metric">
                  <span>Total Impressions</span>
                  <strong>1,250,000</strong>
                </div>
                <div class="mock-metric">
                  <span>Total Scans</span>
                  <strong>12,840</strong>
                </div>
                <div class="mock-metric">
                  <span>Conversion Rate</span>
                  <strong>1.03%</strong>
                </div>
                <div class="mock-metric">
                  <span>Active Campaigns</span>
                  <strong>18</strong>
                </div>
              </div>

              <div class="mock-chart mt-6"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Value -->
    <section class="section-block text-center">
      <v-container>
        <div class="section-head text-center">
          <h2>What the Platform Delivers</h2>
          <p>
            Built to deliver stronger campaign accountability, better machine
            oversight, clearer audience reporting, and real performance
            visibility for both operators and clients.
          </p>
        </div>

        <v-row>
          <v-col cols="12" md="4">
            <v-card outlined class="feature-card pa-5">
              <h3>Verified Campaign Delivery</h3>
              <p>
                Ensure campaigns are active on the right machines, within the
                right time windows, with measurable delivery through
                impressions, proof of play, and tracking.
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card outlined class="feature-card pa-5">
              <h3>Clear Operational Visibility</h3>
              <p>
                Get a live view of machines, locations, assignments, and
                performance so teams can quickly understand what is running,
                where it is running, and how it is performing.
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card outlined class="feature-card pa-5">
              <h3>Actionable Performance Insights</h3>
              <p>
                Turn delivery data into useful reporting through scans, device
                breakdown, top-performing machines, daily trends, and campaign
                conversion visibility.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Modules -->
    <!-- <section class="section-block alt-section">
      <v-container>
        <div class="section-head text-center">
          <h2>Key Delivery Areas</h2>
        </div>

        <v-row>
        
          <v-col cols="12" sm="6" md="4">
            <v-card outlined class="module-card pa-4 text-center">
              <h4>Client Visibility</h4>
              <p>Give clients direct access to performance, top machines, scans, and delivery metrics.</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card outlined class="module-card pa-4 text-center">
              <h4>Campaign Accountability</h4>
              <p>Track what was delivered, where it ran, and how each campaign performed over time.</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-card outlined class="module-card pa-4 text-center">
              <h4>Growth Intelligence</h4>
              <p>Use delivery data and performance trends to improve planning, targeting, and reporting.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section> -->

    <!-- CTA -->
    <section class="section-block cta-section">
      <v-container>
        <v-card class="cta-card pa-8 text-center" outlined>
          <h2 class="mb-3">Ready to deliver more value from every screen?</h2>
          <p class="mb-6">
            Access campaign delivery, machine visibility, and performance
            insights from one platform built for measurable results.
          </p>

          <nuxt-link to="/admin/dashboard">
            <v-btn
              color="#73D843"
              dark
              large
              class="mr-3 mb-2 black--text hero-btn-primary"
            >
              View Campaigns
            </v-btn>
          </nuxt-link>

          <nuxt-link to="/auth/client.login">
            <v-btn outlined large class="mb-2 hero-btn-outline">
              View Clients
            </v-btn>
          </nuxt-link>
        </v-card>
      </v-container>
    </section>

    <!-- Footer -->
    <footer class="footer-section">
      <v-container class="d-flex justify-space-between align-center flex-wrap">
        <div class="footer-brand">Charge24 Platform</div>
        <div class="footer-copy">
          Built for measurable delivery and campaign visibility
        </div>
      </v-container>
    </footer>
  </v-container>
</template>

<script>
import logo from "~/assets/logo.png";
export default {
  name: "HomePage",
  data() {
    return {
      logo,
    };
  },
};
</script>

<style scoped>
.home-page {
  background: #050505;
  min-height: 100vh;
  color: #ffffff;
}

.hero-section {
  padding: 80px 0 60px;
  background: radial-gradient(
      circle at top right,
      rgba(198, 255, 0, 0.12),
      transparent 28%
    ),
    linear-gradient(135deg, #050505, #0b0b0b 50%, #101010);
}

.hero-content {
  max-width: 620px;
}

.hero-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(198, 255, 0, 0.1);
  border: 1px solid rgba(198, 255, 0, 0.3);
  color: #73d843;
  font-size: 13px;
  margin-bottom: 18px;
}

.hero-title {
  font-size: 48px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 18px;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.7;
  color: #cfcfcf;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.hero-btn-primary {
  font-weight: 700;
}

.hero-btn-outline {
  border-color: #73d843 !important;
  color: #73d843 !important;
}

.hero-card {
  border-radius: 20px;
  background: linear-gradient(180deg, #111111, #0a0a0a);
  border: 1px solid rgba(198, 255, 0, 0.18) !important;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
}

.mock-header {
  display: flex;
  gap: 8px;
}

.mock-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3a3a3a;
}

.mock-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.mock-metric {
  border: 1px solid rgba(198, 255, 0, 0.14);
  border-radius: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
}

.mock-metric span {
  display: block;
  font-size: 13px;
  color: #b5b5b5;
  margin-bottom: 8px;
}

.mock-metric strong {
  font-size: 22px;
  color: #73d843;
}

.mock-chart {
  height: 180px;
  border-radius: 16px;
  background: linear-gradient(
    180deg,
    rgba(198, 255, 0, 0.22),
    rgba(198, 255, 0, 0.04)
  );
  border: 1px solid rgba(198, 255, 0, 0.14);
}

.section-block {
  padding: 70px 0;
  background: #050505;
}

.alt-section {
  background: #0b0b0b;
}

.section-head {
  max-width: 720px;
  margin: 0 auto 36px;
}

.section-head h2 {
  font-size: 32px;
  margin-bottom: 12px;
  color: #ffffff;
}

.section-head p {
  color: #b8b8b8;
  font-size: 16px;
  line-height: 1.7;
}

.feature-card,
.module-card,
.cta-card {
  border-radius: 18px;
  height: 100%;
  background: linear-gradient(180deg, #111111, #090909) !important;
  border: 1px solid rgba(198, 255, 0, 0.12) !important;
  color: #ffffff;
}

.feature-card h3,
.module-card h4 {
  margin-bottom: 12px;
  color: #73d843;
}

.feature-card p,
.module-card p,
.cta-card p {
  color: #c5c5c5;
  line-height: 1.7;
  margin-bottom: 0;
}

.cta-section {
  padding-top: 20px;
  padding-bottom: 80px;
}

.footer-section {
  padding: 20px 0;
  border-top: 1px solid rgba(198, 255, 0, 0.12);
  background: #050505;
}

.footer-brand {
  font-weight: 700;
  color: #73d843;
}

.footer-copy {
  color: #9f9f9f;
  font-size: 14px;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 36px;
  }

  .mock-metrics {
    grid-template-columns: 1fr;
  }
}
</style>