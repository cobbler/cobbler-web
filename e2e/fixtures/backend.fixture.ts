import { CobblerXmlRpcClient } from './xmlrpc-client';

export const COBBLER_USERNAME =
  process.env['COBBLER_TEST_USERNAME'] ?? 'cobbler';
export const COBBLER_PASSWORD =
  process.env['COBBLER_TEST_PASSWORD'] ?? 'cobbler';
export const COBBLER_API_URL =
  process.env['COBBLER_TEST_API_URL'] ?? 'http://localhost/cobbler_api';

/** Creates a logged-in XML-RPC client for direct backend setup/teardown, bypassing the UI. */
export async function createBackendClient(): Promise<CobblerXmlRpcClient> {
  const client = new CobblerXmlRpcClient(COBBLER_API_URL);
  await client.login(COBBLER_USERNAME, COBBLER_PASSWORD);
  return client;
}
