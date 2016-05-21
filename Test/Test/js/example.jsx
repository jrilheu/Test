//Main Component
const ActivityContainerList = React.createClass({
    displayName: 'ActivityContainerList',
    getInitialState: function () {
        return {
            app: app
        };
    },
    componentWillMount: function () {
        this.state.app.listener = this;
    },
    changed: function () {
        this.forceUpdate();
    },
    render: function () {
        var activityListOrdered = [] ;
        for (var index = 0, len = app.rows.length; index < len; index++) {
            if (index == 0 || index % 3 == 0) {
                var rowsSlice = app.rows.slice(index, index + 3);
                var activityListParts = this.renderActvityParts(rowsSlice, index);
                activityListOrdered.push(this.renderListOrdered(activityListParts, index));
            }
        }
        return (
            <div>
                {activityListOrdered}
            </div>
        );
    },
    renderListOrdered : function(activityListParts) {
        return (<div className="row">{activityListParts}</div>);
    },
    renderActvityParts(rowsSlice, oldIndex) {
        var elements = [];
        for (var index = 0; index < rowsSlice.length; index++) {
            var isEven = (index + oldIndex + 1) % 2 ? false : true;
            var activityCard = (<ActivityContainer key={rowsSlice[index].id} data={ rowsSlice[index]} evenItem={isEven }/>);
            elements.push(activityCard);
        }
        return elements;
    }
});
//Activity Card
const ActivityContainer = React.createClass({
    displayName: "ActivityContainer",
    renderLogoProvider: function (provider) {
        var classLogo = "fa fa-";
        classLogo += provider;
        var logoProvider = (<span><i className={classLogo} aria-hidden="true"></i> {provider}</span>);
        return logoProvider;
    },
    render: function () {
        var location = "";
        if (this.props.data.activity_latitude != null) {
            var point = "https://www.google.com/maps/?q=loc:" + this.props.data.activity_latitude + "," + this.props.data.activity_longitude;
            location = (<a href={point} target="_blank" className="lnk-location"><i className="fa fa-map-marker" aria-hidden="true"></i> Location</a>)
        }
        var avator = this.props.data.actor_avator;
        avator = avator.substring(0, avator.length - 22);

        var attachment = this.props.data.activity_attachment;
        if (this.props.data.activity_attachment == null) {
            attachment = "images/No_image_available.png"
        }
        var classes = "activity-container col-md-4";
        if (this.props.evenItem) {
            classes += " even";
        }
        return (
            <div className={classes}>
                <div className="text-right provider">{this.renderLogoProvider(this.props.data.provider)}</div>
                <div className="row">
                    <div className="col-xs-6">
                        <a href={this.props.data.actor_url} target="_blank">
                            <img src={avator + "?size=100x100"} />
                        </a>
                    </div>
                    <div className="col-xs-6 actor-details">
                        <a href={this.props.data.actor_url} target="_blank">
                            <p className="actor">{this.props.data.actor_name}</p>
                        </a>
                        <p>{this.props.data.actor_description}</p>
                    </div>
                </div>
                <a href={this.props.data.activity_url} target="_blank">
                    <img className="attachment" src={attachment} />
                </a>
                <div>
                    <div>{this.props.data.activity_message}</div>
                    <span className="date pull-right">{this.props.data.activity_date}</span>
                    <div className="clearfix"></div>
                    {location}
                </div>
                <div className="row counters">
                    <div className="col-xs-4">
                        {this.props.data.activity_likes + " likes"}
                    </div>
                    <div className="col-xs-8 text-right">
                        {this.props.data.activity_comments + " comments "}
                        {this.props.data.activity_shares + "  shares"}
                    </div>
                </div>
                <div className="text-center">
                    <div className="btn-group" role="group" aria-label="...">
                        <LikeButton idItem={this.props.data.id} />
                        <CommentButton idItem={this.props.data.id} />
                        <ShareButton idItem={this.props.data.id} />
                    </div>
                </div>
            </div>
            );
    }
});
//Comment Button
const CommentButton = React.createClass({
    displayName: 'CommentButton',
    getInitialState() {
        return { commented: false };
    },
    onClick: function () {
        this.setState({ commented: true });
        let shareMessage = { commented: this.state.commented, confirmComment: this.confirmComment, type: "comment" };
        ReactDOM.render(<ModalAlert showModal={true} metadata={shareMessage } />, document.getElementById('modal'));
    },
    confirmComment() {
        app.addComment(this.props.idItem);
        this.setState({ commented: true });
    },
    render: function () {
        return (<button className="btn btn-primary" onClick={this.onClick }><i className="fa fa-comment-o" aria-hidden="true"></i> Comment</button>);
    }
});
//Like Button
const LikeButton = React.createClass({
    displayName: 'LikeButton',
    getInitialState() {
        return { liked: false };
    },
    onClick: function () {
        this.setState({ liked: !this.state.liked });
        var newlike = { id: this.props.idItem, liked: this.state.liked };
        app.addLike(newlike);
    },
    render() {
        var faClass = "fa ";
        var btnClasses = 'btn btn-primary ';
        if (this.state.liked) {
            faClass += 'fa-thumbs-up';
            btnClasses += 'active';
        } else {
            faClass += 'fa-thumbs-o-up';
        }
        return (<button className={btnClasses} onClick={this.onClick }><i className={faClass} aria-hidden="true"></i> Like</button>);
    }
});
//Share Button
const ShareButton = React.createClass({
    displayName: 'ShareButton',
    getInitialState() {
        return { shared: false };
    },
    onClick: function () {
        let shareMessage = { shared: this.state.shared, confirmShare: this.confirmShare, type: "share" };
        ReactDOM.render(<ModalAlert showModal={true} metadata={shareMessage } />, document.getElementById('modal'));
    },
    confirmShare() {
        app.addShare(this.props.idItem);
        this.setState({ shared: true });
    },
    render: function () {
        var btnClasses = "btn btn-primary ";
        if (this.state.shared) {
            btnClasses += 'active';
        }
        return (<button className={btnClasses} onClick={this.onClick }><i className="fa fa-share" aria-hidden="true"></i> Share</button>);
    }
});
//Modal confirmation
const ModalAlert = React.createClass({
    displayName: 'ModalAlert',
    componentWillReceiveProps: function (nextProps) {
        this.setState({ showModal: true })
    },
    getInitialState() {
        return { showModal: true, published: false };
    },
    close() {
        this.setState({ published: false, showModal: false });
    },
    onModalClick: function () {
        this.props.metadata.type == "share" ? this.props.metadata.confirmShare() : this.props.metadata.confirmComment();
        this.setState({ published: true });
    },
    render() {
        var type = this.props.metadata.type;
        var title = "Share activity";
        if (type == "comment") {
            title = "Add Comment";
        }
        let Modal = ReactBootstrap.Modal;
        return (
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderMessage(type)}
                </Modal.Body>
                {this.renderButtons()}
            </Modal>
        );
    },
    renderButtons() {
        let Modal = ReactBootstrap.Modal;
        if (this.props.metadata.shared || this.state.published) {
            return (<Modal.Footer><button className="btn btn-primary right" onClick={this.close }>Ok</button></Modal.Footer>);
        } else {
            return (
                <Modal.Footer>
                        <button className="btn btn-default right" onClick={this.close}>Cancel</button>
                        <button className="btn btn-primary right" onClick={this.onModalClick}>Ok</button>
                </Modal.Footer>
                );
        }
    },
    renderMessage(type) {
        let message;

        if (type == "share") {
            message = "Are you sure you want share this item?";
        }

        if (type == "comment") {
            message = (<div>
                            <label>Add your comment: </label>
                            <textarea className="form-control"></textarea>
                        </div>
                    );
        }

        if (this.state.published) {
            message = (type == "share")? "Shared sucessfully" : "Your comment has been sent";
        }

        if (this.props.metadata.shared) {
            message = "You already share this item."
        }

        return message;
    }
});
$.when(loadData).then(function () {
ReactDOM.render(
        <ActivityContainerList />, document.getElementById('example')
    );
});
