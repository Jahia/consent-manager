# consent-manager
This module is an accelerator which present how user consents could be managed with Jahia.

With this module you can create *Consent* contents and add these consents to your project.
By doing this, you enable the consent for your project, and the visitor must approve or deny
this consent. The user preferences are stored in the browser local storage 

A consent allow you to load directly a javascript code when user give his consent or to trigger
a third party event. Currently, the module is implemented to trigger Google Tag Manager (GTM)
events. The javascript code to deploy is managed in GTM.

## Quickstart
### Build and Deploy
* clone this project
  ```shell 
  git clone git@github.com:Jahia/consent-manager.git
  ```
* build the module (snapshot)
  ```shell
  cd consent-manager/
  mvn clean install
  ```
  > you must have a **java sdk** and **maven** installed
* install the module
  * In jContent, go to **Administration** panel.
  * In the **Server** section expand the **Modules and Extensions** entry and click **Modules**.
  * From the right panel, click **SELECT MODULE** and select the jar file in the *target* repository.
  * Click **UPLOAD**.
  
![000]

* enable the module for your web project
  * click the module name
  * search for your web project and turn on the switch button
  
When the module is installed, it automatically deploys:
* a new set of Categories
  <img src=".doc/images/003_contegory.png" width="375px"/>

[comment]: <> (  ![003])
* a **consent** folder in jContent -> Content Folders
* a new configuration point at the Site level
* a new content type `jnt:consentType` 
* a React application

### Create consent and enable the manager
Now the plateform is ready to create consent content and enable the consent manager
in your web project
#### Create new consent
*Consent* content will be consumed by the React webapp through GraphQl call,
so the best place to create headless content is in jContent.
As explained above, the module hase created a dedicated **consents** directory in
`jContent/Content Folders/contents`. This folder is the place to create new consents.

![002]

#### Enable the consent manager for you website
When you have a pool of consent ready to use, you must enable the **Consent Manager**
on top of your web project.
So in Page composer right-click on the name of your project and select **Edit**.
Then scroll down until the Option section and enable the **Consent Manager**.


### Interact with the React application

[000]: doc/images/000_consentModule.png
[000.1]: doc/images/000.1_consentModule.png
[001]: doc/images/001_enableConsent.png
[001.1]: doc/images/001_EnableModule.png
[002]: doc/images/002_jConsent.png
[002.1]: doc/images/002_CreateConsent.png
[003]: doc/images/003_contegory.png
[004]: doc/images/004_consentExample.png
[005]: doc/images/005_GTM.png
[006]: doc/images/006_GTM2.png
[007]: doc/images/007_editWebProject.png
[040]: doc/images/040_ConsentForm.png
[010]: doc/images/010_consent.png
[020]: doc/images/020_reviewDetails.png
[030]: doc/images/030_localStorage.png