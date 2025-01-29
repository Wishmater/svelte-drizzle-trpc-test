export function disableConstraints(constraintsValue: any) {
	for (const key1 in constraintsValue) {
		for (const key2 in constraintsValue[key1]) {
			constraintsValue[key1]![key2] = false;
		}
	}
}
