<script lang="ts">
import { onMount, tick } from "svelte";
import { createNote, updateNote, deleteNote, linkNoteToTag } from "../../../lib/notes";
import { getAllTags, createTag, deleteTag, updateTag, getNotesByTag } from "../../../lib/tags";
import SectionCard from "./SectionCard.svelte";

let sections = [];
let visibleSections = 4;
let startIndex = 0;
let activeSectionIndex = 0;
let sessionToken = "";
let userId = "";
let editingSectionId: string | null = null;
let editedSectionName = "";



async function getSessionData() {
    if (typeof window !== "undefined") {
        sessionToken = localStorage.getItem("session_token") || "";
        userId = localStorage.getItem("user_id") || "";

        if (!userId && sessionToken) {
            const response = await fetch("http://localhost:8000/api/check/validate-session", {
                method: "GET",
                headers: { "session-token": sessionToken }
            });

            const data = await response.json();
            if (data.valid && data.user_id) {
                userId = data.user_id;
                localStorage.setItem("user_id", userId);
            }
        }
    }
}

async function loadSectionsAndNotes() {
    if (!sessionToken || !userId) {
        console.warn("No hay sesión, no se puede cargar notas.");
        return;
    }

    try {
        const tagsData = await getAllTags(sessionToken);

        sections = await Promise.all(tagsData.map(async tag => {
            const rawNotes = await getNotesByTag(tag.uuid, sessionToken);

            const notes = rawNotes.map(note => ({
                id: note.uuid, 
                title: note.title,
                content: note.content,
            }));

            return {
                id: tag.uuid,
                sectionTitle: tag.name,
                notes
            };
        }));

        sections = [...sections];
        await tick();
    } catch (error) {
        console.error("Error al cargar notas y secciones:", error);
        sections = [];
    }
}



async function initApp() {
    if (typeof window !== "undefined") {
        await getSessionData();
        await loadSectionsAndNotes();
    }
}
initApp();


// CRUDS de notas y tags


async function handleCreateNote() {
  if (!sections[activeSectionIndex]) return;

  const activeSection = sections[activeSectionIndex];
  const existingTitles = activeSection.notes.map(n => n.title);

  const baseTitle = "New Note";
  let title = baseTitle;
  let content = "Write here...";
  let counter = 1;
  let createdNote = null;

  try {
    while (!createdNote) {
      while (existingTitles.includes(title)) {
        title = `${baseTitle} ${counter}`;
        counter++;
      }

      const response = await createNote(title, content, sessionToken);

      if (response?.note) {
        createdNote = response.note;
        break;
      }

      if (response?.detail?.includes("Ya existe una nota con ese titulo")) {
        console.warn(" Título repetido, generando otro...");
        title = `${baseTitle} ${counter}`;
        counter++;
        continue;
      }

      return;
    }

    if (activeSection.id !== "untagged") {
      const tagResponse = await linkNoteToTag(createdNote.uuid, activeSection.id, sessionToken);
    }

    activeSection.notes.push({
      id: createdNote.uuid,
      title: createdNote.title,
      content: createdNote.content
    });

    sections = [...sections];
    await tick();

    console.log("Nota creada correctamente:", createdNote.title);
  } catch (error) {
    console.error("Error en handleCreateNote:", error);
  }
}




 async function handleDeleteNote(event) {
    const note_uuid = event.detail.note_uuid;


    try {
        const response = await deleteNote(note_uuid, sessionToken);

        if (!response || !response.note) {
            console.error("Error: La API no eliminó la nota correctamente.");
            return;
        }

        sections.forEach(section => {
            section.notes = section.notes.filter(note => note.id !== note_uuid);
        });

        sections = [...sections];
        await tick();

    } catch (error) {
        console.error("Error al eliminar la nota:", error);
    }
}

async function handleUpdateNote(event) {
    const { note_uuid, title, content } = event.detail;

    try {
        const response = await updateNote(note_uuid, title, content, sessionToken);

        if (!response || !response.note) {
            console.error("Error: La API no actualizó la nota correctamente.");
            return;
        }

        let updatedSection = sections.find(section => 
            section.notes.some(note => note.id === note_uuid)
        );


        await linkNoteToTag(note_uuid, updatedSection.id, sessionToken);

        sections.forEach(section => {
            const noteIndex = section.notes.findIndex(note => note.id === note_uuid);
            if (noteIndex !== -1) {
                section.notes[noteIndex] = {
                    id: response.note.uuid, 
                    title: response.note.title, 
                    content: response.note.content,
                };
            }
        });

        sections = [...sections];
        await tick();

    } catch (error) {
        console.error("Error al actualizar la nota:", error);
    }
}

async function handleCreateTag() {
    let baseName = "New Tag";
    let newName = baseName;
    let counter = 1;

    const existingNames = sections.map(section => section.sectionTitle);

    while (existingNames.includes(newName)) {
        newName = `${baseName}${counter}`;
        counter++;
    }

    try {
        const newTag = await createTag(newName, sessionToken);

        if  (!newTag || !newTag.tag || !newTag.tag.uuid) 
        {
            console.error("Error al crear la nueva sección:", newTag);
            return;
        }

        sections = [
            ...sections,
            {  id: newTag.tag.uuid, sectionTitle: newTag.tag.name, notes: [] 
        }
        ];

        activeSectionIndex = sections.length - 1;

        await tick();

    } catch (error) {
        console.error("Error al crear la nueva sección:", error);
    }
}



async function handleDeleteTag(sectionId: string) {
    try {
        await deleteTag(sectionId, sessionToken);

        await loadSectionsAndNotes();

        editingSectionId = null;

    } catch (error) {
        console.error("Error al eliminar la sección:", error);
    }
}


async function handleUpdateTag(sectionId: string, newName: string) {
    try {
        await updateTag(sectionId, newName, sessionToken);

        sections = sections.map(section =>
            section.id === sectionId ? { ...section, sectionTitle: newName } : section
        );
        editingSectionId = null;
    } catch (error) {
        console.error("Error al actualizar la sección:", error);
    }
}

function startEditingSection(sectionId: string, currentName: string) {
    editingSectionId = sectionId;
    editedSectionName = currentName;
}



async function saveSectionEdit(sectionId: string) {
  await tick();

  if (editedSectionName.trim() === "") {
    if (editingSectionId !== sectionId) return;
    editingSectionId = null;
    await handleDeleteTag(sectionId);
    return;
  }

  await handleUpdateTag(sectionId, editedSectionName);
}

function previousSection() {
  if (startIndex > 0) {
    startIndex -= 1;
  }
}

function nextSection() {
  if (startIndex + visibleSections < sections.length) {
    startIndex += 1;
  }
}

function updateVisibleSections() {
  if (typeof window !== 'undefined') {
    visibleSections = window.innerWidth < 640 ? 2 : 4;
  }
}

onMount(() => {
  updateVisibleSections();
  window.addEventListener('resize', updateVisibleSections);
  return () => window.removeEventListener('resize', updateVisibleSections);
});

</script>



<style>
</style>
  
<!-- Botones en mobile -->
<div class="w-full px-4 mt-4 sm:hidden flex justify-between mb-4">
  <button on:click={handleCreateNote}
    class="p-3 rounded-lg shadow-md text-sm
    bg-[#ECE6F0] text-[#65558F] dark:bg-[rgba(50,50,50,0.9)] dark:text-white
    hover:bg-[#d3c8e0] dark:hover:bg-darkHover hover:scale-105 transition-all duration-200 ease-in-out">
    + New note
  </button>

  <button on:click={handleCreateTag}
    class="p-3 rounded-lg shadow-md text-sm
    bg-[#ECE6F0] text-[#65558F] dark:bg-[rgba(50,50,50,0.9)] dark:text-white
    hover:bg-[#d3c8e0] dark:hover:bg-darkHover hover:scale-105 transition-all duration-200 ease-in-out">
    + New Tag
  </button>
</div>


<div class="flex items-center w-full px-4  mb-4 relative">

  <!-- Botones en escritorio -->
  <button on:click={handleCreateNote}
    class="hidden sm:block absolute left-0
    p-3 rounded-lg shadow-md text-lg
    bg-[#ECE6F0] text-[#65558F] dark:bg-[rgba(50,50,50,0.9)] dark:text-white
    hover:bg-[#d3c8e0] dark:hover:bg-darkHover hover:scale-105 transition-all duration-200 ease-in-out">
    + New note
  </button>

  <button on:click={handleCreateTag}
    class="hidden sm:block absolute right-0
    p-3 rounded-lg shadow-md text-lg
    bg-[#ECE6F0] text-[#65558F] dark:bg-[rgba(50,50,50,0.9)] dark:text-white
    hover:bg-[#d3c8e0] dark:hover:bg-darkHover hover:scale-105 transition-all duration-200 ease-in-out">
    + New Tag
  </button>

  <!-- Flechas y secciones -->
  <div class="mx-auto flex items-center space-x-4 sm:space-x-6 overflow-x-auto sm:overflow-visible px-2">
    <button on:click={previousSection} class="text-black dark:text-white text-xl">
      &#9664;
    </button>

    {#each sections.slice(startIndex, startIndex + visibleSections) as section, index}
      {#if editingSectionId === section.id}
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          bind:value={editedSectionName}
          class="border-none px-4 py-2 rounded-full text-lg outline-none bg-[rgba(231,222,222,1)]
          dark:bg-[rgba(50,50,50,0.9)] dark:text-white"
          on:blur={() => saveSectionEdit(section.id)} 
          on:keydown={(e) => { 
              if (e.key === 'Enter') {
              e.preventDefault();
              saveSectionEdit(section.id);
              }
          }}
          autofocus
        />
      {:else}
        <button 
          class="px-5 py-2 rounded-full shadow-md font-bold text-black dark:text-white transition-colors duration-200 
          bg-[rgba(231,222,222,1)] dark:bg-[rgba(50,50,50,0.9)] hover:bg-[rgba(213,147,209,0.6)]
          dark:hover:bg-darkHover whitespace-nowrap
          {index + startIndex === activeSectionIndex ? 'bg-[rgba(213,147,209,0.87)] dark:bg-darkHover text-white' : ''}"
          on:dblclick={() => startEditingSection(section.id, section.sectionTitle)}
          on:click={() => activeSectionIndex = index + startIndex}>
          {section.sectionTitle}
        </button>
      {/if}
    {/each}

    <button on:click={nextSection} class="text-black dark:text-white text-xl">
      &#9654;
    </button>
  </div>
</div>

  
  {#if sections.length > 0 && sections[activeSectionIndex]}
    <div class="max-h-[440px] overflow-y-auto grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 justify-items-center">
      {#each sections[activeSectionIndex].notes as note}
        <SectionCard notes={[note]} on:deleteNote={handleDeleteNote} on:updateNote={handleUpdateNote} />
      {/each}
    </div>
  {:else}
    <p class="text-gray-500 dark:text-gray-300">No hay notas disponibles.</p>
  {/if}
  
  