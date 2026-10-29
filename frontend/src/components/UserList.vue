<template>
  <div class="list-card">
    <div class="list-header">
      <h2>Users ({{ users.length }})</h2>
      <button
        class="btn btn-add"
        :disabled="loading"
        @click="$emit('add')"
        title="Add user"
      >
        + Add User
      </button>
    </div>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else-if="users.length === 0" class="empty">
      No users found. Add one using the form!
    </div>

    <table v-else class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Created</th>
          <th class="actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.age !== null ? user.age : '—' }}</td>
          <td>{{ formatDate(user.created_at) }}</td>
          <td class="actions">
            <button
              class="btn btn-icon btn-edit"
              @click="$emit('edit', user)"
              title="Edit user"
            >
              ✏️
            </button>
            <button
              class="btn btn-icon btn-delete"
              @click="$emit('delete', user.id)"
              :disabled="loading"
              title="Delete user"
            >
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'UserList',
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete', 'add'],
  setup() {
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return { formatDate };
  },
};
</script>

<style scoped>
.list-card {
  width: 100%;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}
.list-header h2 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
}
.btn-add {
  background-color: #3498db;
  color: #fff;
}
.btn-add:hover:not(:disabled) {
  background-color: #2980b9;
}
.btn-add:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.users-table th,
.users-table td {
  padding: 0.6rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}
.users-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #34495e;
}
.users-table tbody tr:hover {
  background-color: #fafbfc;
}
.actions {
  display: flex;
  gap: 0.3rem;
}
.actions-header {
  text-align: center;
}
.btn-icon {
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  border-radius: 4px;
}
.btn-edit:hover {
  background-color: rgba(52, 152, 219, 0.15);
}
.btn-delete:hover {
  background-color: rgba(231, 76, 60, 0.15);
}
</style>
