<template>
<div class="campaigns-page">
    <h1>Campaigns</h1>

    <nuxt-link to="/campaigns/create">
        <button>Create Campaign</button>
    </nuxt-link>

    <nuxt-link to="/campaigns/assign">
        <button>Assign Campaign</button>
    </nuxt-link>


     <nuxt-link to="/machines">
        <button>Machines</button>
    </nuxt-link>


    <nuxt-link to="/traffic-config">Traffic Config</nuxt-link>

    <br /><br />

    <table border="1" cellpadding="8" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Target Impressions</th>
                <th>Delivered</th>
                <th>Start Date</th>
                <th>End Date</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="campaign in campaigns" :key="campaign.id">
                <td>{{ campaign.id }}</td>
                <td>{{ campaign.linked_client_name || campaign.client_name }}</td>
                <td>{{ campaign.campaign_name }}</td>
                <td>{{ campaign.status }}</td>
                <td>{{ campaign.target_impressions }}</td>
                <td>{{ campaign.delivered_impressions }}</td>
                <td>{{ campaign.start_date }}</td>
                <td>{{ campaign.end_date }}</td>
                <td>
                    <nuxt-link :to="`/view/${campaign.id}`">
                        {{ campaign.campaign_name }}
                    </nuxt-link>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import api from "@/services/api";

export default {
    data() {
        return {
            campaigns: []
        };
    },

    mounted() {
        this.fetchCampaigns();
    },

    methods: {
        async fetchCampaigns() {
            try {
                const {
                    data
                } = await api.get("/api/campaigns");
                this.campaigns = data;
            } catch (error) {
                console.error("fetchCampaigns error:", error);
            }
        }
    }
};
</script>

<style scoped>
.campaigns-page {
    padding: 20px;
}
</style>
