<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button
          type="button"
          class="modal-close"
          @click="close"
          title="Close modal"
        >&times;</button>
      </header>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue';

export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => emit('close');

    // Close the modal when the Escape key is pressed
    const onKeydown = (e) => {
      if (e.key === 'Escape') close();
    };

    onMounted(() => {
      document.addEventListener('keydown', onKeydown);
      // Prevent the background from scrolling while the modal is open
      document.body.style.overflow = 'hidden';
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = '';
    });

    return { close };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #ecf0f1;
  background: #fafbfc;
}
.modal-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
}
.modal-close:hover {
  color: #2c3e50;
  background-color: #ecf0f1;
}
.modal-body {
  padding: 1.5rem;
}
</style>
