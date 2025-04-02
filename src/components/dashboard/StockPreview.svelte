<script lang="ts">
    import { onMount } from "svelte";
    import { getAllInventoryItems } from "../../lib/inventory";
  
    let inventory = [];
    let sessionToken = "";
    let userId = "";
  
    onMount(async () => {
      sessionToken = localStorage.getItem("session_token") || "";
      userId = localStorage.getItem("user_id") || "";
  
      if (sessionToken && userId) {
        const data = await getAllInventoryItems(sessionToken);
        inventory = (data.inventory_items || [])
          .slice(0, 3) // solo los primeros 3
          .map((item: any) => ({
            ...item,
            id: item.uuid,
          }));
      }
    });
  
    function formatDate(dateString: string): string {
      const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
      return new Date(dateString).toLocaleDateString("es-ES", options);
    }
  </script>
  
  <div class="rounded-xl border border-[rgba(100,100,100,0.1)] dark:border-[rgba(255,255,255,0.08)] 
            bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(30,30,30,0.6)] 
            backdrop-blur-md shadow-sm transition-all duration-200 p-4">


    <h2 class="text-lg font-bold flex items-center gap-2 text-[#65558F] dark:text-white mb-4">
      Stock
    </h2>
    <hr class="border-t border-gray-400 dark:border-gray-600 my-6" />
    <table class="w-full text-sm text-left border-separate border-spacing-y-2">
      <thead class="text-[#65558F] dark:text-white">
        <tr>
          <th class="px-3 py-2">Name</th>
          <th class="px-3 py-2">Amount</th>
          <th class="px-3 py-2">Maturity</th>
        </tr>
      </thead>
      <tbody>
        {#each inventory as item, index}
          <tr
            class="text-black dark:text-white rounded-full overflow-hidden"
          >
            <td class="px-3 py-2 rounded-l-full"
                class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
                class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
              {item.product_name}
            </td>
            <td class="px-3 py-2"
                class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
                class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
              {item.amount}
            </td>
            <td class="px-3 py-2 rounded-r-full"
                class:bg-[rgba(213,147,209,0.28)]={index % 2 === 0}
                class:bg-[rgba(213,147,209,0.60)]={index % 2 !== 0}>
              {formatDate(item.expiration_date)}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  