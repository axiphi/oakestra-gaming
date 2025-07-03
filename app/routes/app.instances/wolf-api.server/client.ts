import createClient from "openapi-fetch";
import type { paths as WolfApi } from "~/lib/external-api/wolf";

export const wolfClient = createClient<WolfApi>();
