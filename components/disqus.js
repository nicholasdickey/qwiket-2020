import React from "react";
import styled from "styled-components";
import ReactDisqusThread from "react-disqus-comments";
import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";
import grey from "@material-ui/core/colors/grey";
import blueGrey from "@material-ui/core/colors/blueGrey";
//import u from './utils'
class Local extends React.Component {
    constructor(props) {
        super(props);
        //console.log("Local constructor")
        this.state = {
            // theme:this.context.theme,
            redraw: false,
        };
        //if(__CLIENT__)
        // console.log('hostname:',location.hostname)
    }

    componentDidMount() {
        //  console.log("local mounted")
    }
    shouldComponentUpdate(nextProps, nextState) {
        const props = this.props;
        if (!props.topic || !nextProps.topic) return true;
        let redraw =
            props.cc != nextProps.cc ||
            props.threadid != nextProps.threadid ||
            props.topic.get("title") != nextProps.topic.get("title");
        // console.log('shouldComponentUpdate ',redraw,this.redraw,this.state.redraw)
        if (this.redraw) {
            // console.log("setting redraw false")
            this.setState({ redraw: false });
            this.redraw = false;
            redraw = true;
        } else if (redraw) {
            // console.log("setting redraw true")
            if (!this.state.redraw) {
                //  console.log('->state.redraw:false')
                setTimeout(() => this.setState({ redraw: true }), 1);
            } else {
                //  console.log('->state.redraw:true')
                setTimeout(() => this.setState({ redraw: false }), 1);
            }
            this.redraw = true;
        }
        return redraw;
    }
    handleNewComment(comment) {
        const props = this.props;
        const contextUrl = props.contextUrl;
        console.log("handleNewComment:", comment);
        console.log(comment.text);
        props.setPost(
            props.channel,
            props.realDisqThreadid,
            props.shortname,
            comment.id
        );
    }
    render() {
        /*if(__SERVER__){
          return <div/>
        }*/
        //  console.log("Local",this.props)
        const props = this.props;
        if (props.skip || this.redraw) {
            // console.log("SKIPPING RENDER")
            return <div />;
        }
        /* if(this.redraw){
           
           return <div/>
         }*/
        let {
            site,
            channel,
            contextUrl,
            topic,
            cc,
            threadid,
            realDisqThreadid,
            theme,
            color,
        } = props;
        // console.log("LOCAL theme=", theme);

        let title = topic.get("title");
        //  console.log('LOCAL RENDER %s',this.props.title)
        if (title) {
            var t = title.replace(/"/g, "'");
            t = t.replace(":", "-");
            //t=channel?('['+channel+'] '+t):t
            cc = cc ? "#" + cc : "";
            let url =
                "https://qwiket.com" +
                contextUrl +
                "/topic/" +
                realDisqThreadid +
                cc;
            // console.log('title=%s',t)
            //console.log('channel=%s',channel)
            //console.log('Local identifier=%s',this.props.threadid)
            //console.log('Local url=%s',url)
            //
            let identifier =
                site && site != "qwiket" && site != "usconservative"
                    ? site + "_X_" + threadid
                    : threadid;
            // console.log('LOCAL render: site:%s,channel:%s,contextUrl:%s,title:%s,url:%s,identifier:%s',site,channel,contextUrl,t,url,identifier)
            /* if(site!=window.lastDisqusForum){
               window.lastDisqusForum=site;
               this.redraw=true;
               console.log("RESETTING DISQUS")
               //this.setState({redraw:true})
               return   <div id="local">
                       <ReactDisqusThread
                           shortname={null}
                           identifier={null}
                           title={null}
                           url={null}                
                           onNewComment={null}/>
         )                   </div> 
             }*/
            /*if(threadid!=topic.get("threadid")){
        
              console.log("NOT MACHING - INVALIDATE")
                return <span/>
              }*/
            //  console.log("local: identifier:%s",identifier,url)
            //  console.log('Disqus url=%s','/disqus/'+site+'/'+encodeURIComponent(identifier)+'/'+encodeURIComponent(title)+'/'+encodeURIComponent(url));

            return (
                <div
                    id="local"
                    style={{
                        marginRight: 8,
                        color,
                        opactiy: 0.95,
                    }}>
                    <ReactDisqusThread
                        shortname={site}
                        identifier={identifier}
                        title={t}
                        url={url}
                        onNewComment={this.handleNewComment.bind(this)}
                    />
                    <style global jsx>
                        {`
                            #disqus_thread a {
                                color: ${theme == 1
                                    ? blueGrey[700]
                                    : blueGrey[200]};
                            }
                            #disqus_thread div {
                                font-family: roboto;
                            }
                        `}
                    </style>
                </div>
            );
        } else {
            //console.log("LOCAL CLEAR")
            return <div />;
        }
    }
}
export default Local;
/* * * CONFIGURATION VARIABLES * * */
/*   var disqus_shortname ;
   var disqus_identifier;
   var disqus_url;
   var disqus_title;
 var disqus_config = function () {
          this.language = 'EN'
        };*/

/* * * DON'T EDIT BELOW THIS LINE * * */

/*  (function() {
    if(__CLIENT__){
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        }
      })(); */
