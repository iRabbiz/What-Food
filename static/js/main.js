var img = document.getElementById("img");
img.style.display = 'none';
var output_div = document.getElementById("output");
output_div.style.display = 'none';
var output_data = document.getElementById("output_data");
var loading = document.getElementById("loading");
loading.style.display = 'none';
var btn = document.getElementById("btn_search");
btn.addEventListener("click", classify);
var img_url = document.getElementById("img_url");

// Sent and Get data
function classify() {
  output_data.innerHTML = "";
  output_div.style.display = 'none';
  img.style.display = 'block';
  loading.style.display = 'block';
  img.src = img_url.value;
  var url = "classify?imageurl="+img_url.value;
  $.get(url, function(data, status){
    output_div.style.display = 'block';
    loading.style.display = 'none';
    switch(data.results) {
      case "friedrice":
      output_data.innerHTML = "ข้าวผัด";
      break;
      case "greencurry":
      output_data.innerHTML = "แกงเขียวหวาน";
      break;
      case "papayasalad":
      output_data.innerHTML = "ส้มตำ";
      break;
      case "tomyum":
      output_data.innerHTML = "ต้มยำ";
      break;
    }
  });
}
