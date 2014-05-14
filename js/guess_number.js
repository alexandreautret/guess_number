/******************************************
 *
 * @author          Alexandre Autret
 * @copyright       Copyright (c) 2014 Alexandre Autret
 * @license         This GuessNumber jQuery plug-in is licensed under the MIT license.
 * @version         Version 1.0
 *
 ******************************************/
(function($)
{
  $.fn.wGuessNumber = function(option, settings)
  {
    if(typeof option === 'object')
    {
      settings = option;
    }
    else if(typeof option == 'string')
    {
      var values = [];

      var elements = this.each(function()
      {

        var data = $(this).data('_wGuessNumber');

        if(data)
        {
          if(option === 'updateSettings') { data.updateSettings(settings); }

         else if($.fn.wGuessNumber.defaultSettings[option] !== undefined)
          {
            if(settings !== undefined) { data.settings[option] = settings; }
            else { values.push(data.settings[option]); }
          }
        }
      });

      if(values.length === 1) { return values[0]; }
      if(values.length > 0) { return values; }
      else { return elements; }
    }

    settings = $.extend({}, $.fn.wGuessNumber.defaultSettings, settings || {});

    return this.each(function()
    {
      var elem = $(this);
      var $settings = jQuery.extend(true, {}, settings);

      var sp = new GuessNumber($settings, elem);

      elem.append(sp.generate());



      elem.data('_wGuessNumber', sp);

      sp.init();
    });


  };

  $.fn.wGuessNumber.defaultSettings =
  {
    value			: 210,		// Set the number to guess
    numberOfTryAllowed	: 10,		// Set the number to guess
    inputIdentifier : 'proposition', // Set the id of input element where is the user answer
    buttonIdentifier : 'validProposition', // Set the button id of element where user click the validate his answer
    messageIdentifier : 'messageBox', // Set the id of div where the text message is displaying

    callbackFunction : null,
    texts : {
      tooLow : 'Trop Bas ! ',
      tooBig : 'Trop Haut !',
      exact  : 'Exact !'
    }
  };

  function GuessNumber(settings, elem)
  {
    this.settings = settings;
    this.$elem = elem;
    return this;
  }

  GuessNumber.prototype =
  {
    generate: function()
    {
      var $this = this;
      if(!$this.settings.texts.tooBig) $this.settings.texts.tooBig =  $.fn.wGuessNumber.defaultSettings.texts.tooBig ;
      if(!$this.settings.texts.tooLow) $this.settings.texts.tooLow =  $.fn.wGuessNumber.defaultSettings.texts.tooLow;
      if(!$this.settings.texts.exact) $this.settings.texts.exact =  $.fn.wGuessNumber.defaultSettings.texts.exact ;
      if(!$this.settings.texts.error) $this.settings.texts.error =  $.fn.wGuessNumber.defaultSettings.texts.error ;

      if(!$this.settings.numberOfTryAllowed) $this.settings.numberOfTryAllowed =  $.fn.wGuessNumber.defaultSettings.numberOfTryAllowed ;
      if(!$this.settings.callbackFunction) $this.settings.callbackFunction =  $.fn.wGuessNumber.defaultSettings.callbackFunction ;

      if(!$this.settings.buttonIdentifier) $this.settings.buttonIdentifier =  $.fn.wGuessNumber.defaultSettings.buttonIdentifier ;
      if(!$this.settings.inputIdentifier) $this.settings.inputIdentifier =  $.fn.wGuessNumber.defaultSettings.inputIdentifier ;
      if(!$this.settings.messageIdentifier) $this.settings.messageIdentifier =  $.fn.wGuessNumber.defaultSettings.messageIdentifier ;

      $validationButton = $('#' + $this.settings.buttonIdentifier);
      $propositionInput = $this.$elem.find('#' + $this.settings.inputIdentifier);
      $messageIdentifier = $('#' + $this.settings.messageIdentifier);

      $validationButton.click(function(e){
        e.preventDefault();
        $this.checkValue();
      });
      $propositionInput.keydown(function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          e.preventDefault();
          $this.checkValue();
        }
      });
      return this;
    },
    init: function()
    {
      return this;
    },
    updateSettings: function( newSetting)
    {
      if(newSetting.value) $this.settings.value =  parseInt(newSetting.value);
      if(newSetting.numberOfTryAllowed) $this.settings.numberOfTryAllowed =  parseInt(newSetting.numberOfTryAllowed) ;
      if(newSetting.texts.tooBig) $this.settings.texts.tooBig =  newSetting.texts.tooBig ;
      if(newSetting.texts.tooLow) $this.settings.texts.tooLow =  newSetting.texts.tooLow;
      if(newSetting.texts.exact) $this.settings.texts.exact =  newSetting.texts.exact ;
      if(newSetting.texts.error) $this.settings.texts.error =  newSetting.texts.error ;

      if(newSetting.callbackFunction) $this.settings.callbackFunction =  newSetting.callbackFunction ;

      this.init();
    },

    checkValue : function(){
    var value =  $propositionInput.val();
    if(value != "" && (parseInt(value) || value == 0)){
      var valueResult = this.compareNumbers(this.settings.value, value);
      switch (valueResult){
        case  0:
          $messageIdentifier.html(this.settings.texts.tooLow);
          break;
        case  1:
          $messageIdentifier.html(this.settings.texts.tooBig);
          break;
        case  2:
          $messageIdentifier.html(this.settings.texts.exact);
          this.solutionCallback(true);
          break;
      }
    } else {
      $messageIdentifier.html(this.settings.texts.error);
    }
  },
    compareNumbers : function (first, second){
    if(parseInt(second) < parseInt(first))
      return 0;
    else if(parseInt(second) > parseInt(first))
      return 1;
    else if(parseInt(first) == parseInt(second))
      return 2;
  },
   solutionCallback : function (answerFound) {
     $this = this;
        setTimeout(function () {
          $this.settings.callbackFunction({sucess:answerFound});
        }, 1000)

    }


  }
})(jQuery);
