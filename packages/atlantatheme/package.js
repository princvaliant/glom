Package.describe({
  summary: "Atlanta theme",
  version: "1.0.0"
});

Package.on_use(function (api) {

  api.use('less');
  api.use('blaze');

  api.addFiles('js/jquery.min.js', 'client');
  api.addFiles('js/jquery-ui.min.js', 'client');
  api.addFiles('js/jquery.mCustomScrollbar.js', 'client');
  api.addFiles('js/icheck.min.js', 'client');
  api.addFiles('js/jquery-validation/jquery.validate.js', 'client');
  api.addFiles('js/jquery-validation/additional/accept.js', 'client');
  api.addFiles('js/jquery-validation/additional/additional.js', 'client');
  api.addFiles('js/jquery-validation/additional/alphanumeric.js', 'client');
  api.addFiles('js/jquery-validation/additional/bankaccountNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/bankorgiroaccountNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/bic.js', 'client');
  api.addFiles('js/jquery-validation/additional/cifES.js', 'client');
  api.addFiles('js/jquery-validation/additional/creditcardtypes.js', 'client');
  api.addFiles('js/jquery-validation/additional/currency.js', 'client');
  api.addFiles('js/jquery-validation/additional/dateFA.js', 'client');
  api.addFiles('js/jquery-validation/additional/dateITA.js', 'client');
  api.addFiles('js/jquery-validation/additional/dateNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/extension.js', 'client');
  api.addFiles('js/jquery-validation/additional/giroaccountNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/iban.js', 'client');
  api.addFiles('js/jquery-validation/additional/integer.js', 'client');
  api.addFiles('js/jquery-validation/additional/ipv4.js', 'client');
  api.addFiles('js/jquery-validation/additional/ipv6.js', 'client');
  api.addFiles('js/jquery-validation/additional/lettersonly.js', 'client');
  api.addFiles('js/jquery-validation/additional/letterswithbasicpunc.js', 'client');
  api.addFiles('js/jquery-validation/additional/mobileNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/mobileUK.js', 'client');
  api.addFiles('js/jquery-validation/additional/nieES.js', 'client');
  api.addFiles('js/jquery-validation/additional/nifES.js', 'client');
  api.addFiles('js/jquery-validation/additional/nowhitespace.js', 'client');
  api.addFiles('js/jquery-validation/additional/pattern.js', 'client');
  api.addFiles('js/jquery-validation/additional/phoneNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/phoneUK.js', 'client');
  api.addFiles('js/jquery-validation/additional/phoneUS.js', 'client');
  api.addFiles('js/jquery-validation/additional/phonesUK.js', 'client');
  api.addFiles('js/jquery-validation/additional/postalCodeCA.js', 'client');
  api.addFiles('js/jquery-validation/additional/postalcodeIT.js', 'client');
  api.addFiles('js/jquery-validation/additional/postalcodeNL.js', 'client');
  api.addFiles('js/jquery-validation/additional/postcodeUK.js', 'client');
  api.addFiles('js/jquery-validation/additional/require_from_group.js', 'client');
  api.addFiles('js/jquery-validation/additional/skip_or_fill_minimum.js', 'client');
  api.addFiles('js/jquery-validation/additional/statesUS.js', 'client');
  api.addFiles('js/jquery-validation/additional/strippedminlength.js', 'client');
  api.addFiles('js/jquery-validation/additional/time.js', 'client');
  api.addFiles('js/jquery-validation/additional/time12h.js', 'client');
  api.addFiles('js/jquery-validation/additional/url2.js', 'client');
  api.addFiles('js/jquery-validation/additional/vinUS.js', 'client');
  api.addFiles('js/jquery-validation/additional/zipcodeUS.js', 'client');
  api.addFiles('js/jquery-validation/additional/ziprange.js', 'client');
  api.addFiles('js/owl/owl.carousel.min.js', 'client');
  api.addFiles('js/jQAllRangeSliders-min.js', 'client');
  api.addFiles('js/ion.rangeSlider.min.js', 'client');
  api.addFiles('js/jquery.blueimp-gallery.min.js', 'client', {
    bare: true
  });

  api.addFiles('js/validationengine/jquery.validationEngine.js', 'client');
  api.addFiles('js/validationengine/languages/jquery.validationEngine-en.js', 'client');

  api.addFiles('js/bootstrap.min.js', 'client');
  api.addFiles('js/plugins.js', 'client');
  api.addFiles('js/actions.js', 'client', {
    bare: true
  });
  // api.addFiles('js/settings.js', 'client' );
  api.addFiles('js/morris/raphael-min.js', 'client');
  api.addFiles('js/morris/morris.min.js', 'client');
  api.addFiles('js/morris/justgage.1.0.1.min.js', 'client', {
    bare: true
  });
  api.addFiles('js/bootstrap-timepicker.min.js', 'client');
  api.addFiles('js/bootstrap-datepicker.js', 'client');
  api.addFiles('js/bootstrap-file-input.js', 'client');
  api.addFiles('js/bootstrap-select.js', 'client', {
    bare: true
  });

  api.addFiles('css/bootstrap.min.css', 'client');
  api.addFiles('css/summernote.css', 'client');
  api.addFiles('css/rickshaw.css', 'client');
  api.addFiles('css/nv.d3.css', 'client');
  api.addFiles('css/jquery.mCustomScrollbar.css', 'client');
  api.addFiles('css/jquery-ui.min.css', 'client');
  api.addFiles('css/font-awesome.min.css', 'client');
  api.addFiles('css/dropzone.css', 'client');
  api.addFiles('css/codemirror.css', 'client');
  api.addFiles('css/blueimp-gallery.min.css', 'client');
  api.addFiles('css/animate.min.css', 'client');
  api.addFiles('css/theme-default.less', 'client');
  api.addFiles('css/styles.less', 'client');
  api.addFiles('css/switch.css', 'client');
  api.addFiles('css/ion.rangeSlider.css', 'client');
  api.addFiles('css/ion.rangeSlider.skinFlat.css', 'client');
  api.addFiles('css/theme-default.css', 'client');

  api.addAssets('fonts/fontawesome-webfont.woff', 'client');
  api.addAssets('fonts/fontawesome-webfont.ttf', 'client');
  api.addAssets('fonts/fontawesome-webfont.eot', 'client');
  api.addAssets('fonts/fontawesome-webfont.svg', 'client');

  api.addAssets('fonts/glyphicons-halflings-regular.eot', 'client');
  api.addAssets('fonts/glyphicons-halflings-regular.svg', 'client');
  api.addAssets('fonts/glyphicons-halflings-regular.ttf', 'client');
  api.addAssets('fonts/glyphicons-halflings-regular.woff', 'client');

  api.addAssets('img/bg.png', 'client');
  api.addAssets('img/logo.png', 'client');
  api.addAssets('img/logo-small.png', 'client');
  api.addAssets('img/themes/dark.jpg', 'client');
  api.addAssets('img/themes/default-head-light.jpg', 'client');

  api.addAssets('img/icons/status-battery-0-icon.png', 'client');
  api.addAssets('img/icons/status-battery-1-icon.png', 'client');
  api.addAssets('img/icons/status-battery-2-icon.png', 'client');
  api.addAssets('img/icons/status-battery-3-icon.png', 'client');
  api.addAssets('img/icons/status-battery-4-icon.png', 'client');
  api.addAssets('img/icons/status-signal-0-icon.png', 'client');
  api.addAssets('img/icons/status-signal-1-icon.png', 'client');
  api.addAssets('img/icons/status-signal-2-icon.png', 'client');
  api.addAssets('img/icons/status-signal-3-icon.png', 'client');
  api.addAssets('img/icons/status-signal-4-icon.png', 'client');
  api.addAssets('img/ion/sprite-skin-flat.png', 'client');

  //   api.export('JustGage', ['client']);
  //   api.export('blueimp', ['client']);
});
