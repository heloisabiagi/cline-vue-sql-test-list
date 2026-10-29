<template>
  <div class="form-card">
    <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>

    <form @submit.prevent="onSubmit" class="user-form">
      <div class="field">
        <label for="name">Name *</label>
        <input
          id="name"
          type="text"
          v-model="form.name"
          :disabled="loading"
          placeholder="Enter full name"
          required
        />
      </div>

      <div class="field">
        <label for="email">Email *</label>
        <input
          id="email"
          type="email"
          v-model="form.email"
          :disabled="loading"
          placeholder="name@example.com"
          required
        />
      </div>

      <div class="field">
        <label for="age">Age</label>
        <input
          id="age"
          type="number"
          v-model.number="form.age"
          :disabled="loading"
          placeholder="e.g. 28"
          min="0"
        />
      </div>

      <div class="actions">
        <button type="submit" :disabled="loading" class="btn btn-primary">
          <span v-if="loading">Saving...</span>
          <span v-else>{{ editingUser ? 'Update' : 'Create' }}</span>
        </button>
        <button
          v-if="editingUser"
          type="button"
          @click="onCancel"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  name: 'UserForm',
  props: {
    editingUser: {
      type: Object,
      default: () => null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      email: '',
      age: null,
    });

    // When editingUser prop changes, populate the form
    watch(
      () => props.editingUser,
      (newVal) => {
        if (newVal) {
          form.value = {
            name: newVal.name,
            email: newVal.email,
            age: newVal.age,
          };
        } else {
          // Reset form when not editing
          form.value = {
            name: '',
            email: '',
            age: null,
          };
        }
      },
      { immediate: true }
    );

    const handleSubmit = () => {
      // Merge id if editing, so the parent can distinguish create vs update
      const payload = { ...form.value };
      if (props.editingUser) {
        payload.id = props.editingUser.id;
      }
      emit('submit', payload);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return { form, onSubmit: handleSubmit, onCancel: handleCancel };
  },
};
</script>

<style scoped>
.form-card {
  width: 100%;
}
.form-card h2 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}
.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.field label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #34495e;
}
.field input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}
.field input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
.field input:disabled {
  background-color: #f8f9fa;
}
.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary {
  background-color: #27ae60;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background-color: #229954;
}
.btn-primary:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
}
.btn-secondary:hover:not(:disabled) {
  background-color: #d5dbdb;
}
</style>
