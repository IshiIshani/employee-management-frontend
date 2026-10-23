
<template>
  <v-form ref="employeeForm" @submit.prevent="handleSubmit">
    <v-row>
      <!-- Employee name -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.name"
          label="Employee Name"
          prepend-inner-icon="mdi-account"
          :rules="[rules.required]"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <!-- Email address -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.email"
          label="Email Address"
          prepend-inner-icon="mdi-email"
          :rules="[rules.required, rules.email]"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <!-- Phone number -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.phone"
          label="Phone Number"
          prepend-inner-icon="mdi-phone"
          :rules="[rules.required]"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <!-- Designation dropdown -->
      <v-col cols="12" md="6">
        <v-select
          v-model="form.designation"
          label="Designation"
          prepend-inner-icon="mdi-briefcase"
          :items="designations"
          :rules="[rules.required]"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <!-- Editable monthly salary -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="form.monthly_salary_package"
          label="Monthly Salary Package (LKR)"
          type="number"
          min="0"
          prepend-inner-icon="mdi-cash"
          :rules="[rules.required, rules.nonNegative]"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <!-- Automatically calculated monthly tax -->
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="formatMoney(monthlyTax)"
          label="Monthly Tax (LKR)"
          prepend-inner-icon="mdi-calculator"
          readonly
          variant="outlined"
          density="comfortable"
          class="calculated-field"
          hint="Automatically calculated from salary"
          persistent-hint
        />
      </v-col>

      <!-- Automatically calculated yearly bonus -->
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="formatMoney(yearlyBonus)"
          label="Yearly Increasing Bonus (LKR)"
          prepend-inner-icon="mdi-trending-up"
          readonly
          variant="outlined"
          density="comfortable"
          class="calculated-field"
          hint="Automatically calculated from designation"
          persistent-hint
        />
      </v-col>

      <!-- Calculated monthly net salary -->
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="formatMoney(monthlyNetSalary)"
          label="Monthly Net Salary (LKR)"
          prepend-inner-icon="mdi-wallet"
          readonly
          variant="outlined"
          density="comfortable"
          class="calculated-field"
        />
      </v-col>

      <!-- Calculated yearly net salary -->
      <v-col cols="12">
        <v-text-field
          :model-value="formatMoney(yearlyNetSalary)"
          label="Yearly Net Salary (LKR)"
          prepend-inner-icon="mdi-chart-bar"
          readonly
          variant="outlined"
          density="comfortable"
          class="calculated-field"
        />
      </v-col>
    </v-row>

    <!-- Form actions -->
    <div class="employee-form__actions">
      <v-btn
        variant="outlined"
        color="grey-darken-1"
        :disabled="submitting"
        @click="$emit('cancel')"
      >
        Cancel
      </v-btn>

      <v-btn
        type="submit"
        color="teal-darken-1"
        :loading="submitting"
        :disabled="submitting"
      >
        {{ submitLabel }}
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import '../scss/employee-form.scss'

export default {
  name: 'EmployeeForm',

  props: {
    // Existing employee data when editing.
    employee: {
      type: Object,
      default: null,
    },

    // Button text for Add or Update.
    submitLabel: {
      type: String,
      default: 'Save Employee',
    },

    // Loading state controlled by the parent.
    submitting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['submit', 'cancel'],

  data() {
    return {
      // Allowed employee designations.
      designations: ['Intern', 'Associate', 'Senior', 'Manager'],

      // Form fields.
      form: this.createEmptyForm(),

      // Validation rules.
      rules: {
        required: (value) =>
          (value !== null &&
            value !== undefined &&
            String(value).trim() !== '') ||
          'This field is required',

        email: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '') ||
          'Enter a valid email address',

        nonNegative: (value) =>
          value !== '' &&
          value !== null &&
          value !== undefined &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0 ||
          'Enter a valid value of zero or greater',
      },
    }
  },

  computed: {
    // Read the salary as a number.
    salary() {
      return Math.max(0, Number(this.form.monthly_salary_package) || 0)
    },

    // Tax rules:
    // Salary >= 150,000: tax = 5% of 150,000 = 7,500
    // Salary >= 100,000 and < 150,000: tax = 3% of 150,000 = 4,500
    // Salary < 100,000: no tax
    monthlyTax() {
      if (this.salary >= 150000) {
        return 7500
      }

      if (this.salary >= 100000) {
        return 4500
      }

      return 0
    },

    // Annual bonus based on designation and monthly salary.
    yearlyBonus() {
      const bonusRates = {
        Manager: 0.05,
        Senior: 0.03,
        Associate: 0.01,
        Intern: 0,
      }

      const rate = bonusRates[this.form.designation] ?? 0

      return Math.round((this.salary * rate + Number.EPSILON) * 100) / 100
    },

    // Monthly net salary = monthly salary - calculated tax.
    monthlyNetSalary() {
      return Math.round(
        (this.salary - this.monthlyTax + Number.EPSILON) * 100,
      ) / 100
    },

    // Yearly net salary = (monthly salary - tax) * 12 + yearly bonus.
    yearlyNetSalary() {
      return Math.round(
        (
          this.monthlyNetSalary * 12 +
          this.yearlyBonus +
          Number.EPSILON
        ) * 100,
      ) / 100
    },
  },

  watch: {
    // Populate the form when editing an employee.
    // Reset the form when adding a new employee.
    employee: {
      immediate: true,
      handler(employee) {
        if (employee) {
          this.form = {
            name: employee.name ?? employee.employee_name ?? '',
            email: employee.email ?? '',
            phone: employee.phone ?? employee.contact_number ?? '',
            designation: employee.designation ?? '',
            monthly_salary_package: Number(
              employee.monthly_salary_package ??
              employee.monthlySalaryPackage ??
              0,
            ),
          }
        } else {
          this.form = this.createEmptyForm()
        }
      },
    },
  },

  methods: {
    // Create a fresh form with editable fields only.
    createEmptyForm() {
      return {
        name: '',
        email: '',
        phone: '',
        designation: '',
        monthly_salary_package: 0,
      }
    },

    // Format money using Sri Lankan rupees.
    formatMoney(value) {
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value) || 0)
    },

    // Validate and send employee data to the parent component.
    async handleSubmit() {
      const result = await this.$refs.employeeForm.validate()

      if (!result.valid) return

      // Send editable fields and calculated previews.
      // The Laravel backend recalculates the derived values too.
      this.$emit('submit', {
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        phone: this.form.phone.trim(),
        designation: this.form.designation,
        monthly_salary_package: this.salary,
        monthly_tax_value: this.monthlyTax,
        yearly_increasing_bonus: this.yearlyBonus,
        monthly_net_salary: this.monthlyNetSalary,
        yearly_net_salary: this.yearlyNetSalary,
      })
    },
  },
}
</script>
