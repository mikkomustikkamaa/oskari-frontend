/**
 * @class Oskari.mapframework.bundle.system_message.SystemBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.wfsvector.WfsVectorBundle", function () {

}, {
        "create": function () {
            return this;

        },
        "update": function (manager, bundle, bi, info) {

        }
    },
    {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [
                {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/service/WFSLayerService.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/request/ActivateHighlightRequest.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSFeaturesSelectedEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSPropertiesEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSFeatureEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapwfs2/domain/WFSLayer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapwfs2/domain/WfsLayerModelBuilder.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapwfs2/plugin/WfsVectorLayerPlugin.ol.js"
                }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "wfsvector",
                "Bundle-Name": "wfsvector",
                "Bundle-Author": [{
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2018",
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari", "jquery"],
                "Import-Bundle": {}
            }
        }
    });
Oskari.bundle_manager.installBundleClass("mapwfs2", "Oskari.wfsvector.WfsVectorBundle");
