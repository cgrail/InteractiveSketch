var currentPageNumber = 1;

window.addEventListener("load", function load(event){
    onHashChange();
},false);

window.addEventListener("hashchange", onHashChange, false);
window.addEventListener('focus',  resizeCurrentPage, false);
window.addEventListener('resize', resizeCurrentPage,  false);
document.addEventListener('fullscreenchange', resizeCurrentPage,  false);

function onHashChange() {
    gotoPage(getPageNameFromUrl());
}

function getPageNameFromUrl() {
    return window.location.hash.replace('#', '') || currentPageNumber;
}

function gotoPage(newPage) {
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

function resizeCurrentPage() {
    HotspotResizer.resizeHotspots(getPage(currentPageNumber));
}

function setPageDisplayProperty(pageNumber, displayPropertyValue){
    var page = getPage(pageNumber);
    if(!page){
        return;
    }
    page.style.display = displayPropertyValue;
}

function getPage(pageNumber) {
    return document.getElementById("page" + pageNumber);
}