document.addEventListener('DOMContentLoaded', function () {
chrome.tabs.query({ active: true, currentWindow: true }, function(result){
    chrome.tabs.sendMessage(result[0].id, { action: "at_Device" }, function (response) {
      console.log(response);
      if(response !== null) {
        document.getElementById("sensor_chart").style.display = "none";
        document.getElementById("device_page").style.display = "block";
        document.getElementById("getallchart").textContent = response;
      } else {
        document.getElementById("sensor_chart").style.display = "block";
        document.getElementById("device_page").style.display = "none";
      }
    })
  });
});