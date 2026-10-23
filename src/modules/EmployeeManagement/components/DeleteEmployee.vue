
<template>
  <!-- Delete confirmation dialog -->
  <v-dialog v-model="dialog" max-width="450">
    <v-card rounded="lg">
      <!-- Dialog heading -->
      <v-card-title class="delete-employee__title">
        <v-icon color="red-darken-1" class="mr-2">
          mdi-delete-alert
        </v-icon>
        Delete Employee
      </v-card-title>

      <v-divider />

      <!-- Confirmation message -->
      <v-card-text class="pa-5">
        <div class="delete-employee__content">
          <v-avatar color="red-lighten-5" size="56">
            <v-icon color="red-darken-1" size="30">
              mdi-account-remove
            </v-icon>
          </v-avatar>

          <p>
            Are you sure you want to delete
            <strong>{{ employee?.name || 'this employee' }}</strong>?
          </p>

          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
          >
            This action cannot be undone.
          </v-alert>
        </div>
      </v-card-text>

      <!-- Dialog actions -->
      <v-card-actions class="px-5 pb-4">
        <v-spacer />

        <v-btn
          variant="outlined"
          color="grey-darken-1"
          :disabled="submitting"
          @click="closeDialog"
        >
          Cancel
        </v-btn>

        <v-btn
          color="red-darken-1"
          variant="flat"
          :loading="submitting"
          :disabled="!employee || submitting"
          @click="confirmDelete"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import '../scss/employee.scss'

export default {
  name: 'DeleteEmployee',

  props: {
    // Controls dialog visibility.
    modelValue: {
      type: Boolean,
      default: false,
    },

    // Employee selected for deletion.
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

  emits: ['update:modelValue', 'confirm'],

  computed: {
    // Synchronize dialog visibility with the parent.
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
    // Ask the parent to delete the selected employee.
    confirmDelete() {
      if (!this.employee || this.submitting) return

      this.$emit('confirm', this.employee)
    },

    // Close the dialog without deleting anything.
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>
