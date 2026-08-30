export function encodeBase64(data: Uint8Array): string {
	let binary = "";
	for (const byte of data) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

export function encodeBase64urlNoPadding(data: Uint8Array): string {
	return encodeBase64(data).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
