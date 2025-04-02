<script lang="ts">
    import { onMount } from "svelte";
    import { getAllTags, getNotesByTag } from "../../lib/tags";

  
    let sessionToken = "";
    let userId = "";
    let notes = [];
  
    onMount(async () => {
      sessionToken = localStorage.getItem("session_token") || "";
      userId = localStorage.getItem("user_id") || "";
  
      if (sessionToken && userId) {
        try {
          const tags = await getAllTags(sessionToken);
  
          for (const tag of tags) {
            const tagNotes = await getNotesByTag(tag.uuid, sessionToken);
            for (const note of tagNotes) {
              if (notes.length < 3) {
                notes.push({
                  id: note.uuid,
                  title: note.title,
                  content: note.content,
                });
              }
            }
          }
  
          notes = [...notes];
        } catch (err) {
          console.error("Error al obtener notas:", err);
        }
      }
    });
  </script>
  
  <div class="rounded-xl border border-[rgba(100,100,100,0.1)] dark:border-[rgba(255,255,255,0.08)] 
            bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(30,30,30,0.6)] 
            backdrop-blur-md shadow-sm transition-all duration-200 p-4">

    <h2 class="text-lg font-bold flex items-center gap-2 text-[#65558F] dark:text-white mb-4">
      Notes
    </h2>
    <hr class="border-t border-gray-400 dark:border-gray-600 my-6" />
  
    {#if notes.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto">
        {#each notes.slice(0, 4) as note}
          <div class="w-[228px] h-[130px] p-3 flex flex-col rounded-lg shadow-md 
            bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(60,60,60,0.5)]">
            <div class="flex justify-between items-center">
              <span class="px-2 py-1 text-sm font-bold rounded 
                bg-[rgba(191,80,183,0.17)] dark:bg-[rgba(100,100,100,0.5)] 
                text-black dark:text-white">
                {note.title}
              </span>
            </div>
  
            <p class="mt-2 text-sm leading-relaxed text-[rgba(0,0,0,0.75)] 
              dark:text-[rgba(255,255,255,0.75)] overflow-y-auto max-h-[100px] pr-1 break-words">
              {note.content}
            </p>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-sm text-gray-500 dark:text-gray-300">No notes available</p>
    {/if}
  </div>
  
  