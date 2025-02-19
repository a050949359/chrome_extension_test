document.querySelector('#getallchart').addEventListener('click', getallcharturl);

function getallcharturl() {
    console.log("getTabs");
    chrome.tabs.query({ active: true, currentWindow: true }, function(result){
		var url   = new URL(result[0].url);
        var queryString = "content=sensors&output=xml&columns=objid,probe,group,device,sensor,status,message,lastvalue,priority,favorite";

        url.pathname = '/api/table.xml'; // 更新路徑
        url.search = `?${queryString}&id=${url.searchParams.get('id')}`;

        fetch(url.href)
        .then((response) => response.text())
        .then((text) => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, "text/xml");
            var sensors = doc.querySelectorAll("item");
            var sensors_info = new Array();

            [].forEach.call(sensors,function(sensor) {
                sensors_info.push({id: sensor.querySelector("objid").textContent, filename: sensor.querySelector("sensor").textContent});
            });

            chrome.runtime.sendMessage({ action: "sensor_id", source: url.href, sensors_info: sensors_info, folder: document.querySelector('#getallchart').textContent });
        });
	});

    return true;
}