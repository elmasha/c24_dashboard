<!-- Please remove this file from your project -->
<template>
<div style="background: linear-gradient(to left, #05F3DF,#1A1B2B); ">

    <v-card rounded elevation="10" class="" style=" margin:0px;">
        <div class="container">
            <div class="d-flex" style="margin: 0px;">
                <v-btn style="color: black;" to="/selection" icon rounded color="black">
                    <v-icon right>mdi-arrow-left</v-icon>

                </v-btn>
                <h5 style="margin-top: 10px;margin-left: 8px; color: black; font-weight: 900;" class="white--text text--darken-1">Candidate Information</h5>
            </div>

        </div>
        <V-row>
            <v-col cols="12" md="6">

                <div class="container text-center">

                    <div class="container">
                        <div class="d-flex flex-column align-center">
                            <v-space></v-space>
                            <div>
                                <v-avatar color="primary" size="46" style="color: aliceblue;">{{ int_value }}</v-avatar>
                            </div>
                            <v-space></v-space>
                            <div class="d-flex">
                                <h3>{{ candidate.candidate_name  }}</h3>
                                <p></p>
                            </div>
                            <v-space></v-space>
                        </div>

                        <p>{{ candidate.gender +" . "}}{{ candidate.age }} Yrs</p>
                        <p>{{ candidate.county }}</p>

                        <v-card-actions>
                            <v-chip>{{ numeral(candidate.salary).format('0,0')  }} per {{ candidate.salary_period }}</v-chip>
                            <v-spacer></v-spacer>
                            <p>Status <b style="color:green;margin-top: 12px;">{{ candidate.working_status }}</b></p>
                        </v-card-actions>
                    </div>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <v-divider></v-divider>
                <div class="container">

                    <v-alert border="top" colored-border type="info" elevation="2" color="orange">
                        <p>1. Click on Call 'agent/bureau' to discuss the candidate and interview him/her directly</p>
                        <p>
                            2. Once agreed click on 'confirm deal'. Otherwise if not agreed, click on 'Change preference'.</p>
                        <p>After 3 days, you will need to make another payment to access more candidates.</p>
                        <p>
                            NB: Clicking on 'Confirm Deal' is what will remove your choice from the list of available candidates, so that other people do not select him/her.
                            Your payment shall remain valid for 3 days.
                        </p>
                    </v-alert>

                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="container" style="border-radius: 12px;background-color: aliceblue; margin: 9px; padding: 12px;">
                    <div class="container">

                        <p><b>Bureuau Details</b></p>
                        <h4> {{ candidate.bureau_name }}</h4>
                        <div class="d-flex">
                            <v-rating v-model="rating" background-color="white" color="yellow accent-4" dense half-increments hover size="12"></v-rating>
                            <span class="black--text text--lighten-2 text-caption mr-2">
                                ({{ rating }})
                            </span>
                        </div>

                        <v-card-actions class="pa-4">

                        </v-card-actions>
                        <p>Contact Person: <b>{{ candidate.bureau_no }}</b></p>
                        <v-card-actions>
                            <v-btn outlined @click="CheckGoalProgress(candidate.candidate_id)" rounded small color="primary">
                                Call Agent/Bureau
                                <v-icon right>mdi-phone</v-icon>
                            </v-btn>

                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </div>
                </div>
                <v-alert v-if="message" class="mt-4" type="error" dense outlined :timeout="4000">
                    {{ message }}
                </v-alert>
                <v-card-actions class="container">
                    <v-spacer></v-spacer>
                    <v-btn @click="ConfimeDeal" style="color: aqua;" rounded width="50%" color="black">
                        {{" "}}Confirm Deal

                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-col>

            <v-col cols="12" md="12">

            </v-col>
            <v-col cols="12" md="6"></v-col>
            <v-col cols="12" md="6"></v-col>
        </V-row>

    </v-card>
    <v-snackbar color="white--text" :timeout="4000" v-model="snackbar" center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="red" :timeout="4000" v-model="snackbar2" outlined bottom center>
        {{ snackbarText2 }}
    </v-snackbar>
</div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";
export default {
    mounted() {
        this.checkUser();
        this.fetchCandidates();
    },
    data() {
        return {
            message: null,
            snackbar: false,
            snackbarText: "No error message",
            snackbar2: false,
            showLogin: false,
            snackbarText2: "",
            rating: 4.5,
            user,
            numeral,
            candidate: [],
            loading: false,
            uid: null,
            int_value: null,
        }
    },
    methods: {
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.uid = this.$fire.auth.currentUser.uid;
                console.log("UID =>", this.uid);
            } else {
                this.auth_state = false;
            }
        },
        async ConfimeDeal() {
            this.loading = true;
            try {
                const res = await axios.post(`https://yayalinkserver-production-4990.up.railway.app/api/employer-access/select`, {
                    employer_uid: this.uid,
                    candidate_id: this.$route.params.id,
                });
                if (res.status == 200) {
                    this.snackbar = true;
                    this.snackbarText = res.data.message;
                    this.message = res.data.message;
                }
                this.message = res.data.message;
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async Send_sms() {
            this.loading = true;
            try {
                const res = await axios.post(` https://quicksms.advantasms.com/api/services/sendsms/`, {
                    apikey: process.env.SmsAPIKey,
                    partnerID: process.env.PartnerID,
                    message: "this is a test message",
                    shortcode: process.env.ShortCode,
                    mobile: "254796124865"
                });
                if (res.status == 200) {
                    this.$router.push("/employer");
                }
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async fetchCandidates() {

            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/candidates/get-candidate/${this.$route.params.id}`, {});
                this.candidate = res.data;
                this.int_value = res.data.candidate_name.substring(0, 2);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
    }

}
</script>
