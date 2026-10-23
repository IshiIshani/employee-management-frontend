
<template>
  <v-card class="employee-table-card" elevation="0">
    <!-- Table heading -->
    <div class="table-heading">
      <div>
        <h2>Employee Records</h2>
        <p>View and manage employee salary details.</p>
      </div>

      <v-chip color="teal" variant="tonal" size="small">
        {{ filteredEmployees.length }} Employees
      </v-chip>
    </div>

    <!-- Search -->
    <div class="table-search">
      <v-text-field
        v-model="search"
        label="Search employees"
        placeholder="Search by name, email, phone or designation"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
    </div>

    <!-- Employee table -->
    <div class="table-scroll">
      <table class="employee-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Monthly Salary</th>
            <th>Monthly Tax</th>
            <th>Yearly Bonus</th>
            <th>Monthly Net Salary</th>
            <th>Yearly Net Salary</th>
            <th class="actions-heading">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="employee in filteredEmployees"
            :key="employee.id ?? employee.email"
          >
            <td class="employee-name">
              {{ employee.name }}
            </td>

            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>

            <td>
              <v-chip
                color="teal"
                variant="tonal"
                size="small"
              >
                {{ employee.designation }}
              </v-chip>
            </td>

            <td class="salary-value">
              {{ money(employee.monthly_salary_package) }}
            </td>

            <td>{{ money(employee.monthly_tax_value) }}</td>

            <td>{{ money(employee.yearly_increasing_bonus) }}</td>

            <td class="salary-value">
              {{ money(employee.monthly_net_salary) }}
            </td>

            <td class="salary-value">
              {{ money(employee.yearly_net_salary) }}
            </td>

            <td>
              <div class="employee-actions">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="tonal"
                  color="blue"
                  aria-label="View employee"
                  title="View employee"
                  @click="$emit('view', employee)"
                />

                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="tonal"
                  color="amber-darken-2"
                  aria-label="Edit employee"
                  title="Edit employee"
                  @click="$emit('edit', employee)"
                />

                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="tonal"
                  color="red"
                  aria-label="Delete employee"
                  title="Delete employee"
                  @click="$emit('delete', employee)"
                />
              </div>
            </td>
          </tr>

          <tr v-if="filteredEmployees.length === 0">
            <td colspan="10" class="empty-table">
              <v-icon size="32" color="grey">mdi-account-search-outline</v-icon>
              <p>No employee records found.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-card>
</template>

<script>
import '../scss/employee-table.scss'

export default {
  name: 'EmployeeTable',

  props: {
    employees: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['view', 'edit', 'delete'],

  data() {
    return {
      search: '',
    }
  },

  computed: {
    filteredEmployees() {
      const term = (this.search || '').trim().toLowerCase()

      if (!term) {
        return this.employees
      }

      return this.employees.filter((employee) => {
        return [
          employee.name,
          employee.email,
          employee.phone,
          employee.designation,
        ].some((value) =>
          String(value ?? '').toLowerCase().includes(term)
        )
      })
    },
  },

  methods: {
    money(value) {
      if (value === null || value === undefined || value === '') {
        return '—'
      }

      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))
    },
  },
}
</script>
