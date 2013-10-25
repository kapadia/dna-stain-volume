
(function(){
  var width = 512;
  var height = 512;
  var depth = 70;
  var volumeData = new Uint8Array(width * height * depth);
  var minimumEl;
  var maximumEl;
  var minimum = 0;
  var maximum = 255;
  
  getImage = function(z) {
    
    var img = new Image();
    
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      var data = ctx.getImageData(0, 0, 512, 512).data;
      
      var bChannel = new Uint8Array(data.length / 4);
      
      // Get only the blue channel
      for (var i = 0; i < data.length; i+=1) {
        var index = 4 * i;
        bChannel[i] = data[index + 2];
      }
      volumeData.set(bChannel, z * bChannel.length);
      
      // Check if we have all data
      if (z === (depth  - 1)) {
        
        // Create volume rendering
        var el = document.querySelector("#volume");
        var volume = new astro.Volumetric(el, 700);
        
        volume.setExtent(0, 255);
        volume.setTexture(new Float32Array(volumeData), width, height, depth);
        volume.draw();
        
        // Connect UI
        minimumEl.onchange = function() {
          minimum = parseInt(this.value);
          volume.setExtent(minimum, maximum);
        }
        maximumEl.onchange = function() {
          maximum = parseInt(this.value);
          volume.setExtent(minimum, maximum);
        }
        
        return;
      }
      
      // Request next image
      z++;
      getImage(z);
    }
    
    // Zero pad
    var pad = "";
    if ((z+1).toString().length === 1) {
      pad = "0";
    }
    
    img.src = "data/" + "P-TRE_15_R3D_D3D.dv_c00_z" + pad + (z + 1) + "_t01.jpg";
  }
  
  domReady = function() {
    minimumEl = document.querySelector("input[data-type='minimum']");
    maximumEl = document.querySelector("input[data-type='maximum']");
    getImage(0);
  }
  window.addEventListener('DOMContentLoaded', domReady, false);
})()