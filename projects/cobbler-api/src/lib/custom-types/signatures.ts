export interface DistroSignatureOsVersion {
  signatures: string[];
  version_file: string | null;
  version_file_regex?: string | null;
  kernel_arch: string;
  kernel_arch_regex?: string | null;
  supported_arches: (
    | 'arm'
    | 'ARM64'
    | 'armhfp'
    | 'aarch64'
    | 'i386'
    | 'i586'
    | 'ia64'
    | 'ppc'
    | 'ppc64'
    | 'ppc64le'
    | 'ppc64el'
    | 's390'
    | 's390x'
    | 'x86_64'
    | 'amd64'
    | 'AMD64'
    | 'x86'
  )[];
  supported_repo_breeds: ('rsync' | 'rhn' | 'yum' | 'apt')[];
  kernel_file: string;
  initrd_file: string;
  isolinux_ok?: boolean;
  default_autoinstall: string;
  kernel_options: string;
  kernel_options_post: string;
  template_files?: string;
  boot_files?: string[];
  boot_loaders?: {
    arm?: ('pxe' | 'ipxe' | 'grub')[];
    armhfp?: ('pxe' | 'ipxe' | 'grub')[];
    aarch64?: ('pxe' | 'ipxe' | 'grub')[];
    i386?: ('pxe' | 'ipxe' | 'grub')[];
    ia64?: ('pxe' | 'ipxe' | 'grub')[];
    ppc?: ('pxe' | 'ipxe' | 'grub')[];
    ppc64?: ('pxe' | 'ipxe' | 'grub')[];
    ppc64le?: ('pxe' | 'ipxe' | 'grub')[];
    s390?: ('pxe' | 'ipxe' | 'grub')[];
    s390x?: ('pxe' | 'ipxe' | 'grub')[];
    x86_64?: ('pxe' | 'ipxe' | 'grub')[];
    [k: string]: unknown;
  };
}

/**
 * The different distributions supported by Cobbler. This schema is valid for Cobbler with major version 3.
 *
 * Generated via: https://transform.tools/json-schema-to-typescript
 */
export interface DistroSignatures {
  breeds: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "redhat|debian|ubuntu|suse|vmware|freebsd|xen|unix|windows|powerkvm|generic".
     */
    [k: string]: {
      /**
       * This interface was referenced by `undefined`'s JSON-Schema definition
       * via the `patternProperty` "^[a-zA-Z0-9]*$".
       */
      [k: string]: DistroSignatureOsVersion;
    };
  };
}
