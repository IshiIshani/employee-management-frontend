
<template>
  <v-container fluid class="employee-management-page">
    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1>Employee Management</h1>
        <p>Manage employee details and salary information.</p>
      </div>

      <v-btn
        color="teal-darken-1"
        prepend-icon="mdi-account-plus"
        @click="openAddDialog"
      >
        Add Employee
      </v-btn>
    </div>

    <!-- Success message -->
    <v-alert
      v-if="message"
      class="mb-4"
      type="success"
      variant="tonal"
      closable
      @click:close="message = ''"
    >
      {{ message }}
    </v-alert>

    <!-- API error message -->
    <v-alert
      v-if="errorMessage"
      class="mb-4"
      type="error"
      variant="tonal"
      closable
      @click:close="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>

    <!-- Loading indicator -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="teal-darken-1"
      class="mb-4"
    />

    <!-- Summary cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="0">
          <v-card-text>
            <div class="summary-label">Total Employees</div>
            <div class="summary-value">{{ employees.length }}</div>
            <v-icon color="teal" size="28">mdi-account-group</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="0">
          <v-card-text>
            <div class="summary-label">Monthly Salary</div>
            <div class="summary-value">{{ money(totalSalary) }}</div>
            <v-icon color="blue" size="28">mdi-cash-multiple</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="0">
          <v-card-text>
            <div class="summary-label">Monthly Tax</div>
            <div class="summary-value">{{ money(totalTax) }}</div>
            <v-icon color="orange" size="28">mdi-file-document</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="0">
          <v-card-text>
            <div class="summary-label">Yearly Net Salary</div>
            <div class="summary-value">{{ money(totalYearlyNet) }}</div>
            <v-icon color="green" size="28">mdi-chart-line</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Employee table -->
    <EmployeeTable
      :employees="filteredEmployees"
      @view="openViewDialog"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />

    <!-- Add Employee dialog -->
    <AddEmployee
      :key="formKey"
      v-model="addDialog"
      @submit="addEmployee"
    />

    <!-- Update Employee dialog -->
    <UpdateEmployee
      v-model="editDialog"
      :employee="selectedEmployee"
      @submit="updateEmployee"
    />

    <!-- View Employee dialog -->
    <ViewEmployee
      v-model="viewDialog"
      :employee="selectedEmployee"
    />

    <!-- Delete Employee dialog -->
    <DeleteEmployee
      v-model="deleteDialog"
      :employee="selectedEmployee"
      @confirm="deleteEmployee"
    />
  </v-container>
</template>

<script>
import EmployeeTable from "../components/EmployeeTable.vue";
import AddEmployee from "../components/AddEmployee.vue";
import UpdateEmployee from "../components/UpdateEmployee.vue";
import ViewEmployee from "../components/ViewEmployee.vue";
import DeleteEmployee from "../components/DeleteEmployee.vue";
import employeeService from "../services/employeeService.js";

import "../scss/employee-management.scss";
import "../scss/employee.scss";

export default {
  name: "EmployeeManagement",

  components: {
    EmployeeTable,
    AddEmployee,
    UpdateEmployee,
    ViewEmployee,
    DeleteEmployee,
  },

  data() {
    return {
      formKey: 0,
      message: "",
      errorMessage: "",
      search: "",
      loading: false,

      addDialog: false,
      editDialog: false,
      viewDialog: false,
      deleteDialog: false,

      selectedEmployee: null,

      // Employee records are now loaded from Laravel.
      employees: [],
    };
  },

  computed: {
    filteredEmployees() {
      const term = this.search.trim().toLowerCase();

      if (!term) return this.employees;

      return this.employees.filter((employee) =>
        [
          employee.name,
          employee.email,
          employee.phone,
          employee.designation,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(term),
        ),
      );
    },

    totalSalary() {
      return this.employees.reduce(
        (sum, employee) =>
          sum + Number(employee.monthly_salary_package || 0),
        0,
      );
    },

    totalTax() {
      return this.employees.reduce(
        (sum, employee) =>
          sum + Number(employee.monthly_tax_value || 0),
        0,
      );
    },

    totalYearlyNet() {
      return this.employees.reduce(
        (sum, employee) =>
          sum + Number(employee.yearly_net_salary || 0),
        0,
      );
    },
  },

  // Load the saved employee records when the page opens.
  mounted() {
    this.loadEmployees();
  },

  methods: {
    money(value) {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 2,
      }).format(Number(value || 0));
    },

    // Get a useful message from Laravel or Axios.
    getErrorMessage(error) {
      const response = error.response;

      if (response?.status === 422) {
        const errors = response.data?.errors;

        if (errors) {
          return Object.values(errors).flat().join(" ");
        }
      }

      if (response?.data?.message) {
        return response.data.message;
      }

      if (error.request && !response) {
        return "Cannot connect to Laravel. Check that the backend server is running.";
      }

      return error.message || "An unexpected error occurred.";
    },

    // GET /api/employees
    async loadEmployees() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const response = await employeeService.getAll();

        // Laravel returns employee records inside response.data.data.
        this.employees = response.data.data;
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    openAddDialog() {
      this.message = "";
      this.errorMessage = "";
      this.formKey++;
      this.addDialog = true;
    },

    // GET /api/employees/{id}
    async openViewDialog(employee) {
      this.message = "";
      this.errorMessage = "";
      this.selectedEmployee = { ...employee };
      this.viewDialog = true;
      this.loading = true;

      try {
        const response = await employeeService.getById(employee.id);
        this.selectedEmployee = response.data.data;
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    openEditDialog(employee) {
      this.message = "";
      this.errorMessage = "";
      this.selectedEmployee = { ...employee };
      this.formKey++;
      this.editDialog = true;
    },

    openDeleteDialog(employee) {
      this.message = "";
      this.errorMessage = "";
      this.selectedEmployee = { ...employee };
      this.deleteDialog = true;
    },

    // POST /api/employees
    async addEmployee(form) {
      this.message = "";
      this.errorMessage = "";
      this.loading = true;

      try {
        // Send fields accepted by the Laravel controller.
        // Laravel calculates the net salary fields.
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          designation: form.designation,
          monthly_salary_package: Number(form.monthly_salary_package),
          monthly_tax_value: Number(form.monthly_tax_value || 0),
          yearly_increasing_bonus: Number(
            form.yearly_increasing_bonus || 0,
          ),
        };

        await employeeService.create(payload);

        this.addDialog = false;
        this.message = "Employee added successfully.";

        await this.loadEmployees();
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    // PUT /api/employees/{id}
    async updateEmployee(form) {
      if (!this.selectedEmployee) return;

      this.message = "";
      this.errorMessage = "";
      this.loading = true;

      try {
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          designation: form.designation,
          monthly_salary_package: Number(form.monthly_salary_package),
          monthly_tax_value: Number(form.monthly_tax_value || 0),
          yearly_increasing_bonus: Number(
            form.yearly_increasing_bonus || 0,
          ),
        };

        await employeeService.update(
          this.selectedEmployee.id,
          payload,
        );

        this.editDialog = false;
        this.message = "Employee updated successfully.";

        await this.loadEmployees();
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    // DELETE /api/employees/{id}
    async deleteEmployee() {
      if (!this.selectedEmployee) return;

      this.message = "";
      this.errorMessage = "";
      this.loading = true;

      try {
        await employeeService.delete(this.selectedEmployee.id);

        this.deleteDialog = false;
        this.selectedEmployee = null;
        this.message = "Employee deleted successfully.";

        await this.loadEmployees();
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
