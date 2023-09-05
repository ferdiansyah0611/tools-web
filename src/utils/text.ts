
export function toUpperFirst(text: string|null) {
	return text ? text[0].toUpperCase() + text.slice(1) : null
}
export function removeFormat(text: string) {
	if (text.indexOf(".") !== -1) return text[0].toUpperCase() + text.slice(1, text.indexOf("."))
	return text[0].toUpperCase() + text.slice(1);
}
export function toFilename(text: string) {
	return text.includes(".") ? text: text + ".js"
}
export function getCaseName(text: string, isFormat: boolean = true) {
	return (isFormat ? removeFormat(text): text).replaceAll("-", "_")
}