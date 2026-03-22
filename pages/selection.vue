<template>
<v-app style="background-color: #1A1B2B;">
    <v-app-bar height="90" elevation="0" color="black" dark :clipped-left="clipped" fixed app rounded>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <nuxt-link to="/" style="text-decoration: none;color: aqua;">
            <v-toolbar-title>YayaLink </v-toolbar-title>
        </nuxt-link>
        <v-spacer />

        <v-btn color="white" icon @click="logout()">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute right color="black" dark>
        <template>
            <div class="container notification-bell" style="color: white;">

                <button @click="open = !open">
                    <div class="d-flex">
                        <span v-if="notification_count">{{ notification_count }}</span>
                        <p v-if="notification_count > 0">
                            🔔Notifications
                        </p>
                        <p v-if="notification_count == 1">
                            🔔Notification
                        </p>
                    </div>
                </button>
                <v-btn icon @click="drawer = !drawer" style="position: absolute; top: 10px; right: 10px;">
                    <v-icon color="white">mdi-close</v-icon>
                </v-btn>

                <div class="dropdown">
                    <div v-for="(n, i) in notifications" :key="i" class="notification">
                        <strong style="font-size: 0.8rem;">{{ n.title }}</strong>
                        <p style="font-size: 0.6rem;">{{ n.message }}</p>
                        <p class="time" style="font-size: 0.5rem;">
                            <b> {{ $dayjs(n.created_at).fromNow() }}</b>
                        </p>
                    </div>
                </div>
            </div>
        </template>

    </v-navigation-drawer>

    <div class="container">

        <div class="d-flex">
            <nuxt-link v-show="showProfile" to="/employer">
                <div class="d-flex">
                    <v-avatar color="primary" size="40" style="color: aliceblue;margin-left: 20px;">{{int_value}}</v-avatar>
                    <h6 style="color: white;margin-top: 10px;margin-left: 10px;">{{ employer.name }}</h6>
                </div>
            </nuxt-link>

            <v-spacer />
            <v-btn icon @click="drawer = !drawer">
                <v-icon color="white">mdi-bell</v-icon>
            </v-btn>
        </div>

        <v-divider></v-divider>
        <div class="container" style="margin-top: 0px; color: aliceblue; font-weight: 1200;">

            <h2>Find a househelp</h2>
            <p>Here is some information to help you narrow down your preference.</p>
        </div>
        <!-- FILTER FORM -->
        <v-card color="white" style="border-radius: 12px;" width="100%">
            <div class="container">

                <v-row>
                    <v-col cols="12">
                        <v-row class="">

                            <v-col cols="12" md="6" class="">
                                <div style="padding: 0px;" class="">
                                    <v-autocomplete v-model="filters.county" clearable filled rounded dense :loading="loading" @change="fetchCandidates" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details placeholder="Search county...   "></v-autocomplete>

                                    <v-btn large elevation="0" @click="show = !show" style="border-radius: 12px;background-color: aliceblue; margin-left: 12px; padding-bottom: 0px; margin-top: 10px;">
                                        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-tune' }}</v-icon>
                                        <p style="margin-top: 15px; font-size: 0.9rem; font-weight: 900;margin-right: 10px;">Filters</p>
                                    </v-btn>
                                </div>

                                <v-expand-transition>
                                    <v-row v-show="show" style="border-radius: 12px;background-color: floralwhite; margin-top: 10px; padding: 10px;width: 100%;">
                                        <v-col v-show="true" cols="12" md="6" class="">

                                            <!-- <v-text-field v-model="filters.ward" filled rounded dense placeholder="Ward" clearable /> -->
                                            <div>
                                                <v-select style="width: 100%;" v-model="filters.gender" filled rounded dense :items="items_gender" label="Gender" required clearable />

                                            </div>
                                        </v-col>

                                        <v-col cols="12" md="6" class="">
                                            <div>
                                                <b class="d-flex">
                                                    <p>{{ numeral(filters.min_age||18).format('0,0') +" - "+ numeral(filters.max_age||40).format('0,0') }}</p>
                                                </b>
                                            </div>
                                            <div>
                                                <v-slider v-model="filters.min_age" min="18" step="1" max="40" label="Min Age" thumb-label></v-slider>
                                            </div>
                                            <div>
                                                <v-slider v-model="filters.max_age" min="18" step="1" max="40" label="Max Age" thumb-label></v-slider>
                                            </div>

                                        </v-col>

                                        <v-col cols="12" md="9" class="">
                                            <div class="d-flex">
                                                <div style="margin: 8px;">
                                                    <v-text-field type="number" filled rounded dense v-model="filters.min_experience" placeholder="Min Experience" clearable />

                                                </div>
                                                <div style="margin: 8px;">
                                                    <v-text-field type="number" filled rounded dense v-model="filters.max_experience" placeholder="Max Experience" clearable />

                                                </div>
                                                <!-- <v-slider v-model="filters.min_salary" min="0" step="1000" max="50000" label="Min Salary" thumb-label></v-slider> -->

                                            </div>
                                            <div class="d-flex">
                                                <div style="margin: 8px;">
                                                    <v-text-field type="number" filled rounded dense v-model="filters.min_salary" placeholder="Min Salary" clearable />

                                                </div>
                                                <div style="margin: 8px;">
                                                    <v-text-field type="number" filled rounded dense v-model="filters.max_salary" placeholder="Max Salary" clearable />

                                                </div>

                                                <!-- <v-slider v-model="filters.min_salary" min="0" step="1000" max="50000" label="Min Salary" thumb-label></v-slider> -->

                                            </div>

                                        </v-col>

                                        <div>
                                            <v-card-actions>
                                                <!-- <v-spacer></v-spacer> -->

                                                <v-btn rounded color="black" style="color: aqua;" @click="fetchCandidates">
                                                    <v-icon>mdi-filter-outline</v-icon> Apply filter
                                                </v-btn>
                                                <v-btn text @click="resetFilters">Reset</v-btn>
                                                <v-spacer></v-spacer>

                                            </v-card-actions>
                                        </div>
                                    </v-row>

                                </v-expand-transition>

                            </v-col>

                        </v-row>
                    </v-col>

                </v-row>

            </div>

            <div class="" style="border-radius: 12px;background-color: aliceblue; margin: 10px; padding: 10px;">
                <!-- RESULTS -->
                <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="loading">Loading...</div>

                <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="candidates.length === 0 && !loading">
                    No candidates found
                </div>
                <div class="" v-if="candidates.length > 0 && !loading">
                    <p>Select a candidate</p>
                </div>
                <div class="grid">
                    <div v-for="candidate in candidates" :key="candidate.id">

                        <v-card style="border-radius: 12px;">
                            <div class="container">
                                <div class="d-flex">
                                    <v-avatar size="40" color="black">
                                        <img :src="user" width="60" contain height="60" />
                                    </v-avatar>

                                    <v-spacer />
                                    <v-chip outlined>{{ candidate.working_status }}</v-chip>
                                </div>
                                <div style="padding: 0px;">

                                    <div class="d-flex">
                                        <h3>{{ candidate.candidate_name }}</h3>
                                        <v-icon style="margin-left: 3px;margin-top: 4px;" small color="blue">mdi-check-decagram</v-icon>
                                    </div>

                                    <div class="d-flex">
                                        <!-- <v-icon >mdi-gender-male-female</v-icon> -->
                                        <p>{{ candidate.gender +" . " }} {{ candidate.age }} Yrs </p>
                                    </div>

                                    <v-chip-group>
                                        <v-chip>{{ candidate.county }}</v-chip>
                                        <v-chip> <b style="margin-right: 2px;"> {{ candidate.experience }} yrs </b> {{ "Experience" }} </v-chip>
                                    </v-chip-group>

                                </div>
                                <p></p>

                            </div>
                            <v-card-actions style="border-radius: 12px;background-color: aliceblue; margin: 9px; padding: 12px;">
                                <!-- <p>Status <br> <b style="color:green">{{ candidate.working_status }}</b></p> -->
                                <h4 style="font-size: 1rem; color:#1A1B2B;">Ksh{{ numeral(candidate.salary).format('0,0')  }} <br>
                                    <p style="font-size: 0.9rem;font-weight:200;color: #1A1B2B;">{{ candidate.salary_period }}</p>
                                </h4>
                                <v-spacer></v-spacer>
                                <v-btn @click="CheckProgress(candidate.candidate_id)" rounded small color="black" style="color: white;">
                                    View Profile
                                    <v-icon right>mdi-account-arrow-right-outline</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>

                    </div>
                </div>
            </div>

        </v-card>

    </div>

    <v-dialog v-model="dialog" width="500">

        <v-card>
            <v-card-title class="headline">Selection payment</v-card-title>
            <v-card-subtitle>Selection will three day</v-card-subtitle>
            <div class="container">
                <div class="row">
                    <div @click="plan_days = 3,amaount = 150" style="padding: 0.8rem;border-radius: 1rem;background-color: aliceblue;color: black;">
                        <v-btn> 3 Days plan</v-btn>
                    </div>
                    <div @click="plan_days = 7,amaount = 300" style="padding: 0.8rem;border-radius: 1rem;background-color: aliceblue;color: black;">
                        <v-btn> 7 Days plan</v-btn>
                    </div>
                    <div @click="plan_days = 30,amaount = 900" style="padding: 0.8rem;border-radius: 1rem;background-color: aliceblue;color: black;">
                        <v-btn> 30 Days plan</v-btn>
                    </div>

                </div>
            </div>

            <br>
            <br>
            <v-card-text>
                <label for="phoneNumber">Provide you mpesa number</label>

                <v-text-field outlined v-model="phoneNumber" :prefix="phonePrefix" placeholder="(7.. format)" dense></v-text-field>
                <label for="voteCount">You will pay a selection fee of <b>{{ amaount }}</b> ksh for a period of <b>{{ plan_days }}</b> days . </label>
                <span></span>
                <br>
                <br>
                <div class="d-flex">
                    <p style="font-size: 0.9rem;">Total amount to be paid. <h4>{{ numeral(amaount).format("0,0") }} ksh</h4>
                    </p>
                </div>

                <div class="d-flex" style="padding: 0.8rem;border-radius: 1rem;background-color: aliceblue;color: black;">
                    <p style="font-size: 0.9rem;"> An STK push will prompted on the <b>{{ phonePrefix+phoneNumber }}</b> check for an mpesa prompting you to pay <b>{{ numeral(amaount).format("0,0") }}</b> ksh</p>
                </div>
                <v-progress-linear v-show="progress_bar" indeterminate color="black"></v-progress-linear>
                <!-- Message -->
                <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                    {{ message }}
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-btn color="black" @click="processPayment" style="color: white;">Make payment</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Cancel</v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar color="white--text" :timeout="4000" v-model="snackbar" center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="red" :timeout="4000" v-model="snackbarError" outlined bottom center>
        {{ snackbarError }}
    </v-snackbar>
    <v-snackbar color="primary accent-8" :timeout="6000" v-model="snackbar_s" centered bottom>
        {{ snackbarText_s }}
    </v-snackbar>

</v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";

export default {
    data() {
        return {
            notification_count: 0,
            notifications: [],
            drawer: false,
            open: false,
            show: false,
            user,
            CheckoutRequestID: "",
            snackbar_s: false,
            snackbarText_s: "",
            dialog: false,
            snackbar: false,
            snackbarText: "No error message",
            snackbarError: false,
            showLogin: false,
            snackbarTextError: "",
            message: null,
            paymentDialog: false,
            paymentConfirmDialog: false,
            phoneNumber: "",
            phonePrefix: "254",
            numeral,
            amount: 1,
            progress_bar: false,
            items_gender: ['Female', 'Male'],
            loading: false,
            items: [],
            search: null,
            counties: [],
            filters: {
                gender: "",
                county: "",
                ward: "",
                min_age: "",
                max_age: "",
                min_salary: "",
                max_salary: "",
                min_experience: "",
                max_experience: "",
                working_status: ""
            },
            uid: "",
            candidates: [],
            loading: false,
            auth_state: false,
            amaount: 0,
            timerEnabled: false,
            timerCount: 25,
            employer: false,
            int_value: "",
            showProfile: false,
            plan_days: 3,

        };
    },
    watch: {

        timerEnabled(value) {
            if (value) {
                setTimeout(() => {
                    this.timerCount--;
                }, 1000);
            }
        },
        timerCount: {
            handler(value) {
                if (value > 0 && this.timerEnabled) {
                    setTimeout(() => {
                        this.timerCount--;
                    }, 1000);
                } else if (value == 0) {
                    this.StkQuery();
                    this.timerCount = 25;
                }
            },
            immediate: true, // This ensures the watcher is triggered upon creation
        },
    },
    methods: {
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
        },
        async fetchNotification() {
            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/notifications/get-notifications/${this.uid}`, {
                    params: this.filters
                });
                this.notifications = res.data;
                this.notification_count = res.data.length;
                console.log("notification", res.data);
            } catch (err) {
                console.error(err);
                // alert("Failed to load candidates");
            } finally {
                this.loading = false;
            }

        },
        async fetchEmployer() {

            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/employers/get-employer/${this.uid}`, {});
                this.employer = res.data;
                this.int_value = this.employer.name.substring(0, 3).toUpperCase();
                console.log(this.employer);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.showProfile = true;
                this.uid = this.$fire.auth.currentUser.uid;

                console.log("UID =>", this.uid);
            } else {
                this.showProfile = false;
                this.auth_state = false;
            }
        },
        async CheckPaymentStatus() {

            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/employer-access/payment-status/${this.uid}`);
                console.log("Payment status", res.data);
                if (res.data.allowed == false) {

                    // proceed
                    // alert("Payment required to view candidate profiles.");
                    // this.dialog = true;
                } else {
                    // this.$router.push(`/candidate_info/${val}`);
                }
            } catch (err) {

                console.error("Unexpected error", err);

            }
        },
        async CheckProgress(val) {

            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/employer-access/${this.uid}`);
                console.log(res.data);
                if (res.data.allowed == false) {

                    // proceed
                    // alert("Payment required to view candidate profiles.");
                    this.dialog = true;
                } else {
                    this.$router.push(`/candidate_info/${val}`);
                }
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    const reason = err.response.data.reason;

                    if (reason === "PAYMENT_REQUIRED") {
                        //this.$router.push("/payment");

                        alert("Payment required to view candidate profiles.");
                    }

                    if (reason === "GRACE_PERIOD_EXPIRED") {
                        alert("Your grace period has expired. Please contact support.");
                        console.log(reason);
                    }
                } else {
                    console.error("Unexpected error", err);
                }
            }
        },
        async fetchCandidates() {

            this.loading = true;
            try {
                const res = await axios.get("https://yayalinkserver-production-4990.up.railway.app/api/candidates/filter", {
                    params: this.filters
                });
                this.candidates = res.data;
                console.log(res.data);
            } catch (err) {
                console.error(err);
                // alert("Failed to load candidates");
            } finally {
                this.loading = false;
            }

        },

        async submitCandidate() {
            try {
                await axios.post("https://yayalinkserver-production-4990.up.railway.app/api/candidates/register", this.form);
                alert("Candidate added successfully");
                this.$router.push("/candidates");
            } catch (err) {
                alert(err.response);
            }
        },

        resetFilters() {
            this.filters = {
                gender: "",
                county: "",
                ward: "",
                min_age: "",
                max_age: "",
                min_salary: "",
                max_salary: "",
                min_experience: "",
                max_experience: "",
                working_status: ""
            };
            this.fetchCandidates();
        },
        StkQuery() {
            let that = this;
            that.snackbar_s = true;
            that.snackbarText_s = "Checking payment status...";
            that.step = 5;
            axios
                .post("https://yayalinkserver-production-4990.up.railway.app/api/payments/stk/query", {
                    checkoutRequestId: that.CheckoutRequestID,
                })
                .then(function (response) {
                    console.log("StkPush Query", response.data);
                    if (response.status == 200) {
                        this.$router.push(`/candidate_info/${val}`);
                        that.progress_bar = false;
                        that.snackbar = true;
                        that.snackbarText = response.data.ResultDesc;
                        if (response.data.ResultCode == "0") {
                            that.dialog = true;
                        }
                        that.timerCount = 25;
                        that.timerEnabled = false;

                    }
                })
                .catch(function (error) {
                    that.snackbarError = true;
                    that.snackbarTextError = error;
                    that.timerCount = 25;
                    that.timerEnabled = false;
                    that.show6 = false;
                    that.progress_bar = false;
                });
        },
        async processPayment() {
            let that = this;
            if (that.phoneNumber == null) {
                that.snackbarTextError = "Provide phone..";
                that.snackbarError = true;
            } else {
                let phone = that.phonePrefix + that.phoneNumber;
                if (phone.length != 12) {
                    that.snackbarTextError = "Phone number should be 12 digits including country code";
                    that.snackbarError = true;
                    return;
                }
                axios
                    .post("https://yayalinkserver-production-4990.up.railway.app/api/payments/stk", {
                        phone: phone,
                        amount: "1",
                        user_id: that.uid,
                        plan_days: that.plan_days,
                        User_name: "Employer Test",
                    })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            that.CheckoutRequestID = response.data.CheckoutRequestID;
                            that.snackbar = true;
                            that.message = "Payment initiated. Enter Mpesa PIN to confirm.";
                            that.progress_bar = true;
                            that.snackbarText = response.data;
                            that.timerEnabled = true;
                        } else if (response.status == 400) {
                            that.snackbarError = true;
                            that.snackbarTextError = response.data;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        that.snackbarTextError = error;
                        that.snackbarError = true;
                        that.progress_bar = false;
                    });
            }
            Error;
        },

        viewProfile(id) {

        }
    },
    async mounted() {
        this.checkUser();
        this.resetFilters();
        this.fetchCandidates();
        this.CheckPaymentStatus();
        this.fetchEmployer();
        let response = await axios.get("https://yayalinkserver-production-4990.up.railway.app/api/counties/get-counties");
        this.counties = response.data;
        console.log(this.counties);
        this.fetchNotification();

    }
};
</script>

<style scoped>
.container {
    padding: 20px;
}

.filters {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.filters v-text-field,
.filters select,
.filters v-btn {
    padding: 10px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 6px;
}

.card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
</style>
