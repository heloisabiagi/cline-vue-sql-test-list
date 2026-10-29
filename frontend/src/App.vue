<template>
  <div class="app">
    <header class="header">
      <h1>Vue SQLite Test List</h1>
      <p>A user management app backed by Express + SQLite</p>
    </header>

    <main class="main">
      <section class="form-section">
        <UserForm
          :editing-user="editingUser"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="cancelEdit"
        />
      </section>

      <section class="list-section">
        <UserList
          :users="users"
          :loading="loading"
          @edit="startEdit"
          @delete="removeUser"
        />
      </section>

      <div v-if="error" class="error-banner">
        {{ error }}
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import UserList from './components/UserList.vue';
import UserForm from './components/UserForm.vue';
import { fetchUsers, createUser, updateUser, deleteUser } from './api/users';

export default {
  name: 'App',
  components: {
    UserList,
    UserForm,
  },
  setup() {
    const users = ref([]);
    const editingUser = ref(null);
    const loading = ref(false);
    const error = ref('');

    // Load all users from the API
    async function loadUsers() {
      loading.value = true;
      error.value = '';
      try {
        users.value = await fetchUsers();
      } catch (err) {
        error.value = err.message || 'Failed to load users';
      } finally {
        loading.value = false;
      }
    }

    // Add a new user
    async function addUser(user) {
      loading.value = true;
      error.value = '';
      try {
        await createUser(user);
        await loadUsers();
      } catch (err) {
        error.value = err.message || 'Failed to create user';
      } finally {
        loading.value = false;
      }
    }

    // Update an existing user
    async function editUser(user) {
      loading.value = true;
      error.value = '';
      try {
        await updateUser(user.id, user);
        await loadUsers();
        editingUser.value = null;
      } catch (err) {
        error.value = err.message || 'Failed to update user';
      } finally {
        loading.value = false;
      }
    }

    // Delete a user
    async function removeUser(id) {
      if (!confirm('Are you sure you want to delete this user?')) return;
      loading.value = true;
      error.value = '';
      try {
        await deleteUser(id);
        await loadUsers();
      } catch (err) {
        error.value = err.message || 'Failed to delete user';
      } finally {
        loading.value = false;
      }
    }

    // Start editing a user (pre-fills the form)
    function startEdit(user) {
      editingUser.value = { ...user };
    }

    // Cancel editing
    function cancelEdit() {
      editingUser.value = null;
    }

    // Submit handler for the form (create or update)
    async function handleSubmit(user) {
      if (user.id) {
        await editUser(user);
      } else {
        await addUser(user);
      }
    }

    onMounted(() => {
      loadUsers();
    });

    return {
      users,
      editingUser,
      loading,
      error,
      addUser,
      removeUser,
      startEdit,
      cancelEdit,
      handleSubmit,
    };
  },
};
</script>

<style>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.header {
  text-align: center;
  margin-bottom: 2rem;
}
.header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.header p {
  color: #7f8c8d;
  font-size: 0.9rem;
}
.main {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
}
.form-section,
.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.error-banner {
  grid-column: 1 / -1;
  background: #e74c3c;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-align: center;
  margin-top: 1rem;
}
@media (max-width: 768px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>

