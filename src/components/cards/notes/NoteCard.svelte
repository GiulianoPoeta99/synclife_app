<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

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
    editedContent = content === "\u200B" ? "" : content;
  }
}


  function saveChanges() {
    isEditing = false;
    console.log("NoteCard - updateNote:"),
    dispatch("updateNote", {
    note_uuid:noteId,
    title: editedTitle,
    content: editedContent,
  });

  }

  function deleteNote() {
    console.log("NoteCard - deleteNote:", { note_uuid: noteId });
    dispatch("deleteNote", { note_uuid:noteId });
  }
</script>

<style></style>

<div class="w-[328px] h-[200px] p-3 flex flex-col rounded-lg shadow-md 
  bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(60,60,60,0.5)]">

  <div class="flex justify-between items-center">
    <span class="px-2 py-1 text-sm font-bold rounded bg-[rgba(191,80,183,0.17)] dark:bg-[rgba(100,100,100,0.5)] text-black dark:text-white">
      {title}
    </span>
    <div class="flex gap-2">
      <button on:click={toggleEdit} class="w-7 h-7 flex items-center justify-center 
        rounded-md bg-[rgba(191,80,183,0.17)] dark:bg-[#FF66A3]
        transition-colors duration-200 hover:bg-[rgba(191,80,183,0.35)] dark:hover:bg-darkHover">
        <img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4" />
      </button>
      <button on:click={deleteNote} class="w-7 h-7 flex items-center justify-center 
        rounded-md bg-[rgba(191,80,183,0.17)] dark:bg-[#FF66A3]
        transition-colors duration-200 hover:bg-[rgba(191,80,183,0.35)] dark:hover:bg-darkHover">
        <img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4" />
      </button>
    </div>
  </div>

  {#if isEditing}
    <div class="mt-2 p-2 rounded-lg flex flex-col gap-2 bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(70,70,70,0.5)]">
      <input type="text" bind:value={editedTitle} class="w-full p-2 text-sm border border-[rgba(191,80,183,0.4)] 
        bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] text-black dark:text-white 
        rounded-md focus:ring-2 focus:ring-lightColor dark:focus:ring-darkHover">
        <textarea
        bind:value={editedContent}
        placeholder="Write here..."
        class="w-full p-2 text-sm border border-[rgba(191,80,183,0.4)] 
               bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] text-black dark:text-white 
               rounded-md focus:ring-2 focus:ring-lightColor dark:focus:ring-darkHover max-h-20">
      </textarea>
      <button on:click={saveChanges} class="w-7 h-7 flex items-center justify-center 
        rounded-md bg-[rgba(191,80,183,0.17)] dark:bg-[rgba(100,100,100,0.5)]
        transition-colors duration-200 hover:bg-[rgba(191,80,183,0.35)] dark:hover:bg-[rgba(150,150,150,0.5)]">
        <img src="src/icons/notes/save.png" alt="Guardar" class="w-4 h-4" />
      </button>
    </div>
  {:else}
    <p class="mt-2 text-sm leading-relaxed text-[rgba(0,0,0,0.75)] dark:text-[rgba(255,255,255,0.75)] 
    overflow-y-auto max-h-[100px] pr-1 break-words">
      {content}
   </p>

  {/if}
</div>

