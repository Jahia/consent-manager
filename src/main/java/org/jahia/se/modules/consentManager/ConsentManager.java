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
    private final static String CONSENT_MANAGER_MIX="jmix:consentManager";
    
    @Activate
    public void activate() {
        setPriority(-1);
        setApplyOnModes("live,preview");
        setApplyOnConfigurations("page");
    }

    @Override
    public String execute(String previousOut, RenderContext renderContext, Resource resource, RenderChain chain) throws Exception {
        String output = super.execute(previousOut, renderContext, resource, chain);
        boolean hasConsentManagerEnabled = renderContext.getSite().isNodeType(CONSENT_MANAGER_MIX);

        //Disable the filter in case we are in Content Editor preview.
        boolean isCEPreview = renderContext.getRequest().getAttribute("ce_preview") != null;

        if(hasConsentManagerEnabled && !isCEPreview)
            output = enhanceOutput(output, renderContext);

        return output;
    }

    /**
     * This Function is just to add some logic to our filter and therefore not needed to declare a filter
     *
     * @param output    Original output to modify
     * @return          Modified output
     */
    @NotNull
    private String enhanceOutput(String output, RenderContext renderContext) throws Exception{

        Source source = new Source(output);
        OutputDocument outputDocument = new OutputDocument(source);

        JCRSiteNode site = renderContext.getSite();
        String siteUUID = site.getIdentifier();
        String jsid = siteUUID.replace('-','_');
        
        String hookId = "consent_manager_"+jsid;
       
        String contextId = "consent_manager_ctx_"+jsid;
        String bodyScript = this.getBodyScript(hookId, siteUUID, site.getName(), site.getSiteKey(), 
            contextId, renderContext.getMainResourceLocale().toString(), renderContext.getWorkspace());
        //Add webapp script to the HEAD tag
        List<Element> elementList = source.getAllElements(HTMLElementName.HEAD);
        if (elementList != null && !elementList.isEmpty()) {
//            final StartTag headStartTag = elementList.get(0).getStartTag();
//            outputDocument.replace(headStartTag.getEnd(), headStartTag.getEnd() + 1, gtHeadScript);

            final EndTag headEndTag = elementList.get(0).getEndTag();
            outputDocument.replace(headEndTag.getBegin(), headEndTag.getBegin() + 1, getHeadScript());
        }

        //Add context script and html hook to the BODY tag
        elementList = source.getAllElements(HTMLElementName.BODY);
        if (elementList != null && !elementList.isEmpty()) {
//            final StartTag bodyStartTag = elementList.get(0).getStartTag();
//            outputDocument.replace(bodyStartTag.getEnd(), bodyStartTag.getEnd() + 1, gtBodyScript);

            final EndTag bodyEndTag = elementList.get(0).getEndTag();
            outputDocument.replace(bodyEndTag.getBegin(), bodyEndTag.getBegin() + 1, getBodyHtmlHook(hookId)+bodyScript);
        }

        output = outputDocument.toString().trim();
        return output;
    }

    private String getBodyHtmlHook(String hookId){
        return "\n<div id=\""+hookId+"\">Loading...</div>";
    }

    private String getHeadScript(){
        StringBuilder headScriptBuilder =
            new StringBuilder( "\n<link href=\"https://fonts.googleapis.com/css?family=Lato:300,400,700,900\" rel=\"stylesheet\">" );
        headScriptBuilder.append( "\n<script type=\"text/javascript\" src=\"/modules/consent-manager/javascript/webapp/consentManager-vendors.js\"></script>" );
        headScriptBuilder.append( "\n<script type=\"text/javascript\" src=\"/modules/consent-manager/javascript/webapp/consentManager.js\"></script>\n<");
        return headScriptBuilder.toString();
    }

    private String getBodyScript(String hookId, String siteUUID, String siteName, 
        String siteKey, String contextId, String locale, String workspace){
        
        StringBuilder bodyScriptBuilder = new StringBuilder( "\n<script type=\"text/javascript\">" );
        bodyScriptBuilder.append("\n//consentManager 1.0.3.1");
        bodyScriptBuilder.append("\n(function () {");
        bodyScriptBuilder.append("\n  const "+contextId+" = {");
        bodyScriptBuilder.append("\n    language: \""+locale+"\",");
        bodyScriptBuilder.append("\n    siteUUID: \""+siteUUID+"\",");
        bodyScriptBuilder.append("\n    siteName: \""+siteName+"\",");
        bodyScriptBuilder.append("\n    siteKey: \""+siteKey+"\",");
        bodyScriptBuilder.append("\n    workspace: \"" + workspace+ "\",");
        bodyScriptBuilder.append("\n    baseURL: window.location.protocol + '//' + window.location.host,");
        bodyScriptBuilder.append("\n    cdpEndPoint:window.digitalData?window.digitalData.contextServerPublicUrl:undefined,");//digitalData is set in live mode only
        bodyScriptBuilder.append("\n    gqlAuthorization:\"Basic cm9vdDpyb290\",");

        bodyScriptBuilder.append("\n  };");
        bodyScriptBuilder.append("\n  window.jahiaConsentManager(\""+hookId+"\", "+contextId+");");
        bodyScriptBuilder.append("\n})();");
        bodyScriptBuilder.append("\n</script>\n<");
        return bodyScriptBuilder.toString();
    }
}



