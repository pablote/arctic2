import * as vitest from "vitest";

import { encodeBase64, encodeBase64urlNoPadding } from "./encoding.js";

vitest.test("encodeBase64()", () => {
	vitest
		.expect(encodeBase64(new TextEncoder().encode("Aladdin:open sesame")))
		.toBe("QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
});

vitest.test("encodeBase64urlNoPadding()", () => {
	vitest.expect(encodeBase64urlNoPadding(new Uint8Array([251, 255, 255]))).toBe("-___");
});
