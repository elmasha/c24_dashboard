<template>
<div class="container" style="background-color: #1A1B2B;margin: 10px;">
     <v-app-bar height="90" elevation="0" color="black" dark :clipped-left="clipped" fixed app rounded>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <nuxt-link to="/" style="text-decoration: none;color: aqua;">
            <v-toolbar-title>YayaLink </v-toolbar-title>
        </nuxt-link>
        <v-spacer />

      

      
    </v-app-bar>
    <v-row>

        <v-col cols="12" md="6" style="border-radius: 12px;background-color: aliceblue; margin: 0px; padding: 10px;">
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
                    Create Employer Account
                </v-tab>
            </v-tabs>

            <v-card v-show="registerAuth">
                <v-card-subtitle>Create an employer account</v-card-subtitle>
                <div class="container" style="margin: 10px;">
                    <form @submit.prevent="register">
                        <v-text-field v-model="form.name" placeholder="Name" outlined rounded />
                        <v-text-field v-model="form.phone_no" type="number" placeholder="Phone" outlined rounded />
                        <v-text-field v-model="form.street_name" placeholder="Street Name" outlined rounded />
                        <v-text-field v-model="form.city" placeholder="City" outlined rounded />
                        <v-text-field v-model="form.county" placeholder="County" outlined rounded />
                        <v-text-field v-model="auth.email" type="email" required placeholder="Email" outlined rounded />
                        <v-text-field v-model="auth.password" type="password" required placeholder="Password" outlined rounded />
                        <v-text-field v-model="password_matcher" type="password" required placeholder="ReEnter Password" outlined rounded />
                        <v-btn @click="signUp" color="black" style="color: aqua;">Create Account</v-btn>
                    </form>
                    <div class="container">
                        <p>I already have an account <b @click="loginAuth = true,registerAuth = false">Login </b> </p>
                    </div>
                </div>

            </v-card>

            <v-card v-show="loginAuth">
                <v-card-subtitle>
                    <h1>Welcome back</h1>,<br>
                    login back to your account
                </v-card-subtitle>
                <div class="container">
                    <form>
                        <v-text-field v-model="auth.email" type="email" required placeholder="Email" outlined rounded />
                        <v-text-field v-model="auth.password" type="password" required placeholder="Password" outlined rounded />
                        <v-btn @click="checkEmailDB" color="black" style="color: aqua;">Login</v-btn>
                    </form>
                    <div class="container">
                        <p>I dont have an account <b @click="loginAuth = false,registerAuth = true">Create account</b> </p>
                    </div>
                </div>

            </v-card>

        </v-col>
        <v-col col cols="12" md="6">
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
import bu from "@/assets/emp.png";

export default {
    data() {
        return {
            bu,
            snackbar: false,
            snackbarText: "No error message",
            snackbar2: false,
            showLogin: false,
            snackbarText2: "",
            registerAuth: false,
            loginAuth: true,
            password_matcher: null,
            form: {
                name: null,
                phone_no: null,
                city: null,
                email: null,
                county: null,
                user_id: null,
                street_name: null,
            },
            auth: {
                email: null,
                password: null
            },
            auth_state: false,
            uid: "",
        };
    },
    methods: {
        async checkEmailDB() {
            
            try {
                const res = await axios.post(`https://yayalinkserver-production-4990.up.railway.app/api/auth/auth/check-email`, {
                    email: this.auth.email,
                });
                
                if (res.data.exists === true) {
                    this.loginWithEmailPass();
                }else{
                    this.snackbar2 = true;
                    this.snackbarText2 = "Account does not exist, please register first";
                }

                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
            }

        },
        signUp() {
            if (this.form.name == null || this.form.phone_no == null || this.form.city == null ||
                this.form.street_name == null || this.form.county == null || this.auth.email == null || this.auth.password == null) {
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
                        this.register(user.user.uid)
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
                    that.$router.push("/selection");
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
                    this.form.user_id = user.user.uid;
                    this.register()
                    this.show_auth = true;
                });
        },
        async register(val) {

            await axios.post("https://yayalinkserver-production-4990.up.railway.app/api/employers/register", {
                uid: val,
                name: this.form.name,
                phone_no: this.form.phone_no,
                city: this.form.city,
                county: this.form.county,
                email: this.auth.email,
                street_name: this.form.street_name,
                user_image: "https://avatar.iran.liara.run/public/19"
            });

            this.$router.push("/selection");
        }
    }

};
</script>
