# Angular COBBLER App Schema

Cobbler Repo data schema link: <https://github.com/cobbler/cobbler/tree/master/cobbler/items>

Path: `src/app/<component>`

## Shared components

### navbar

Description:

The top most bar of the pages.

At current it serves no special purpose other than decorative.
The navbar does subscribe to the Authentication component to listen for changes
in the user's 'isAuthorized' status.

The login component controls wether or not a user has entered the correct user and password.
Currently refreshing the page will redirect the user to the login page.

###  manage-menu

Description:

After a user has been authorized through login, they are directed to the 'manage' page where they can
access the different components through this sidebar menu.  The sidebar menu utilizes routerLinks to
change which component the user is accessing on the page.
Each item in the 'manage-menu' has a corresponding component.
Example:  Distros => ./distros/distros.component

## Services

Description:
Services can be utilized to subscribe to data, and distribute data to other components.
Each manage menu item will have it's own service that deals only with the data it is retrieving from the
xmlrpc.

### authentication

Description:
A service that has an 'isAuthorized' variable which is currently set by the login page.
Subscribing to this variable from Authentication allows components to know if a user has
successfully 'logged in'.

### auth-gaurd

Description:
A service that is utilized in the routing of the manage page components.
This service implements the 'canActivate()' built in to message to the routing module wether
or not the user has successfully logged in.

** note:
		Not implemented yet is the <user-status> service that could be used in the future to
		set up different user roles and privledges.

## Components

### app-events

Component to display the app-events data on the page

Data:
...
Service:
...

### app-files:

Editable
Uses Form

Component to display the app-files data on the page.


Data:
FIELDS[0-3] are not editable in UI
Below:   FIELDS[4-13]
[
    0-["action", "create", 0, "Action", True, "Create or remove file resource", 0, "str"],
    1-["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    2-["group", "", 0, "Owner group in file system", True, "File owner group in file system", 0, "str"],
    3-["is_dir", False, 0, "Is Directory", True, "Treat file resource as a directory", 0, "bool"],
    4-["mode", "", 0, "Mode", True, "The mode of the file", 0, "str"],
    5-["name", "", 0, "Name", True, "Name of file resource", 0, "str"],
    6-["owner", "", 0, "Owner user in file system", True, "File owner user in file system", 0, "str"],
    7-["owners", "SETTINGS:default_ownership", 0, "Owners", True, "Owners list for authz_ownership (space delimited)", [], "list"],
    8-["path", "", 0, "Path", True, "The path for the file", 0, "str"],
    9-["template", "", 0, "Template", True, "The template for the file", 0, "str"]
]

/*USE

    for items of data[i][j]:
    i=
    [0] = action *create/remove
    [1] = comment
    [2] = file group
    [3] = is_dir
    [4] = mode
    [5] = name
    [6] = owner
    [7] = owners
    [8] = path
    [9] = templates
    j=
    [0] = python variable name
    [1] = data about this item
    [2] = number = 0
    [3] = description
    [4] = boolean
    [5] = use case
    [6] = function call | 0
    [7] = data type
    to get owner description: {{ data[6][3] }}

Service:
import { FilesService } from '../services/files.service';

### appManage

Component that is the preliminary dispaly after the user has logged in.
No data or services are utilized.  A welcome message is displayed.
The user can access all the data elements in the 'manage-menu' sidebar on the screen.

### app-settings

Data: (as found in cobbler/cobbler/settings.py)

DEFAULTS = {
    "allow_duplicate_hostnames": [0, "bool"],
    "allow_duplicate_ips": [0, "bool"],
    "allow_duplicate_macs": [0, "bool"],
    "allow_dynamic_settings": [0, "bool"],
    "always_write_dhcp_entries": [0, "bool"],
    "anamon_enabled": [0, "bool"],
    "auth_token_expiration": [3600, "int"],
    "authn_pam_service": ["login", "str"],
    "autoinstall_snippets_dir": ["/var/lib/cobbler/snippets", "str"],
    "autoinstall_templates_dir": ["/var/lib/cobbler/templates", "str"],
    "bind_chroot_path": ["", "str"],
    "bind_master": ["127.0.0.1", "str"],
    "boot_loader_conf_template_dir": ["/etc/cobbler/boot_loader_conf", "str"],
    "bootloaders_dir": ["/var/lib/cobbler/loaders", "str"],
    "grubconfig_dir": ["/var/lib/cobbler/grub_config", "str"],
    "build_reporting_enabled": [0, "bool"],
    "build_reporting_ignorelist": ["", "str"],
    "build_reporting_sender": ["", "str"],
    "build_reporting_smtp_server": ["localhost", "str"],
    "build_reporting_subject": ["", "str"],
    "buildisodir": ["/var/cache/cobbler/buildiso", "str"],
    "cache_enabled": [1, "bool"],
    "cheetah_import_whitelist": [["re", "random", "time"], "list"],
    "client_use_https": [0, "bool"],
    "client_use_localhost": [0, "bool"],
    "cobbler_master": ["", "str"],
    "convert_server_to_ip": [0, "bool"],
    "createrepo_flags": ["-c cache -s sha", "str"],
    "default_autoinstall": ["/var/lib/cobbler/templates/default.ks", "str"],
    "default_name_servers": [[], "list"],
    "default_name_servers_search": [[], "list"],
    "default_ownership": [["admin"], "list"],
    "default_password_crypted": [r"\$1\$mF86/UHC\$WvcIcX2t6crBz2onWxyac.", "str"],
    "default_template_type": ["cheetah", "str"],
    "default_virt_bridge": ["xenbr0", "str"],
    "default_virt_disk_driver": ["raw", "str"],
    "default_virt_file_size": [5, "int"],
    "default_virt_ram": [512, "int"],
    "default_virt_type": ["auto", "str"],
    "enable_gpxe": [0, "bool"],
    "enable_menu": [1, "bool"],
    "http_port": [80, "int"],
    "include": [["/etc/cobbler/settings.d/*.settings"], "list"],
    "iso_template_dir": ["/etc/cobbler/iso", "str"],
    "kernel_options": [{}, "dict"],
    "ldap_anonymous_bind": [1, "bool"],
    "ldap_base_dn": ["DC=devel,DC=redhat,DC=com", "str"],
    "ldap_port": [389, "int"],
    "ldap_search_bind_dn": ["", "str"],
    "ldap_search_passwd": ["", "str"],
    "ldap_search_prefix": ['uid=', "str"],
    "ldap_server": ["grimlock.devel.redhat.com", "str"],
    "ldap_tls": ["on", "str"],
    "ldap_tls_cacertfile": ["", "str"],
    "ldap_tls_certfile": ["", "str"],
    "ldap_tls_keyfile": ["", "str"],
    "bind_manage_ipmi": [0, "bool"],
    "manage_dhcp": [0, "bool"],
    "manage_dns": [0, "bool"],
    "manage_forward_zones": [[], "list"],
    "manage_reverse_zones": [[], "list"],
    "manage_genders": [0, "bool"],
    "manage_rsync": [0, "bool"],
    "manage_tftp": [1, "bool"],
    "manage_tftpd": [1, "bool"],
    "mgmt_classes": [[], "list"],
    "mgmt_parameters": [{}, "dict"],
    "next_server": ["127.0.0.1", "str"],
    "nsupdate_enabled": [0, "bool"],
    "power_management_default_type": ["ipmitool", "str"],
    "proxy_url_ext": ["", "str"],
    "proxy_url_int": ["", "str"],
    "puppet_auto_setup": [0, "bool"],
    "puppet_parameterized_classes": [1, "bool"],
    "puppet_server": ["puppet", "str"],
    "puppet_version": [2, "int"],
    "puppetca_path": ["/usr/bin/puppet", "str"],
    "pxe_just_once": [1, "bool"],
    "nopxe_with_triggers": [1, "bool"],
    "redhat_management_permissive": [0, "bool"],
    "redhat_management_server": ["xmlrpc.rhn.redhat.com", "str"],
    "redhat_management_key": ["", "str"],
    "register_new_installs": [0, "bool"],
    "remove_old_puppet_certs_automatically": [0, "bool"],
    "replicate_repo_rsync_options": ["-avzH", "str"],
    "replicate_rsync_options": ["-avzH", "str"],
    "reposync_flags": ["-l -m -d", "str"],
    "restart_dhcp": [1, "bool"],
    "restart_dns": [1, "bool"],
    "run_install_triggers": [1, "bool"],
    "scm_track_enabled": [0, "bool"],
    "scm_track_mode": ["git", "str"],
    "scm_track_author": ["cobbler <cobbler@localhost>", "str"],
    "scm_push_script": ["/bin/true", "str"],
    "serializer_pretty_json": [0, "bool"],
    "server": ["127.0.0.1", "str"],
    "sign_puppet_certs_automatically": [0, "bool"],
    "signature_path": ["/var/lib/cobbler/distro_signatures.json", "str"],
    "signature_url": ["https://cobbler.github.io/signatures/3.0.x/latest.json", "str"],
    "tftpboot_location": ["/var/lib/tftpboot", "str"],
    "virt_auto_boot": [0, "bool"],
    "webdir": ["/var/www/cobbler", "str"],
    "webdir_whitelist": [".link_cache", "misc", "distro_mirror", "images", "links", "localmirror", "pub", "rendered", "repo_mirror", "repo_profile", "repo_system", "svc", "web", "webui"],
    "xmlrpc_port": [25151, "int"],
    "yum_distro_priority": [1, "int"],
    "yum_post_install_mirror": [1, "bool"],
    "yumdownloader_flags": ["--resolve", "str"],
}

service
import { ItemSettingsService } from './services/item-settings.service'
services/item-settings.service.ts

### app-templates

Component

Data:
...
Service:
...

### build-iso

Component

Data:
...
Service:
...
----------

check-sys

Component

Data:
...
Service:
...
---------

current-obj

uses: Subscription, session storage
Component that displays the current selected Item's name to be used/modified by other components

Data:
MockDataobj: string

Service:
import { GetObjService } from '../services/get-obj.service';




---------
distros

Component to display the distro data on the page.
service/data-distro.service fetches data and constructor sets it.
Future use can include the CRUD through the service.


/*USE
    --------
    for items of tabledata[i]:
    [0] = arch
    [1] = autoinstall-meta
    [2] = boot_files
    [3] = boot_loader
    [4] = breed
    [5] = comment
    [6] = fetchable_files
    [7] = initrd
    [8] = kernel
    [9] = remote_boot_initrd
    [10] = remote_boot_kernel
    [11] = kernel_options
    [12] = kernel_options_post
    [13] = mgmt_classes
    [14] = name
    [15] = os_version
    [16] = owners
    [17] = redhat_management_key
    [18] = template_files
    ~~~
    for j of data[i][j]:
    [0] = python variable name
    [1] = data about this item
    [2] = number = 0
    [3] = description
    [4] = boolean
    [5] = use case
    [6] = function call | 0
    [7] = data type
    --------
    Example:
    to get and display arch type:
    {{data[0][7]}}
*/

Data:

    [7] = data type
    ["arch", 'x86_64', 0, "Architecture", True, "", utils.get_valid_archs(), "str"],
    ["autoinstall_meta", {}, 0, "Automatic Installation Template Metadata", True, "Ex: dog=fang agent=86", 0, "dict"],
    ["boot_files", {}, 0, "TFTP Boot Files", True, "Files copied into tftpboot beyond the kernel/initrd", 0, "list"],
    ["boot_loader", "<<inherit>>", 0, "Boot loader", True, "Network installation boot loader", utils.get_supported_system_boot_loaders(), "str"],
    ["breed", 'redhat', 0, "Breed", True, "What is the type of distribution?", utils.get_valid_breeds(), "str"],
    ["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    ["fetchable_files", {}, 0, "Fetchable Files", True, "Templates for tftp or wget/curl", 0, "list"],
    ["initrd", None, 0, "Initrd", True, "Absolute path to kernel on filesystem", 0, "str"],
    ["kernel", None, 0, "Kernel", True, "Absolute path to kernel on filesystem", 0, "str"],
    ["remote_boot_initrd", None, 0, "Remote Boot Initrd", True, "URL the bootloader directly retrieves and boots from", 0, "str"],
    ["remote_boot_kernel", None, 0, "Remote Boot Kernel", True, "URL the bootloader directly retrieves and boots from", 0, "str"],
    ["kernel_options", {}, 0, "Kernel Options", True, "Ex: selinux=permissive", 0, "dict"],
    ["kernel_options_post", {}, 0, "Kernel Options (Post Install)", True, "Ex: clocksource=pit noapic", 0, "dict"],
    ["mgmt_classes", [], 0, "Management Classes", True, "Management classes for external config management", 0, "list"],
    ["name", "", 0, "Name", True, "Ex: Fedora-11-i386", 0, "str"],
    ["os_version", "virtio26", 0, "OS Version", True, "Needed for some virtualization optimizations", utils.get_valid_os_versions(), "str"],
    ["owners", "SETTINGS:default_ownership", 0, "Owners", True, "Owners list for authz_ownership (space delimited)", 0, "list"],
    ["redhat_management_key", "", "", "Redhat Management Key", True, "Registration key for RHN, Spacewalk, or Satellite", 0, "str"],
    ["template_files", {}, 0, "Template Files", True, "File mappings for built-in config management", 0, "dict"]

Service:
src/app/services/data-distro.service.ts

----------

images

Editable
Uses: Form
Component editable item from the 'Images' fields
This component uses an *ngFor loop to iterate through FIELDS/data and populate the form

Data:
FIELDS = [
    # non-editable in UI (internal)
    ['ctime', 0, 0, "", False, "", 0, "float"],
    ['depth', 0, 0, "", False, "", 0, "int"],
    ['mtime', 0, 0, "", False, "", 0, "float"],
    ['parent', '', 0, "", False, "", 0, "str"],
    ['uid', "", 0, "", False, "", 0, "str"],

    # editable in UI
    0-['arch', 'x86_64', 0, "Architecture", True, "", utils.get_valid_archs(), "str"],
    1-['autoinstall', '', 0, "Automatic installation file", True, "Path to autoinst/answer file template", 0, "str"],
    2-['breed', 'redhat', 0, "Breed", True, "", utils.get_valid_breeds(), "str"],
    3-['comment', '', 0, "Comment", True, "Free form text description", 0, "str"],
    4-['file', '', 0, "File", True, "Path to local file or nfs://user@host:path", 0, "str"],
    5-['image_type', "iso", 0, "Image Type", True, "", ["iso", "direct", "memdisk", "virt-image"], "str"],
    6-['name', '', 0, "Name", True, "", 0, "str"],
    7-['network_count', 1, 0, "Virt NICs", True, "", 0, "int"],
    8-['os_version', '', 0, "OS Version", True, "ex: rhel4", utils.get_valid_os_versions(), "str"],
    9-['owners', "SETTINGS:default_ownership", 0, "Owners", True, "Owners list for authz_ownership (space delimited)", [], "list"],
    10-['virt_auto_boot', "SETTINGS:virt_auto_boot", 0, "Virt Auto Boot", True, "Auto boot this VM?", 0, "bool"],
    11-['virt_bridge', "SETTINGS:default_virt_bridge", 0, "Virt Bridge", True, "", 0, "str"],
    12-['virt_cpus', 1, 0, "Virt CPUs", True, "", 0, "int"],
    13-["virt_disk_driver", "SETTINGS:default_virt_disk_driver", 0, "Virt Disk Driver Type", True, "The on-disk format for the virtualization disk", "raw", "str"],
    14-['virt_file_size', "SETTINGS:default_virt_file_size", 0, "Virt File Size (GB)", True, "", 0, "float"],
    15-['virt_path', '', 0, "Virt Path", True, "Ex: /directory or VolGroup00", 0, "str"],
    16-['virt_ram', "SETTINGS:default_virt_ram", 0, "Virt RAM (MB)", True, "", 0, "int"],
    17-['virt_type', "SETTINGS:default_virt_type", 0, "Virt Type", True, "", ["xenpv", "xenfv", "qemu", "kvm", "vmware"], "str"],
]
----- for j of data[i][j]:
    [0] = python variable name
    [1] = data about this item
    [2] = number = 0
    [3] = description
    [4] = boolean
    [5] = use case
    [6] = function call | 0
    [7] = data type
    --------

Service:
import { ImagesService } from '../services/images.service';

----------

import-dvd

Component

Data:
...
Service:
...

----------

login

Component to authenticate/authorize user for access to manage components

Data:
...
Service:
AuthGuardService

dependancy components:
AuthenticationComponent

----------

management-classes

Editable
Uses form
Used *ngFor to iterate through field items
Component

Data:
FIELDS = [
    # non-editable in UI (internal)
    FIELDS[0-4]

    FIELDS[5-11]
    # editable in UI
    0-["class_name", "", 0, "Class Name", True, "Actual Class Name (leave blank to use the name field)", 0, "str"],
    1-["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    2-["files", [], 0, "Files", True, "File resources", 0, "list"],
    3-["name", "", 0, "Name", True, "Ex: F10-i386-webserver", 0, "str"],
    4-["owners", "SETTINGS:default_ownership", "SETTINGS:default_ownership", "Owners", True, "Owners list for authz_ownership (space delimited)", 0, "list"],
    5-["packages", [], 0, "Packages", True, "Package resources", 0, "list"],
    6-["params", {}, 0, "Parameters/Variables", True, "List of parameters/variables", 0, "dict"],
]

----- for item of data: item[n]
    [0] = python variable name
    [1] = data about this item
    [2] = number = 0
    [3] = description
    [4] = boolean
    [5] = use case
    [6] = function call | 0
    [7] = data type
    --------

Service:
import { MngclassesService } from '../services/mngclasses.service'

----------

manage-menu

Component used to navigate on manage page.
The menu houses all the different Items the user can view and/or edit.
The <a>link in menu routes the component to the #datascreen

Data:
None
Service:
None

----------

not-found

Component used to tell the user when they have navigated to a path that is not found.

Data:
None
Service:
None

----------

packages

Editable
Uses *ngFor to populate form
Component

Data:
FIELDS = [
    # non-editable in UI (internal)
    [0-3]

    # editable in UI
    [4-9]

    ["action", "create", 0, "Action", True, "Install or remove package resource", 0, "str"],
    ["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    ["installer", "yum", 0, "Installer", True, "Package Manager", 0, "str"],
    ["name", "", 0, "Name", True, "Name of file resource", 0, "str"],
    ["owners", "SETTINGS:default_ownership", 0, "Owners", True, "Owners list for authz_ownership (space delimited)", [], "list"],
    ["version", "", 0, "Version", True, "Package Version", 0, "str"],
]
----- for item of data: item[n]
    [0] = python variable name
    [1] = data about this item
    [2] = number = 0
    [3] = description
    [4] = boolean
    [5] = use case
    [6] = function call | 0
    [7] = data type
    --------


Service:
import { PackagesService } from '../services/packages.service';


----------

profiles

Editable
Uses *ngFor to populate form
Component

Data:
FIELDS = [
    # non-editable in UI (internal)
    ["ctime", 0, 0, "", False, "", 0, "int"],
    ["depth", 1, 1, "", False, "", 0, "int"],
    ["mtime", 0, 0, "", False, "", 0, "int"],
    ["uid", "", "", "", False, "", 0, "str"],

    # editable in UI
    0-["autoinstall", "SETTINGS:default_autoinstall", '<<inherit>>', "Automatic Installation Template", True, "Path to automatic installation template", 0, "str"],
    1-["autoinstall_meta", {}, '<<inherit>>', "Automatic Installation Metadata", True, "Ex: dog=fang agent=86", 0, "dict"],
    2-["boot_files", {}, '<<inherit>>', "TFTP Boot Files", True, "Files copied into tftpboot beyond the kernel/initrd", 0, "list"],
    3-["comment", "", "", "Comment", True, "Free form text description", 0, "str"],
    4-["dhcp_tag", "default", '<<inherit>>', "DHCP Tag", True, "See manpage or leave blank", 0, "str"],
    5-["distro", None, '<<inherit>>', "Distribution", True, "Parent distribution", [], "str"],
    6-["enable_gpxe", "SETTINGS:enable_gpxe", 0, "Enable gPXE?", True, "Use gPXE instead of PXELINUX for advanced booting options", 0, "bool"],
    7-["enable_menu", "SETTINGS:enable_menu", '<<inherit>>', "Enable PXE Menu?", True, "Show this profile in the PXE menu?", 0, "bool"],
    8-["fetchable_files", {}, '<<inherit>>', "Fetchable Files", True, "Templates for tftp or wget/curl", 0, "dict"],
    9-["kernel_options", {}, '<<inherit>>', "Kernel Options", True, "Ex: selinux=permissive", 0, "dict"],
    10-["kernel_options_post", {}, '<<inherit>>', "Kernel Options (Post Install)", True, "Ex: clocksource=pit noapic", 0, "dict"],
    11-["mgmt_classes", [], '<<inherit>>', "Management Classes", True, "For external configuration management", 0, "list"],
    12-["mgmt_parameters", "<<inherit>>", "<<inherit>>", "Management Parameters", True, "Parameters which will be handed to your management application (Must be valid YAML dictionary)", 0, "str"],
    13-["name", "", None, "Name", True, "Ex: F10-i386-webserver", 0, "str"],
    14-["name_servers", "SETTINGS:default_name_servers", [], "Name Servers", True, "space delimited", 0, "list"],
    15-["name_servers_search", "SETTINGS:default_name_servers_search", [], "Name Servers Search Path", True, "space delimited", 0, "list"],
    16-["next_server", "<<inherit>>", '<<inherit>>', "Next Server Override", True, "See manpage or leave blank", 0, "str"],
    17-["filename", "<<inherit>>", '<<inherit>>', "DHCP Filename Override", True, "Use to boot non-default bootloaders", 0, "str"],
    18-["owners", "SETTINGS:default_ownership", "SETTINGS:default_ownership", "Owners", True, "Owners list for authz_ownership (space delimited)", 0, "list"],
    19-["parent", '', '', "Parent Profile", True, "", [], "str"],
    20-["proxy", "SETTINGS:proxy_url_int", "<<inherit>>", "Proxy", True, "Proxy URL", 0, "str"],
    21-["redhat_management_key", "<<inherit>>", "<<inherit>>", "Red Hat Management Key", True, "Registration key for RHN, Spacewalk, or Satellite", 0, "str"],
    22-["repos", [], '<<inherit>>', "Repos", True, "Repos to auto-assign to this profile", [], "list"],
    23-["server", "<<inherit>>", '<<inherit>>', "Server Override", True, "See manpage or leave blank", 0, "str"],
    24-["template_files", {}, '<<inherit>>', "Template Files", True, "File mappings for built-in config management", 0, "dict"],
    25-["virt_auto_boot", "SETTINGS:virt_auto_boot", '<<inherit>>', "Virt Auto Boot", True, "Auto boot this VM?", 0, "bool"],
    26-["virt_bridge", "SETTINGS:default_virt_bridge", '<<inherit>>', "Virt Bridge", True, "", 0, "str"],
    27-["virt_cpus", 1, '<<inherit>>', "Virt CPUs", True, "integer", 0, "int"],
    28-["virt_disk_driver", "SETTINGS:default_virt_disk_driver", '<<inherit>>', "Virt Disk Driver Type", True, "The on-disk format for the virtualization disk", validate.VIRT_DISK_DRIVERS, "str"],
    29-["virt_file_size", "SETTINGS:default_virt_file_size", '<<inherit>>', "Virt File Size(GB)", True, "", 0, "int"],
    30-["virt_path", "", '<<inherit>>', "Virt Path", True, "Ex: /directory OR VolGroup00", 0, "str"],
    31-["virt_ram", "SETTINGS:default_virt_ram", '<<inherit>>', "Virt RAM (MB)", True, "", 0, "int"],
    32-["virt_type", "SETTINGS:default_virt_type", '<<inherit>>', "Virt Type", True, "Virtualization technology to use", validate.VIRT_TYPES, "str"],
]
Service:
import { ProfileService } from '../services/profile.service';

----------

repos

Editable
Uses *ngFor to populate form
Component

Data:
FIELDS = [
    # non-editable in UI (internal)
    ["ctime", 0, 0, "", False, "", 0, "float"],
    ["depth", 2, 0, "", False, "", 0, "float"],
    ["mtime", 0, 0, "", False, "", 0, "float"],
    ["parent", None, 0, "", False, "", 0, "str"],
    ["uid", None, 0, "", False, "", 0, "str"],

    # editable in UI
    0-["apt_components", "", 0, "Apt Components (apt only)", True, "ex: main restricted universe", [], "list"],
    1-["apt_dists", "", 0, "Apt Dist Names (apt only)", True, "ex: precise precise-updates", [], "list"],
    2-["arch", "x86_64", 0, "Arch", True, "ex: i386, x86_64", ['i386', 'x86_64', 'ia64', 'ppc', 'ppc64', 'ppc64le', 'ppc64el', 's390', 's390x', 'arm', 'aarch64', 'noarch', 'src'], "str"],
    3-["breed", "rsync", 0, "Breed", True, "", validate.REPO_BREEDS, "str"],
    4-["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    5-["createrepo_flags", '<<inherit>>', 0, "Createrepo Flags", True, "Flags to use with createrepo", 0, "dict"],
    6-["environment", {}, 0, "Environment Variables", True, "Use these environment variables during commands (key=value, space delimited)", 0, "dict"],
    7-["keep_updated", True, 0, "Keep Updated", True, "Update this repo on next 'cobbler reposync'?", 0, "bool"],
    8-["mirror", None, 0, "Mirror", True, "Address of yum or rsync repo to mirror", 0, "str"],
    9-["mirror_type", "baseurl", 0, "Mirror Type", True, "", ["metalink", "mirrorlist", "baseurl"], "str"],
    10-["mirror_locally", True, 0, "Mirror locally", True, "Copy files or just reference the repo externally?", 0, "bool"],
    11-["name", "", 0, "Name", True, "Ex: f10-i386-updates", 0, "str"],
    12-["owners", "SETTINGS:default_ownership", 0, "Owners", True, "Owners list for authz_ownership (space delimited)", [], "list"],
    13-["priority", 99, 0, "Priority", True, "Value for yum priorities plugin, if installed", 0, "int"],
    14-["proxy", "<<inherit>>", 0, "Proxy information", True, "http://example.com:8080, or <<inherit>> to use proxy_url_ext from settings, blank or <<None>> for no proxy", [], "str"],
    15-["rpm_list", [], 0, "RPM List", True, "Mirror just these RPMs (yum only)", 0, "list"],
    16-["yumopts", {}, 0, "Yum Options", True, "Options to write to yum config file", 0, "dict"],
    17-["rsyncopts", "", 0, "Rsync Options", True, "Options to use with rsync repo", 0, "dict"],
]
Service:
import { ReposService } from '../services/repos.service';


----------

repo-sync
Role ?: Action
Component

Data:
...
Service:
...

----------

snippets

Component

Data:
...
Service:
...
----------

sync
Role ?: Action

Component

Data:
...
Service:
...

----------

systems

Editable
Uses *ngFor to populate forms
Component

Data:
FIELDS = [
    # non-editable in UI (internal)[0-5]
    ["ctime", 0, 0, "", False, "", 0, "float"],
    ["depth", 2, 0, "", False, "", 0, "int"],
    ["ipv6_autoconfiguration", False, 0, "IPv6 Autoconfiguration", True, "", 0, "bool"],
    ["mtime", 0, 0, "", False, "", 0, "float"],
    ["repos_enabled", False, 0, "Repos Enabled", True, "(re)configure local repos on this machine at next config update?", 0, "bool"],
    ["uid", "", 0, "", False, "", 0, "str"],

    # editable in UI [5-]
    ["autoinstall", "<<inherit>>", 0, "Automatic Installation Template", True, "Path to automatic installation template", 0, "str"],
    ["autoinstall_meta", {}, 0, "Automatic Installation Template Metadata", True, "Ex: dog=fang agent=86", 0, "dict"],
    ["boot_files", {}, '<<inherit>>', "TFTP Boot Files", True, "Files copied into tftpboot beyond the kernel/initrd", 0, "list"],
    ["boot_loader", "<<inherit>>", 0, "Boot loader", True, "Linux installation boot loader", utils.get_supported_system_boot_loaders(), "str"],
    ["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    ["enable_gpxe", "<<inherit>>", 0, "Enable gPXE?", True, "Use gPXE instead of PXELINUX for advanced booting options", 0, "bool"],
    ["fetchable_files", {}, '<<inherit>>', "Fetchable Files", True, "Templates for tftp or wget/curl", 0, "dict"],
    ["gateway", "", 0, "Gateway", True, "", 0, "str"],
    ["hostname", "", 0, "Hostname", True, "", 0, "str"],
    ["image", None, 0, "Image", True, "Parent image (if not a profile)", 0, "str"],
    ["ipv6_default_device", "", 0, "IPv6 Default Device", True, "", 0, "str"],
    ["kernel_options", {}, 0, "Kernel Options", True, "Ex: selinux=permissive", 0, "dict"],
    ["kernel_options_post", {}, 0, "Kernel Options (Post Install)", True, "Ex: clocksource=pit noapic", 0, "dict"],
    ["mgmt_classes", "<<inherit>>", 0, "Management Classes", True, "For external config management", 0, "list"],
    ["mgmt_parameters", "<<inherit>>", 0, "Management Parameters", True, "Parameters which will be handed to your management application (Must be valid YAML dictionary)", 0, "str"],
    ["name", "", 0, "Name", True, "Ex: vanhalen.example.org", 0, "str"],
    ["name_servers", [], 0, "Name Servers", True, "space delimited", 0, "list"],
    ["name_servers_search", [], 0, "Name Servers Search Path", True, "space delimited", 0, "list"],
    ["netboot_enabled", True, 0, "Netboot Enabled", True, "PXE (re)install this machine at next boot?", 0, "bool"],
    ["next_server", "<<inherit>>", 0, "Next Server Override", True, "See manpage or leave blank", 0, "str"],
    ["filename", "<<inherit>>", '<<inherit>>', "DHCP Filename Override", True, "Use to boot non-default bootloaders", 0, "str"],
    ["owners", "<<inherit>>", 0, "Owners", True, "Owners list for authz_ownership (space delimited)", 0, "list"],
    ["power_address", "", 0, "Power Management Address", True, "Ex: power-device.example.org", 0, "str"],
    ["power_id", "", 0, "Power Management ID", True, "Usually a plug number or blade name, if power type requires it", 0, "str"],
    ["power_pass", "", 0, "Power Management Password", True, "", 0, "str"],
    ["power_type", "SETTINGS:power_management_default_type", 0, "Power Management Type", True, "Power management script to use", power_manager.get_power_types(), "str"],
    ["power_user", "", 0, "Power Management Username", True, "", 0, "str"],
    ["power_options", "", 0, "Power Management Options", True, "Additional options, to be passed to the fencing agent", 0, "str"],
    ["power_identity_file", "", 0, "Power Identity File", True, "Identity file to be passed to the fencing agent (ssh key)", 0, "str"],
    ["profile", None, 0, "Profile", True, "Parent profile", [], "str"],
    ["proxy", "<<inherit>>", 0, "Internal Proxy", True, "Internal proxy URL", 0, "str"],
    ["redhat_management_key", "<<inherit>>", 0, "Redhat Management Key", True, "Registration key for RHN, Spacewalk, or Satellite", 0, "str"],
    ["server", "<<inherit>>", 0, "Server Override", True, "See manpage or leave blank", 0, "str"],
    ["status", "production", 0, "Status", True, "System status", ["", "development", "testing", "acceptance", "production"], "str"],
    ["template_files", {}, 0, "Template Files", True, "File mappings for built-in configuration management", 0, "dict"],
    ["virt_auto_boot", "<<inherit>>", 0, "Virt Auto Boot", True, "Auto boot this VM?", 0, "bool"],
    ["virt_cpus", "<<inherit>>", 0, "Virt CPUs", True, "", 0, "int"],
    ["virt_disk_driver", "<<inherit>>", 0, "Virt Disk Driver Type", True, "The on-disk format for the virtualization disk", validate.VIRT_DISK_DRIVERS, "str"],
    ["virt_file_size", "<<inherit>>", 0, "Virt File Size(GB)", True, "", 0, "float"],
    ["virt_path", "<<inherit>>", 0, "Virt Path", True, "Ex: /directory or VolGroup00", 0, "str"],
    ["virt_pxe_boot", 0, 0, "Virt PXE Boot", True, "Use PXE to build this VM?", 0, "bool"],
    ["virt_ram", "<<inherit>>", 0, "Virt RAM (MB)", True, "", 0, "int"],
    ["virt_type", "<<inherit>>", 0, "Virt Type", True, "Virtualization technology to use", validate.VIRT_TYPES, "str"],
    ["serial_device", "", 0, "Serial Device #", True, "Serial Device Number", 0, "int"],
    ["serial_baud_rate", "", 0, "Serial Baud Rate", True, "Serial Baud Rate", ["", "2400", "4800", "9600", "19200", "38400", "57600", "115200"], "int"],
]

Service:
import { AppSystemsService } from '../services/app-systems.service'

----------

test-services
** TO BE REMOVED **

Component

Data:
...
Service:
...

----------

unauthorized

Component to inform user that they are trying to access an unauthorized url path.

Data:
None
Service:
None
