<script lang="ts">
import { tick } from "svelte";
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
            const response = await fetch("http://localhost:8000/api/v1/check/validate-session", {
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
            const notes = await getNotesByTag(tag.tag.id, sessionToken);
            return {
                id: tag.tag.id,
                sectionTitle: tag.tag.name,
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

    let baseName = "New Note";
    let counter = 1;

    const existingNames = activeSection.notes.map(note => note.title);
    
    let noteTitle = baseName;
    while (existingNames.includes(noteTitle)) {
        noteTitle = `${baseName} ${counter}`;
        counter++;
    }

    let noteContent = "Write here...";

    try {

        let response = await createNote(userId, noteTitle, noteContent, sessionToken);

        while (response.detail && response.detail.includes("Ya existe una nota con ese titulo")) {
            
            noteTitle = `${baseName} ${counter}`;
            counter++;

            response = await createNote(userId, noteTitle, noteContent, sessionToken);
        }

        if (!response || !response.note) {
            console.error("Error: La API no devolvió la nota creada.", response);
            return;
        }


        if (activeSection.id !== "untagged") {
            await linkNoteToTag(response.note.id, activeSection.id, sessionToken);
        }

        activeSection.notes.push({
            id: response.note.id,
            title: response.note.title,
            content: response.note.content
        });

        sections = [...sections];
        await tick();

        console.log("Nota creada correctamente.");
    } catch (error) {
        console.error("Error al crear la nota:", error);
    }
}

 async function handleDeleteNote(event) {
    const noteId = event.detail.noteId;

    try {
        const response = await deleteNote(noteId, sessionToken);

        if (!response || !response.note) {
            console.error("Error: La API no eliminó la nota correctamente.");
            return;
        }

        sections.forEach(section => {
            section.notes = section.notes.filter(note => note.id !== noteId);
        });

        sections = [...sections];
        await tick();

    } catch (error) {
        console.error("Error al eliminar la nota:", error);
    }
}

async function handleUpdateNote(event) {
    const { noteId, title, content } = event.detail;

    try {
        const response = await updateNote(noteId, title, content, sessionToken);

        if (!response || !response.note) {
            console.error("Error: La API no actualizó la nota correctamente.");
            return;
        }

        let updatedSection = sections.find(section => 
            section.notes.some(note => note.id === noteId)
        );


        await linkNoteToTag(noteId, updatedSection.id, sessionToken);

        sections.forEach(section => {
            const noteIndex = section.notes.findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                section.notes[noteIndex] = {
                    id: response.note.id, 
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
        const newTag = await createTag(userId, newName, sessionToken);

        if (!newTag || !newTag.tag || !newTag.tag.id) {
            console.error("Error al crear la nueva sección:", newTag);
            return;
        }

        sections = [
            ...sections,
            { id: newTag.tag.id, sectionTitle: newTag.tag.name, notes: [] }
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
    if (editedSectionName.trim() === "") {

        if (editingSectionId !== sectionId) return;
        editingSectionId = null;

        await handleDeleteTag(sectionId);
        return;
    }

    await handleUpdateTag(sectionId, editedSectionName);
}




function previousSection() {
    startIndex = Math.max(0, startIndex - 1);
}

function nextSection() {
    startIndex = Math.min(sections.length - visibleSections, startIndex + 1);
}

</script>

<style>
    .section-btn {
      background-color: rgba(231, 222, 222, 1);
      border-radius: 24px;
      padding: 10px 20px;
      transition: background-color 0.2s ease-in-out;
    }
  
    .section-btn.active {
      background-color: rgba(213, 147, 209, 0.87);
    }
  
    .section-btn:hover {
      background-color: rgba(213, 147, 209, 0.6);
      color: black;
    }
    
    .section-input {
    border: none;
    padding: 6px 10px;
    border-radius: 24px;
    font-size: 16px;
    outline: none;
    background-color: rgba(231, 222, 222, 1);
    }

    .add-btn {
      background-color: #ECE6F0;
      color: #65558F;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
      transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
    }
  
    .add-btn:hover {
      background-color: #d3c8e0;
      transform: scale(1.05);
    }
  
    .notes-container {
      max-height: 440px; 
      overflow-y: auto; 
      display: grid;
      grid-template-columns: repeat(3, 1fr); 
      gap: 8px;
      padding: 10px;
      justify-content: center;
    }
  
    .notes-container::-webkit-scrollbar {
      width: 6px;
    }
  
    .notes-container::-webkit-scrollbar-thumb {
      background-color: rgba(191, 80, 183, 0.5);
      border-radius: 4px;
    }
  </style>
  
  <div class="flex flex-col items-center w-full px-4 mt-4 mb-16">
    <button on:click={handleCreateNote} class="pr-7 pl-7 pt-3 pb-3 add-btn rounded-lg shadow-md text-xl absolute left-60">
      +
    </button>
  
    <div class="flex items-center space-x-14">
      <button on:click={previousSection} class="p-1 text-black text-xl">
        &#9664;
      </button>
  
      {#each sections.slice(startIndex, startIndex + visibleSections) as section, index}
        {#if editingSectionId === section.id}
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="text"
            bind:value={editedSectionName}
            class="section-input"
            on:blur={() => setTimeout(() => saveSectionEdit(section.id), 100)} 
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
            class="section-btn shadow-md transition font-bold text-black {index + startIndex === activeSectionIndex ? 'active text-white' : ''}"
            on:dblclick={() => startEditingSection(section.id, section.sectionTitle)}
            on:click={() => activeSectionIndex = index + startIndex}>
            {section.sectionTitle}
          </button>
        {/if}
      {/each}
  
      <button on:click={nextSection} class="p-1 text-black text-xl">
        &#9654;
      </button>
    </div>
  
    <button on:click={handleCreateTag} class="p-3 add-btn rounded-lg shadow-md absolute right-20">
      + New Tag
    </button>
  </div>
  
  {#if sections.length > 0 && sections[activeSectionIndex]}
    <div class="notes-container">
      {#each sections[activeSectionIndex].notes as note}
        <SectionCard notes={[note]} on:deleteNote={handleDeleteNote} on:updateNote={handleUpdateNote} />
      {/each}
    </div>
  {:else}
    <p class="text-gray-500">No hay notas disponibles.</p>
  {/if}
  
  