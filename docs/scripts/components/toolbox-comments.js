// init with delay (due slow html load)
setTimeout(function() {
  checkContentInput();
  checkFakeInputHeight();

  // Not working (find a way to trigger focus over fake-input because @<notifed> links need to be clickable)
  $('.fake-input span').each(function() {
    $(this).on('click', function() {
      console.log('clicked span');
      $(this).closest('.toolbox-comment-field__input').find('textarea').trigger('focusin');
    });
  });
}, 30);

$(window).on('resize', function() {
  checkFakeInputHeight();
});


$('body').on('focusin', '.toolbox-comment-field__input textarea', function() {
  openOverlay(true, false, false);
  $(this).closest('.toolbox-comment-field').addClass('toolbox-comment-field--focus');
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__send').addClass('opacity-100');
});

$('body').on('focusout', '.toolbox-comment-field__input textarea', function() {
  closeOverlay();
  $(this).closest('.toolbox-comment-field').removeClass('toolbox-comment-field--focus');
  checkContentInput();
  checkFakeInputHeight();
});

$('body').on('keyup', '.toolbox-comment-field__input textarea', function() {
  if ($(this).val().length > 0) {
    $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attach .inline-action').addClass('JS_remove_comment').html('');
  } else {
    $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attach .inline-action').removeClass('JS_remove_comment').html('<input name="upload" type="file" class="file-input" tabindex="-1">');
    $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attachment').remove();
  }

  checkContentInput();
  checkFakeInputHeight();
});

$('body').on('change', 'input[type=file]', function() {
  var filePath = $(this).val();
  var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length);
  var fileExtension = filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length);
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__send').addClass('opacity-100');
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__input').removeClass('toolbox-comment-field__input--empty').prepend('<a href="#' + fileName + '" class="toolbox-comment-field__attachment"><div class="toolbox-comment-field__attachment-thumbnail" style="background-image:url(./assets/images/screenshot.png);"></div><div class="toolbox-comment-field__attachment-label h2 hidden">' + fileExtension + '</div></a>');
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__input textarea').val(fileName);
  $(this).closest('.toolbox-comment-field').find('.fake-input').html(fileName);
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attach .inline-action').addClass('JS_remove_comment').html('');
});

$('body').on('click', '.JS_remove_comment', function() {
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attach .inline-action').removeClass('JS_remove_comment').html('<input name="upload" type="file" class="file-input" tabindex="-1">');
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attachment').remove();
  $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__input textarea').val('');

  checkContentInput();
  checkFakeInputHeight();
});

function checkFakeInputHeight() {
  $('.toolbox-comment-field').each(function() {
    var textarea = $(this).find('.toolbox-comment-field__input textarea');
    var fakeInput = $(this).find('.fake-input');

    textarea.css({
      'height': fakeInput.height() + 'px'
    });
  });

  $('.toolbox-comment-post__bubble').each(function() {
    if ($(this).height() >= 200) {
      $(this).addClass('toolbox-comment-post__bubble--overflow');

      $(this).append('<div class="readmore JS_readmore"></div>')
    } else {
      $(this).removeClass('toolbox-comment-post__bubble--overflow');

      $(this).find('.readmore').remove();
    }
  });
}

function checkContentInput() {
  $('.toolbox-comment-field').each(function() {
    var textarea = $(this).find('.toolbox-comment-field__input textarea');
    var notified = textarea[0].value.match(/@[a-z]+/gi);
    var newval = textarea[0].value;

    if (textarea[0].value.length > 0) {
      $(this).find('.toolbox-comment-field__input').removeClass('toolbox-comment-field__input--empty');
      $(this).find('.toolbox-comment-field__send').addClass('opacity-100');

      // turn @<notified> into links
      if (notified != null && notified.length > 0) {
        for (var i = 0; i < notified.length; i++) {
          newval = newval.replace(notified[i], '</span><a href="#' + notified[i] + '" class="inline-action primary">' + notified[i] + '</a><span>');
        }
      }
      newval = newval.replace(newval, '<span>' + newval + '</span>');
      $(this).find('.fake-input').html(newval);
    } else {
      $(this).find('.toolbox-comment-field__input').addClass('toolbox-comment-field__input--empty');
      $(this).find('.toolbox-comment-field__send').removeClass('opacity-100');
      $(this).find('.fake-input').empty();
    }
  });
}

$('.JS_comment_post').each(function() {
  var hasFile = false;

  $(this).on('change', 'input[type=file]', function() {
    hasFile = true;
  });

  $(this).on('click', '.toolbox-comment-field__send', function() {
    var textarea = $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__input textarea');
    var notified = textarea[0].value.match(/@[a-z]+/gi);
    var newval = textarea[0].value;
    var day = new Date().getDate();
    var month = new Date().getMonth();
    var year = new Date().getFullYear();
    var time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: "numeric",
      minute: "numeric"
    });

    if (textarea.val().length > 0) {
      // turn @<notified> into links
      if (notified != null && notified.length > 0) {
        for (var i = 0; i < notified.length; i++) {
          newval = newval.replace(notified[i], '</span><a href="#' + notified[i] + '" class="inline-action primary">' + notified[i] + '</a><span>');
        }
      }

      if (hasFile) {
        $('#comments-container').prepend(
          '<div class="toolbox-comment-post toolbox-comment-post--self">' +
          '<div class="toolbox-comment-post__label">' +
          '<div class="h8"><span class="inline-action primary">Jan Van den Nieuwenhof</span> at <span>' + day + '/' + month + '/' + year + '</span> <span>' + time + '</span></div>' +
          '</div>' +
          '<div class="toolbox-comment-post__value">' +
          '<div class="toolbox-comment-post__bubble">' +
          '<a href="#" class="toolbox-comment-post__bubble-attachment">' +
          '<div class="toolbox-comment-post__bubble-attachment-thumbnail" style="background-image:url(./assets/images/screenshot.png);"></div>' +
          '</a>' +
          '<div class="toolbox-comment-post__bubble-message">' +
          newval +
          '</div>' +
          '</div>' +
          '<div class="toolbox-comment-post__action">' +
          '<div class="inline-action primary"></div>' +
          '</div>' +
          '</div>' +
          '</div>'
        );
      } else {
        $('#comments-container').prepend(
          '<div class="toolbox-comment-post toolbox-comment-post--self">' +
          '<div class="toolbox-comment-post__label">' +
          '<div class="h8"><span class="inline-action primary">Jan Van den Nieuwenhof</span> at <span>' + day + '/' + month + '/' + year + '</span> <span>' + time + '</span></div>' +
          '</div>' +
          '<div class="toolbox-comment-post__value">' +
          '<div class="toolbox-comment-post__bubble">' +
          '<div class="toolbox-comment-post__bubble-message">' +
          newval +
          '</div>' +
          '</div>' +
          '<div class="toolbox-comment-post__action">' +
          '<div class="inline-action primary"></div>' +
          '</div>' +
          '</div>' +
          '</div>'
        );
      }

      $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attach .inline-action').removeClass('JS_remove_comment').html('<input name="upload" type="file" class="file-input" tabindex="-1">');
      $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__attachment').remove();
      $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__input textarea').val('');

      checkContentInput();
      checkFakeInputHeight();
    } else {
      $(this).closest('.toolbox-comment-field').find('.toolbox-comment-field__input').addClass('animate-popup');

      setTimeout(function() {
        $('.toolbox-comment-field__input').removeClass('animate-popup');
      }, 1000);
    }

    hasFile = false;
  });
});

$('body').on('click', '.JS_read', function() {
  $(this).addClass('is-read');
});

$('body').on('click', '.JS_readmore', function() {
  $(this).closest('.toolbox-comment-post__bubble').removeClass('toolbox-comment-post__bubble--overflow').css({
    'max-height': '100%'
  });
});
