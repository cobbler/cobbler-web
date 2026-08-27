export interface CreateFieldsContext {
  name: string;
  /**
   * Uid of the prerequisite parent object, if `requiresParent` is set. Cobbler 4.0.0b4+'s
   * parent-reference fields (e.g. Profile.distro, System.profile) require the referenced item's
   * uid, not its name - fed straight into both the direct XML-RPC create fields and the create
   * dialog's form control value.
   */
  parentUid?: string;
}

export interface ItemConfig {
  /** Route segment under /items/<type>. */
  type: string;
  /** XML-RPC object type used in new_<x>/modify_<x>/save_<x>/remove_<x>/get_<x>_handle calls
   *  — NOT always the same as the route segment (e.g. route "repository" is XML-RPC "repo"). */
  xmlrpcType: string;
  /** Human-readable label used in test titles. */
  label: string;
  overviewRoute: string;
  /** Required fields for the create dialog, keyed by formControlName. `name` is injected by the test. */
  createFields: (ctx: CreateFieldsContext) => Record<string, string>;
  /**
   * One field exercised in the edit-form persistence check, targeted by its <mat-label> text.
   * Edit-page fields are rendered from a `@for` loop using interpolated `formControlName="{{ ... }}"`
   * — Angular does NOT reflect interpolated attributes back into the DOM (only static, literal
   * `formControlName="x"` attributes survive, as used in create dialogs), so `getByLabel` is the
   * only selector that reliably works here — confirmed empirically against the live app.
   */
  editableField: { label: string; value: string };
  /** If set, a prerequisite object of this type must exist first (created via XML-RPC, not the UI). */
  requiresParent?: {
    type: string;
    /** formControlName on this type's create dialog that references the parent by uid. */
    formControlName: string;
  };
}
