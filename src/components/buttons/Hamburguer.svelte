<script>
	let isOpen = false;

	function toggleMenu() {
		const navbar = document.getElementById('navbar');
		const backdrop = document.getElementById('backdrop');

		isOpen = !isOpen;

		navbar?.classList.toggle('-translate-x-full');
		backdrop?.classList.toggle('hidden');
	}
</script>

<button
	on:click={toggleMenu}
	class="sm:hidden p-2 bg-[#ECE6F0] dark:bg-darkContainer text-[#65558F] dark:text-white rounded-lg shadow-lg z-60"
	aria-label="Toggle menu"
>
	☰
</button>


