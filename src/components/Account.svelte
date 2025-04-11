<script lang="ts">
    import { onMount, tick } from "svelte";
    import {
      getUser,
      updateUser,
      deleteUser,
      requestChangePassword,
      updateUserPassword
    } from "../lib/users";
  
    let sessionToken = "";
    let user = null;
  
    let isEditing = {
      first_name: false,
      last_name: false,
      email: false,
      phone: false,
      birth_date: false
    };
  
    let newPassword = "";
    let repeatPassword = "";
    let token = "";
    let showSavePassword = false;
    let showDeleteModal = false;
  
    onMount(async () => {
      sessionToken = localStorage.getItem("session_token") || "";
      if (sessionToken) {
        const data = await getUser(sessionToken);
        if (data && data.first_name) {
          user = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            birth_date: data.birth_date
          };
        }
      }
    });
  
    async function saveField(field: string) {
      if (!user) return;
      const success = await updateUser(
        user.first_name,
        user.last_name,
        user.birth_date,
        user.phone,
        user.email,
        sessionToken
      );
      if (success) {
        isEditing[field] = false;
        await tick();
      }
    }
  
    async function sendToken() {
      if (!user) return;
      const success = await requestChangePassword(user.email);
      if (success) {
        alert("Token enviado a tu email.");
        showSavePassword = true;
      }
    }
  
    async function saveNewPassword() {
      if (newPassword !== repeatPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
  
      const success = await updateUserPassword(newPassword, token);
      if (success) {
        alert("Contraseña actualizada correctamente.");
        newPassword = "";
        repeatPassword = "";
        token = "";
        showSavePassword = false;
      }
    }
  
    async function handleDeleteAccount() {
      const success = await deleteUser(sessionToken);
      if (success) {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_id");
        window.location.href = "/login";
      }
    }

    function formatDate(dateString: string): string {
      const [year, month, day] = dateString.split('-').map(Number);
      const localDate = new Date(year, month - 1, day); // <-- Sin UTC
      return localDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
  });

  function confirmDelete(reminderId: string) {
  showDeleteModal = true;
  }
}

  </script>
  
  <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
    {#if user}
      {#each Object.entries(user) as [field, value]}
        <div class="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-2 sm:gap-4">
          <span class="w-[120px] capitalize font-semibold text-black dark:text-white">
            {field.replace('_', ' ')}
          </span>
  
          {#if isEditing[field]}
            <input
              type={field === 'birth_date' ? 'date' : 'text'}
              bind:value={user[field]}
              class="bg-pink-200 text-black dark:bg-[rgba(255,255,255,0.1)] dark:text-white px-4 py-2 rounded-full w-full sm:w-auto"
            />
            <button
              on:click={() => saveField(field)}
              class="bg-[#ECE6F0] text-[#65558F] dark:bg-[rgba(50,50,50,0.9)] dark:text-white px-4 py-2 rounded-full shadow-md hover:bg-[#d3c8e0] dark:hover:bg-darkHover transition-all"
            >
              Save
            </button>
          {:else}
            <div class="bg-pink-200 text-black px-4 py-2 rounded-full dark:bg-[rgba(255,255,255,0.1)] dark:text-white w-full sm:w-auto">
              {field == 'birth_date' ? formatDate(value as string) : value}
            </div>
            <button
              on:click={() => isEditing[field] = true}
              class="bg-[#ECE6F0] text-[#65558F] dark:bg-darkHover dark:text-white px-4 py-2 rounded-full shadow-md hover:bg-[#d3c8e0] dark:hover:bg-[#FF66A3] transition-all"
            >
              Edit
            </button>
          {/if}
        </div>
      {/each}
        
      <hr class="border-t border-gray-400 dark:border-gray-600 my-6" />


      <h3 class="mt-6 mb-2 font-semibold text-xl text-center sm:text-left text-gray-600 dark:text-gray-300">
        Change Password
      </h3>
  
      <input type="password" bind:value={newPassword} placeholder="New password"
        class="w-full mt-2 bg-[#F3EDF7] dark:bg-[rgba(50,50,50,0.9)] placeholder-black dark:placeholder-white px-4 py-2 rounded-lg" />
  
      <input type="password" bind:value={repeatPassword} placeholder="Repeat new password"
        class="w-full mt-2 bg-[#F3EDF7] dark:bg-[rgba(50,50,50,0.9)] placeholder-black dark:placeholder-white px-4 py-2 rounded-lg" />
  
      <div class="flex flex-col sm:flex-row gap-2 mt-4">
        <input type="text" bind:value={token} placeholder="Token"
          class="w-full sm:w-auto bg-[#F3EDF7] dark:bg-[rgba(50,50,50,0.9)] placeholder-black dark:placeholder-white px-4 py-2 rounded-lg" />
        <button on:click={sendToken}
          class="bg-[#ECE6F0] text-[#65558F] dark:bg-darkHover dark:text-white px-4 py-2 rounded-full shadow-md hover:bg-[#d3c8e0] dark:hover:bg-[#FF66A3] transition-all">
          Send token
        </button>
      </div>
  
      {#if showSavePassword}
        <div class="flex justify-start mt-4">
            <button on:click={saveNewPassword}
            class="bg-[#ECE6F0] text-[#65558F] dark:bg-[rgba(50,50,50,0.9)] dark:text-white px-4 py-2 rounded-full shadow-md hover:bg-[#d3c8e0] dark:hover:bg-darkHover transition-all">
            Save
            </button>
        </div>
        {/if}

        <hr class="border-t border-gray-400 dark:border-gray-600 my-6" />


        <div class="mt-16">
          <button on:click={() => {
            showDeleteModal = true;
          }}
          class="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-md w-full sm:w-auto">
          DELETE ACCOUNT
        </button>
        
        </div>

    {:else}
      <p class="text-center text-gray-500 dark:text-gray-300">Loading user data...</p>
    {/if}

    {#if showDeleteModal}
    <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div class="w-full max-w-[90%] sm:max-w-md bg-[#ECE6F0] dark:bg-[rgba(50,50,50,0.95)] text-[#65558F] dark:text-white p-6 rounded-2xl shadow-xl border border-[#d3c8e0] dark:border-[#444]">
  
        <h2 class="text-xl font-bold text-center mb-4">Do you want to delete the user?</h2>
        <p class="text-center text-sm mb-6 text-[#65558F] dark:text-gray-300">Esta acción no se puede deshacer.</p>
  
        <div class="flex justify-between gap-4">
          <button
            on:click={() => {
              showDeleteModal = false;
            }}
            class="flex-1 bg-[#ECE6F0] dark:bg-[rgba(255,255,255,0.1)] text-[#65558F] dark:text-white px-4 py-2 rounded-full shadow-md hover:bg-[#d3c8e0] dark:hover:bg-darkHover transition"
          >
            Cancel
          </button>
  
          <button
            on:click={async () => {
                await handleDeleteAccount();  
                showDeleteModal = false;
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
  