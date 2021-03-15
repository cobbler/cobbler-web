last updated: 01/15/2021
ABOUT Cobbler Angular web U/I:

--General--

LOGIN
Login Page does not currently interact with a backend. 

MANAGE
App Manage is the base default start to the users. 
Each menu item in the sidebar routes to a component specific to that menu item.
All Components use a similar base css. (BASE_CSS_ALL_App_Manage.css)
Modifications in each components css are to adjust the screen to accomodate user data, as 
fetched from the XMLrpc.

DATA
As of now the data will be incorporated through XML and may be in the future translated to JSON instead.

DATA SCHEMA
??

--Menu abilities--

*** CONFIGURATIONS ***

DISTROS
Link:  [routerLink]="['/Distros']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Distros-div'

XML data selector:

PROFILES
Link: [routerLink]="['/Profiles']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Profiles-div'

XML data selector:

SYSTEMS
Link: [routerLink]="['/Systems']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Systems-div'

XML data selector:

REPOS
Link: [routerLink]="['/Repos']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Repos-div'

XML data selector:


IMAGES 
Link: [routerLink]="['/Images']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Images-div'

XML data selector:



TEMPLATES
Link: [routerLink]="['/Templates']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Templates-div'

XML data selector:
...

SNIPPETS
Link: [routerLink]="['/Snippets']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Snippets-div'

XML data selector:
...

MANAGEMENT CLASSES
Link: [routerLink]="['/ManageClasses']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'ManageClasses-div'

XML data selector:
...

SETTINGS
Link: [routerLink]="['/AppSettings']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Settings-div'

XML data selector:
...

*** RESOURCES ***

PACKAGES
Link: [routerLink]="['/Packages']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Packages-div'

XML data selector:
...


FILES
Link: [routerLink]="['/AppFiles']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'AppFiles-div'

XML data selector:
...


*** ACTIONS ***

IMPORT DVD
Link: [routerLink]="['/ImportDVD']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'ImportDVD-div'

XML data selector:
...


SYNC
Link: [routerLink]="['/Sync']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'Sync-div'

XML data selector:
...

REPOSYNC
Link: [routerLink]="['/RepoSync']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'RepoSync-div'

XML data selector:
...

BUILD ISO 
Link: [routerLink]="['/BuildISO']"

Styles:
CSS specific in .right-column  #dataScreen
class div = 'BuildISO-div'

XML data selector:
...

*** COBBLER ***

CHECK
...

EVENTS
...

ONLINE DOCUMENTATION
...

ONLINE CHAT HELP
...



