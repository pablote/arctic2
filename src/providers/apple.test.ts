import { jwtVerify } from "jose";
import * as vitest from "vitest";

import { Apple } from "./apple.js";

vitest.test("Apple signs its client secret with ES256", async () => {
	const keyPair = await crypto.subtle.generateKey(
		{
			name: "ECDSA",
			namedCurve: "P-256"
		},
		true,
		["sign", "verify"]
	);
	const privateKey = new Uint8Array(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey));
	let clientSecret: string | null = null;
	vitest.vi.stubGlobal("fetch", async (request: Request): Promise<Response> => {
		const body = new URLSearchParams(await request.text());
		clientSecret = body.get("client_secret");
		return new Response(
			JSON.stringify({
				access_token: "access-token",
				token_type: "bearer"
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	});

	try {
		const apple = new Apple("client-id", "team-id", "key-id", privateKey, "https://example.com");
		await apple.validateAuthorizationCode("code");
	} finally {
		vitest.vi.unstubAllGlobals();
	}

	if (clientSecret === null) {
		throw new Error("Missing Apple client secret");
	}
	const { payload, protectedHeader } = await jwtVerify(clientSecret, keyPair.publicKey, {
		algorithms: ["ES256"],
		audience: "https://appleid.apple.com",
		issuer: "team-id",
		subject: "client-id"
	});
	vitest.expect(protectedHeader).toMatchObject({
		alg: "ES256",
		kid: "key-id",
		typ: "JWT"
	});
	vitest.expect(payload.exp! - payload.iat!).toBe(300);
});
