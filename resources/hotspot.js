var toggleHotspots = function () {
    var hotspots = document.getElementsByClassName("hotspot");
    for (var i=0; i<hotspots.length; i++) {
        hotspots[i].classList.toggle("visibleHotspot");
    }
}

var HotspotResizer = function () {

    var supportedStyles = ["width", "height", "top", "left"];

    var originalHotpotStylesStorage = {};

    var generateRandomId = function() {
        return Math.floor((Math.random()) * 0x1000000000).toString(16);
    }

    var getOriginalHotspotStyles = function(hotspot) {
        var originalStyles = originalHotpotStylesStorage[hotspot.id];
        if(originalStyles){
            return originalStyles;
        }
        originalStyles = {};
        var computedStyles = window.getComputedStyle(hotspot);
        supportedStyles.forEach(function(styleName){
            originalStyles[styleName] = computedStyles[styleName];
        });
        originalHotpotStylesStorage[hotspot.id] = originalStyles;
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
            var image = rootElement.getElementsByTagName("img")[0];
            if(!image){
                return;
            }
            var scalingFactor = image.width / image.naturalWidth;
            var hotspots = rootElement.getElementsByClassName("hotspot");
            for(var i=0; i < hotspots.length; i++){
                var hotspot = hotspots[i];
                // Because we need an id, we assign a new id if no id has been already assigned to the hotspot
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

var HotspotNavigation = function () {

    var currentPageNumber = 1;

    var getPage = function(pageNumber) {
        return document.getElementById("page" + pageNumber);
    }

    var setPageDisplayProperty = function(pageNumber, displayPropertyValue){
        var page = getPage(pageNumber);
        if(!page){
            return;
        }
        page.style.display = displayPropertyValue;
    }

    var gotoPage = function(newPage) {
        if(!newPage) {
            return;
        }
        if(newPage !== currentPageNumber) {
            setPageDisplayProperty(currentPageNumber, "none");
        }
        setPageDisplayProperty(newPage, "block");
        currentPageNumber = newPage;
        resizeCurrentPage();
    }

    var getPageNameFromUrl = function() {
        return window.location.hash.replace('#', '') || currentPageNumber;
    }

    var onHashChange = function() {
        gotoPage(getPageNameFromUrl());
    }

    var resizeCurrentPage = function() {
        HotspotResizer.resizeHotspots(getCurrentPage());
    }

    var getCurrentPage = function() {
        return getPage(currentPageNumber);
    }

    return {
        init : function(){
            onHashChange();
            // Make hotspots visible by default
            toggleHotspots();
            window.addEventListener("hashchange", onHashChange, false);
            window.addEventListener('focus',  resizeCurrentPage, false);
            window.addEventListener('resize', resizeCurrentPage,  false);
            document.addEventListener('fullscreenchange', resizeCurrentPage,  false);
        }
    }

}();

window.addEventListener("load", HotspotNavigation.init,false);
