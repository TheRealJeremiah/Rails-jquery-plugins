$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data('user-id') || options.userId;
  this.followState = this.$el.data('initial-follow-state') || options.followState;
  this.render();
  this.$el.on('click', this.handleClick.bind(this));
  this.clicked = false;
};

$.FollowToggle.prototype.render = function () {
  if (this.followState === "followed") {
    this.$el.html("Unfollow!");
  } else if (this.followState === "unfollowed") {
    this.$el.html("Follow!");
  }
};

$.FollowToggle.prototype.handleClick = function (event) {
  event.preventDefault();
  if (this.clicked) {
    return;
  }
  this.clicked = true;
  this.$el.prop('disabled', true);
  var type = this.followState === 'followed' ? 'DELETE' : 'POST';
  $.ajax({
    url: '/users/' + this.userId + '/follow',
    type: type,
    dataType: 'json',
    success: function(data) {
      this.followState = this.followState === 'followed' ? 'unfollowed' : 'followed';
      this.render();
      this.clicked = false;
      this.$el.prop('disabled', false);
    }.bind(this)
  });
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};
