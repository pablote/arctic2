# Arctic Maintenance

This context defines the language used to continue Arctic as a supported OAuth client collection.

## Language

**Maintained package**:
The supported continuation of Arctic's OAuth clients and their provider and reference guidance. Deprecation announcements and standalone replacement snippets are outside its scope.

**Drop-in successor**:
A maintained package that preserves Arctic v3.7's public behavior and provider coverage, requiring consumers to change only the package name.
_Avoid_: Rewrite, redesign

**Runtime-agnostic**:
Usable in ES2022 environments that provide standard web APIs, without requiring Node-specific runtime behavior. Node LTS releases are representative test environments, not the boundary of support.

**Provider client**:
A thin OAuth 2.0 or OpenID Connect client for a provider's authorization-code flow. Provider SDKs, user-profile APIs, and unrelated authentication flows are outside this concept.
_Avoid_: Provider integration, auth SDK
