import { decodeJwt } from "jose";

export function decodeIdToken(idToken: string): object {
	try {
		return decodeJwt(idToken);
	} catch (e) {
		throw new Error("Invalid ID token", {
			cause: e
		});
	}
}
