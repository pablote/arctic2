import * as vitest from "vitest";

import { createS256CodeChallenge } from "./oauth2.js";

vitest.test("createS256CodeChallenge()", () => {
	vitest
		.expect(createS256CodeChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"))
		.toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
});
