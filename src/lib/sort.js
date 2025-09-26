export default function sortObjectArray(arr, meta, asc) {
	return arr.sort((valA, valB) => {
		const a = valA[meta.col];
		const b = valB[meta.col];

		if (a == null || a == undefined) {
			if (b == null || b == undefined) {
				return 0;
			} else {
				return asc ? -1 : 1;
			}
		} else if (b == null || b == undefined) {
			return asc ? 1 : -1;
		}

		switch (meta.type) {
			case 'string':
				return sortString(asc, a, b);
			case 'date':
				return sortDate(asc, a, b);
			case 'ip':
				return sortIp(asc, a, b);
			case 'bool':
				return sortBool(asc, a, b);
			default:
				return sortNumber(asc, a, b);
		}
	});
}

const collator = Intl.Collator('tr');
function sortString(asc, a, b) {
	const ret = collator.compare(a.toLocaleLowerCase('tr'), b.toLocaleLowerCase('tr'));

	if (ret < 0) return asc ? -1 : 1;
	if (ret > 0) return asc ? 1 : -1;
	return 0;
}

function sortNumber(asc, a, b) {
	if (a < b) return asc ? -1 : 1;
	if (a > b) return asc ? 1 : -1;
	return 0;
}

// https://stackoverflow.com/questions/48618635/require-sorting-on-ip-address-using-js/68147012#68147012
function sortIp(asc, a, b) {
	const makeIpNumber = (ip) =>
		Number(
			ip
				.split('.')
				.map((subString) => `00${subString}`.slice(-3))
				.join('')
		);

	const ap = makeIpNumber(a);
	const bp = makeIpNumber(b);

	if (ap < bp) return asc ? -1 : 1;
	if (ap > bp) return asc ? 1 : -1;
	return 0;
}

function sortDate(asc, a, b) {
	const ret = new Date(a) - new Date(b);

	if (ret < 0) return asc ? -1 : 1;
	if (ret > 0) return asc ? 1 : -1;
	return 0;
}

function sortBool(asc, a, b) {
	if (a) {
		if (b) {
			return 0;
		} else {
			return asc ? 1 : -1;
		}
	} else if (b) {
		return asc ? -1 : 1;
	}

	return 0;
}
