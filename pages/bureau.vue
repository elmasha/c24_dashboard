<!-- Please remove this file from your project -->
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

    <div class="container">
            <nuxt-link to="/" style="text-decoration: none;">
                <v-btn icon>
                    <v-icon color="white">mdi-arrow-left</v-icon>
                </v-btn>
            </nuxt-link>
    </div>

    <v-card rounded elevation="10" dark style=" margin:0px;" color="black">
        <div class="text-start">
            <div class="container">
                <div class="d-flex flex-column">
                    <div class="d-flex" style=" margin:10px;">
                        <v-avatar color="primary" size="46" style="color: aliceblue;">{{ int_value }}</v-avatar>

                        <h3 style="margin-left: 10px;margin-top: 6px;">{{ bureau.bureau_name +" Bureau"}}</h3>
                        <div>

                        </div>
                        <v-spacer />

                    </div>

                </div>
                <!-- <p>{{ bureau.county }}</p> -->
            </div>

            <div class="container">
                <v-btn style="color: aqua;margin-bottom: 15px;" outlined small rounded color="aqua" @click="dialogAdd = true">

                    Add candidate
                    <v-icon right>mdi-account-multiple-plus-outline</v-icon>
                </v-btn>
                <div class="d-flex">
                    <div class="d-flex text-center  row">
                        <div style="margin: 4px;padding: 8px 8px 8px 8px;">

                            <p style="font-size: 0.9rem;"> <b>{{ candidate_count }}</b> <br> Candidates</p>

                        </div>
                        <div style="margin: 4px; padding: 8px 8px 8px 8px;">

                            <p style="font-size: 0.9rem;"> <b>{{ 0 }}</b> <br> Available </p>

                        </div>
                        <div style="margin: 4px;padding: 8px 8px 8px 8px;">

                            <p style="font-size: 0.9rem;"> <b>{{ 0 }}</b> <br> UnAvailable </p>

                        </div>
                    </div>
                    <div>
                        <v-spacer />
                        <v-btn icon style="color: aqua;" color="aqua" @click="list = true,grid = false">
                            <v-icon>mdi-format-list-bulleted</v-icon>
                        </v-btn>
                        <v-btn icon style="color: aqua;" color="aqua" @click="grid = true, list= false">
                            <v-icon>mdi-grid</v-icon>
                        </v-btn>
                    </div>
                </div>

            </div>

        </div>

        <!-- RESULTS -->
        <div style="border-radius: 12px;background-color: aliceblue; margin: 20px; padding: 10px;" v-show="grid">
            <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="loading">Loading...</div>

            <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="candidates.length === 0 && !loading">
                No candidates found
            </div>
            <div style="color: black;" class="" v-if="candidates.length > 0 && !loading">
                <h2 style="font-size: 1.3rem;margin-left: 10px;"> {{ bureau.bureau_name }} candidate's</h2>
            </div>

            <div class="row">
                <div v-for="candidate in candidates" :key="candidate.candidate_id" class="col-md-3">

                    <v-card elevation="2" color="white" light class="ma-3 pa-3" style="border-radius: 12px;">
                        <div class="container">
                            <div class="d-flex">
                                <img :src="user" width="60" contain height="60" />
                                <div>
                                    <h3>{{ candidate.candidate_name }}</h3>
                                    <p>{{ candidate.gender }}</p>
                                </div>
                            </div>

                            <p>{{ candidate.age }} Yrs</p>
                            <p>{{ candidate.county }}</p>
                            <v-chip>{{ numeral(candidate.salary).format('0,0')  }} per {{ candidate.salary_period }}</v-chip>
                        </div>
                        <p>Status <br> <b style="color:green">{{ candidate.working_status }}</b></p>
                        <v-card-actions style="border-radius: 12px;background-color: aliceblue; margin: 9px; padding: 12px;">

                            <v-spacer></v-spacer>
                            <v-btn @click=" dialogView = true,can_details = candidate" rounded small color="black" style="color:aliceblue">
                                View
                                <v-icon right>mdi-account-arrow-right-outline</v-icon>
                            </v-btn>

                        </v-card-actions>
                    </v-card>

                </div>
            </div>
        </div>

        <div style="border-radius: 12px;background-color: aliceblue; margin: 20px; padding: 10px;" v-show="list">
            <div>
                <div class="container">
                    <v-data-table :headers="headers" :items="candidates" light color="white" item-key="name" class="elevation-1" :search="search" :custom-filter="filterOnlyCapsText">
                        <template v-slot:top>
                            <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                        </template>
                        <!-- <template v-slot:body.append>
                            <tr>
                                <td></td>
                                <td>
                                    <v-text-field v-model="search" type="number" label="Less than"></v-text-field>
                                </td>
                                <td colspan="4"></td>
                            </tr>
                        </template> -->

                        <!-- <template v-slot:item.canidate_name="{ headers }">
                            <v-avatar color="primary" size="36" style="color: aliceblue;">{{ item.canidate_name.substring(0,2) }}</v-avatar>
                        </template> -->
                    </v-data-table>
                </div>
            </div>
        </div>

    </v-card>

    <v-dialog v-model="dialogView" color="black" max-width="400">
        <v-card elevation="0">
            <div class="d-flex">
                <v-spacer>

                </v-spacer>

                <v-btn icon color="red" @click="dialogView = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer>

                </v-spacer>
            </div>
            <div class="container">

                <v-card elevation="0" color="white" light class="ma-3 pa-3" style="border-radius: 12px;">
                    <div class="container">
                        <div class="d-flex">
                            <img :src="user" width="60" contain height="60" />
                            <div>
                                <h3>{{ can_details.candidate_name }}</h3>
                                <p>{{ can_details.gender }}</p>
                            </div>
                        </div>

                        <p>{{ can_details.age }} Yrs</p>
                        <p>{{ can_details.county }}</p>
                        <v-chip>{{ numeral(can_details.salary).format('0,0')  }} per {{ can_details.salary_period }}</v-chip>
                    </div>
                    <v-card-actions>
                        <p>Status <br> <b style="color:green">{{ can_details.working_status }}</b></p>
                        <v-spacer></v-spacer>

                    </v-card-actions>

                    <div v-if="can_details.working_status == 'UnAvailable'" class="pa-2">
                        <p>Employer: {{ can_details.employer }}</p>
                        <p>Employer Contact: {{ can_details.employer_no }}</p>
                        <p>Employer County: {{ can_details.employer_county }}</p>
                    </div>
                </v-card>

            </div>
            <v-card-actions style="border-radius: 12px;background-color: aliceblue; margin: 9px; padding: 12px;">

                <v-spacer></v-spacer>

                <v-btn @click="deletCanidate = true" rounded small color="red" style="color:aliceblue">
                    Delete
                    <v-icon right>mdi-delete</v-icon>
                </v-btn>
                <v-btn @click="updateCanidate = true" rounded small color="blue" style="color:aliceblue">
                    Update
                    <v-icon right>mdi-account-arrow-right-outline</v-icon>
                </v-btn>

            </v-card-actions>

            <v-expanded-transition>
                <div v-if="deletCanidate" class="pa-4">
                    <h3>Are you sure you want to delete {{ can_details.candidate_name }}?</h3>
                    <br>
                    <v-btn style="color:white;" color="red" @click="deleteCandidate(can_details.candidate_id,can_details.working_status)">Yes, Delete</v-btn>
                    <v-btn color="grey" @click="deletCanidate = false">Cancel</v-btn>
                </div>

            </v-expanded-transition>
        </v-card>

    </v-dialog>
    <v-dialog v-model="dialogAdd" color="black" max-width="700">
        <v-card>
            <div class="d-flex">
                <v-spacer>

                </v-spacer>
                <v-btn icon color="red" @click="dialogAdd = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer>

                </v-spacer>
            </div>
            <div class="container">

                <candidate_reg></candidate_reg>
            </div>
        </v-card>

    </v-dialog>
</v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";
import Candidate_reg from "../components/candidate_reg.vue";
import {
    lib
} from "crypto-js";
export default {
    middleware: 'auth',
    components: {
        Candidate_reg
    },
    mounted() {

        if (this.$fire.auth.currentUser != null) {
            this.uid = this.$fire.auth.currentUser.uid;
            console.log("UID =>", this.uid);
        } else {
            this.auth_state = false;
        }
        this.fetchBureau();
        this.Bureau();

    },
    data() {
        return {
            search: '',
            grid: true,
            deletCanidate: false,
            updateCanidate: false,
            list: false,
            table: false,
            dialogAdd: false,
            dialogView: false,
            candidate_count: 0,
            uid: null,
            auth_state: true,
            user,
            numeral,
            bureau: [],
            candidates: [],
            can_details: false,
            loading: false,
            int_value: "",
            headers: [{
                    text: '',
                    align: 'start',
                    value: 'candidate_image',
                }, {
                    text: 'Candidate name',
                    align: 'start',
                    value: 'candidate_name',
                },
                {
                    text: 'Gender',
                    value: 'gender'
                },
                {
                    text: 'Age',
                    value: 'age'
                },
                {
                    text: 'County',
                    value: 'county'
                },
                {
                    text: 'Salary',
                    value: 'salary'
                },
                {
                    text: 'Salary period',
                    value: 'salary_period'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                {
                    text: 'Salary',
                    value: 'salary_period'
                },
            ],
        }
    },
    methods: {
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
        },
        async deleteCandidate(id,status) {
            if(status === 'UnAvailable'){
                this.snackbar2 = true;
                this.snackbarText2 = "Cannot delete unavailable candidate";
                return;
            }
            this.loading = true;
            try {
                const res = await axios.delete(`https://yayalinkserver-production-4990.up.railway.app/api/candidates/delete-candidate/${id}`, {});
                if (res.status == 200) {
                    this.snackbar = true;
                    this.snackbarText = res.data.message;
                    this.dialogView = false;
                    this.deletCanidate = false;
                    this.Bureau();
                }
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        filterOnlyCapsText(value, search, item) {
            if (!search) return true;
            return value.toString().toUpperCase().includes(search.toUpperCase());
        },
        async fetchBureau() {

            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/bureaus/get-bureau/${this.uid}`, {});
                this.bureau = res.data;
                this.int_value = this.bureau.bureau_name.substring(0, 3).toUpperCase();
                console.log(this.bureau);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
        async fetchBureauCandidates() {
            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production-4990.up.railway.app/api/candidates/bureau-candidate/${this.uid}`, {
                    params: this.filters
                });
                this.candidates = res.data;
                this.candidate_count = res.data.length;
                console.log(res.data);
            } catch (err) {
                console.error(err);
                // alert("Failed to load candidates");
            } finally {
                this.loading = false;
            }

        },
    }

}
</script>
