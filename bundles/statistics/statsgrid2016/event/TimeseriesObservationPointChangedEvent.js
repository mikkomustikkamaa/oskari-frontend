/**
 * Used to notify when observation point is changed in thematic map timeseries.
 *
 * @class Oskari.statistics.statsgrid.event.TimeseriesObservationPointChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.TimeseriesObservationPointChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (pageX, pageY) {
        this._pageX = pageX;
        this._pageY = pageY;
    }, {
        /** @static @property __name event name */
        __name: 'StatsGrid.TimeseriesObservationPointChangedEvent',
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return this.__name;
        },
        getPageX: function () {
            return this._pageX;
        },
        getPageY: function () {
            return this._pageY;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
