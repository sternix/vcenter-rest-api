import { sessionId, getUrl } from '$lib';

export async function load() {
	let sid = await sessionId();

	const response = await fetch(getUrl('/api/vcenter/vm'), {
		method: 'GET',
		headers: {
			'vmware-api-session-id': sid
		}
	});

	return {
		vms: await response.json()
	};
}
