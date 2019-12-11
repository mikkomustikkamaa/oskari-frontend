/*
Oskari.app.playBundle(
{
  bundlename : 'shadow-plugin-3d'
});
*/
Oskari.clazz.define('Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundleInstance',
    function () {
        this._started = false;
        this.plugin = null;
        this._mapmodule = null;
        this._sandbox = null;
        this.state = undefined;
        this._log = Oskari.log('Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundleInstance');
    }, {
        __name: 'shadow-plugin-3d',
        /**
        * @method getName
        * @return {String} the name for the component
        */
        getName: function () {
            return this.__name;
        },
        init: function () {},
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        start: function (sandbox) {
            if (this._started) {
                return;
            }
            this._started = true;
            sandbox = sandbox || Oskari.getSandbox();
            this.setSandbox(sandbox);
            this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            if (!this._mapmodule.getSupports3D()) {
                this._log.warn('Shadowing plugin only supported in 3d mode');
                return;
            }
            this.createPlugin();
            sandbox.register(this);
        },
        createPlugin: function () {
            if (this.plugin) {
                return;
            }
            const plugin = Oskari.clazz.create('Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin', this);
            this._mapmodule.registerPlugin(plugin);
            this._mapmodule.startPlugin(plugin);
            this.plugin = plugin;
        },
        stopPlugin: function () {
            this._mapmodule.unregisterPlugin(this.plugin);
            this._mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
        },
        stop: function () {
            this.stopPlugin();
            this.sandbox = null;
            this.started = false;
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance']
    });
