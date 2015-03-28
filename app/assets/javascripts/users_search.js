$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = this.$el.find('input');
  this.$ul = this.$el.find('ul');
  this.$input.on('input', this.handleInput.bind(this));
};

$.UsersSearch.prototype.handleInput = function (event) {
  $.ajax({
    url: '/users/search',
    type: 'GET',
    data: { query: event.currentTarget.value },
    dataType: 'json',
    success: this.renderResults.bind(this)
  });
};

$.UsersSearch.prototype.renderResults = function (res) {
  this.$ul.empty();
  for(var i = 0; i < res.length; i++){
    var user = res[i];

    var button = $('<button/>', { class: "follow-toggle" });
    var $li = $('<li> </li>');
    var $a = $('<a href="/users/'+ user.id +'">'+ user.username + '</a>')
    $li.append($a).append(button);
    this.$ul.append($li);
    button.followToggle({
      userId: user.id,
      followState: user.followed ? 'followed' : 'unfollowed'
    });
  }
};


$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};
