var HotspotResizer = function () {

    var supportedStyles = ["width", "height", "top", "left"];

    var originalHotpotStyles = {};

    var generateRandomId = function() {
        return Math.floor((Math.random()) * 0x1000000000).toString(16);
    }

    var getOriginalHotspotStyles = function(hotspot) {
        var originalStyles = originalHotpotStyles[hotspot.id];
        if(originalStyles){
            return originalStyles;
        }
        originalStyles = {};
        var computedStyles = window.getComputedStyle(hotspot);
        supportedStyles.forEach(function(styleName){
            originalStyles[styleName] = computedStyles[styleName];
        });
        originalHotpotStyles[hotspot.id] = originalStyles;
        return originalStyles;
    };

    var resizeHotspot = function(hotspot, unscaledStyles, scalingFactor) {
        supportedStyles.forEach(function(styleName){
            var unscaledValue = parseInt(unscaledStyles[styleName]);
            hotspot.style[styleName] = (unscaledValue * scalingFactor) + "px";
        });
    };

    return {
        resizeHotspots: function(rootElement) {
            if(!rootElement){
                return;
            }
            var image = rootElement.getElementsByClassName("hotspotImage")[0];
            if(!image){
                return;
            }
            var scalingFactor = image.width / image.naturalWidth;
            var hotspots = rootElement.getElementsByClassName("hotspot");
            for(var i=0; i < hotspots.length; i++){
                var hotspot = hotspots[i];
                if(!hotspot.id){
                    hotspot.id = generateRandomId();
                }
                var unscaledStyles = getOriginalHotspotStyles(hotspot);
                resizeHotspot(hotspot, unscaledStyles, scalingFactor);
            }
            console.log("resized");
        }
    };
}();