<script lang="ts">
	import Button from "$lib/client/widgets/button.svelte"


</script>

<div class="flex flex-col content-center justify-center items-center ">

	<div class="h-12"></div>
	<a href="/users">
		<Button
			className="bg-blue-900"
		>
			Users
		</Button>
	</a>

	<div class="h-4"></div>
	<button data-ripple-light="true" class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
		Dummy
	</button>
	<div class="h-4"></div>

	<Button
		className="bg-blue-900"
	>
		Component
	</Button>

</div>
