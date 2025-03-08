<script></script>

<style></style>

<div class="relative flex items-center w-full py-4">

  <button class="p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out
  bg-[#ECE6F0] dark:bg-[rgba(50,50,50,0.9)] text-[#65558F] dark:text-white hover:bg-[#d3c8e0] 
  dark:hover:bg-darkHover hover:scale-105">
    + New item
  </button>

  <div class="absolute left-0 right-0 flex justify-center">
    <fieldset class="fieldset w-[250px] mx-auto">
      <input type="text" class="input bg-[#F3EDF7] text-black w-full text-center" placeholder="🔍︎ Search your item" />
    </fieldset>
  </div>
</div>

<div class="overflow-x-auto w-full">
    <table class="table border-separate border-spacing-y-2 w-full">
      <!-- head -->
      <thead class="text-black text-left">
        <tr>
          <th class="px-4 py-3 ">Type</th>
          <th class="px-4 py-3 ">Name</th>
          <th class="px-4 py-3 ">Amount</th>
          <th class="px-4 py-3 ">Maturity</th>
          <th class="px-6 py-3 w-[150px]"></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr class=" text-black rounded-full overflow-hidden">
          <td class="px-4 py-3 rounded-l-full bg-[rgba(213,147,209,0.28)] ">dairy</td>
          <td class="px-4 py-3 bg-[rgba(213,147,209,0.28)] ">Milk</td>
          <td class="px-4 py-3 bg-[rgba(213,147,209,0.28)] ">5</td>
          <td class="px-4 py-3 rounded-r-full bg-[rgba(213,147,209,0.28)]">2 months</td>
          <td class="px-4 py-3 flex gap-2  justify-center">
            <button class="p-2 rounded-full shadow-md hover:bg-gray-200"><img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4" ></button>
            <button class="p-2 rounded-full shadow-md hover:bg-gray-200"><img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4"></button>
          </td> 
        </tr>

        <!-- row 2 -->
        <tr class="text-black rounded-full overflow-hidden">
          <td class="px-4 py-3 rounded-l-full bg-[rgba(213,147,209,0.60)]">dairy</td>
          <td class="px-4 py-3 bg-[rgba(213,147,209,0.60)]">Butter</td>
          <td class="px-4 py-3 bg-[rgba(213,147,209,0.60)]">2</td>
          <td class="px-4 py-3 rounded-r-full bg-[rgba(213,147,209,0.60)]">10 days</td>
          <td class="px-4 py-3 flex gap-2  justify-center">
            <button class="p-2 rounded-full shadow-md hover:bg-gray-200"><img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4" ></button>
            <button class="p-2 rounded-full shadow-md hover:bg-gray-200"><img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4"></button>
          </td>
        </tr>

        <!-- row 3 -->
        <tr class=" text-black rounded-full overflow-hidden">
          <td class="px-4 py-3 rounded-l-full bg-[rgba(213,147,209,0.28)]">vegetable</td>
          <td class="px-4 py-3 bg-[rgba(213,147,209,0.28)]">Tomato</td>
          <td class="px-4 py-3 bg-[rgba(213,147,209,0.28)]">6</td>
          <td class="px-4 py-3 rounded-r-full bg-[rgba(213,147,209,0.28)]">7 days</td>
          <td class="px-4 py-3 flex gap-2  justify-center">
            <button class="p-2 rounded-full shadow-md hover:bg-gray-200"><img src="src/icons/notes/edit.svg" alt="Editar" class="w-4 h-4" ></button>
            <button class="p-2 rounded-full shadow-md hover:bg-gray-200"><img src="src/icons/notes/delete.svg" alt="Eliminar" class="w-4 h-4"></button>
          </td>
        </tr>
      </tbody>
    </table>
</div>

