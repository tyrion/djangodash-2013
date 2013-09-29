// Generated by CoffeeScript 1.6.3
(function() {
  var fRoll, roll;

  fRoll = (function() {
    function fRoll() {
      this.currentStep = 0;
      this.stepNumber = 0;
      this.isAnimating = false;
      this.BreadCrumbEl = $('#breadcrumb');
      this.BreadCrumbProgress = this.BreadCrumbEl.find('.progress');
      this.GeneratorId = void 0;
      this.Questions = void 0;
      this.Baking_url = void 0;
      this.Checking_url = void 0;
      this.ZipUrl = void 0;
      this.StepsEl = $('#steps > li');
      this.init();
    }

    fRoll.prototype.init = function() {
      var input,
        _this = this;
      input = this.StepsEl.filter('#intro').find('input');
      input.typeahead({
        name: 'asda',
        minLength: 0,
        local: window.Bakehouse.cookies,
        valueKey: 'value',
        template: ['<p class="repo-language">{{language}}</p>', '<p class="repo-name">{{options.project_name}}</p>', '<p class="repo-description">{{description}}</p>'].join(''),
        engine: Hogan,
        selected: function(selection) {
          return console.log(selection);
        }
      });
      return input.on('typeahead:selected typeahead:autocompleted', function(e, datum) {
        return _this.GeneratorId = datum.id;
      });
    };

    fRoll.prototype.loadGenerator = function() {
      var choise;
      choise = _.where(window.Bakehouse.cookies, {
        id: this.GeneratorId
      });
      if (!choise[0]) {
        return;
      }
      this.Baking_url = choise[0].baking_url;
      this.Questions = choise[0].options;
      this.stepNumber = _(this.Questions).size() + 2;
      this.initSteps();
      return this.initBreadCrumb();
    };

    fRoll.prototype.generateProject = function() {
      var _this = this;
      $('.milk_bg').animate({
        top: '30%'
      }, 400);
      return $.ajax({
        url: this.Baking_url,
        dataType: 'json',
        type: 'POST',
        data: this.Questions,
        beforeSend: function(req) {
          req.setRequestHeader("X-CSRFToken", window.csrftoken);
          return console.log('loading');
        },
        success: function(json) {
          _this.Checking_url = json.url;
          return window.check_project = window.setInterval($.proxy(_this.checkProject, _this), 4000);
        }
      });
    };

    fRoll.prototype.checkProject = function() {
      var _this = this;
      return $.ajax({
        url: this.Checking_url,
        dataType: 'json',
        type: 'GET',
        beforeSend: function(req) {
          return req.setRequestHeader("X-CSRFToken", window.csrftoken);
        },
        success: function(json) {
          console.log(json);
          if (json.status === 'SUCCESS') {
            window.clearInterval(window.check_project);
            _this.ZipUrl = json.result;
            return _this.DownloadFiles();
          }
        }
      });
    };

    fRoll.prototype.DownloadFiles = function() {
      var _this = this;
      $('.loading_container').fadeOut(400, function() {
        return $('.download_link').fadeIn();
      });
      $('.milk_bg').animate({
        top: '70%'
      }, 400);
      return $(".download").on('click', function() {
        return window.open(_this.ZipUrl);
      });
    };

    fRoll.prototype.initSteps = function() {
      var key, template, val, _ref;
      _ref = this.Questions;
      for (key in _ref) {
        val = _ref[key];
        template = "				<li>					<h1>" + (_(key).humanize()) + "</h1>					<input type='text' id='" + key + "' value='" + val + "'></input>					<a class='next'>						<span>							Next						</span>					</a>				</li>			";
        this.StepsEl.filter('#intro').after(template);
      }
      return this.StepsEl = $('#steps > li');
    };

    fRoll.prototype.initBreadCrumb = function() {
      var b_width, bullet, i, _i, _ref;
      b_width = this.BreadCrumbEl.width();
      for (i = _i = 0, _ref = this.stepNumber - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        bullet = $('<span />').css({
          left: "" + (100 * i / (this.stepNumber - 1)) + "%"
        });
        if (i === 0) {
          bullet.addClass('done current');
        }
        bullet.appendTo(this.BreadCrumbEl);
      }
      this.BreadCrumbEl.fadeIn();
      return this.goNext();
    };

    fRoll.prototype.progressBreadCrumb = function(step_number) {
      var bullet_step;
      bullet_step = this.BreadCrumbEl.find('span').eq(step_number);
      this.BreadCrumbEl.find('span').removeClass('current');
      bullet_step.addClass('current');
      return this.BreadCrumbProgress.animate({
        width: bullet_step[0].style.left
      }, 500, function() {
        return bullet_step.addClass('done');
      });
    };

    fRoll.prototype.goNext = function() {
      var input;
      input = this.getStep(this.currentStep).find('input');
      if (!input.val() & this.currentStep > 0) {
        input.addClass('error');
        return;
      }
      input.removeClass('error');
      return this.jumpTo(this.currentStep + 1);
    };

    fRoll.prototype.getStep = function(n) {
      return this.StepsEl.eq(n);
    };

    fRoll.prototype.jumpTo = function(newStep) {
      var in_effect, out_effect, self;
      if (this.isAnimating) {
        return false;
      }
      if (newStep > this.stepNumber - 1) {
        return false;
      }
      self = this;
      this.isAnimating = true;
      this.progressBreadCrumb(newStep);
      out_effect = newStep > this.currentStep ? 'moveToLeftFade' : 'moveToRightFade';
      in_effect = newStep > this.currentStep ? 'moveFromRightFade' : 'moveFromLeftFade';
      this.getStep(this.currentStep).addClass(out_effect).on('webkitAnimationEnd', function() {
        $(this).off('webkitAnimationEnd');
        $(this).hide();
        $(this).removeClass("" + out_effect + " current");
        return self.isAnimating = false;
      });
      this.getStep(newStep).addClass(in_effect).on('webkitAnimationEnd', function() {
        $(this).off('webkitAnimationEnd');
        $(this).removeClass(in_effect);
        return self.isAnimating = false;
      });
      this.getStep(newStep).addClass('current');
      this.currentStep = newStep;
      if (this.currentStep === this.stepNumber - 1) {
        return this.generateProject();
      }
    };

    return fRoll;

  })();

  roll = new fRoll;

  $(document).on('click', 'a.next', function() {
    return roll.goNext();
  });

  $('a.start').on('click', function() {
    return roll.loadGenerator();
  });

}).call(this);

/*
//@ sourceMappingURL=main.map
*/
