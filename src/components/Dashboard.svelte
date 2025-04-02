<script lang="ts">
    import StockPreview from "./dashboard/StockPreview.svelte";
    import ReminderPreview from "./dashboard/ReminderPreview.svelte";
    import NotePreview from "./dashboard/NotePreview.svelte"
  </script>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <StockPreview />
    <ReminderPreview />
    <NotePreview />
  </div>
  