//App Logic
var app = {
    addComment: function (id) {
        var results = _.map(
            _.where(this.rows, { id: id }), function (row) {
                ++row.activity_comments;
            });
        this.listener.changed();
    },
    addLike: function (newLike) {
        var results = _.map(
            _.where(this.rows, { id: newLike.id }), function (row) {
                !newLike.liked ? ++row.activity_likes : --row.activity_likes;
            });
        this.listener.changed();
    },
    addShare: function(id){
        var results = _.map(
            _.where(this.rows, { id: id }), function (row) {
                ++row.activity_shares;
            });
        this.listener.changed();
    },
    listener: null,
    rows: []
};
var loadData = $.ajax({
    url: "https://nuvi-challenge.herokuapp.com/activities",
    dataType: "json"
}).done(function (data) {
    app.rows = data   
}).fail(function () {
    alert("Error loading Ajax Data");
});