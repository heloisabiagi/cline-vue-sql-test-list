<template>
  <div class="app">
    <header class="header">
      <h1>Vue SQLite Test List</h1>
      <p>A user management app backed by Express + SQLite</p>
    </header>

    <main class="main">
      <section class="list-section">
        <UserList
          :users="users"
          :loading="loading"
          @edit="startEdit"
          @delete="removeUser"
          @add="startAdd"
        />
      </section>

      <div v-if="error" class="error-banner">
        {{ error }}
      </div>
    </main>

    <!-- User form presented in a modal (used for both create and edit) -->
    <Modal
      v-if="modalOpen"
      :title="editingUser ? 'Edit User' : 'Add User'"
      @close="closeModal"
    >
      <UserForm
        :editing-user="editingUser"
        :loading="saving"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import UserList from './components/UserList.vue';
import UserForm from './components/UserForm.vue';
import Modal from './components/Modal.vue';
import { fetchUsers, createUser, updateUser, deleteUser } from './api/users';

export default {
  name: 'App',
  components: {
    UserList,
    UserForm,
    Modal,
  },
  setup() {
    const users = ref([]);
    const editingUser = ref(null);
    const modalOpen = ref(false);
    const loading = ref(false);
    const saving = ref(false);
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

    // Add a new user, then close the modal on success
    async function addUser(user) {
      saving.value = true;
      error.value = '';
      try {
        await createUser(user);
        await loadUsers();
        modalOpen.value = false;
      } catch (err) {
        error.value = err.message || 'Failed to create user';
      } finally {
        saving.value = false;
      }
    }

    // Update an existing user, then close the modal on success
    async function editUser(user) {
      saving.value = true;
      error.value = '';
      try {
        await updateUser(user.id, user);
        await loadUsers();
        modalOpen.value = false;
        editingUser.value = null;
      } catch (err) {
        error.value = err.message || 'Failed to update user';
      } finally {
        saving.value = false;
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

    // Open the modal in "edit" mode (pre-fills the form)
    function startEdit(user) {
      editingUser.value = { ...user };
      modalOpen.value = true;
    }

    // Open the modal in "add" mode
    function startAdd() {
      editingUser.value = null;
      modalOpen.value = true;
    }

    // Close the modal and reset any pending edit user
    function closeModal() {
      modalOpen.value = false;
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
      modalOpen,
      loading,
      error,
      startAdd,
      startEdit,
      closeModal,
      handleSubmit,
      removeUser,
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.error-banner {
  background: #e74c3c;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-align: center;
}
@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
}
</style>

