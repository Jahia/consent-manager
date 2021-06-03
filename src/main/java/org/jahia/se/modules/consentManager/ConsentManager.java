package org.jahia.se.modules.consentManager;

import net.htmlparser.jericho.*;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.render.RenderContext;
import org.jahia.services.render.Resource;
import org.jahia.services.render.filter.AbstractFilter;
import org.jahia.services.render.filter.RenderChain;
import org.jahia.services.render.filter.RenderFilter;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Component(service = RenderFilter.class)
public class ConsentManager extends AbstractFilter {
    private static Logger logger = LoggerFactory.getLogger(ConsentManager.class);
    private String headScript;
    private String bodyHtmlHook;
    private String bodyScript;
    private final static String CONSENT_MANAGER_MIX="jmix:consentManager";

    @Activate
    public void activate() {
//        setApplyOnModules("consent-manager");
        setPriority(-1);
//        setApplyOnEditMode(true);
        setApplyOnModes("live,preview");
//        setSkipOnAjaxRequest(true);
        setApplyOnConfigurations("page");
//        setApplyOnTemplateTypes("html,html-*");
    }

    @Override
    public String prepare(RenderContext renderContext, Resource resource, RenderChain chain) throws Exception {
        JCRSiteNode site = renderContext.getSite();
        String siteUUID = site.getIdentifier();
        String jsid = siteUUID.replace('-','_');
        String hookId = "consent_manager_"+jsid;
        String contextId = "consent_manager_ctx_"+jsid;


        StringBuilder headScriptBuilder =
            new StringBuilder( "\n<link href=\"https://fonts.googleapis.com/css?family=Lato:300,400,700,900\" rel=\"stylesheet\">" );
        headScriptBuilder.append( "\n<script type=\"text/javascript\" src=\"/modules/consent-manager/javascript/webapp/consentManager-vendors.js\"></script>" );
        headScriptBuilder.append( "\n<script type=\"text/javascript\" src=\"/modules/consent-manager/javascript/webapp/consentManager.js\"></script>\n<");
        headScript = headScriptBuilder.toString();


        StringBuilder bodyScriptBuilder = new StringBuilder( "\n<script type=\"text/javascript\">" );
        bodyScriptBuilder.append("\n(function () {");
        bodyScriptBuilder.append("\n  const "+contextId+" = {");
//        bodyScriptBuilder.append("    ctx: \""+${url.context}+"\",");
        bodyScriptBuilder.append("\n    language: \""+resource.getLocale()+"\",");
//        bodyScriptBuilder.append("\n    uiLanguage: \""+renderContext.getUILocale().getLanguage()+"\",");
        bodyScriptBuilder.append("\n    siteUUID: \""+siteUUID+"\",");
        bodyScriptBuilder.append("\n    siteName: \""+site.getName()+"\",");
        bodyScriptBuilder.append("\n    siteKey: \""+site.getSiteKey()+"\",");
        bodyScriptBuilder.append("\n    workspace: \""+renderContext.getWorkspace()+"\",");
        bodyScriptBuilder.append("\n    baseURL: window.location.protocol + '//' + window.location.host,");
//        bodyScriptBuilder.append("\n    gql_endpoint: window.location.protocol + '//' + window.location.host + '/modules/graphql',");
        bodyScriptBuilder.append("\n    gqlAuthorization:\"Basic cm9vdDpyb290\",");
//        bodyScriptBuilder.append("\n    gql_variables:{");
//        bodyScriptBuilder.append("\n      id:\""+siteUUID+"\",");
//        bodyScriptBuilder.append("\n      language: \""+resource.getLocale()+"\",");
//        bodyScriptBuilder.append("\n      workspace: \"EDIT\",");
//        bodyScriptBuilder.append("\n    },");
        bodyScriptBuilder.append("\n  };");
        bodyScriptBuilder.append("\n  window.jahiaConsentManager(\""+hookId+"\", "+contextId+");");
        bodyScriptBuilder.append("\n})();");
        bodyScriptBuilder.append("\n</script>\n<");
        bodyScript = bodyScriptBuilder.toString();
        bodyHtmlHook = "\n<div id=\""+hookId+"\">Loading...</div>";

        return super.prepare(renderContext, resource, chain);
    }

    @Override
    public String execute(String previousOut, RenderContext renderContext, Resource resource, RenderChain chain) throws Exception {
        String output = super.execute(previousOut, renderContext, resource, chain);
        boolean hasConsentManagerEnabled = renderContext.getSite().isNodeType(CONSENT_MANAGER_MIX);
        if(hasConsentManagerEnabled)
            output = enhanceOutput(output);

        return output;
    }

    /**
     * This Function is just to add some logic to our filter and therefore not needed to declare a filter
     *
     * @param output    Original output to modify
     * @return          Modified output
     */
    @NotNull
    private String enhanceOutput(String output) {
        //TODO Load the JS and CSS of the Front end app in charge of the cookie managing
        Source source = new Source(output);
        OutputDocument outputDocument = new OutputDocument(source);
        //Add webapp script to the HEAD tag
        List<Element> elementList = source.getAllElements(HTMLElementName.HEAD);
        if (elementList != null && !elementList.isEmpty()) {
            final EndTag headEndTag = elementList.get(0).getEndTag();
            outputDocument.replace(headEndTag.getBegin(), headEndTag.getBegin() + 1, headScript);
        }

        //Add context script and html hook to the BODY tag
        elementList = source.getAllElements(HTMLElementName.BODY);
        if (elementList != null && !elementList.isEmpty()) {
            final EndTag bodyEndTag = elementList.get(0).getEndTag();
            outputDocument.replace(bodyEndTag.getBegin(), bodyEndTag.getBegin() + 1, bodyHtmlHook+bodyScript);
        }

        output = outputDocument.toString().trim();
        return output;
    }
}
