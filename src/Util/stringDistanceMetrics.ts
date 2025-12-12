export type DistanceMetric = (a: string, b: string) => number;

export const levenshtein: DistanceMetric = (a: string, b: string) => {
	let alen = a.length;
	let blen = b.length;
	if (alen === 0) return blen;
	if (blen === 0) return alen;
	let tmp, i, j, prev, val, row, ma, mb, mc, md, bprev;
	if (alen > blen) {
		tmp = a;
		a = b;
		b = tmp;
	}
	row = new Int8Array(alen + 1);
	// init the row
	for (i = 0; i <= alen; i++) {
		row[i] = i;
	}
	// fill in the rest
	for (i = 1; i <= blen; i++) {
		prev = i;
		bprev = b[i - 1];
		for (j = 1; j <= alen; j++) {
			if (bprev === a[j - 1]) {
				val = row[j - 1];
			} else {
				ma = prev + 1;
				mb = row[j] + 1;
				mc = ma - ((ma - mb) & ((mb - ma) >> 7));
				md = row[j - 1] + 1;
				val = mc - ((mc - md) & ((md - mc) >> 7));
			}
			row[j - 1] = prev;
			prev = val;
		}
		row[alen] = prev;
	}
	return row[alen];
};
