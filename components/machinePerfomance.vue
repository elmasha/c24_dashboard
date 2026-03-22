<template>
<v-card outlined class="pa-4">
    <div class="d-flex align-center mb-3">
        <div class="text-h6">{{ title }}</div>
        <div v-if="rows.length">
            Top Machine:
            <strong color="green">{{ rows[0].machine_name }}</strong>
        </div>
    </div>

    <v-simple-table>
        <thead>
            <tr>
                <th>Machine</th>
                <th>UID</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th class="text-right">Impressions</th>
                <th class="text-right">Scans</th>
                <th class="text-right">Conversion</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="row.machine_id">
                <td>{{ row.machine_name }}</td>
                <td>{{ row.machine_uid }}</td>
                <td>{{ row.location_name }}</td>
                <td>{{ row.location_category }}</td>
                <td>
                    <div v-if="row.status=== 'online'">
                        <v-chip color="green" style="color:black">{{ row.status }}</v-chip>
                    </div>
                    <div v-if="row.status=== 'offline'">
                        <v-chip color="red">{{ row.status }}</v-chip>
                    </div>
                </td>
                <td class="text-right">{{ formatNumber(row.impressions) }}</td>
                <td class="text-right">{{ formatNumber(row.scans) }}</td>
                <td class="text-right">{{ row.conversion_rate }}%</td>
            </tr>

            <tr v-if="!rows.length">
                <td colspan="8">No machine performance data.</td>
            </tr>
        </tbody>
    </v-simple-table>
</v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "Top Performing Machines"
        },
        rows: {
            type: Array,
            default: () => []
        }
    },

    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString();
        }
    }
};
</script>
<style>

