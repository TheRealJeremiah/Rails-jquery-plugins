$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.$feed = this.$el.find('#feed');
  this.maxCreatedAt = null;
  this.fetchTweets();

  this.$el.find('.fetch-more').on('click', this.fetchTweets.bind(this));
  this.$feed.on('insert-tweet', this.insertTweet.bind(this));
};

$.InfiniteTweets.prototype.fetchTweets = function(){
  var data = {};
  if (this.maxCreatedAt !== null) {
    data.max_created_at = this.maxCreatedAt;
  }

  $.ajax({
    url: '/feed',
    type: 'GET',
    data: data,
    dataType: 'json',
    success: this.insertTweets.bind(this)
  });

};

$.InfiniteTweets.prototype.insertTweet = function(event, tweet) {
  var template = this.$el.find('script').html();
  var compiled = _.template(template);
  var renderedTweet = compiled({ tweets: [tweet] });
  this.$feed.prepend(renderedTweet);
};

$.InfiniteTweets.prototype.insertTweets = function(res){
  var template = this.$el.find('script').html();
  var compiled = _.template(template);
  var renderedTweets = compiled({ tweets: res });
  this.$feed.append(renderedTweets);

  this.maxCreatedAt = res[res.length - 1].created_at;
  if ( res.length < 20 ) {
    this.$el.find('.fetch-more').remove();
    this.$el.append('<p>No moar</p>');
  }
};

$.fn.infiniteTweets = function () {
  return this.each(function(){
    new $.InfiniteTweets(this);
  });
};
