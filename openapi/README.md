# OpenAPI specification for nidemall

## Setup authentication in Insomnia

1. Go to *Manage Environments*, and select a sub-environement.
2. After `"xLitemallToken":`, remove the existing value (including quotes `"`) and start typing `"Response`.
3. Select `Response => Body attribute`.
4. Click the tag, and fill the fields:
  - **Function to Perform**: Response - reference values from other request's responses
  - **Attribute**: Body attribute - value of response body
  - **Request**: [wx-auth] POST Auth login
  - **Filter**: `$.data.token`
  - **Trigger Behavior**: Always - resend request when needed
