/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */

/*global dashjs*/

let ServerRule;

function ServerRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let DashManifestModel = factory.getSingletonFactoryByName('DashManifestModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let Debug = factory.getSingletonFactoryByName('Debug');

    let context = this.context;
    let instance,
        logger;
    let historyCount;

    function setup() {
        logger = Debug(context).getInstance().getLogger(instance);
    }

    function getBytesLength(request) {
        return request.trace.reduce((a, b) => a + b.b[0], 0);
    }

    function getMaxIndex(rulesContext) {
        console.log('usegetmax');
        let mediaType = rulesContext.getMediaInfo().type;

        let metricsModel = MetricsModel(context).getInstance();
        let dashMetrics = DashMetrics(context).getInstance();
        let dashManifest = DashManifestModel(context).getInstance();
        let metrics = metricsModel.getReadOnlyMetricsFor(mediaType);
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());

        let requests = dashMetrics.getHttpRequests(metrics),
            lastRequest = null,
            currentRequest = null,
            downloadTime,
            totalTime,
            calculatedBandwidth,
            currentBandwidth,
            latencyInBandwidth,
            switchUpRatioSafetyFactor,
            currentRepresentation,
            count,
            bandwidths = [],
            i,
            q = SwitchRequest.NO_CHANGE,
            p = SwitchRequest.PRIORITY.DEFAULT,
            totalBytesLength = 0;

        latencyInBandwidth = true;
        switchUpRatioSafetyFactor = 1.5;
        logger.debug("[CustomRules][" + mediaType + "][ServerRule] Checking download ratio rule... (current = " + current + ")");
        console.log(metrics);
        console.log(current);
        if (!metrics) {
            logger.debug("[CustomRules][" + mediaType + "][ServerRule] No metrics, bailing.");
            return SwitchRequest(context).create();
        }
        // console.log(metrics);
        // console.log(current);
        // Get last valid request
        i = requests.length - 1;
        while (i >= 0 && lastRequest === null) {
            currentRequest = requests[i];
            if (currentRequest._tfinish && currentRequest.trequest && currentRequest.tresponse && currentRequest.trace && currentRequest.trace.length > 0) {
                lastRequest = requests[i];
            }
            i--;
        }

        if (lastRequest === null) {
            logger.debug("[CustomRules][" + mediaType + "][ServerRule] No valid requests made for this stream yet, bailing.");
            return SwitchRequest(context).create();
        }

        if(lastRequest.type !== 'MediaSegment' ) {
            logger.debug("[CustomRules][" + mediaType + "][ServerRule] Last request is not a media segment, bailing.");
            return SwitchRequest(context).create();
        }

        totalTime = (lastRequest._tfinish.getTime() - lastRequest.trequest.getTime()) / 1000;
        downloadTime = (lastRequest._tfinish.getTime() - lastRequest.tresponse.getTime()) / 1000;

        if (totalTime <= 0) {
            logger.debug("[CustomRules][" + mediaType + "][ServerRule] Don't know how long the download of the last fragment took, bailing.");
            return SwitchRequest(context).create();
        }
        console.log("history::"+ historyCount);
        historyCount = historyCount || 0;
        if(historyCount === metrics.HttpList.length){
            console.log("不变");
            return SwitchRequest(context).create();
        }
        historyCount = metrics.HttpList.length;

        let switchRequest = SwitchRequest(context).create();
        // switchRequest.quality = (current + 1)%rulesContext.getMediaInfo().representationCount;

        var params = {
            count: rulesContext.getMediaInfo().representationCount,
            bitrates:rulesContext.getMediaInfo().bitrateList,
            current: current
        };
        console.log(params);
        console.log('ABR:'+ABRId);
        var resultBitrate = 0;
        $.ajax({
            type        :'POST',
            url         :'/abr',
            async       :false,

            data        :{  ABRId       :ABRId,//global
                            'data'      : JSON.stringify(params)
                            },
            success     :function (result) {
                resultBitrate = parseInt(result);
                console.log(result);
            }
        });
        switchRequest.quality = resultBitrate;
        console.log('switch::' +switchRequest.quality);
        switchRequest.reason = 'Get suitable rate from server';
        switchRequest.priority = SwitchRequest.PRIORITY.WEAK;
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

ServerRuleClass.__dashjs_factory_name = 'ServerRule';
ServerRule = dashjs.FactoryMaker.getClassFactory(ServerRuleClass);

