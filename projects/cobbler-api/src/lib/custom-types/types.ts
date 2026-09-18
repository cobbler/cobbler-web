// Cobbler API service
//
// `get_item_resolved_value`, `dump_vars`, every `get_*_as_rendered` and every `get_*_since` method run the value
// produced by the `typescript-xmlrpc` deserializer through `CobblerApiService.convertXmlRpcValue()`, which recursively
// turns the native `Map` that an XML-RPC `<struct>` deserializes to into a plain object. A struct-valued result is
// therefore a plain object.
export type ResolvedValue = string | number | Array<any> | Record<string, any>;

// Cobbler API service
export type AttributeValue =
  | string
  | number
  | Array<string>
  | Record<string, any>;

// Cobbler API service
export type XmlrpcHacksInput =
  | Array<any>
  | Record<string, any>
  | number
  | string
  | undefined;

// Cobbler API service
export type ModifyValue =
  | string
  | boolean
  | number
  | Record<string, any>
  | Array<any>;

// Cobbler API service
export type RestValue = Record<string, any>;

// Cobbler API Service
export type TftpFileResult = [Uint8Array, number];

export type KernelOptionScalar = string | number | boolean | null;

export type KernelOptionValue = KernelOptionScalar | Array<KernelOptionScalar>;

// Items
export type KernelOptionsDict = Record<string, KernelOptionValue>;

// Options
export type CobblerApi = string;

// Options
export type ItemType = 'Profile' | 'System' | 'Image' | 'Template' | string;
