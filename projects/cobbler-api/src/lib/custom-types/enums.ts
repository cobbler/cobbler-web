export enum Value {
  INHERITED = '<<inherit>>',
  NONE = 'none',
}

export enum Bootloader {
  INHERITED = Value.INHERITED,
  GRUB = 'grub',
  IPXE = 'ipxe',
  PXE = 'pxe',
}

export enum NetworkInterfaceType {
  NA = 'na',
  BOND = 'bond',
  BOND_SLAVE = 'bond_slave',
  BRDIGE = 'bridge',
  BRIDGE_SLAVE = 'bridge_slave',
  BMC = 'bmc',
  INFINIBAND = 'infiniband',
}

export enum RepoBreeds {
  NONE = Value.NONE,
  RSYNC = 'rsync',
  RHN = 'rhn',
  YUM = 'yum',
  APT = 'apt',
  WGET = 'wget',
}

export enum RepoArchs {
  NONE = Value.NONE,
  I386 = 'i386',
  X86_64 = 'x86_64',
  IA64 = 'ia64',
  PPC = 'ppc',
  PPC64 = 'ppc64',
  PPC64LE = 'ppc64le',
  PPC64EL = 'ppc64el',
  S390 = 's390',
  ARM = 'arm',
  AARCH64 = 'aarch64',
  NOARCH = 'noarch',
  SRC = 'src',
}

export enum MirrorType {
  NONE = Value.NONE,
  METALINK = 'metalink',
  MIRRORLIST = 'mirrorlist',
  BASEURL = 'baseurl',
}

export enum ImageTypes {
  DIRECT = 'direct',
  ISO = 'iso',
  MEMDISK = 'memdisk',
  VIRT_CLONE = 'virt-clone',
}

export enum BaudRates {
  DISABLED = -1,
  B0 = 0,
  B110 = 110,
  B300 = 300,
  B600 = 600,
  B1200 = 1200,
  B2400 = 2400,
  B4800 = 4800,
  B9600 = 9600,
  B14400 = 14400,
  B19200 = 19200,
  B38400 = 38400,
  B57600 = 57600,
  B115200 = 115200,
  B128000 = 128000,
  B256000 = 256000,
}

export enum VirtDiskDrivers {
  INHERITED = Value.INHERITED,
  RAW = 'raw',
  QCOW2 = 'qcow2',
  QED = 'qed',
  VDI = 'vdi',
  VDMK = 'vdmk',
}
