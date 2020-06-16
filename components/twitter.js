import React, { PureComponent } from "react";

import ReactDOM from "react-dom";
import { TwitterTimelineEmbed } from "react-twitter-embed";

class Twitter extends PureComponent {
    constructor(props) {
        // console.log("Twitter constructor")
        super(props);
    }
    shouldComponentUpdate(nextProps) {
        return false;
    }
    componentWillReceiveProps(nextProps) {
        // console.log("twitter componentWillReceiveProps",this.props.url,nextProps.url)
        if (nextProps.url != this.props.url) {
            // console.log("TWITTER url changed to ",nextProps.url)
            var js, link;
            //twttr.widgets.load()
            setTimeout(() => {
                link = ReactDOM.findDOMNode(this.refs.link); //.getDOMNode();
                //console.log('link',link)
                if (link)
                    //if (!this.initialized) {
                    this.initialized = true; // console.log('loading twttr widgets')
                twttr.widgets.load(ReactDOM.findDOMNode(this.refs.link));
                /*
                      js = document.createElement("script");
                      js.id = "twitter-wjs";
                      js.src = "//platform.twitter.com/widgets.js";
                      console.log("twitter inited")
                      return link.parentNode.appendChild(js);*/
                //  }
            }, 1000);
        }
    }
    componentDidMount() {
        var js, link;
        //twttr.widgets.load()
        setTimeout(() => {
            link = ReactDOM.findDOMNode(this.refs.link); //.getDOMNode();
            //console.log('link',link)
            if (link)
                if (!this.initialized) {
                    this.initialized = true;
                    //  console.log('loading twttr widgets')
                    twttr.widgets.load(ReactDOM.findDOMNode(this.refs.link));
                    /*
                          js = document.createElement("script");
                          js.id = "twitter-wjs";
                          js.src = "//platform.twitter.com/widgets.js";
                          console.log("twitter inited")
                          return link.parentNode.appendChild(js);*/
                }
        }, 100);
    }
    componentWillUnmount() {
        let link = ReactDOM.findDOMNode(this.refs.link);
        if (link)
            while (link.childNodes.length > 1) {
                link.removeChild(link.firstChild);
            }
    }

    render() {
        //   const globals = this.props.globals;
        // const width=globals.get("width");//u.width();
        let { url, theme } = this.props;
        //  console.log("render twitter", { url, theme })
        return (
            <TwitterTimelineEmbed
                sourceType="list"
                url={url}
                noHeader
                ownerScreenName="QWIKET_FEED"
                theme={theme == 1 ? "light" : "dark"}
                //screenName="QWIKET_FEED"
            />
        );
        //return <div ref="link" style={{width:'100%'}}><a  className="twitter-timeline"  data-chrome="transparent noscrollbar noborders nofooter noheader" data-height={this.props.height} data-screen-name={this.props.url} data-partner="tweetdeck" data-theme={theme==1?"light":"dark"} href={this.props.url}></a>
        //      </div>
        /*  //
          return <div ref="link">
          <MediaQuery minWidth={750} values={{width}} >
          <a  className="twitter-timeline" data-width="700" data-height="2900" data-partner="tweetdeck" data-theme="dark" href="https://twitter.com/QWIKET_FEED/lists/con-us">A Twitter List by QWIKET_FEED</a>
       </MediaQuery>
          <MediaQuery minWidth={750} values={{width}} >
       </MediaQuery>
          <a  className="twitter-timeline"  data-height="2900" data-partner="tweetdeck" data-theme="dark" href="https://twitter.com/QWIKET_FEED/lists/con-us">A Twitter List by QWIKET_FEED</a>
       
          </div>
          */
    }
}

export default Twitter;
