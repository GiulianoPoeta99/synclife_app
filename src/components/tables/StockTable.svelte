<script lang="ts">

import { tick } from "svelte";
import { 
  getAllInventoryItems, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from "../../lib/inventory";  
 
let inventory = [];
let sessionToken = "";
let userId = "";
let searchQuery = "";
let editingItemId: string | null = null;
let editedValues = { product_name: "", amount: 0, expiration_date: "" };
let filteredInventoryList = [];

$: filteredInventoryList = [...(searchQuery
    ? inventory.filter(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : inventory)]
    .sort((a, b) => new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime());


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


async function loadInventory() {
    if (!sessionToken || !userId) {
        console.warn("No hay sesión, no se puede cargar el inventario.");
        return;
    }

    try {
        const data = await getAllInventoryItems(sessionToken);


        console.log("Respuesta del backend:", data);
        if (!Array.isArray(data.inventory_items)) {
            console.error("Error: La API no devolvió una lista válida.", data);
            inventory = []; 
            return;
        }

        inventory = data.inventory_items.map(item => ({
            ...item,
            id: item.uuid 
        }));

        await tick();
    } catch (error) {
        console.error("Error al cargar el inventario:", error);
        inventory = [];
    }
}



async function initApp() {
    if (typeof window !== "undefined") {
        await getSessionData();
        await loadInventory();
    }
}
initApp();

//CRUDS de inventory

async function handleCreateItem() {
    let productName = "New Item";
    let amount = 1;
    let expirationDate = getTomorrowDate(); 

    try {
        const response = await createInventoryItem(productName, amount, expirationDate, sessionToken);

        if (!response || !response.item) {
            console.error("Error: La API no devolvió el producto creado.", response);
            return;
        }

        const newItem = { ...response.item, id: response.item.uuid };
        inventory.push(newItem);


        inventory = [...inventory];
        await tick();

        console.log("Producto creado correctamente.");
    } catch (error) {
        console.error("Error al crear el producto:", error);
    }
}


async function handleDeleteItem(event) {
    const itemId = event.detail.itemId;

    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
        const response = await deleteInventoryItem(itemId, sessionToken);

        if (!response) {
            console.error("Error: La API no eliminó el producto correctamente.");
            return;
        }

        inventory = inventory.filter(item => item.id !== itemId);
        await tick();
        console.log("Producto eliminado correctamente.");
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
}


async function handleUpdateItem(item) {
    try {
        const response = await updateInventoryItem(
            item.id,
            editedValues.product_name,
            editedValues.amount,
            editedValues.expiration_date,
            sessionToken
        );

        if (!response || !response.item) {
            console.error("Error: La API no actualizó el producto correctamente.", response);
            return;
        }

        inventory = inventory.map(i =>
            i.id === item.id
                ? { 
                    ...i, 
                    product_name: response.item.product_name,
                    amount: response.item.amount,
                    expiration_date: response.item.expiration_date
                  }
                : i
        );

        editingItemId = null;
        await tick();
        console.log("Producto actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
    }
}

function enableEdit(item) {
    editingItemId = item.id;
    editedValues = { 
        product_name: item.product_name, 
        amount: item.amount, 
        expiration_date: item.expiration_date 
    };
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

<style>
</style>


<div class="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-4 px-4 sm:px-6 py-4">

  <div class="flex justify-center sm:justify-start">
    <button
      on:click={handleCreateItem}
      class="w-full max-w-[150px] p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out
             bg-[#ECE6F0] dark:bg-[rgba(50,50,50,0.9)] text-[#65558F] dark:text-white 
             hover:bg-[#d3c8e0] dark:hover:bg-darkHover hover:scale-105"
    >
      + New item
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
        placeholder="🔍︎ Search your item"
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
        <th class="px-3 py-2 sm:px-4 sm:py-3">Amount</th>
        <th class="px-3 py-2 sm:px-8 sm:py-3">Maturity</th>
        <th class="px-3 py-2 sm:px-6 sm:py-3 text-center w-[90px] sm:w-[140px] md:w-[160px]"></th>
      </tr>
    </thead>
    <tbody>
      {#each filteredInventoryList as item, index (item.id)}

        <tr class="text-black dark:text-white rounded-full overflow-hidden">
          
          <td class="px-3 py-3 sm:px-4 sm:py-5 rounded-l-full"
              class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
              class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
            {#if editingItemId === item.id}
              <input
                type="text"
                bind:value={editedValues.product_name}
                class="w-full p-2 text-sm border border-[rgba(191,80,183,0.4)] 
                       bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] 
                       text-black dark:text-white rounded-md focus:ring-2 
                       focus:ring-lightColor dark:focus:ring-darkHover"
              >
            {:else}
              {item.product_name}
            {/if}
          </td>

          <td class="px-3 py-3 sm:px-6 sm:py-5"
              class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
              class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
            {#if editingItemId === item.id}
              <input
                type="number"
                bind:value={editedValues.amount}
                class="w-full p-2 text-sm border border-[rgba(191,80,183,0.4)] 
                       bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] 
                       text-black dark:text-white rounded-md focus:ring-2 
                       focus:ring-lightColor dark:focus:ring-darkHover"
              >
            {:else}
              {item.amount}
            {/if}
          </td>

          <td class="px-3 py-3 sm:px-6 sm:py-5 rounded-r-full"
              class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
              class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
            {#if editingItemId === item.id}
              <input
                type="date"
                bind:value={editedValues.expiration_date}
                class="w-full text-sm border border-[rgba(191,80,183,0.4)] 
                       bg-[rgba(213,147,209,0.28)] dark:bg-[rgba(50,50,50,0.8)] 
                       text-black dark:text-white rounded-md focus:ring-2 
                       focus:ring-lightColor dark:focus:ring-darkHover"
              >
            {:else}
              {formatDate(item.expiration_date)}
            {/if}
          </td>

          <td class="px-2 py-3 flex gap-2 justify-center">
            {#if editingItemId === item.id}
              <button on:click={() => editingItemId = null}
                class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                       dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                ✖
              </button>
              <button on:click={() => handleUpdateItem(item)}
                class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                       dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                <img src="src/icons/notes/save.png" alt="Guardar" class="w-4 h-4" />
              </button>
            {:else}
              <button on:click={() => enableEdit(item)}
                class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                       dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                <img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4">
              </button>
              <button on:click={() => handleDeleteItem({ detail: { itemId: item.id } })}
                class="p-2 rounded-full shadow-md bg-[rgba(191,80,183,0.17)] 
                       dark:bg-[#FF66A3] hover:bg-gray-200 dark:hover:bg-darkHover">
                <img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4">
              </button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>


