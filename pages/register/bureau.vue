<template>
<div class="container">
    <v-app-bar height="90" elevation="0" color="black" dark :clipped-left="clipped" fixed app rounded>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <nuxt-link to="/" style="text-decoration: none;color: aqua;">
            <v-toolbar-title>YayaLink </v-toolbar-title>
        </nuxt-link>
        <v-spacer />

    </v-app-bar>
    <v-row>

        <v-col cols="12" md="6" sm="6" class="" style="border-radius: 12px;background-color: aliceblue; margin: 0px; padding: 10px;">
            <div class="container">
                <v-col cols="12" class="">
                    <nuxt-link to="/" style="text-decoration: none;">
                        <v-btn icon>
                            <v-icon color="black">mdi-arrow-left</v-icon>
                        </v-btn>
                    </nuxt-link>
                </v-col>
            </div>
            <v-tabs color="black">
                <v-tab @click="registerAuth = false, loginAuth = true">
                    LogIn
                </v-tab>
                <v-tab @click="registerAuth = true, loginAuth = false">
                    Create Bureau Account
                </v-tab>
            </v-tabs>
            <v-card v-show="loginAuth">
                <v-card-subtitle style="margin: 10px;">
                    <h2>Welcome back</h2><br>
                    login back to your account
                </v-card-subtitle>
                <div class="container">
                    <form @submit.prevent="registerBureau">

                        <v-text-field v-model="auth.email" type="email" placeholder="Email" outlined rounded />
                        <v-text-field v-model="auth.password" type="password" placeholder="Password" outlined rounded />

                        <v-btn color="black" style="color: aqua;" @click="checkEmailDB">Login</v-btn>
                    </form>
                    <div class="container">
                        <p>I dont have an account <b @click="loginAuth = false,registerAuth = true">Create account</b> </p>
                    </div>
                </div>
            </v-card>
            <v-card v-show="registerAuth">
                <v-card-subtitle>Create an bureau account</v-card-subtitle>
                <div class="container">
                    <form @submit.prevent="registerBureau">
                        <v-text-field v-model="form.bureau_name" placeholder="Bureau Name" outlined rounded />
                        <v-text-field v-model="form.name" placeholder="Owner Name" outlined rounded />
                        <v-text-field v-model="form.phone_no" placeholder="Phone" outlined rounded />
                        <v-autocomplete v-model="form.county" :loading="loading" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details label="Provide county" solo></v-autocomplete>
                        <v-text-field v-model="form.street_name" placeholder="Street name" outlined rounded />
                        <v-text-field v-model="form.city" placeholder="City" outlined rounded />
                        <v-text-field v-model="form.box_no" placeholder="Box No" outlined rounded />
                        <v-text-field v-model="form.building" placeholder="Building" outlined rounded />
                        <v-text-field v-model="form.postal_code" placeholder="Postal Code" outlined rounded />
                        <v-text-field v-model="form.id_no" placeholder="ID Number" outlined rounded />
                        <v-text-field v-model="auth.email" type="email" placeholder="Email" outlined rounded />
                        <v-text-field v-model="auth.password" type="password" placeholder="Password" outlined rounded />
                        <v-text-field v-model="password_matcher" type="password" placeholder="ReEnter Password" outlined rounded />
                        <v-btn color="black" style="color: aqua;" @click="signUp">Create account Bureau</v-btn>
                    </form>
                    <div class="container">
                        <p>I already have an account <b @click="loginAuth = true,registerAuth = false">Login </b> </p>
                    </div>
                </div>
            </v-card>

        </v-col>
        <v-col cols="12" md="6" sm="6" class="">
            <v-img :src="bu" contain height="400" style="margin: 120px;"></v-img>

        </v-col>

    </v-row>
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
import bu from "@/assets/bu1.png";
import emp from "@/assets/emp.png";
import can from "@/assets/can.png";
import auth from "../../middleware/auth";

export default {
    data() {
        return {
            snackbar: false,
            snackbarText: "No error message",
            snackbar2: false,
            showLogin: false,
            snackbarText2: "",
            loginAuth: true,
            registerAuth: false,
            auth: {
                email: null,
                password: null,
            },
            password_matcher: null,
            bu,
            loading: false,
            items: [],
            search: null,
            counties: [],
            form: {
                bureau_name: null,
                name: null,
                phone_no: null,
                city: null,
                access_expires_at: null,
                id_no: null,
                box_no: null,
                building: null,
                street_name: null,
                county: null,
                postal_code: null,
                bureau_image: "https://avatar.iran.liara.run/public/28",
                device_token: "wqieywuq0e8-wewqee21342134"
            },
            uid: null,
        };
    },

    methods: {
        checkEmail() {
            let that = this;
            const mAuth = this.$fire.auth;
            mAuth
                .fetchSignInMethodsForEmail(this.auth.email)
                .then(function (signInMethods) {
                    if (signInMethods.length === 0) {
                        that.snackbar2 = true;
                        that.snackbarText2 = "Email not registered";
                    } else {
                        that.loginWithEmailPass();
                    }
                })
                .catch(function (error) {
                    console.error(error.message);
                });
        },
        async checkEmailDB() {

            try {
                const res = await axios.post(`https://yayalinkserver-production-4990.up.railway.app/api/auth/auth/check-email`, {
                    email: this.auth.email,
                });
                if (res.data.exists === true) {
                    this.loginWithEmailPass();
                } else {
                    this.snackbar2 = true;
                    this.snackbarText2 = "Account does not exist, please register first";
                }
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {}

        },
        signUp() {

            if (this.form.bureau_name == null || this.form.name == null || this.form.city == null ||
                this.form.phone_no == null || this.form.id_no == null ||
                this.form.box_no == null || this.form.building == null || this.form.county == null ||
                this.form.street_name == null || this.form.postal_code == null || this.auth.email == null || this.auth.password == null) {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide input from the required fields";

            } else if (this.password_matcher !== this.auth.password) {
                this.snackbar2 = true;
                this.snackbarText2 = "Password dont not match";

            } else {
                const mAuth = this.$fire.auth;
                // this.progress_bar2 = true;
                // if (this.password === this.registrationPassword) {
                mAuth
                    .createUserWithEmailAndPassword(this.auth.email, this.auth.password)
                    .catch((error) => {
                        console.log(error);
                        this.snackbar2 = true;
                        this.snackbarText2 = error;
                        // this.progress_bar2 = false;
                    })
                    .then((user) => {
                        const start_time = this.$dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss");
                        this.uid = user.user.uid;
                        this.registerBureau(user.user.uid)
                        this.show_auth = true;
                    });
            }
        },
        loginWithEmailPass() {
            let that = this;
            const mAuth = this.$fire.auth;
            mAuth
                .signInWithEmailAndPassword(this.auth.email, this.auth.password)
                .catch(function (error) {
                    // that.snackbarText = error.message;
                    // that.snackbar = true;
                    console.error(error.message)
                })
                .then((user) => {
                    //we are signed in
                    that.$router.push("/bureau");
                });
        },
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.uid = this.$fire.auth.currentUser.uid;
            } else {
                this.auth_state = false;
            }
        },
        loginAnonymously1() {
            this.$fire.auth
                .signInAnonymously()
                .catch(function (error) {
                    this.snackbarText = error.message;
                    this.snackbar = true;
                    this.showLogin = false;
                })
                .then((user) => {
                    //we are signed in
                    const start_time = this.$dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss");
                    this.uid = user.user.uid;
                    this.registerBureau()
                });
        },
        async registerBureau(val) {

            await axios.post("https://yayalinkserver-production-4990.up.railway.app/api/bureaus/register", {
                user_id: val,
                bureau_name: this.form.bureau_name,
                name: this.form.name,
                phone_no: this.form.phone_no,
                city: this.form.city,
                box_no: this.form.box_no,
                building: this.form.building,
                postal_code: this.form.postal_code,
                id_no: this.form.id_no,
                street_name: this.form.street_name,
                county: this.form.county,
                email: this.auth.email,
                bureau_image: "https://avatar.iran.liara.run/public/19"
            });

            this.$router.push("/bureau");
        },

    },
    async mounted() {
        this.checkUser();
        let response = await axios.get("https://yayalinkserver-production-4990.up.railway.app/api/counties/get-counties");
        this.counties = response.data;
        console.log(this.counties)
    },

};
</script>
