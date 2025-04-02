<script lang="ts">
    import { onMount } from "svelte";
    import { getAllReminders } from "../../lib/reminders";
  
    let reminders = [];
    let sessionToken = "";
    let userId = "";
  
    onMount(async () => {
      sessionToken = localStorage.getItem("session_token") || "";
      userId = localStorage.getItem("user_id") || "";
  
      if (sessionToken && userId) {
        const data = await getAllReminders(sessionToken);
        reminders = (data.items || [])
          .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime())
          .slice(0, 5) // máx 5
          .map((r: any) => ({
            ...r,
            id: r.uuid,
            daysLeft: calculateDaysLeft(r.remind_date),
          }));
      }
    });
  
    function calculateDaysLeft(dateStr: string): number {
      const today = new Date();
      const target = new Date(dateStr);
      const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    }
  
    function getUrgencyColor(days: number): string {
      return days <= 2 ? "text-[#D43C3C]" : "text-[#BF50B7]";
    }
  </script>
  
  <div class="rounded-xl border border-[rgba(100,100,100,0.1)] dark:border-[rgba(255,255,255,0.08)] 
            bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(30,30,30,0.6)] 
            backdrop-blur-md shadow-sm transition-all duration-200 p-4">

    <h2 class="text-lg font-bold flex items-center gap-2 text-[#65558F] dark:text-white mb-4">
      Reminders
    </h2>
    <hr class="border-t border-gray-400 dark:border-gray-600 my-6" />
  
    <div class="space-y-2">
      {#each reminders as reminder}
        <div class="flex justify-between items-center px-4 py-2 rounded-full bg-[rgba(213,147,209,0.15)]">
          <span class="text-sm font-medium text-black dark:text-white">
            {reminder.title}
          </span>
          <div class="flex items-center gap-3">
            <span class="h-4 w-px bg-gray-500 dark:bg-gray-400"></span>
            <span class="text-sm font-semibold {getUrgencyColor(reminder.daysLeft)}">
              {reminder.daysLeft} {reminder.daysLeft === 1 ? 'day' : 'days'} left
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  