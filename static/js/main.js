// Set variable by ID
var img = document.getElementById("img");
var output_div = document.getElementById("output");
var output_data = document.getElementById("output_data");
var loading = document.getElementById("loading");
var img_url = document.getElementById("img_url");
var btn = document.getElementById("btn_search");

// Hide image, output box, loading text
img.style.display = 'none';
output_div.style.display = 'none';
loading.style.display = 'none';

// Check when click button "Go!" on image url
btn.addEventListener("click", classify);

// Predict by image url
function classify() {
  output_data.innerHTML = "";
  // Hide output while predict
  output_div.style.display = 'none';
  // Display loadding text while predict
  loading.style.display = 'block';
  // Display image by image url input
  img.src = img_url.value;
  // Set variable url by image url input
  var url = "classify?imageurl="+img_url.value;
  $.get(url, function(data, status){
    // Display output box and hide loadding text
    img.style.display = 'block';
    output_div.style.display = 'block';
    loading.style.display = 'none';
    // Translate label to Thai Language and Set label in output box
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
