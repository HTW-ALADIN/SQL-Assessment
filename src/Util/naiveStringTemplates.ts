export type TemplateString<T extends string = string> = T | `${T}\${${string}}`;

export interface TemplateVariableDictionary {
	[key: string]: unknown;
}

export const resolveTemplateString = <T = TemplateString>(
	templateString: T,
	valueObject: TemplateVariableDictionary = {}
) => {
	let output = templateString as string;
	const templateRegExp = new RegExp("\\${(\\w+)}", "g");

	const extractMatches = (matches: Iterable<RegExpExecArray>) => {
		return [...matches].map((match) => match[1]);
	};

	const matches = output.matchAll(templateRegExp);
	const variablesToReplace = new Set(extractMatches(matches));
	while (variablesToReplace.size) {
		for (const value of variablesToReplace) {
			if (!(value in valueObject)) return output;
			output = output.replace(new RegExp("\\$" + `{${value}}`, "g"), `${valueObject[value]}`);
			variablesToReplace.delete(value);
		}

		const matches = output.matchAll(templateRegExp)!;
		extractMatches(matches).forEach((v) => variablesToReplace.add(v));
	}
	return output as T;
};
