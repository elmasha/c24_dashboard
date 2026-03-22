<template>
<v-app dark class="" color="black" style="background-color: black;">

    <v-main>
      
        <!-- Mobile drawer -->
        <v-navigation-drawer v-model="drawer" absolute left temporary>
            <v-list>
                <!-- <v-list-item class="px-1" v-if="overview.client">
                <v-list-item-avatar>
                    <v-avatar>
                        {{ overview.client.client_name.substring(0,2)}}
                    </v-avatar>
                </v-list-item-avatar>
            </v-list-item> -->

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">

                        </v-list-item-title>

                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list nav dense>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-folder</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>My Files</v-list-item-title>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-account-multiple</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Shared with me</v-list-item-title>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-star</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Starred</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
       
            
            <Nuxt />
        
    </v-main>

    <v-footer style="background-color: #000;" dark :absolute="!fixed" app>
        <v-row>
            <v-col>

            </v-col>
        </v-row>
        <div class="text-center">

            <div class="d-flex">
                <div class="d-flex">
                    <h5 style="color: greenyellow;">C24 Dashboard</h5>
                    <span>&copy; {{ new Date().getFullYear() }}</span>
                </div>
            </div>
        </div>
        <v-row>
            <v-col>

            </v-col>
        </v-row>
    </v-footer>
</v-app>
</template>

<script>
export default {
    name: 'DefaultLayout',
    mounted() {
        
    },
    data() {
        return {
            windowSize: {
                x: null,
                y: null,
            },
            showBurger: false,
            clipped: false,
            auth_state: false,
            drawer: false,
            fixed: false,
            items: [{
                    icon: 'mdi-account',
                    title: 'Account',
                    to: '/'
                },
                {
                    icon: 'mdi-wallet',
                    title: 'Wallet',
                    to: '/inspire'
                }
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: '',
            drawer: false,
        }
    },
    methods: {
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
            return this.windowSize;
        },
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
        },

    },
}
</script>

<style>
* {
    font-family: "Quicksand", sans-serif;
    scroll-behavior: smooth;
    overflow: hidden;
    /* color: #2b4601; */

}
</style>
