//requestParams.js
const params = req => {
    var xFF = req.headers["x-forwarded-for"];
    var ua = encodeURIComponent(req.headers["user-agent"] || "");
    var ip = xFF ? xFF.split(",")[0] : req.connection.remoteAddress || "";
    //console.log("IP: ", { ip, xFF, rip: req.connection.remoteAddress, identity, hostname: req.hostname, reqip: req.ip })
    var w = ip.split(":");
    ip = w ? w[w.length - 1] : ip;
    let host = req.headers.host;
    let sessionID = req.sessionID;
    let s = `sessionID=${sessionID}host=${host}xip=${ip}ua=${ua}xFF=${xFF}`;
    return s;
};
export default params;
