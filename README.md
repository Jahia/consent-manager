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
* a set up entry point at the Site level
* two new content types `jnt:consentType` and `jnt:consentManagerWebAppConfig` 
* a React application
* a filter to deploy automatically the React application in the HTML pages of your web project
* a **consent-manager** folder in *jContent/Content Folders*. This folder contains
  * a React application configuration content, used by contributor to write the static
    content used by the webapp.
  * a **consents** folder used to store the consent content.
    ![002]

### Create consent and enable the manager
Now the platform is ready to create consent content and enable the consent manager
in your web project
#### Create new consent
*Consent* content will be consumed by the React webapp through GraphQl call,
so the best place to create headless content is in jContent.

As explained above, the module hase created a dedicated **consents** directory in
`jContent/Content Folders/consent-manager/contents`. This folder is the place to create new consents.

![002.1]

##### Javascript to load if consent is granted
The consent content is used to load (consent is granted) or not (consent is denied)
a javascript code which uses cookie information stored in the visitor browser.
There are two ways to provide the javascript code which will be loaded:
* Use a Google Tag Manager (GTM) trigger event.
* Write the javascript code to load directly in the consent content.

![004]

###### Google Tag Manager
The consent content form expose the property **Event to trigger** which is used to store the
name of a GTM trigger.

In the image above, the value *jahia-cm-google-analytics* is filled.

This value is the name of a trigger create in GTM as shown in the image below.

![005]

If the property **Event to trigger** is filled, the consent manager webapp use the GTM 
API to fire the trigger using this name.

> Note: to load the GTM API in your site you can use the [addstuff][jahia:AddStuff] module.

Then, the GTM trigger load the javascript code associated. In the example below the code loaded
write a message to the javascript console of your browser.

![006]

###### Write your code in the consent
If you don't want to use GTM, you can directly write the code launched when 
the consent will be granted. This code is most of the time provided by the service you want
to include in your page e.g. Google Analytics, Criteo... and you just have to copy/past it.

> Note: if the **Event to trigger** and **Javascript to execute** field are both filled, this
> is the event which will be used to load the javascript code.


#### Enable the consent manager for you website
Now you have a pool of consents ready to use, the next step is to set up the **Consent Manager**
for your web project:
* In Page composer right-click on the name of your project and select **Edit**.
  ![007]
* Then scroll down and switch on **Consent Manager**. Three field appears :
  * the first one is used to select the consent content you want to use in your website
  * the second one is the expiration date of the consent (not used for now)
  * the third one the configuration node which contains static content for the React application
    (as explained above a default configuration is provided)
![001]
* Finally, save and publish all your content, including the consent-manager folder

In the live mode you should see the manager in action the first time you launch a web page
![010]

### Interact with the React application
Once visitors have given their consents, they can review then at anytime. For that, the website 
must offer the capability to see the review panel.

Also, the React application provide a function to open a review panel `openConsentDetails()`.
This function is available in the `window` object inside an API object named `_jcm_`.
You can use the following code to open the review panel from your site template.

```html
<a onclick="window._jcm_.openConsentDetails()" >Review your consent</a>
```

Clicking the button "Review your consent" should have this effect :
![020]

### User preference storage
The user preference are stored in the `local storage` database of the user's browser with a key
like this : `_jcm_ucp_<key id>`. There is one storage per web project.

![030]

If jExperience is available, a consent event is also triggered.

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


[jahia:AddStuff]: https://store.jahia.com/module/addstuff
