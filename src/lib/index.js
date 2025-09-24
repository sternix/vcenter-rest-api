import { VCENTER_URL, VCENTER_USERNAME, VCENTER_PASSWORD } from '$env/static/private';

// vcenter self signed ca kullanıyor,
// hatayı atlamak için kullanıyoruz
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

export function getUrl(path) {
    return `${VCENTER_URL}${path}`;
}

export async function sessionId() {
    const response = await fetch(getUrl('/api/session'), {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${VCENTER_USERNAME}:${VCENTER_PASSWORD}`).toString('base64')
        }
    });

    return await response.json();
}
