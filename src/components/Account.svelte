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
      if (!confirm("¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.")) return;
  
      const success = await deleteUser(sessionToken);
      if (success) {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_id");
        window.location.href = "/login";
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
              {value}
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
        <button on:click={handleDeleteAccount}
            class="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-md w-full sm:w-auto">
            DELETE ACCOUNT
        </button>
        </div>

    {:else}
      <p class="text-center text-gray-500 dark:text-gray-300">Loading user data...</p>
    {/if}
  </div>
  