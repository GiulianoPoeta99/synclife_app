<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import NoteCard from "../../cards/notes/NoteCard.svelte";

  export let notes: { id: string; title: string; content: string }[];

  const dispatch = createEventDispatcher();

  function handleDelete(event) {
    console.log("SectionCard - forward deleteNote:", event.detail);
    dispatch("deleteNote",  event.detail );
  }

  function handleUpdate(event) {
    console.log("SectionCard - forward updateNote:", event.detail);
    dispatch("updateNote", event.detail);

  }
</script>

<style></style>

<div class= "max-h-[1200px] overflow-y-auto pr-2">
<div class="grid grid-cols-1 gap-2 ">
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
</div>
