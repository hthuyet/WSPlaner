var isMobile = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
var isIos = iOS();


$.validator.addMethod("notExisted", function (value, element) {
  var checkApi = $(element).attr('check-api');
  var existed = true;
  $.ajax({
    url: checkApi + value,
    method: 'GET',
    async: false,
    success: function (response) {
      existed = response;
    },
    error: function (error) {
      //not existed by default
    }
  });
  return !existed;
});
$.validator.messages.notExisted = 'This value is already in use';

var common = {
  initCollapsedAfterNgRepeat: function () {
    // Collapse on click
    $('.panelNgRepeat [data-action=collapse]').unbind('click').click(function (e) {
      e.preventDefault();
      var $panelCollapse = $(this).parent().parent().parent().parent().nextAll();
      $(this).parents('.panel').toggleClass('panel-collapsed');
      $(this).toggleClass('rotate-180');

      // recalculate page height
      var availableHeight = $(window).height() - $('.page-container').offset().top - $('.navbar-fixed-bottom').outerHeight();
      $('.page-container').attr('style', 'min-height:' + availableHeight + 'px');

      $panelCollapse.slideToggle(150);
    });

  },
  notifyWarning: function (_message) {
    PNotify.removeAll();
    new PNotify({ text: _message, icon: 'icon-warning22', addclass: 'bg-warning' });
  },
  notifySuccess: function (_message) {
    PNotify.removeAll();
    PNotify.defaultStack = {
      dir1: 'down',
      dir2: 'left',
      firstpos1: 25,
      firstpos2: 25,
      spacing1: 36,
      spacing2: 36,
    }
    new PNotify({
      text: '<i class="icon-checkmark3"></i> ' + _message,
      addclass: 'bg-success',
      delay: 3000,
      stack: PNotify.defaultStack
    });
  },
  notifyWithMessage: function (_message, _status, info) {
    PNotify.removeAll();
    PNotify.defaultStack = {
      dir1: 'down',
      dir2: 'left',
      firstpos1: 25,
      firstpos2: 25,
      spacing1: 36,
      spacing2: 36,
    }
    new PNotify({
      text:  _message,
      title: info,
      addclass: 'bg-warning',
      delay: 3000,
      stack: PNotify.defaultStack
    });
  },
  notifyError: function (_message, _status) {
    PNotify.removeAll();
    PNotify.defaultStack = {
      dir1: 'down',
      dir2: 'left',
      firstpos1: 25,
      firstpos2: 25,
      spacing1: 36,
      spacing2: 36,
    }
    new PNotify({
      text: _message,
      title: _status,
      icon: 'icon-blocked',
      addclass: 'bg-danger',
      delay: 3000,
      stack: PNotify.defaultStack
    });
  },
  notifyRemoveAll: function () {
    PNotify.removeAll();
  },
  spinner: function (_isLoading) {
    if (_isLoading && !$('#preloader2').is(":visible")) {
      $('#preloader1').show();
    } else {
      $('#preloader1').hide();
    }
  },
  spinnerFirstLoad: function (_isLoading) {
    if (_isLoading) {
      // $('#preloader1').hide();
      $('#preloader2').show();
    } else {
      $('#preloader2').hide();
    }
  },
  btnLoading: function (_element, _isLoading) {
    if (_isLoading) {
      _element.find('i').hide();
      _element.html('<i class="icon-spinner4 spinner position-left iconLoading"></i>' + _element.html());
      _element.attr('disabled', true);

    } else {
      _element.find('i').show();
      _element.find('i.iconLoading').remove();
      _element.removeAttr('disabled');
    }
  },
  renderParameterInputData: function (_parameter) {
    var rule = _parameter.rule ? _parameter.rule : '';
    var settingValue = _parameter.settingValue ? _parameter.settingValue : '';
    var options = [];

    // Validate rule
    // if (_parameter.settingValue && _parameter.settingValue !== '') {
    //   rule = _parameter.settingValue;
    // } else if (_parameter.rule && _parameter.rule !== '') {
    //   rule = _parameter.rule;
    // }

    if (_parameter.type === 'number') {
      _parameter.value = !isNaN(_parameter.value) ? parseInt(_parameter.value) : null;
      if (rule.startsWith('[') && rule.endsWith(']') && rule.length > 2) {

        var parameterRule = _parameter.rule.substr(1, _parameter.rule.length - 2);
        if (parameterRule.startsWith('>')) {
          options = parameterRule.split('>');
          _parameter.inputOptions = [options[1], null]

        } else if (parameterRule.startsWith('<')) {
          options = parameterRule.split('<');
          _parameter.inputOptions = [null, options[1]]

        } else if (parameterRule.indexOf('-') > 0) {
          options = parameterRule.split('-');
          _parameter.inputOptions = [options[0], options[1]]

        } else {
          _parameter.inputOptions = [null, null];
        }
      } else {
        _parameter.inputOptions = [null, null];
      }
    }
    else if (_parameter.type === 'text') {
      if (rule.startsWith('[') && rule.endsWith(']') && rule.length > 2) {

        var parameterRule = _parameter.rule.substr(1, _parameter.rule.length - 2);
        if (parameterRule.startsWith('>')) {
          options = parameterRule.split('>');
          _parameter.inputOptions = [options[1], null]

        } else if (parameterRule.startsWith('<')) {
          options = parameterRule.split('<');
          _parameter.inputOptions = [null, options[1]]

        } else if (parameterRule.indexOf('-') > 0) {
          options = parameterRule.split('-');
          _parameter.inputOptions = [options[0], options[1]]

        } else {
          _parameter.inputOptions = [null, null];
        }
      } else {
        _parameter.inputOptions = [null, null];
      }
    }
    else if (_parameter.type === 'combo-box') {
      if (settingValue.startsWith('[') && settingValue.endsWith(']') && settingValue.length > 2) {
        var parameterRule = settingValue.substr(1, settingValue.length - 2);
        options = parameterRule.split(';');
        _parameter.inputOptions = options;
      }
    }
    else if (_parameter.type === 'date') {
      // 1970-01-01T04:21:04+00:00
      var value = _parameter.value && _parameter.value.length === '2017-04-01T04:21:04+00:00'.length ? _parameter.value : '';
      if (value !== '') {
        value = moment(value).format(constants.DATETIME_MOMENT_FORMAT)
      }
      _parameter.value = value;

    }
    else if (_parameter.type === 'checkbox') {
      //
    } else if (_parameter.type === 'hidden') {
      _parameter.value = _parameter.settingValue;
    }

    return _parameter;
  },
  setValueFromRequestParams: function (_requestParams) {
    var result = {};

    // Render value
    $.each(_requestParams, function (_index, _value) {
      result[_value] = common.getUrlRequestParam(_value);
    });

    // Set default value
    result.limit = result.limit !== null ? result.limit : '20';
    result.page = result.page !== null ? parseInt(result.page) : 1;

    // Validate params
    // Validate limit
    if (['5', '10', '15', '20', '30'].indexOf(result.limit) < 0) {
      common.notifyWarning('Request param limit invalid.');
      result.limit = '20';
      common.updateUrlRequestParam('limit', result.limit);
    }

    return result;
  },
  formValidate: {
    ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
    errorClass: 'validation-error-label',
    successClass: 'validation-success-label',
    validClass: "validation-valid-label",
    onkeyup: false,
    onfocusout: function (element) {
      if ($(element).attr('type') !== 'file') {
        $(element).val($.trim($(element).val()));
      }
      $(element).valid();
    },
    highlight: function (element, errorClass) {
      $(element).removeClass(errorClass);
      $(element).parents('.form-group').first().find('.control-label').addClass('text-danger');
      $(element).addClass('border-bottom-danger')
    },
    unhighlight: function (element, errorClass) {
      $(element).removeClass(errorClass);
      $(element).parents('.form-group').first().find('.control-label').removeClass('text-danger');
      $(element).removeClass('border-bottom-danger');
    },
    // Different components require proper error label placement
    errorPlacement: function (error, element) {

      //<editor-fold desc="Add text error default">
      // Styled checkboxes, radios, bootstrap switch
      if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container')) {
        if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
          error.appendTo(element.parent().parent().parent().parent());
        }
        else {
          error.appendTo(element.parent().parent().parent().parent().parent());
        }
      }

      // Unstyled checkboxes, radios
      else if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
        error.appendTo(element.parent().parent().parent());
      }

      // Input with icons and Select2
      else if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
        error.appendTo(element.parent());
      }

      // Inline checkboxes, radios
      else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
        error.appendTo(element.parent().parent());
      }

      // Input group, styled file input
      else if (element.parent().hasClass('uploader') || element.parents().hasClass('input-group')) {
        error.appendTo(element.parent().parent());
      }

      else {
        error.insertAfter(element);
      }
      //</editor-fold>

      var domElement = $(element)[0];
      if ($(element).val() !== '' && (domElement.hasAttribute("unique") || domElement.hasAttribute("notExisted"))) {
        error.insertAfter(element);
      }
    },
    validClass: "validation-valid-label",
    success: function (label) {
      $(label).remove();
    },
    rules: {}
  },
  getUrlRequestParam: function (_paramName) {
    // Function get value query parameter
    // return null if query name not exist
    var locationSearch = decodeURIComponent(window.location.search.substring(1));
    var currentQueryArr = locationSearch.split('&');
    var result = null;

    if (locationSearch.length > 0) {
      for (var i = 0; i < currentQueryArr.length; i++) {
        var queryItem = currentQueryArr[i].split('=');
        var queryNameItem = queryItem[0];
        if (queryNameItem === _paramName) {
          if (queryItem.length >= 1) {
            result = currentQueryArr[i].substring(_paramName.length + 1)
          }
          break;
        }
      }
    }

    return result;
  },
  updateUrlRequestParam: function (_paramName, _paramValue, callback) {
    // Function change value query parameter without reload page
    // Remove query parameter if value is null
    var locationSearch = decodeURIComponent(window.location.search.substring(1));
    var currentQueryArr = locationSearch.split('&');
    var isExistQueryName = false;

    if (locationSearch.length > 0) {
      for (var i = 0; i < currentQueryArr.length; i++) {
        var queryItem = currentQueryArr[i].split('=');
        var queryNameItem = queryItem[0];
        if (queryNameItem === _paramName) {
          currentQueryArr[i] = queryNameItem + '=' + _paramValue;
          if (_paramValue === null) {
            currentQueryArr.splice(i, 1);
          }
          isExistQueryName = true;
          break;
        }
      }
    } else {
      currentQueryArr = [];
    }

    // Add new if query not exist
    if (_paramValue !== null && !isExistQueryName) {
      currentQueryArr.push(_paramName + '=' + _paramValue);
    }

    // Get new url search string
    var newLocationSearch = currentQueryArr.length > 0 ? '?' + currentQueryArr.join('&') : '';

    // Replace url without refresh page
    history.pushState({}, $(document).find("title").text(), location.origin + location.pathname + newLocationSearch);

    // Callback
    if (callback && typeof callback === "function") {
      callback();
    }
  },
  updateCheckBoxAllStatus: function (_element, _listChecked, _list) {
    var status = false;
    var checked = null;
    var unChecked = null;
    $.each(_list, function (_key, _value) {
      if (_listChecked.indexOf(_value) >= 0) {
        checked = true;
      } else {
        unChecked = true;
      }
    });

    if (checked !== null && unChecked !== null) {
      _element.prop('indeterminate', true);
    } else {
      _element.prop('indeterminate', false);
      if (checked) {
        _element.prop('checked', 'checked');
        status = true;
      } else if (unChecked) {
        _element.prop('checked', false);
      }
    }

    return status;
  },
  arrayToObject: function (_array) {
    var result = {};
    for (var i = 0; i < _array.length; ++i)
      result[i] = _array[i];
    return result;
  },
  compareStringDateTime: function (_startedTime, _endedTime) {
    var result = 0;
    if (_startedTime && _endedTime && _startedTime !== '' && _endedTime !== '' && moment(_startedTime).isValid() && moment(_endedTime).isValid()) {
      result = moment(_startedTime) <= moment(_endedTime) ? 1 : -1
    }

    return result;
  }

};

$(function () {

  common.spinnerFirstLoad(true);
  Pace.on('done', function () {
    common.spinnerFirstLoad(false)
  });

  var formValidate = $(".formValidate").validate(common.formValidate);

  // Validate positive integer
  $('.formValidate').find('.validatePositiveInteger').on('keyup change paste', function () {
    var inputValue = $(this).val();
    var alNumRegexPhone = /[^0-9]/g; //only numbers

    $(this).parent().find('.textErrorValidatePositiveInteger').remove();
    if (alNumRegexPhone.test(inputValue) || (inputValue !== '' && inputValue <= 0)) {
      $(this).parent().append('<span class="textErrorValidate textErrorValidatePositiveInteger text-danger">Input invalid, please enter an integer > 0.</span>');
      $('.formValidate').find('button.btnSubmit').attr('disabled', true);
    } else {
      if ($('.formValidate').find('.textErrorValidate').length === 0) {
        $('.formValidate').find('button.btnSubmit').removeAttr('disabled');
      }
    }
  });

  $('.noEnterSubmit').keypress(function (e) {
    if (e.which === 13)
      return false;
  });

});

function formatToTimeHHmm(date) {
  var rtn = "";
  var hour = date.getHours();
  var min = date.getMinutes();

  if (hour < 10) {
    rtn += "0" + hour;
  } else {
    rtn += hour;
  }
  if (min < 10) {
    rtn += ":0" + min;
  } else {
    rtn += ":" + min;
  }

  return rtn;
}

var timezone = new Date().getTimezoneOffset();

function formatDateToString(date) {
  var rtn = date.getFullYear();
  var sdate = date.getDate();
  var month = date.getMonth() + 1;
  if (sdate < 10) {
    rtn += "-0" + sdate;
  } else {
    rtn += "-" + sdate;
  }
  if (month < 10) {
    rtn += "-0" + month;
  } else {
    rtn += "-" + month;
  }
  var hour = date.getHours();
  var min = date.getMinutes();
  var second = date.getSeconds();

  if (hour < 10) {
    rtn += "T0" + hour;
  } else {
    rtn += "T" + hour;
  }
  if (min < 10) {
    rtn += ":0" + min;
  } else {
    rtn += ":" + min;
  }
  if (second < 10) {
    rtn += ":0" + second;
  } else {
    rtn += ":" + second;
  }

  return rtn;
}

function formatDateToApi(date) {
  var rtn = date.getFullYear();
  var sdate = date.getDate();
  var month = date.getMonth() + 1;
  if (month < 10) {
    rtn += ".0" + month;
  } else {
    rtn += "." + month;
  }
  if (sdate < 10) {
    rtn += ".0" + sdate;
  } else {
    rtn += "." + sdate;
  }
  return rtn;
}

function dateFromStringWithTimeZone(input) {
  var date;
  if (input.endsWith("Z")) {
    date =  new Date(input.substring(0, input.length - 1));
  }
  date = new Date(input);
  var timezone = 0 - new Date().getTimezoneOffset();
  var rtn = moment(date).add(0-timezone, 'minutes').toDate();
  return rtn;
}

function formatDateToYYYYMMDD000000(date) {
  var rtn = date.getFullYear();
  var sdate = date.getDate();
  var month = date.getMonth() + 1;
  if (month < 10) {
    rtn += "-0" + month;
  } else {
    rtn += "-" + month;
  }
  if (sdate < 10) {
    rtn += "-0" + sdate;
  } else {
    rtn += "-" + sdate;
  }
  rtn += "T00:00:00";
  return rtn;
}
function formatDateToYYYYMMDD(date) {
  var rtn = date.getFullYear();
  var sdate = date.getDate();
  var month = date.getMonth() + 1;
  if (month < 10) {
    rtn += "-0" + month;
  } else {
    rtn += "-" + month;
  }
  if (sdate < 10) {
    rtn += "-0" + sdate;
  } else {
    rtn += "-" + sdate;
  }
  var hour = date.getHours();
  var min = date.getMinutes();
  var second = date.getSeconds();

  if (hour < 10) {
    rtn += "T0" + hour;
  } else {
    rtn += "T" + hour;
  }
  if (min < 10) {
    rtn += ":0" + min;
  } else {
    rtn += ":" + min;
  }
  if (second < 10) {
    rtn += ":0" + second;
  } else {
    rtn += ":" + second;
  }

  return rtn;
}

function dateToUTC2(date) {
  if (date instanceof Date) {
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  } else if (typeof date === 'string' || date instanceof String) {
    var newDate = new Date(date);
    var userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
    return new Date(newDate.getTime() + userTimezoneOffset);
  }

  return null;
}

function dateToUTC(date) {
  if (date instanceof Date) {
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  } else if (typeof date === 'string' || date instanceof String) {
    var newDate = new Date(date);
    var userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
    return new Date(newDate.getTime() - userTimezoneOffset);
  }

  return null;
}

Date.prototype.toJSON = function () {
  var rtn = moment(this).format();
  if (rtn.includes("+")) {
    console.log('----toJSON split: ' + rtn.split("+")[0]);
    return rtn.split("+")[0];
  }
  console.log('----toJSON: ' + rtn);
  return rtn;
}

function scaleToFit(img, canvas, ctx) {
  // get the scale
  var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  // get the top left position of the image
  var x = (canvas.width / 2) - (img.width / 2) * scale;
  var y = (canvas.height / 2) - (img.height / 2) * scale;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx, cy, cw, ch, ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}


function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()) {
        return true;
      }
    }
  }

  return false;
}

function iOSversion() {

  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    if (!!window.indexedDB) {
      return 'iOS 8 and up';
    }
    if (!!window.SpeechSynthesisUtterance) {
      return 'iOS 7';
    }
    if (!!window.webkitAudioContext) {
      return 'iOS 6';
    }
    if (!!window.matchMedia) {
      return 'iOS 5';
    }
    if (!!window.history && 'pushState' in window.history) {
      return 'iOS 4';
    }
    return 'iOS 3 or earlier';
  }

  return 'Not an iOS device';
}
//
// var supportGetUserMedia = false;
//
// try {
//   navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
//       navigator.webkitGetUserMedia ||
//       navigator.mozGetUserMedia ||
//       navigator.msGetUserMedia);
//
//   navigator.getMedia({video: true}, function () {
//     // webcam is available
//     console.log("----webcam is available-----");
//     supportGetUserMedia = true;
//   }, function () {
//     // webcam is not available
//     console.log("----webcam is not available-----");
//     supportGetUserMedia = false;
//   });
// }catch (e) {
//   console.error(e);
//
// }