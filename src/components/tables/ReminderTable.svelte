<style></style>

<div class="relative flex items-center w-full py-4">

  <button class="p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out
  bg-[#ECE6F0] dark:bg-[rgba(50,50,50,0.9)] text-[#65558F] dark:text-white hover:bg-[#d3c8e0] 
  dark:hover:bg-darkHover hover:scale-105">
    + New Reminder
  </button>

  <div class="absolute left-0 right-0 flex justify-center pointer-events-none">
    <fieldset class="fieldset w-[250px] mx-auto pointer-events-auto">
      <input type="text" class="input bg-[#F3EDF7] dark:bg-[rgba(50,50,50,0.9)] dark:placeholder-white placeholder-black w-full text-center" placeholder="🔍︎ Search your reminder" />
    </fieldset>
  </div>
  
</div>

<div class="overflow-x-auto w-full">
    <table class="table border-separate border-spacing-y-2 w-full">
      <!-- head -->
      <thead class="text-black text-left dark:text-white">
        <tr>
          <th class="px-4 py-3 ">Name</th>
          <th class="px-4 py-3 ">Description</th>
          <th class="px-4 py-3 ">Date</th>
          <th class="px-6 py-3 w-[150px]"></th>
        </tr>
      </thead>
      <tbody>
        <tr class=" text-black dark:text-white rounded-full overflow-hidden">
          <td class="px-4 py-3 rounded-l-full bg-[rgba(213,147,209,0.28)]">Reminder 1</td>
          <td class="px-4 py-3  bg-[rgba(213,147,209,0.28)]">description reminder</td>
          <td class="px-4 py-3 rounded-r-full bg-[rgba(213,147,209,0.28)] ">12 de marzo 2024</td>
          <td class="px-4 py-3 flex gap-2  justify-center">
            <button class="p-2 rounded-full shadow-md dark:bg-[#FF66A3] dark:hover:bg-darkHover hover:bg-gray-200"><img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4" ></button>
            <button class="p-2 rounded-full shadow-md dark:bg-[#FF66A3] dark:hover:bg-darkHover hover:bg-gray-200"><img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4"></button>
          </td> 
        </tr>

       
      </tbody>
    </table>
</div>