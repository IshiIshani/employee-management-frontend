
<template>
  <!-- Dialog for viewing employee details -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card v-if="employee" rounded="lg">
      <!-- Dialog heading -->
      <v-card-title class="view-employee__title">
        <v-icon color="teal-darken-1" class="mr-2">
          mdi-account-details
        </v-icon>
        Employee Details
      </v-card-title>

      <v-divider />

      <!-- Employee information -->
      <v-card-text class="pa-5">
        <div class="view-employee__profile">
          <v-avatar color="teal-lighten-5" size="64">
            <v-icon color="teal-darken-1" size="36">
              mdi-account
            </v-icon>
          </v-avatar>

          <div>
            <h3>{{ employee.name }}</h3>
            <v-chip color="teal" size="small" variant="tonal">
              {{ employee.designation }}
            </v-chip>
          </div>
        </div>

        <v-list density="comfortable" class="view-employee__list">
          <v-list-item
            prepend-icon="mdi-email-outline"
            title="Email Address"
            :subtitle="employee.email || 'Not provided'"
          />

          <v-list-item
            prepend-icon="mdi-phone-outline"
            title="Phone Number"
            :subtitle="employee.phone || 'Not provided'"
          />

          <v-divider class="my-2" />

          <v-list-item
            prepend-icon="mdi-cash"
            title="Monthly Salary Package"
            :subtitle="money(employee.monthly_salary_package)"
          />

          <v-list-item
            prepend-icon="mdi-file-document-outline"
            title="Monthly Tax"
            :subtitle="money(employee.monthly_tax_value)"
          />

          <v-list-item
            prepend-icon="mdi-trending-up"
            title="Yearly Increasing Bonus"
            :subtitle="money(employee.yearly_increasing_bonus)"
          />

          <v-list-item
            prepend-icon="mdi-wallet-outline"
            title="Monthly Net Salary"
            :subtitle="money(employee.monthly_net_salary)"
          />

          <v-list-item
            prepend-icon="mdi-chart-bar"
            title="Yearly Net Salary"
            :subtitle="money(employee.yearly_net_salary)"
          />
        </v-list>
      </v-card-text>

      <!-- Close button -->
      <v-card-actions class="px-5 pb-4">
        <v-spacer />

        <v-btn
          color="teal-darken-1"
          variant="flat"
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import '../scss/employee.scss'

export default {
  name: 'ViewEmployee',

  props: {
    // Controls dialog visibility.
    modelValue: {
      type: Boolean,
      default: false,
    },

    // Employee selected from the table.
    employee: {
      type: Object,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    // Synchronize visibility with the parent.
    dialog: {
      get() {
        return this.modelValue
      },

      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },

  methods: {
    // Format salary values as Sri Lankan rupees.
    money(value) {
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
      }).format(Number(value || 0))
    },

    // Close the details dialog.
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>
