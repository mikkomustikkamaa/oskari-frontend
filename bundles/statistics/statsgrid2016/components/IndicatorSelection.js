import { SelectList } from './SelectList';
import { MetadataPopup } from './MetadataPopup';

Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorSelection', function (instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this._params = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParameters', this.instance.getLocalization(), this.instance.getSandbox());
    this.element = null;
    this.metadataPopup = new MetadataPopup();
    this.selectClassRef = [];
    Oskari.makeObservable(this);
}, {
    __templates: {
        main: _.template('<div class="statsgrid-ds-selections"></div>'),
        selections: _.template('<div class="statsgrid-indicator-selections"></div>'),
        select: _.template('<div class="selection">' +
            '<div class="title">${name}</div>' +
            '<div class=${clazz}>' +
            '</div>' +
            '</div>'),
        headerWithTooltip: _.template('<div class="selection tooltip">' +
            '<div class="title">${title}</div>' +
            '<div class="tooltip">${tooltip1}</div>' +
            '<div class="tooltip">${tooltip2}</div>' +
            '</div>'),
        option: _.template('<option value="${id}">${name}</option>'),
        link: _.template('<a href="javascript:void(0);"></a>')
    },
    /** **** PRIVATE METHODS ******/

    /**
     * @method  @private _populateIndicators populate indicators
     * @param  {Object} select  jQuery element of selection
     * @param  {Integer} datasrc datasource
     */
    _populateIndicators: function (select, datasrc, regionsetRestrictions) {
        var me = this;
        var errorService = me.service.getErrorService();
        var locale = Oskari.getMsg.bind(null, 'StatsGrid');

        if (!datasrc || datasrc === '') {
            return;
        }
        var hasRegionSetRestriction = Array.isArray(regionsetRestrictions) && regionsetRestrictions.length > 0;

        // start spinner
        me.spinner.start();
        this.service.getIndicatorList(datasrc, function (err, result) {
            var results = [];
            if (err) {
                // notify error!!
                Oskari.log('Oskari.statistics.statsgrid.IndicatorSelection').warn('Error getting indicator list');
                errorService.show(locale('errors.title'), locale('errors.indicatorListError'));
                return;
            }
            var disabledIndicatorIDs = [];
            result.indicators.forEach(function (ind) {
                var resultObj = {
                    id: ind.id,
                    title: Oskari.getLocalized(ind.name)
                };
                results.push(resultObj);
                if (hasRegionSetRestriction) {
                    var supportsRegionset = regionsetRestrictions.some(function (iter) {
                        return ind.regionsets.indexOf(Number(iter)) !== -1;
                    });
                    if (!supportsRegionset) {
                        disabledIndicatorIDs.push(ind.id);
                    }
                }
            });
            var value = select.getValue();
            select.setOptions(results);
            select.setValue(value);
            if (hasRegionSetRestriction) {
                select.disableOptions(disabledIndicatorIDs);
            }
            if (select.getOptions().options.length > 0) {
                me._enableIndicatorSelection();
            }

            if (result.complete) {
                me.spinner.stop();
                var userDatasource = me.service.getUserDatasource();
                var isUserDatasource = !!userDatasource && '' + userDatasource.id === '' + datasrc;
                if (!isUserDatasource && result.indicators.length === 0) {
                    // show notification about empty indicator list for non-myindicators datasource
                    errorService.show(locale('errors.title'), locale('errors.indicatorListIsEmpty'));
                }
            }
        });
    },
    _enableIndicatorSelection () {
        const sumoSelectDiv = jQuery('.stats-ind-selector').find('.SumoSelect');
        sumoSelectDiv.removeClass('disabled');
        const select = sumoSelectDiv.find('.SumoUnder');
        select.removeAttr('disabled');
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    createAddIndicatorButton: function () {
        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.setTitle(this.instance.getLocalization().userIndicators.buttonTitle);
        return btn;
    },
    /** **** PUBLIC METHODS ******/
    clearSelections: function (selectInstance) {
        this._params.clean();
        this.selectClassRef.forEach(function (ref) {
            ref.reset();
        });
    },
    /**
     * @method  @public getPanelContent get panel content
     * @return {Object} jQuery element
     */
    getPanelContent: function () {
        var me = this;
        var main = jQuery(this.__templates.main());
        var locale = Oskari.getMsg.bind(null, 'StatsGrid');
        var panelLoc = locale('panels.newSearch');

        // Series checkbox
        main.append(jQuery(this.__templates.select({ name: panelLoc.seriesTitle, clazz: 'stats-series-selection' })));
        var seriesInput = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        seriesInput.setTitle(panelLoc.seriesLabel);
        seriesInput.setChecked(false);
        seriesInput.addClass('stats-series-input');
        var seriesSelection = main.find('.stats-series-selection');
        seriesSelection.append(seriesInput.getElement());

        // Regionsets
        main.append(jQuery(this.__templates.select({ name: panelLoc.regionsetTitle, clazz: 'stats-rs-selector' })));
        var regionsetFilterElement = main.find('.stats-rs-selector');
        var regionOptions = {
            placeholder: panelLoc.selectRegionsetPlaceholder,
            multi: true
        };

        var regionFilterSelect = new SelectList();
        var regionFilterDropdown = regionFilterSelect.create(this.service.getRegionsets(), regionOptions);
        regionFilterDropdown.css({ width: '100%' });
        regionsetFilterElement.append(regionFilterDropdown);
        regionFilterSelect.update();

        var datasources = this.service.getDatasource();
        var sources = [];
        datasources.forEach(function (ds) {
            var dataObj = {
                id: ds.id,
                title: ds.name
            };
            sources.push(dataObj);
        });
        // Datasources
        main.append(jQuery(this.__templates.select({ name: panelLoc.datasourceTitle, clazz: 'stats-ds-selector' })));
        var dsSelector = main.find('.stats-ds-selector');
        var options = {
            placeholder: panelLoc.selectDatasourcePlaceholder,
            search: false
        };
        var dsSelect = new SelectList();
        var dropdown = dsSelect.create(sources, options);
        dropdown.css({ width: '100%' });
        dsSelector.append(dropdown);

        // Indicator list
        main.append(jQuery(this.__templates.select({ name: panelLoc.indicatorTitle, clazz: 'stats-ind-selector' })));
        var indicatorSelector = main.find('.stats-ind-selector');
        me.spinner.insertTo(indicatorSelector);
        var indicOptions = {
            placeholder: panelLoc.selectIndicatorPlaceholder,
            multi: true,
            disabled: true
        };
        var indicSelect = new SelectList();
        var indicDropdown = indicSelect.create(null, indicOptions);
        indicDropdown.css({ width: '100%' });
        indicatorSelector.append(indicDropdown);

        var indicDescriptionLink = jQuery(this.__templates.link());
        main.append(indicDescriptionLink);
        indicDescriptionLink.on('click', function () {
            me.metadataPopup.show(dsSelect.getValue(), indicSelect.getValue());
        });

        // Refine data label and tooltips
        var dataLabelWithTooltips = jQuery(this.__templates.headerWithTooltip({
            title: panelLoc.refineSearchLabel,
            tooltip1: panelLoc.refineSearchTooltip1 || '',
            tooltip2: panelLoc.refineSearchTooltip2 || ''
        }));
        main.append(dataLabelWithTooltips);

        // Refine data selections
        var selectionsContainer = jQuery(this.__templates.selections());
        main.append(selectionsContainer);
        me._params.attachTo(selectionsContainer);

        var btnAddIndicator = me.createAddIndicatorButton();
        btnAddIndicator.insertTo(main.find('.stats-ind-selector'));
        btnAddIndicator.setVisible(false);

        btnAddIndicator.setHandler(function (event) {
            event.stopPropagation();
            var formFlyout = me.instance.getFlyoutManager().getFlyout('indicatorForm');
            formFlyout.showForm(dsSelect.getValue());
        });

        var btnEditIndicator = Oskari.clazz.create('Oskari.userinterface.component.buttons.EditButton');
        btnEditIndicator.setPrimary(false);
        btnEditIndicator.insertTo(main);
        btnEditIndicator.setVisible(false);

        seriesInput.setHandler(function () {
            me._params.indicatorSelected(
                dsSelect.getValue(),
                indicSelect.getValue(),
                regionFilterSelect.getValue(),
                seriesInput.isChecked());
        });

        me.selectClassRef.push(regionFilterSelect);
        me.selectClassRef.push(dsSelect);

        dsSelector.on('change', function () {
            me._params.clean();
            // If selection was removed -> reset indicator selection
            if (dsSelect.getValue() === null) {
                dataLabelWithTooltips.find('.tooltip').show();
                indicSelect.setOptions(null);
                regionFilterSelect.reset(true);
                btnAddIndicator.setVisible(false);
                btnEditIndicator.setVisible(false);
                return;
            }

            me._populateIndicators(indicSelect, dsSelect.getValue(), regionFilterSelect.getValue());

            // if datasource is of type "user" the user can add new indicators to it
            var type = me.service.getDatasource(Number(dsSelect.getValue())).type;
            btnAddIndicator.setVisible(type === 'user');
            jQuery(btnAddIndicator.getElement()).css({
                'width': '60%',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap'
            });
        });

        indicatorSelector.on('change', function () {
            var indId = indicSelect.getValue();
            // second check is for placeholder
            if (!indId || !indId.length) {
                dataLabelWithTooltips.find('.tooltip').show();
            } else {
                // if datasource is of type "user" the user can add new indicators to it
                btnEditIndicator.setVisible(me.service.getDatasource(Number(dsSelect.getValue())).type === 'user');

                btnEditIndicator.setEnabled(indId.length === 1);
                btnEditIndicator.setHandler(function (event) {
                    event.stopPropagation();
                    var formFlyout = me.instance.getFlyoutManager().getFlyout('indicatorForm');
                    formFlyout.showForm(dsSelect.getValue(), indId[0]);
                });
                indicDescriptionLink.html(locale('metadataPopup.open', { indicators: indId.length }));
                if (me.metadataPopup.isVisible()) {
                    me.metadataPopup.show(dsSelect.getValue(), indId);
                }
            }
            // this will show the params or clean them depending if values exist
            me._params.indicatorSelected(
                dsSelect.getValue(),
                indicSelect.getValue(),
                regionFilterSelect.getValue(),
                seriesInput.isChecked());
        });

        regionsetFilterElement.on('change', function (evt) {
            if (regionFilterSelect.getValue() === null || regionFilterSelect.getValue().length === 0) {
                var keepSelectedValue = true;
                dsSelect.reset(keepSelectedValue);
                indicSelect.disableOptions([]);
                return;
            }
            var unsupportedSelections = me.service.getUnsupportedDatasetsList(regionFilterSelect.getValue());

            me._params.indicatorSelected(dsSelect.getValue(), indicSelect.getValue(), regionFilterSelect.getValue(), seriesInput.isChecked());

            if (unsupportedSelections) {
                var ids = unsupportedSelections.map(function (iteration) {
                    return iteration.id;
                });
                dsSelect.disableOptions(ids);
            }

            var preselectSingleOption = function (select) {
                var state = select.getOptions();
                if (state.options.length - state.disabled.length === 1) {
                    var enabled = state.options.not(':disabled');
                    select.setValue(enabled.val());
                }
            };
            preselectSingleOption(dsSelect);
            preselectSingleOption(indicSelect);
        });
        me._params.on('indicator.changed', function (enabled) {
            me.trigger('indicator.changed', enabled);
            if (enabled) {
                indicDescriptionLink.show();
                dataLabelWithTooltips.find('.tooltip').hide();
            } else {
                indicDescriptionLink.hide();
                dataLabelWithTooltips.find('.tooltip').show();
            }
        });
        me._params.on('indicator.parameter.changed', e => me.trigger('indicator.parameter.changed', e));

        this.service.on('StatsGrid.DatasourceEvent', function (evt) {
            var currentDS = dsSelect.getValue();
            var ds;

            if (!isNaN(evt.getDatasource())) {
                ds = evt.getDatasource().toString();
            } else {
                ds = evt.getDatasource();
            }
            if (currentDS !== ds) {
                return;
            }
            // update indicator list
            me._populateIndicators(indicSelect, currentDS, regionFilterSelect.getValue());
        });
        me.setElement(main);
        return main;
    },
    getValues: function () {
        if (!this._params) {
            return {};
        }

        return this._params.getValues();
    },
    getIndicatorSelector: function () {
        var el = this.getElement();
        var indicSel = el.find('.stats-ind-selector');
        return indicSel;
    }
});
