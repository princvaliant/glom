Template.navigation.rendered = function () {

  x_navigation_onresize();
  page_content_onresize();
};

Template.navigation.events({
    'click .x-navigation-minimize': function () {
      if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
        $(".page-container").removeClass("page-navigation-toggled");
        x_navigation_minimize("open");
      } else {
        $(".page-container").addClass("page-navigation-toggled");
        x_navigation_minimize("close");
      }
      onresize();
    },
    'click .x-navigation  li > a': function (event) {
      var li = $(event.target.parentNode);
      var ul = li.parent("ul");
      ul.find(" > li").not(li).removeClass("active");
    },
    'click .x-navigation li': function (event) {

      var li = $(event.target).parents();
      if (li.hasClass("xn-openable") > 0)
        return;
      event.stopPropagation();
      if (li.children("ul").length > 0 || li.children(".panel").length > 0 || $(this).hasClass("xn-profile") > 0) {
        if (li.hasClass("active")) {
          li.removeClass("active");
          li.find("li.active").removeClass("active");
        } else {
          li.addClass("active");
        }
        onresize();
        if ($(this).hasClass("xn-profile") > 0)
          return true;
        else
          return false;
      }
    },
    'click .signout': function (e, t) {
      Meteor.logout(function () {
        Session.set('routeTemplate', 'signIn');
      });
      return false;
    }
});

function page_content_onresize() {
  $(".page-content,.content-frame-body,.content-frame-right,.content-frame-left").css("width", "").css("height", "");

  var content_minus = 0;
  content_minus = ($(".page-container-boxed").length > 0) ? 40 : content_minus;
  content_minus += ($(".page-navigation-top-fixed").length > 0) ? 50 : 0;

  var content = $(".page-content");
  var sidebar = $(".page-sidebar");

  if (content.height() < $(document).height() - content_minus) {
    content.height($(document).height() - content_minus);
  }

  if (sidebar.height() > content.height()) {
    content.height(sidebar.height());
  }

  if ($(window).width() > 1024) {

    if ($(".page-sidebar").hasClass("scroll")) {
      var doc_height;
      if ($("body").hasClass("page-container-boxed")) {
        doc_height = $(document).height() - 40;
      } else {
        doc_height = $(window).height();
      }
      $(".page-sidebar").height(doc_height);

    }

    if ($(".content-frame-body").height() < $(document).height() - 162) {
      $(".content-frame-body,.content-frame-right,.content-frame-left").height($(document).height() - 162);
    } else {
      $(".content-frame-right,.content-frame-left").height($(".content-frame-body").height());
    }

    $(".content-frame-left").show();
    $(".content-frame-right").show();
  } else {
    $(".content-frame-body").height($(".content-frame").height() - 80);

    if ($(".page-sidebar").hasClass("scroll"))
      $(".page-sidebar").css("height", "");
  }

  if ($(window).width() < 1200) {
    if ($("body").hasClass("page-container-boxed")) {
      $("body").removeClass("page-container-boxed").data("boxed", "1");
    }
  } else {
    if ($("body").data("boxed") === "1") {
      $("body").addClass("page-container-boxed").data("boxed", "");
    }
  }
}


/* PANEL FUNCTIONS */
function panel_fullscreen(panel) {

  if (panel.hasClass("panel-fullscreened")) {
    panel.removeClass("panel-fullscreened").unwrap();
    panel.find(".panel-body,.chart-holder").css("height", "");
    panel.find(".panel-fullscreen .fa").removeClass("fa-compress").addClass("fa-expand");

    $(window).resize();
  } else {
    var head = panel.find(".panel-heading");
    var body = panel.find(".panel-body");
    var footer = panel.find(".panel-footer");
    var hplus = 30;

    if (body.hasClass("panel-body-table") || body.hasClass("padding-0")) {
      hplus = 0;
    }
    if (head.length > 0) {
      hplus += head.height() + 21;
    }
    if (footer.length > 0) {
      hplus += footer.height() + 21;
    }

    panel.find(".panel-body,.chart-holder").height($(window).height() - hplus);


    panel.addClass("panel-fullscreened").wrap('<div class="panel-fullscreen-wrap"></div>');
    panel.find(".panel-fullscreen .fa").removeClass("fa-expand").addClass("fa-compress");

    $(window).resize();
  }
}

function panel_collapse(panel, action, callback) {

  if (panel.hasClass("panel-toggled")) {
    panel.removeClass("panel-toggled");

    panel.find(".panel-collapse .fa-angle-up").removeClass("fa-angle-up").addClass("fa-angle-down");

    if (action && action === "shown" && typeof callback === "function")
      callback();

    onload();

  } else {
    panel.addClass("panel-toggled");

    panel.find(".panel-collapse .fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-up");

    if (action && action === "hidden" && typeof callback === "function")
      callback();

    onload();

  }
}

function panel_refresh(panel, action, callback) {
  if (!panel.hasClass("panel-refreshing")) {
    panel.append('<div class="panel-refresh-layer"><img src="img/loaders/default.gif"/></div>');
    panel.find(".panel-refresh-layer").width(panel.width()).height(panel.height());
    panel.addClass("panel-refreshing");

    if (action && action === "shown" && typeof callback === "function")
      callback();
  } else {
    panel.find(".panel-refresh-layer").remove();
    panel.removeClass("panel-refreshing");

    if (action && action === "hidden" && typeof callback === "function")
      callback();
  }
  onload();
}

function panel_remove(panel, action, callback) {
  if (action && action === "before" && typeof callback === "function")
    callback();

  panel.animate({
    'opacity': 0
  }, 200, function () {
    panel.parent(".panel-fullscreen-wrap").remove();
    $(this).remove();
    if (action && action === "after" && typeof callback === "function")
      callback();


    onload();
  });
}
/* EOF PANEL FUNCTIONS */

/* X-NAVIGATION CONTROL FUNCTIONS */
function x_navigation_onresize() {

  var inner_port = window.innerWidth || $(document).width();

  if (inner_port < 1025) {
    $(".page-sidebar .x-navigation").removeClass("x-navigation-minimized");
    $(".page-container").removeClass("page-container-wide");
    $(".page-sidebar .x-navigation li.active").removeClass("active");


    $(".x-navigation-horizontal").each(function () {
      if (!$(this).hasClass("x-navigation-panel")) {
        $(".x-navigation-horizontal").addClass("x-navigation-h-holder").removeClass("x-navigation-horizontal");
      }
    });


  } else {
    if ($(".page-navigation-toggled").length > 0) {
      x_navigation_minimize("close");
    }

    $(".x-navigation-h-holder").addClass("x-navigation-horizontal").removeClass("x-navigation-h-holder");
  }

}

function x_navigation_minimize(action) {

  if (action == 'open') {
    $(".page-container").removeClass("page-container-wide");
    $(".page-sidebar .x-navigation").removeClass("x-navigation-minimized");
    $(".x-navigation-minimize").find(".fa").removeClass("fa-indent").addClass("fa-dedent");
    $(".page-sidebar.scroll").mCustomScrollbar("update");
  }

  if (action == 'close') {
    $(".page-container").addClass("page-container-wide");
    $(".page-sidebar .x-navigation").addClass("x-navigation-minimized");
    $(".x-navigation-minimize").find(".fa").removeClass("fa-dedent").addClass("fa-indent");
    $(".page-sidebar.scroll").mCustomScrollbar("disable", true);
  }

  $(".x-navigation li.active").removeClass("active");

}

function x_navigation() {

  $(".x-navigation-control").click(function () {
    $(this).parents(".x-navigation").toggleClass("x-navigation-open");

    onresize();

    return false;
  });

  if ($(".page-navigation-toggled").length > 0) {
    x_navigation_minimize("close");
  }

  $(".x-navigation-minimize").click(function () {

    if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
      $(".page-container").removeClass("page-navigation-toggled");
      x_navigation_minimize("open");
    } else {
      $(".page-container").addClass("page-navigation-toggled");
      x_navigation_minimize("close");
    }

    onresize();

    return false;
  });

  $(".x-navigation  li > a").click(function () {

    var li = $(this).parent('li');
    var ul = li.parent("ul");

    ul.find(" > li").not(li).removeClass("active");

  });

  $(".x-navigation li").click(function (event) {
    event.stopPropagation();

    var li = $(this);

    if (li.children("ul").length > 0 || li.children(".panel").length > 0 || $(this).hasClass("xn-profile") > 0) {
      if (li.hasClass("active")) {
        li.removeClass("active");
        li.find("li.active").removeClass("active");
      } else
        li.addClass("active");

      onresize();

      if ($(this).hasClass("xn-profile") > 0)
        return true;
      else
        return false;
    }
  });

  /* XN-SEARCH */
  $(".xn-search").on("click", function () {
    $(this).find("input").focus();
  })
  /* END XN-SEARCH */

}
/* EOF X-NAVIGATION CONTROL FUNCTIONS */

/* PAGE ON RESIZE WITH TIMEOUT */
function onresize(timeout) {
  timeout = timeout ? timeout : 200;

  setTimeout(function () {
    page_content_onresize();
  }, timeout);
}
/* EOF PAGE ON RESIZE WITH TIMEOUT */

/* PLAY SOUND FUNCTION */
function playAudio(file) {
  if (file === 'alert')
    document.getElementById('audio-alert').play();

  if (file === 'fail')
    document.getElementById('audio-fail').play();
}
/* END PLAY SOUND FUNCTION */

/* PAGE LOADING FRAME */
function pageLoadingFrame() {
  if ($(".page-loading-frame").length > 0) {
    $(".page-loading-frame").addClass("removed");

    setTimeout(function () {
      $(".page-loading-frame").remove();
    }, 1000);
  }
}
/* END PAGE LOADING FRAME */

/* NEW OBJECT(GET SIZE OF ARRAY) */
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
/* EOF NEW OBJECT(GET SIZE OF ARRAY) */
