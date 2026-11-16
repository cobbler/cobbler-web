import * as xmlrpc from 'xmlrpc';

/**
 * Minimal Node-side XML-RPC client talking to the same real cobblerd endpoint the
 * browser under test hits via the /cobbler_api proxy. Deliberately NOT the Angular
 * CobblerApiService — that's an @Injectable requiring Angular's HttpClient DI context
 * and can't run standalone in Playwright's Node process.
 */
export class CobblerXmlRpcClient {
  private readonly client: xmlrpc.Client;
  private token: string | undefined;

  constructor(url: string = 'http://localhost/cobbler_api') {
    const parsed = new URL(url);
    this.client = xmlrpc.createClient({
      host: parsed.hostname,
      port: Number(parsed.port) || 80,
      path: parsed.pathname,
    });
  }

  private call<T>(method: string, params: unknown[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.methodCall(method, params, (error, value) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(value as T);
      });
    });
  }

  async login(username: string, password: string): Promise<string> {
    this.token = await this.call<string>('login', [username, password]);
    return this.token;
  }

  private requireToken(): string {
    if (!this.token) {
      throw new Error(
        'CobblerXmlRpcClient: call login() before making authenticated calls',
      );
    }
    return this.token;
  }

  async getItemHandle(type: string, name: string): Promise<string> {
    return this.call<string>(`get_${type}_handle`, [name, this.requireToken()]);
  }

  async newItem(type: string): Promise<string> {
    return this.call<string>(`new_${type}`, [this.requireToken()]);
  }

  async modifyItem(
    type: string,
    handle: string,
    field: string,
    value: unknown,
  ): Promise<boolean> {
    return this.call<boolean>(`modify_${type}`, [
      handle,
      field,
      value,
      this.requireToken(),
    ]);
  }

  async saveItem(type: string, handle: string): Promise<boolean> {
    return this.call<boolean>(`save_${type}`, [handle, this.requireToken()]);
  }

  /** Creates an item directly via XML-RPC (new -> modify each field -> save), bypassing the UI. */
  async createItem(
    type: string,
    fields: Record<string, unknown>,
  ): Promise<string> {
    const handle = await this.newItem(type);
    for (const [field, value] of Object.entries(fields)) {
      await this.modifyItem(type, handle, field, value);
    }
    await this.saveItem(type, handle);
    return fields['name'] as string;
  }

  async getItem(type: string, name: string): Promise<Record<string, unknown>> {
    // get_<type> on 3.3.x takes the item's name directly, not a handle (unlike get_<type>_handle,
    // which resolves a name to a handle only for new_/modify_/save_/remove_ calls).
    return this.call(`get_${type}`, [name, false, false, this.requireToken()]);
  }

  async removeItem(
    type: string,
    name: string,
    recursive = false,
  ): Promise<boolean> {
    return this.call<boolean>(`remove_${type}`, [
      name,
      this.requireToken(),
      recursive,
    ]);
  }

  async getItemNames(type: string): Promise<string[]> {
    return this.call<string[]>(`get_item_names`, [type]);
  }

  /** Starts a real backend signature-update task. Returns the event id (a `get_task_status` key). */
  async backgroundSignatureUpdate(): Promise<string> {
    return this.call<string>('background_signature_update', [
      {},
      this.requireToken(),
    ]);
  }

  /** `get_task_status` returns `[statetime, name, state, read_by_who]` - index 2 is the state. */
  async getTaskState(eventId: string): Promise<string> {
    const status = await this.call<[number, string, string, string[]]>(
      'get_task_status',
      [eventId],
    );
    return status[2];
  }

  /** Polls `get_task_status` until the task leaves the running state, or times out. */
  async waitForTaskCompletion(
    eventId: string,
    timeoutMs = 10000,
  ): Promise<string> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const state = await this.getTaskState(eventId);
      if (state === 'complete' || state === 'failed') {
        return state;
      }
      if (Date.now() > deadline) {
        throw new Error(
          `Task "${eventId}" did not complete within ${timeoutMs}ms (last state: "${state}")`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  /** Templates/Snippets aren't Item objects — they're plain file-content RPCs. */
  async removeAutoinstallTemplate(filePath: string): Promise<boolean> {
    return this.call<boolean>('remove_autoinstall_template', [
      filePath,
      this.requireToken(),
    ]);
  }

  async getAutoinstallTemplates(): Promise<string[]> {
    return this.call<string[]>('get_autoinstall_templates', [
      this.requireToken(),
    ]);
  }
}
