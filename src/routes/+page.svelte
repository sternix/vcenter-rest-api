<script>
	import { onMount } from 'svelte';
	import sortObjectArray from '$lib/sort.js';

	let { data } = $props();

	let vms = $state([]);
	let key = $state('name');
	let asc = $state(false);
	let showOffline = $state(true);

	onMount(() => {
		sortBy();
	});

	const meta = {
		mem: { type: 'number', col: 'memory_size_MiB' },
		cpu: { type: 'number', col: 'cpu_count' },
		name: { type: 'string', col: 'name' }
	};

	function sortBy(pkey = 'name') {
		if (pkey === key) {
			asc = !asc;
		} else {
			asc = true;
		}

		key = pkey;
		vms = sortObjectArray(data.vms, meta[pkey], asc);
	}

	function filterOffline() {
		showOffline = !showOffline;
		if (showOffline) {
			vms = data.vms;
		} else {
			vms = data.vms.filter((vm) => vm.power_state !== 'POWERED_OFF');
		}
	}
</script>

<div>
	Offlineları kaldır <input type="checkbox" onchange={() => filterOffline()} />
	<br />
	Toplam Sayı: {vms.length}
</div>

<table>
	<thead>
		<tr style="background-color:darkolivegreen ;">
			<th onclick={() => sortBy('name')}>
				Name
				{#if key === 'name'}
					{asc ? ' 🔺' : ' 🔻'}
				{/if}
			</th>
			<th onclick={() => sortBy('mem')}>
				Memory Size
				{#if key === 'mem'}
					{asc ? ' 🔺' : ' 🔻'}
				{/if}
			</th>
			<th onclick={() => sortBy('cpu')}>
				Cpu Count
				{#if key === 'cpu'}
					{asc ? ' 🔺' : ' 🔻'}
				{/if}
			</th>
		</tr>
	</thead>

	<tbody>
		{#each vms as vm (vm.vm)}
			<tr class={vm.power_state == 'POWERED_OFF' ? 'off' : ''}>
				<td>{vm.name}</td>
				<td>{vm.memory_size_MiB}</td>
				<td>{vm.cpu_count}</td>
			</tr>
		{:else}
			<tr>
				<td colspan="3">Kayıt Bulunamadı</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	* {
		box-sizing: border-box;
		margin: 0px;
		padding: 0px;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100%;
		border: 1px solid #ddd;
	}

	th,
	td {
		text-align: left;
		padding: 8px;
		border: 1px solid darkgray;
	}

	tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	.off {
		background-color: tomato;
	}
</style>
