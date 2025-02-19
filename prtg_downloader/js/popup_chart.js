const width_input = document.querySelector("#width_input");
const height_input = document.querySelector("#height_input");
const sdate_input = document.querySelector("#sdate_input");
const edate_input = document.querySelector("#edate_input");

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get("width").then((result) => {
        if (result.width !== undefined) {
            width_input.value = result.width;
        }
    });

    chrome.storage.local.get(["height"]).then((result) => {
        if (result.height !== undefined) {
            height_input.value = result.height;
        }
        
    });

    chrome.storage.local.get(["sdate"]).then((result) => {
        if (result.sdate !== undefined) {
            sdate_input.value = result.sdate;
        }
    });

    chrome.storage.local.get(["edate"]).then((result) => {
        if (result.edate !== undefined) {
            edate_input.value = result.edate;
        }
    });
    
    document.querySelector('#getchart').addEventListener('click', getchart);
    document.querySelector('#clear_all').addEventListener('click', clear_storage);
    document.querySelector('#width_input').addEventListener('input', (e) => {
        chrome.storage.local.set({ "width": width_input.value }).then(() => {
            console.log("width is set:" + width_input.value);
        });
    });

    document.querySelector('#height_input').addEventListener('input', (e) => {
        chrome.storage.local.set({ "height": height_input.value }).then(() => {
            console.log("height is set:" + height_input.value);
        });
    });

    document.querySelector('#sdate_input').addEventListener('input', (e) => {
        chrome.storage.local.set({ "sdate": sdate_input.value }).then(() => {
            console.log("sdate is set:" + sdate_input.value);
        });
    });

    document.querySelector('#edate_input').addEventListener('input', (e) => {
        chrome.storage.local.set({ "edate": edate_input.value }).then(() => {
            console.log("edate is set:" + edate_input.value);
        });
    });
});

function getTabs(){
    console.log("getTabs");
	chrome.tabs.query({ active: true, currentWindow: true }, function(result){
		var output = [];

        // http://125.227.161.91:8088/api/historicdata.csv?id=objectid&avg=0&sdate=2016-01-20-00-00-00&edate=2016-01-21-00-00-00
		// for (var i = 0; i < result.length; i++){
			var url   = result[0].url;
			var icon  = result[0].favIconUrl;
			var title = result[0].title;
            var doc   = result[0].document;
			console.log(title);
            console.log("    " + url);

		// }
		// document.querySelector('#output').innerHTML = output.join('');
	});
}

// function getdom(){
//     console.log("getdom");
//     chrome.tabs.query({ active: true, currentWindow: true }, function(result){
//         chrome.tabs.sendMessage(result[0].id, { action: "get_page_content" }, function (response) {
//             console.log(response);
//         });
//     });
// }

function getchart() {
    console.log("getchart");
    chrome.tabs.query({ active: true, currentWindow: true }, function(result){
        chrome.tabs.sendMessage(result[0].id, { action: "get_prtg_chart" }, function (response) {
            var downloadOptions = {
                "url" : response.content.replace(/(width=)(\d+)&(height=)(\d+)/, function(match, p1, num1, p2, num2) {
                    var newWidth = num1;
                    var newHeight = num2;
                    if ( width_input.value !== "" )  {
                        newWidth = width_input.value;
                    } 
                    
                    if ( height_input.value !== "" ) {
                        newHeight = height_input.value;
                    }

                    return p1 + newWidth + '&' + p2 + newHeight;
                  }).replace(/(showLegend%3D%27)(\d+)(%27)/, function(match, p1, showLegendValue, p2) {
                    var newShowLegendValue = (showLegendValue === '0') ? '1' : '0';
                    return p1 + newShowLegendValue + p2;
                  }).replace(/(edate=)(\d+-\d+-\d+-\d+-\d+-\d+)/, function(match, parameter, datestr) {
                    console.log("edate: match");
                    if (edate_input.value !== "") {
                        console.log("edate_value");
                        return parameter + edate_input.value;
                    } else {
                        console.log("edate_value empty");
                        return match;
                    }
                  }).replace(/(sdate=)(\d+-\d+-\d+-\d+-\d+-\d+)/, function(match, parameter, datestr) {
                    console.log("sdate: match");
                    if (sdate_input.value !== "") {
                        console.log("sdate_value");
                        return parameter + sdate_input.value;
                    } else {
                        console.log("sdate_value empty");
                        return match;
                    }
                  }).replace(/(graphid=)(\d)&/, function(match, parameter, value) {
                    console.log("graphid: match");
                    if (edate_input.value !== "" && sdate_input.value !== "") {
                        console.log("graphid: " + parameter + "-1&edate=" + edate_input.value + "&sdate=" + sdate_input.value + "&");
                        return parameter + "-1&edate=" + edate_input.value + "&sdate=" + sdate_input.value + "&";
                    } else {
                        console.log("graphid: " + parameter + value + "&");
                        return parameter + value + "&";
                    }
                  }),
                "saveAs" : false,
                "filename" : response.filename + ".png"
            };

            console.log(downloadOptions.url);
            console.log(response.filename);
            console.log(response.element);
            chrome.downloads.download(downloadOptions,function(downloadId) {
                console.log(downloadId);
            });
        });
    });
}


function clear_storage() {
    chrome.storage.local.clear();
    width_input.value = null;
    height_input.value = null;
    sdate_input.value = null;
    edate_input.value = null;
    // fetch('http://125.227.161.91:8088/api/table.xml?content=sensortree&output=xml&_=1708594553509')
    // .then(function(response) {
    //     console.log(response.text());
    //     // 處理 response
    // }).catch(function(err) {
    //     // 錯誤處理
    //     console.log(err);
    // });
}
