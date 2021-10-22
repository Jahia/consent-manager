// window.jahia.i18n.loadNamespaces('consent-manager');

// window.jahia.uiExtender.registry.add('callback', 'consent-manager', {
//     targets: ['jahiaApp-init:30'],
//     callback: function () {
//
//         const categoryPickerCmp = Object.assign({},window.jahia.uiExtender.registry.get('pickerConfiguration', 'category').cmp);
//         categoryPickerCmp.treeConfigs = categoryPickerCmp.treeConfigs.map(treeConfig => {
//             if(treeConfig.hasOwnProperty("rootPath"))
//                 return {
//                     ...treeConfig,
//                     rootPath: () => '/sites/systemsite/categories/consent-manager',
//                 }
//             return treeConfig;
//         })
//         console.debug('categoryPickerCmp', categoryPickerCmp);
//         console.debug('%c consentCategory pickerConfiguration Extensions  is activated', 'color: #3c8cba');
//         window.jahia.uiExtender.registry.add('pickerConfiguration', 'consentCategory', {
//             cmp: categoryPickerCmp
//         });
//
//         const contentPicker = window.jahia.uiExtender.registry.get('selectorType', 'ContentPicker');
//         const consentNodePickerCmp={
//             picker: contentPicker,
//             treeConfigs : [{
//                 rootPath: site => `/sites/${site}/contents/consent-manager/consents`,
//                 openableTypes: ['jnt:contentFolder'],
//                 selectableTypes: ['jnt:contentFolder'],
//                 type: 'contents',
//                 rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
//             }],
//             searchSelectorType: 'jnt:consentType',
//             listTypesTable: ['jnt:consentType'],
//             selectableTypesTable: ['jnt:consentType']
//         }
//
//         console.debug('consentNodePickerCmp', consentNodePickerCmp);
//         console.debug('%c consentNode pickerConfiguration Extensions  is activated', 'color: #3c8cba');
//         window.jahia.uiExtender.registry.add('pickerConfiguration', 'consentNode', {
//             cmp: consentNodePickerCmp
//         });
//
//         const configNodePickerCmp={
//             picker: contentPicker,
//             treeConfigs : [{
//                 rootPath: site => `/sites/${site}/contents/consent-manager`,
//                 openableTypes: ['jnt:contentFolder'],
//                 selectableTypes: ['jnt:contentFolder'],
//                 type: 'contents',
//                 rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
//             }],
//             searchSelectorType: 'jnt:consentManagerWebAppConfig',
//             listTypesTable: ['jnt:consentManagerWebAppConfig'],
//             selectableTypesTable: ['jnt:consentManagerWebAppConfig']
//         }
//         window.jahia.uiExtender.registry.add('pickerConfiguration', 'configNode', {
//             cmp: configNodePickerCmp
//         });
//
//
//
//
//
//
//         // const choiceListCmp = Object.assign({},window.jahia.uiExtender.registry.get('selectorType', 'Choicelist').cmp);
//         // // categoryPickerCmp.treeConfigs = categoryPickerCmp.treeConfigs.map(treeConfig => {
//         // //     if(treeConfig.hasOwnProperty("rootPath"))
//         // //         return {
//         // //             ...treeConfig,
//         // //             rootPath: () => '/sites/systemsite/categories/consent-manager',
//         // //         }
//         // //     return treeConfig;
//         // // })
//         // console.debug('choiceListCmp', choiceListCmp);
//         // console.debug('%c consentCategory pickerConfiguration Extensions  is activated', 'color: #3c8cba');
//         // window.jahia.uiExtender.registry.add('selectorType', 'ChoicelistConsent', {
//         //     cmp: categoryPickerCmp
//         // });
//
//
//         // window.jahia.uiExtender.registry.add('adminRoute', 'consent-managerExample', {
//         //     targets: ['administration-sites:999', 'consent-manageraccordion'],
//         //     label: 'consent-manager:label.settings.title',
//         //     icon: window.jahia.moonstone.toIconComponent('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6V5A2 2 0 0 0 17 3H15A2 2 0 0 0 13 5V6H11V5A2 2 0 0 0 9 3H7A2 2 0 0 0 5 5V6H3V20H21V6M19 18H5V8H19Z" /></svg>'),
//         //     isSelectable: true,
//         //     requireModuleInstalledOnSite: 'consent-manager',
//         //     iframeUrl: window.contextJsParameters.contextPath + '/cms/editframe/default/$lang/sites/$site-key.consent-manager.html.ajax'
//         // });
//         //
//         // window.jahia.uiExtender.registry.add('action', 'consent-managerExample', {
//         //     buttonIcon: window.jahia.moonstone.toIconComponent('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6V5A2 2 0 0 0 17 3H15A2 2 0 0 0 13 5V6H11V5A2 2 0 0 0 9 3H7A2 2 0 0 0 5 5V6H3V20H21V6M19 18H5V8H19Z" /></svg>'),
//         //     buttonLabel: 'consent-manager:label.action.title',
//         //     targets: ['contentActions:999'],
//         //     onClick: context => {
//         //         window.open('https://github.com/Jahia/app-shell/blob/master/docs/declare-new-module.md', "_blank");
//         //     }
//         // });
//         //
//         // window.jahia.uiExtender.registry.add('accordionItem', 'consent-managerApps_Example', window.jahia.uiExtender.registry.get('accordionItem', 'renderDefaultApps'), {
//         //     targets: ['jcontent:998'],
//         //     label: 'consent-manager:label.appsAccordion.title',
//         //     icon: window.jahia.moonstone.toIconComponent('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6V5A2 2 0 0 0 17 3H15A2 2 0 0 0 13 5V6H11V5A2 2 0 0 0 9 3H7A2 2 0 0 0 5 5V6H3V20H21V6M19 18H5V8H19Z" /></svg>'),
//         //     appsTarget: 'consent-manageraccordion',
//         //     isEnabled: function(siteKey) {
//         //         return siteKey !== 'systemsite'
//         //     }
//         // });
//     }
// });
