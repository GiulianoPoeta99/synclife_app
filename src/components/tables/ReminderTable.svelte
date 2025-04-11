<script lang="ts">
  import { tick } from "svelte";
  import {
    getAllReminders,
    createReminder,
    updateReminder,
    deleteReminder
  } from "../../lib/reminders";
  
  let reminders = [];
  let sessionToken = "";
  let userId = "";
  let searchQuery = "";
  let editingReminderId: string | null = null;
  let editedValues = { title: "", remind_date: "" };
  let showDeleteModal = false;
  let reminderToDelete: string | null = null;

  
  $: filteredReminders = [...(searchQuery
    ? reminders.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : reminders)].sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime());
  
  async function getSessionData() {
    if (typeof window !== "undefined") {
      sessionToken = localStorage.getItem("session_token") || "";
      userId = localStorage.getItem("user_id") || "";
    }
  }
  
  async function loadReminders() {
    if (!sessionToken || !userId) return;
    try {
      const data = await getAllReminders(sessionToken);
      if (!Array.isArray(data.items)) {
      console.error("Respuesta inválida del backend:", data);
      reminders = [];
      return;
      }

      reminders = data.items.map(r => ({
        ...r,
        id: r.uuid
      }));
      await tick();
    } catch (error) {
      console.error("Error al cargar recordatorios:", error);
    }
  }
  
  async function initApp() {
    await getSessionData();
    await loadReminders();
  }
  initApp();
  
  async function handleCreateReminder() {
    const title = "New Reminder";
    const remind_date = getTomorrowDate();
  
    try {
      const reminder = await createReminder(title, remind_date, sessionToken);
      if (!reminder) return;
  
      reminders = [...reminders, { ...reminder, id: reminder.uuid }];
      await tick();
    } catch (error) {
      console.error("Error al crear el recordatorio:", error);
    }
  }
  
  function enableEdit(reminder) {
    editingReminderId = reminder.id;
    editedValues = {
      title: reminder.title,
      remind_date: reminder.remind_date
    };
  }
  
  async function handleUpdateReminder(reminder) {
    try {
      const updated = await updateReminder(reminder.id, editedValues.title, editedValues.remind_date, sessionToken);
      if (!updated) return;
  
      reminders = reminders.map(r =>
        r.id === reminder.id
          ? { ...r, title: updated.title, remind_date: updated.remind_date }
          : r
      );
      editingReminderId = null;
      await tick();
    } catch (error) {
      console.error("Error al actualizar el recordatorio:", error);
    }
  }
  
  async function handleDeleteReminder(reminderId: string) {
  try {
    const result = await deleteReminder(reminderId, sessionToken);
    if (!result) return;

    reminders = reminders.filter(r => r.id !== reminderId);
    await tick();
  } catch (error) {
    console.error("Error al eliminar el recordatorio:", error);
  }
}


  function confirmDelete(reminderId: string) {
  reminderToDelete = reminderId;
  showDeleteModal = true;
  }
  
  function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }
  
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  }
  </script>
  
  <div class="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-4 px-4 sm:px-6 py-4">
    <div class="flex justify-center sm:justify-start">
      <button
        on:click={handleCreateReminder}
        class="w-full max-w-[150px] p-4 whitespace-nowrap rounded-lg shadow-md transition-all duration-200 ease-in-out
               bg-[#ECE6F0] dark:bg-[rgba(50,50,50,0.9)] text-[#65558F] dark:text-white 
               hover:bg-[#d3c8e0] dark:hover:bg-darkHover hover:scale-105"
      >
        + New Reminder
      </button>
    </div>
  
    <div class="flex justify-center">
      <fieldset class="w-full max-w-[250px]">
        <input
          type="text"
          bind:value={searchQuery}
          class="input w-full text-center text-sm sm:text-base
                 bg-[#F3EDF7] dark:bg-[rgba(50,50,50,0.9)]
                 dark:placeholder-white placeholder-black"
          placeholder="🔍︎ Search your reminder"
        />
      </fieldset>
    </div>
  
    <div class="hidden sm:block"></div>
  </div>
  
  <div class="overflow-x-auto w-full px-2 sm:px-4 md:px-6">
    <table class="min-w-full border-separate border-spacing-y-2 text-sm sm:text-base">
      <thead class="text-black dark:text-white text-left">
        <tr>
          <th class="px-3 py-2 sm:px-6 sm:py-3">Name</th>
          <th class="px-3 py-2 sm:px-4 sm:py-3">Date</th>
          <th class="px-3 py-2 sm:px-6 sm:py-3 text-center w-[90px] sm:w-[140px] md:w-[160px]"></th>
        </tr>
      </thead>
      <tbody>
        {#each filteredReminders as reminder, index (reminder.id)}
          <tr class="text-black dark:text-white rounded-full overflow-hidden">
            <td class="px-3 py-3 sm:px-4 sm:py-5 rounded-l-full"
                class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
                class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
              {#if editingReminderId === reminder.id}
                <input
                  type="text"
                  bind:value={editedValues.title}
                  class="w-full p-2 text-sm border border-[rgba(191,80,183,0.4)] 
                         bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] 
                         text-black dark:text-white rounded-md focus:ring-2 
                         focus:ring-lightColor dark:focus:ring-darkHover"
                />
              {:else}
                {reminder.title}
              {/if}
            </td>
  
            <td class="px-3 py-3 sm:px-4 sm:py-5 rounded-r-full"
                class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
                class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
              {#if editingReminderId === reminder.id}
                <input
                  type="date"
                  bind:value={editedValues.remind_date}
                  class="w-full p-2 text-sm border border-[rgba(191,80,183,0.4)] 
                         bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] 
                         text-black dark:text-white rounded-md focus:ring-2 
                         focus:ring-lightColor dark:focus:ring-darkHover"
                />
              {:else}
                {formatDate(reminder.remind_date)}
              {/if}
            </td>
  
            <td class="px-2 py-3 flex gap-2 justify-center">
              {#if editingReminderId === reminder.id}
                <button on:click={() => editingReminderId = null}
                  class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                         dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">✖</button>
                <button on:click={() => handleUpdateReminder(reminder)}
                  class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                         dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                  <img src="src/icons/notes/save.png" alt="Guardar" class="w-4 h-4" />
                </button>
              {:else}
                <button on:click={() => enableEdit(reminder)}
                  class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                         dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                  <img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4" />
                </button>
                <button on:click={() => confirmDelete(reminder.id)}
                  class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                         dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                  <img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4" />
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if showDeleteModal}
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="w-full max-w-[90%] sm:max-w-md bg-[#ECE6F0] dark:bg-[rgba(50,50,50,0.95)] text-[#65558F] dark:text-white p-6 rounded-2xl shadow-xl border border-[#d3c8e0] dark:border-[#444]">

      <h2 class="text-xl font-bold text-center mb-4">Do you want to delete the reminder?</h2>
      <p class="text-center text-sm mb-6 text-[#65558F] dark:text-gray-300">Esta acción no se puede deshacer.</p>

      <div class="flex justify-between gap-4">
        <button
          on:click={() => {
            showDeleteModal = false;
            reminderToDelete = null;
          }}
          class="flex-1 bg-[#ECE6F0] dark:bg-[rgba(255,255,255,0.1)] text-[#65558F] dark:text-white px-4 py-2 rounded-full shadow-md hover:bg-[#d3c8e0] dark:hover:bg-darkHover transition"
        >
          Cancel
        </button>

        <button
          on:click={async () => {
            if (reminderToDelete) {
              await handleDeleteReminder(reminderToDelete);
              showDeleteModal = false;
              reminderToDelete = null;
            }
          }}
          class="flex-1 bg-[#FF66A3] hover:bg-[#e05591] text-white px-4 py-2 rounded-full shadow-md transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}

  </div>
  