import WFSLayer from '../domain/WFSLayer';
import WfsLayerModelBuilder from '../domain/WfsLayerModelBuilder';
const VectorTileLayerPlugin = Oskari.clazz.get('Oskari.mapframework.mapmodule.VectorTileLayerPlugin');

Oskari.clazz.defineES('Oskari.wfsmvt.WfsMvtLayerPlugin',
    class WfsMvtLayerPlugin extends VectorTileLayerPlugin {
        constructor (config) {
            super(config);
            this.__name = 'WfsMvtLayerPlugin';
            this._clazz = 'Oskari.wfsmvt.WfsMvtLayerPlugin';
            this.layertype = 'wfs';
        }
        /**
         * Override, see superclass
         */
        _getLayerModelClass () {
            return WFSLayer;
        }
        /**
         * Override, see superclass
         */
        _getModelBuilder () {
            return new WfsLayerModelBuilder();
        }
        /**
         * Override, see superclass
         */
        _getTileUrlFunction (layer) {
            return function ([z, x, y], resolution, projection) {
                return Oskari.urls.getRoute('GetWFSVectorTile') + `&id=${layer.getId()}&srs=${projection.getCode()}&z=${z}&x=${x}&y=${(-y - 1)}`;
            };
        }
    }
    , {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
