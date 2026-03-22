<template>
<div class="">
    <v-row class="">

        <v-col cols="12" md="12" class="text-center">

            <v-card elevation="0">
                <v-tabs color="black" center-active :show-arrows="true" class="text-center">

                    <v-tab v-show="!auth_state" value="two" @click="(register = true), (login = false)">
                        <span>Createa Candidate Account</span></v-tab>

                </v-tabs>
                <!-- <div class="container">
                    <div class="d-flex">
                        <v-img :src="form.profile_image" contain height="80" />

                    </div>
                </div> -->
                <v-row>
                    <v-col>

                        <div class="container">

                            <div class="row">
                                <form @submit.prevent="submitCandidate">
                                    <p>{{ form.uid }}</p>
                                    <v-text-field v-model="form.candidate_name" placeholder="Full Name" required outlined rounded />
                                    <v-text-field v-model="form.mobile_no" placeholder="Phone" required outlined rounded />
                                    <v-text-field v-model="form.kin_phone_no" placeholder="Next of Kin Phone" outlined rounded />

                                    <v-select v-model="form.gender" :items="items_gender" label="Gender" required outlined rounded />
                                    <v-select v-model="form.salary_period" :items="items_salary_period" label="Salary Period" required outlined rounded />
                                    <v-text-field v-model="form.dob" placeholder="Date of Birth" type="date" outlined rounded @change="calculatedAge" />
                                    <p>Age: {{ form.age }} years</p>
                                    <v-autocomplete style="margin: 6px;" outlined rounded v-model="form.county" :loading="loading" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details label="Provide county" solo></v-autocomplete>

                                    <v-text-field v-model="form.ward" placeholder="Ward" outlined rounded />
                                    <v-text-field v-model="form.village" placeholder="Village" outlined rounded />
                                    <v-text-field disabled v-model="form.bureau_name" placeholder="Bureau Name" outlined rounded />
                                    <v-text-field v-model="form.bureau_no" placeholder="Bureau Number" outlined rounded />
                                    <v-text-field v-model="form.experience" placeholder="Experience" outlined rounded />
                                    <v-text-field v-model="form.salary" placeholder="Salary" type="number" outlined rounded />
                                    <v-btn width="100%" color="black" style="color: aqua;" @click="submitCandidate">Add Candidate</v-btn>
                                </form>

                            </div>

                            <!-- <v-btn color="black--text" @click="loginAnonymously1">Sign Up</v-btn> -->

                        </div>
                    </v-col>

                </v-row>
            </v-card>
        </v-col>

        <v-snackbar color="white--text" :timeout="4000" v-model="snackbar" center>
            {{ snackbarText }}
        </v-snackbar>
        <v-snackbar color="red" :timeout="4000" v-model="snackbar2" outlined center>
            {{ snackbarText2 }}
        </v-snackbar>
    </v-row>
</div>
</template>

<script>
import firebase from "firebase/compat/app";
import axios from "axios";
import can from "@/assets/can.png";

const keyValue = "fd85b4945YF'i"; // your key value (eg: key)
const ivKey = "smslt";

export default {
    data() {
        return {
            items_salary_period: ['Daily', 'Weekly', 'Monthly'],
            form: {
                candidate_id: crypto.randomUUID(),
                user_id: "",
                candidate_name: "Joy kimani",
                age: "",
                gender: "Female",
                dob: "",
                mobile_no: "0723456734",
                kin_phone_no: "073456734",
                next_of_kin: "",
                residence: "",
                village: "Westlands",
                ward: "Westlands",
                county: "Nairobi",
                bureau_name: "",
                bureau_no: "0746291229",
                experience: "5",
                salary: "7000",
                salary_period: "Monthly",
                working_status: "available",
                status: "Available",
                device_token: "",
                profile_image: "",
            },
            can,
            gender: null,
            items_gender: ['Female', 'Male'],
            UID: null,
            progress_bar: false,
            progress_bar2: false,
            snackbar: false,
            snackbarText: "No error message",
            snackbar2: false,
            showLogin: false,
            snackbarText2: "",
            user_uid: null,
            verified: false,
            user_image: "",
            password: "",
            auth: {
                email: "",
                password: "",
            },
            image: null,
            randomNineDigitNumber: null,
            appVerifier: null,
            confirmation_Result: null,
            phone: "",
            county: "",
            progress_bar: false,
            progress_bar2: false,
            loader: null,
            loading: false,
            loading2: false,
            confirmation_Result: null,
            timerCount: 30,
            timerEnabled: false,
            user_id: "",
            uid: this.$fire.auth.currentUser.uid,
            age: null,
            bureau: null,
            counties: [],
            int_value: null,
            loading: false,
            items: [],
            search: null,
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
                    this.code_state = false;
                    this.timerEnabled = false;
                    this.snackbar2 = true;
                    this.snackbarText2 = "Time out";
                }
            },
            immediate: true, // This ensures the watcher is triggered upon creation
        },
    },
    computed: {

    },
    async mounted() {
        this.checkUser();
        this.fetchBureau();
        let response = await axios.get("https://yayalinkserver-production-4990.up.railway.app/api/counties/get-counties");
        this.counties = response.data;
        console.log(this.counties)
    },
    created() {
        this.generateRandomNumber();
    },
    methods: {

        async fetchBureau() {

            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/bureaus/get-bureau/${this.uid}`, {});
                this.bureau = res.data;
                this.form.bureau_name = this.bureau.bureau_name;
                this.form.user_id = this.bureau.user_id;
                this.int_value = this.bureau.bureau_name.substring(0, 3).toUpperCase();
                console.log(this.bureau);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
        calculatedAge() {
            if (!this.form.dob) {
                this.age = null
                return
            }

            const today = new Date()
            const dob = new Date(this.form.dob)

            let age = today.getFullYear() - dob.getFullYear()
            const monthDiff = today.getMonth() - dob.getMonth()

            // If birthday hasn't happened yet this year
            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < dob.getDate())
            ) {
                age--
            }

            this.form.age = age;
            this.age = age
        },
        async submitCandidate() {
            this.form.uid = this.uid;
            console.log(this.form.uid);
            if (this.form.age === "") {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide Date of birth";
            } else if (this.form.age < 18) {
                this.snackbar2 = true;
                this.snackbarText2 = "Age should be 18 and above";
            } else {
                try {
                    await axios.post("https://yayalinkserver-production-4990.up.railway.app/api/candidates/register", this.form);
                    alert("Candidate added successfully");
                    ///this.$router.push("/candidates");
                } catch (err) {
                    alert(err.response);
                }
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
                    this.submitCandidate()
                    this.show_auth = true;
                });
        },
        FetchUserPin() {
            const db = this.$fire.firestore;
            db.collection("Tipp_user")
                .where("user_uid", "==", this.$fire.auth.currentUser.uid)
                .get()
                .then((queryResult) => {
                    queryResult.forEach((doc) => {
                        this.security_key = doc.data().security_key;
                        this.user_name = doc.data().user_name;
                        if (doc.data().pin == null) {
                            this.set_Pin = true;
                            this.login = false;
                            this.register = false;
                            this.auth_state = true;
                            this.security_quiz = false;
                            this.progress_bar = false;
                        } else if (doc.data().security_quiz == false) {
                            this.set_Pin = false;
                            this.login = false;
                            this.register = false;
                            this.auth_state = true;
                            this.security_quiz = true;
                            this.progress_bar = false;
                        } else {
                            this.$router.push({
                                path: "/",
                            });
                        }

                        // console.log(doc.data())
                        console.log(this.decrypteData(doc.data().pin));
                    });
                });
        },
        configureRecaptcha() {
            window.recaptchaVerifier = new this.$fireModule.auth.RecaptchaVerifier(
                "recaptcha-container", {
                    size: "visible",
                    callback: (response) => {
                        console.log(response);
                    },
                }
            );
        },
        // handle otpsend
        sendOtpForVerification() {
            if (this.phone_no == "") {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide phone number";
            } else {
                this.progress_bar = true;
                this.configureRecaptcha();
                const phoneNumber = "+254" + this.phone_no; //user phone number
                this.appVerifier = window.recaptchaVerifier;
                console.log("init SMS", this.appVerifier2, "\n", phoneNumber);
                firebase.auth().languageCode = "en";
                firebase
                    .auth()
                    .signInWithPhoneNumber(phoneNumber, this.appVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).

                        window.confirmationResult = confirmationResult;
                        this.confirmation_Result = confirmationResult;
                        this.progress_bar = false;
                        this.timerEnabled = true;
                        if (this.confirmation_Result.verificationId != null) {
                            this.code_state_otp = true;
                            this.code_state = false;
                        }
                        console.log("Result", this.confirmation_Result, "OTP sent");
                        this.snackbar = true;
                        this.snackbarText = "OTP was successfully";
                        //this.$toast.success("Otp sent successfully");
                    })
                    .catch((error) => {
                        // Error; SMS not sent
                        this.progress_bar = false;
                        console.log("Error", error);
                        this.snackbar2 = true;
                        this.snackbarText2 = error;
                    });
            }
        },
        ConfirmCode() {
            console.log("Code sent to you.", this.code_no);

            var credential = firebase.auth.PhoneAuthProvider.credential(
                this.confirmation_Result.verificationId,
                this.code_no
            );
            if ((this.code_no = "")) {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide Code sent to you";
                console.log("Provide Code sent to you");
            } else {
                console.log("Verify Code", this.code_no);
                this.progress_bar = true;
                firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then((user) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        //this.$toast.success("Otp sent successfully");
                        //this.storeUserDetails();
                        this.StoreUSer(user.user.uid)
                    })
                    .catch((error) => {
                        this.progress_bar = false;
                        // Error; SMS not sent
                        console.log("Error", error);
                        this.snackbar2 = true;
                        this.snackbarText2 = error;
                    });
            }
        },
        generateRandomNumber() {
            const digits = "DY*1234FA6789";
            let randomNumber = "";
            const length = 9;

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * digits.length);
                randomNumber += digits[randomIndex];
            }

            this.randomNineDigitNumber = randomNumber;

            return randomNumber;
        },
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.uid = this.$fire.auth.currentUser.uid;
            } else {
                this.auth_state = false;
            }
        },
    },

};
</script>

<!-- 

<style scoped></style> -->
