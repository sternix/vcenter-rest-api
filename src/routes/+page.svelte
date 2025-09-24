<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	let vms = $state([]);
	let key = $state('name');
	let asc = $state(true);
	let showOffline = $state(true);

	onMount(() => {
		sortBy();
	});

	function sortBy(pkey = 'name') {
		if (pkey === key) {
			asc = !asc;
		} else {
			asc = true;
		}

		switch (pkey) {
			case 'mem':
				key = 'mem';
				vms = data.vms.sort((a, b) => {
					if (a.memory_size_MiB < b.memory_size_MiB) {
						return asc ? -1 : 1;
					} else if (a.memory_size_MiB > b.memory_size_MiB) {
						return asc ? 1 : -1;
					} else {
						return 0;
					}
				});
				break;
			case 'cpu':
				key = 'cpu';
				vms = data.vms.sort((a, b) => {
					if (a.cpu_count < b.cpu_count) {
						return asc ? -1 : 1;
					} else if (a.cpu_count > b.cpu_count) {
						return asc ? 1 : -1;
					} else {
						return 0;
					}
				});
				break;
			default:
				key = 'name';
				vms = data.vms.sort((a, b) => {
					const ret = Intl.Collator('tr').compare(
						a.name.toLocaleLowerCase('tr'),
						b.name.toLocaleLowerCase('tr')
					);
					if (ret < 0) {
						return asc ? -1 : 1;
					} else if (ret > 0) {
						return asc ? 1 : -1;
					} else {
						return 0;
					}
				});
		}
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
