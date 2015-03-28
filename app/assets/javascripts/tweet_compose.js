$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$content = this.$el.find('textarea');
  this.$options = this.$el.find('select').children();
  this.$feed = $(this.$el.data('tweets-ul'));
  this.$charsLeft = this.$el.find('.chars-left');
  this.updateCharsLeft();
  this.$mentionedUsers = this.$el.find('.mentioned-users');

  this.$content.on('input', this.updateCharsLeft.bind(this));
  this.$el.on('submit', this.submit.bind(this));

  this.$el.find('.add-mentioned-user').on(
    'click',
    this.addMentionedUser.bind(this)
  );

  this.$mentionedUsers.on(
    'click',
    'a.remove-mentioned-user',
    this.removeMentionedUser.bind(this)
  );
};

$.TweetCompose.prototype.addMentionedUser = function () {
  var mentionUserForm = this.$el.find('script').html();
  this.$el.find('.mentioned-users').append(mentionUserForm);
};

$.TweetCompose.prototype.removeMentionedUser = function (event) {
  var $form = $(event.currentTarget).parent();
  $form.remove();
};

$.TweetCompose.prototype.updateCharsLeft = function() {
  this.$charsLeft.html(140 - this.$content.val().length);
};

$.TweetCompose.prototype.submit = function(event) {
  event.preventDefault();
  var data = this.$el.serializeJSON();
  $.ajax({
    url: "/tweets",
    type: "POST",
    data: data,
    dataType: 'json',
    success: this.handleSuccess.bind(this)
  });
};

$.TweetCompose.prototype.handleSuccess = function(res) {
  this.clearInput();
  $('#feed').trigger('insert-tweet', res);
};

$.TweetCompose.prototype.clearInput = function () {
  this.$content.val('');
  this.$mentionedUsers.empty();
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};
