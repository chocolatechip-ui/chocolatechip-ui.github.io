(function($) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));
$(function() {
  $._contrast = '#333';
  var stylesheet;

  // Function to light a hex color:
  //===============================
  $.lightenColor = function(color, percent) {  
    var num = parseInt(color.slice(1), 16);
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt;
    var G = (num >> 8 & 0x00FF) + amt;
    var B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  //===========================================
  // Define method to calculate color contrast:
  //===========================================
  $.calculateContrast = function(color) {
    if (typeof color === 'object') color = color.toHexString();
    var colour = new $.RGBColor(color);
    return $.calcBrightness(colour);
  };

  //======================================================
  // Define a mediator to handle publishing color choices,
  // and updating the stylessheets and UI:
  //======================================================
  var colorMediator = $.subscribe('chosen-color', function(event, obj) {
    var brightness = $.calculateContrast(obj.color);
    var bkcolor = obj.color;
    var color = '#fff';
    if (brightness > 149) {
      color = '#000'
    }
    $('#backgroundColorTest').css({'background-color': bkcolor, 'color': color})



  });

  //========================
  // Initialize UI elements:
  //========================

  var calculateColors = function(color) {
    if (typeof color === 'string') {
      $._color = color;
    } else { 
      $._color = color.toHexString();
    }
    $.publish('chosen-color', {color: $._color});
  };  

  // Initialize primary color picker:
  var primaryColorInput = $('#colorPicker');
  primaryColorInput.spectrum({flat: true, showInput: true, showInitial: true, showButtons: false, preferredFormat: "hex", showPalette: false, showSelectionPalette: false, color: '#007aff', 
    move : function(color) {
      calculateColors(color);
    }
  });


  // Calculate Color from manual entry:
  $('.sp-input').on("keypress", function(e) {
    if (e.keyCode == 13) {
      calculateColors($(this).val());
    }
  });
});