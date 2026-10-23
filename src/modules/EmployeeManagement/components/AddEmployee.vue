
<template>
  <!-- Dialog for adding a new employee -->
  <v-dialog
    v-model="dialog"
    max-width="800"
    persistent
  >
    <v-card rounded="lg">
      <!-- Dialog heading -->
      <v-card-title class="add-employee__title">
        <v-icon color="teal-darken-1" class="mr-2">
          mdi-account-plus
        </v-icon>
        Add New Employee
      </v-card-title>

      <v-divider />

      <!-- Reusable employee form -->
      <v-card-text class="pa-5">
        <EmployeeForm
          :submitting="submitting"
          submit-label="Add Employee"
          @submit="handleSubmit"
          @cancel="closeDialog"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EmployeeForm from './EmployeeForm.vue'
import '../scss/employee.scss'

export default {
  name: 'AddEmployee',

  components: {
    EmployeeForm,
  },

  props: {
    // Controls whether the dialog is visible.
    modelValue: {
      type: Boolean,
      default: false,
    },

    // Indicates whether the parent is processing the submission.
    submitting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'submit'],

  computed: {
    // Keep the dialog visibility synchronized with the parent.
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
    // Send the new employee data to the parent component.
    handleSubmit(employee) {
      this.$emit('submit', employee)
    },

    // Close the dialog when Cancel is clicked.
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>
