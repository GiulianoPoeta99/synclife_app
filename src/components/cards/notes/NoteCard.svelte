<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let title: string;
  export let content: string;
  export let noteId: string;

  let isEditing = false;
  let editedTitle = "";
  let editedContent = "";

  const dispatch = createEventDispatcher();

  function toggleEdit() {
    isEditing = !isEditing;

    if (isEditing) {
      editedTitle = title;
      editedContent = content;
    }
  }

  function saveChanges() {
    isEditing = false;
    dispatch("updateNote", {
      noteId,
      title: editedTitle,
      content: editedContent,
    });
  }

  function deleteNote() {
    dispatch("deleteNote", { noteId });
  }
</script>

<style>
  .note-card {
    background-color: rgba(213, 147, 209, 0.28); 
    width: 328px;
    height: 200px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .note-title {
    background-color: rgba(191, 80, 183, 0.17);
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    color: black;
  }
  
  .note-content {
    color: rgba(0, 0, 0, 0.75);
    font-size: 14px;
    line-height: 1.4;
    overflow-y: auto;
    max-height: 100px;
    word-wrap: break-word;
    padding-right: 5px;
    flex-grow: 1;
  }

  .note-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .note-content::-webkit-scrollbar-thumb {
    background-color: rgba(191, 80, 183, 0.5);
    border-radius: 4px;
  }

  
  .btn {
    background-color: rgba(191, 80, 183, 0.17);
    color: rgba(0, 0, 0, 0.95);
    font-size: 1rem;
    padding: 4px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    transition: background-color 0.2s ease-in-out;
  }

  .btn:hover {
    background-color: rgba(191, 80, 183, 0.35);
  }
  
  .btn-container {
    display: flex;
    gap: 5px;
  }
  
  .icon {
    width: 14px;
    height: 14px;
  }

  .edit-mode {
    background-color: rgba(213, 147, 209, 0.28);
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-field, .textarea-field {
    background-color: rgba(213, 147, 209, 0.28);
    color: black;
    border: 1px solid rgba(191, 80, 183, 0.4);
    padding: 5px;
    width: 100%;
    border-radius: 5px;
    font-size: 14px;
  }

  .textarea-field {
    max-height: 80px;
    overflow-y: auto; 
  }
</style>

<div class="note-card">
  <div class="flex justify-between items-center mb-2">
    <span class="note-title">{title}</span>
    <div class="btn-container">
      <button on:click={toggleEdit} class="btn">
        <img src="src/icons/notes/edit.svg" alt="Editar" class="icon" />
      </button>
      <button on:click={deleteNote} class="btn">
        <img src="src/icons/notes/delete.svg" alt="Eliminar" class="icon" />
      </button>
    </div>
  </div>

  {#if isEditing}
    <div class="edit-mode">
      <input type="text" bind:value={editedTitle} class="input-field" />
      <textarea bind:value={editedContent} class="textarea-field"></textarea>
      <button on:click={saveChanges} class="btn">
        <img src="src/icons/notes/save.png" alt="Guardar" class="icon" />
      </button>
    </div>
  {:else}
    <p class="note-content">{content}</p>
  {/if}
</div>
