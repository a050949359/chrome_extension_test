console.log("content.js");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("content.js get_page_content");
    if (request.action === 'get_page_content') {
        var pageContent = document.documentElement.outerHTML;

        sendResponse({ content: pageContent });
    } else if (request.action === 'get_prtg_chart') {
        var element = document.querySelector('.prtgchart ');
        var filename = getChartFileName();

        if (element) {
            var srcValue = element.src;
            sendResponse({ content: srcValue, filename: filename });
        } else {
            sendResponse({ content: null, filename: null });
        }
    }

});

function getChartFileName() {
    var ulElement = document.querySelector('.crumbler');

    if (ulElement) {
        var liElements = ulElement.querySelectorAll('li');
        var secondToLastValue = liElements[liElements.length - 2].querySelector('a').textContent.replace("\\", ".").replace("/", ".").replace(":", ".").replace("*", ".").replace("?", ".").replace("\"", ".").replace(">", ".").replace("<", ".").replace("?", ".");
        // var lastValue = liElements[liElements.length - 1].querySelector('a').textContent.replace("\\", ".").replace("/", ".").replace(":", ".").replace("*", ".").replace("?", ".").replace("\"", ".").replace(">", ".").replace("<", ".").replace("?", ".");
        var lastValue = document.querySelector('.sensorheader').querySelector('dummy').textContent.replace("\\", ".").replace("/", ".").replace(":", ".").replace("*", ".").replace("?", ".").replace("\"", ".").replace(">", ".").replace("<", ".").replace("?", ".");
        return secondToLastValue + "/" + lastValue
    } else {
        return null;
    }
}