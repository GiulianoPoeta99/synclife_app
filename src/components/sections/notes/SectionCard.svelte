<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import NoteCard from "../../cards/notes/NoteCard.svelte";

  export let notes: { id: string; title: string; content: string }[];

  const dispatch = createEventDispatcher();

  function handleDelete(event) {
    dispatch("deleteNote", { noteId: event.detail.noteId });
  }

  function handleUpdate(event) {
    dispatch("updateNote", { 
      noteId: event.detail.noteId, 
      title: event.detail.title, 
      content: event.detail.content 
    });
  }
</script>

<style>
  .note-list {
  max-height: 1200px; 
  overflow-y: auto; 
  padding-right: 5px;
}

.note-list::-webkit-scrollbar {
  width: 6px;
}

.note-list::-webkit-scrollbar-thumb {
  background-color: rgba(191, 80, 183, 0.5);
  border-radius: 4px;
}
</style>

<div class="note-list grid grid-cols-1 gap-2">
  {#each notes as note}
    <NoteCard 
      noteId={note.id} 
      title={note.title} 
      content={note.content} 
      on:deleteNote={handleDelete} 
      on:updateNote={handleUpdate} 
    />
  {/each}
</div>

