
<template>
  <!-- Dialog for updating an existing employee -->
  <v-dialog
    v-model="dialog"
    max-width="800"
    persistent
  >
    <v-card rounded="lg">
      <!-- Dialog heading -->
      <v-card-title class="add-employee__title">
        <v-icon color="teal-darken-1" class="mr-2">
          mdi-account-edit
        </v-icon>

        Update Employee
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <!-- Display the form when an employee is selected -->
        <EmployeeForm
          v-if="employee"
          :key="employee.id"
          :employee="employee"
          :submitting="submitting"
          submit-label="Save Changes"
          @submit="handleSubmit"
          @cancel="closeDialog"
        />

        <!-- Message when no employee is selected -->
        <v-alert
          v-else
          type="info"
          variant="tonal"
        >
          Please select an employee to update.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EmployeeForm from './EmployeeForm.vue'
import '../scss/employee.scss'

export default {
  name: 'UpdateEmployee',

  components: {
    EmployeeForm,
  },

  props: {
    // Controls whether the dialog is open.
    modelValue: {
      type: Boolean,
      default: false,
    },

    // Employee selected from the employee table.
    employee: {
      type: Object,
      default: null,
    },

    // Loading state controlled by the parent.
    submitting: {
      type: Boolean,
      default: false,
    },
  },

  // Events sent back to EmployeeManagement.vue.
  emits: ['update:modelValue', 'submit'],

  computed: {
    // Keep dialog visibility synchronized with the parent.
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
    // Send updated employee details to the parent.
    handleSubmit(updatedEmployee) {
      this.$emit('submit', updatedEmployee)
    },

    // Close the dialog when Cancel is clicked.
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>
