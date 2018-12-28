
var RequestBitrateRule;

// Rule that selects the lowest possible bitrate
function RequestBitrateRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let context = this.context;
    let instance;

    function setup() {
    }


    function getMaxIndex(rulesContext) {
        // here you can get some informations aboit metrics for example, to implement the rule
        let metricsModel = MetricsModel(context).getInstance();
        var mediaType = rulesContext.getMediaInfo().type;
        var metrics = metricsModel.getReadOnlyMetricsFor(mediaType);

        if (!metrics) {
            // logger.debug("[CustomRules][" + mediaType + "][DownloadRatioRule] No metrics, bailing.");
            return SwitchRequest(context).create();
        }
        // A smarter (real) rule could need analyze playback metrics to take
        // bitrate switching decision. Printing metrics here as a reference
        console.log(metrics);

        // Get current bitrate
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());

        var params = {
            count: rulesContext.getMediaInfo().representationCount,
            bitrates:rulesContext.getMediaInfo().bitrateList,
            current: current
        };
        console.log(params);
        var resultBitrate = 0;
        // $.ajax({
        //     type        :'POST',
        //     url         :'/ab',
        //     async       :false,
        //     data        :{'data':JSON.stringify(params)},
        //     success     :function (result) {
        //         resultBitrate = parseInt(result);
        //         console.log(result);
        //     }
        // });
        resultBitrate = 0;
        // // Get current bitrate
        // let streamController = StreamController(context).getInstance();
        // let abrController = rulesContext.getAbrController();
        // let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());
        //
        // // If already in lowest bitrate, don't do anything
        // if (current === 0) {
        //     return SwitchRequest(context).create();
        // }
        console.log(resultBitrate);
        // Ask to switch to the lowest bitrate
        let switchRequest = SwitchRequest(context).create();
        switchRequest.quality = resultBitrate;
        switchRequest.reason = 'Get suitable rate from server';
        switchRequest.priority = SwitchRequest.PRIORITY.STRONG;
        // var q = resultBitrate;
        // var p = SwitchRequest.PRIORITY.STRONG;
        // return SwitchRequest(context).create(q, {name : RequestBitrateRuleClass.__dashjs_factory_name},  p);
        return switchRequest;
    }

    instance = {
        getMaxIndex: getMaxIndex
    };

    setup();

    return instance;
}

RequestBitrateRuleClass.__dashjs_factory_name = 'RequestBitrateRule';
RequestBitrateRule = dashjs.FactoryMaker.getClassFactory(RequestBitrateRuleClass);

