/**

zEncoder

**/
const data = {
    //format: name[size].z
    psize4: [
        { norm: "8px", zoom: "12px", superz: "8px", code: "8214px" },
        { norm: "12px", zoom: "16px", superz: "8px", code: "8314px" },
        { norm: "16px", zoom: "20px", superz: "8px", code: "8414px" },
    ],

    psize8: [
        { norm: "4px", zoom: "6pc", superz: "4px", code: "8218px" },
        { norm: "6px", zoom: "8px", superz: "4px", code: "8318px" },
        { norm: "8px", zoom: "10px", superz: "4px", code: "8418px" },
    ],

    titleFont: [
        { norm: "1.4rem", zoom: "1.5rem", superz: "3.2rem", code: "7217px" },
        { norm: "1.6rem", zoom: "1.7rem", superz: "3.2rem", code: "7317px" },
        { norm: "2.2rem", zoom: "2.4rem", superz: "3.2rem", code: "7417px" },
    ],

    textFont: [
        { norm: "1.3rem", zoom: "1.4rem", superz: "2.9rem", code: "6216px" },
        { norm: "1.4rem", zoom: "1.6rem", superz: "2.9rem", code: "6316px" },
        { norm: "2.0rem", zoom: "2.2rem", superz: "2.9rem", code: "6416px" },
    ],

    embedWidth: [
        { norm: "100%", zoom: "400px", superz: "100%", code: "9131px" },
        { norm: "100%", zoom: "550px", superz: "100%", code: "9231px" },
        { norm: "100%", zoom: "750px", superz: "100%", code: "9331px" },
    ],
    embedHtmlWidth: [
        { norm: "100%", zoom: "400px", superz: "350px", code: "11500px" },
        { norm: "100%", zoom: "500px", superz: "350px", code: "11501px" },
        { norm: "100%", zoom: "550px", superz: "350px", code: "11502px" },
    ],
    embedHtmlSizeW: [
        { norm: "100%", zoom: "400", superz: "350", code: "11600px" },
        { norm: "100%", zoom: "500", superz: "350", code: "11601px" },
        { norm: "100%", zoom: "550", superz: "350", code: "11602px" },
    ],
    embedHtmlSizeH: [
        { norm: "380", zoom: "440", superz: "380", code: "11700px" },
        { norm: "380", zoom: "520", superz: "380", code: "11701px" },
        { norm: "380", zoom: "530", superz: "380", code: "11702px" },
    ],
    capFontSize: [
        { norm: "2.9rem", zoom: "3.4rem", superz: "2.9rem", code: "5215px" },
        { norm: "4rem", zoom: "5rem", superz: "2.9rem", code: "5315px" },
        { norm: "8rem", zoom: "10rem", superz: "2.9rem", code: "5415px" },
    ],

    capFontSizeBck: [
        { norm: "2.6rem", zoom: "2.8rem", superz: "2.7rem", code: "11800px" },
        { norm: "4rem", zoom: "5rem", superz: "2.7rem", code: "11801px" },
        { norm: "8rem", zoom: "10rem", superz: "2.7rem", code: "11802px" },
    ],
    capWidth: [
        { norm: "2.8rem", zoom: "3.0rem", superz: "2.6rem", code: "10000px" },
        { norm: "4rem", zoom: "4.6rem", superz: "2.6rem", code: "10001px" },
        { norm: "8rem", zoom: "9.2rem", superz: "2.6rem", code: "10002px" },
    ],

    capWidthBck: [
        { norm: "2.6rem", zoom: "2.6rem", superz: "2.7rem", code: "11100px" },
        { norm: "4.4rem", zoom: "5.5rem", superz: "2.7rem", code: "11101px" },
        { norm: "8.8rem", zoom: "11rem", superz: "2.7rem", code: "11102px" },
    ],
    capHeight: [
        { norm: "3.2rem", zoom: "3.4rem", superz: "3.2rem", code: "10100px" },
        { norm: "4.8rem", zoom: "6.0rem", superz: "3.2rem", code: "10101px" },
        { norm: "9.6rem", zoom: "12rem", superz: "3.2rem", code: "10102px" },
    ],
    capHeightBck: [
        { norm: "3.2rem", zoom: "3.5rem", superz: "3.4rem", code: "11300px" },
        { norm: "5.2rem", zoom: "6.2rem", superz: "3.4rem", code: "11301px" },
        { norm: "10.4rem", zoom: "12.4rem", superz: "3.4rem", code: "11302px" },
    ],
    capOuterSize: [
        { norm: "3.2rem", zoom: "3.4rem", superz: "3.4rem", code: "10200px" },
        { norm: "4.8rem", zoom: "6.5rem", superz: "3.4rem", code: "10201px" },
        { norm: "9.6rem", zoom: "13rem", superz: "3.4rem", code: "10202px" },
    ],

    capWidthW: [
        { norm: "3.6rem", zoom: "3.8rem", superz: "3.8rem", code: "10700px" },
        { norm: "6.4rem", zoom: "6.6rem", superz: "3.8rem", code: "10701px" },
        { norm: "10.8rem", zoom: "11.2rem", superz: "3.8rem", code: "10702px" },
    ],
    capWidthWBck: [
        { norm: "3.1rem", zoom: "3.3rem", superz: "3.5rem", code: "11200px" },
        { norm: "4.8rem", zoom: "5.9rem", superz: "3.5rem", code: "11201px" },
        { norm: "9.6rem", zoom: "11.8rem", superz: "3.5rem", code: "11202px" },
    ],
    capHeightW: [
        { norm: "3.2rem", zoom: "3.4rem", superz: "3.3rem", code: "10800px" },
        { norm: "5.2rem", zoom: "6.2rem", superz: "3.3rem,", code: "10801px" },
        { norm: "10.4rem", zoom: "12.4rem", superz: "3.3rem", code: "10802px" },
    ],

    capHeightWBck: [
        { norm: "3.2rem", zoom: "3.4rem", superz: "2.3rem", code: "10800px" },
        { norm: "5.6rem", zoom: "5.8rem", superz: "2.8rem", code: "10801px" },
        { norm: "11.2rem", zoom: "11.6rem", superz: "2.8rem", code: "10802px" },
    ],
    capOuterSizeW: [
        { norm: "3.6rem", zoom: "3.8rem", superz: "3.8rem", code: "1090px" },
        { norm: "5.2rem", zoom: "6.9rem", superz: "3.8rem", code: "10901px" },
        { norm: "10.4rem", zoom: "13.8rem", superz: "3.8rem", code: "10902px" },
    ],

    boxAvatarRadius: [
        { norm: "4vw", zoom: "5vw", superz: "5vw", code: "11000px" },
        { norm: "5vw", zoom: "6vw", superz: "6vw", code: "11001px" },
        { norm: "7vw", zoom: "8vw", superz: "8vw", code: "11002px" },
    ],
    capPadding: [
        {
            norm: "7px 0 0 0",
            zoom: "7px 0 0 0",
            superz: "7px 0 0 0",
            code: "11400px",
        },
        {
            norm: "5px 0 0 0",
            zoom: "5px 0 0 0",
            superz: "7px 0 0 0",
            code: "11401px",
        },
        {
            norm: "10px 0 0 0",
            zoom: "10px 0 0 0",
            superz: "7px 0 0 0",
            code: "11402px",
        },
    ],
    capPaddingBck: [
        {
            norm: "3px 2px 1px 2px",
            zoom: "3px 2px 1px 2px",
            superz: "5px 3px 1px 3px",
            code: "11900px",
        },
        {
            norm: "5px 4px 1px 4px",
            zoom: "5px 5px 1px 5px",
            superz: "5px 3px 1px 3px",
            code: "11901px",
        },
        {
            norm: "10px 8px 2px 8px",
            zoom: "10px 10px 2px 10px",
            superz: "5px 3px 1px 3px",
            code: "11902px",
        },
    ],
};
/*

	"capRight":[
		{"norm":"0.1vw","zoom":"0.2vw", "superz":"2vw", "code":"10300px"},
		{"norm":"0.6vw","zoom":"0.8vw", "superz":"2.4vw", "code":"10301px"},
		{"norm":"1.2vw","zoom":"1.3vw","superz":"1.3vw","code":"10302px"},
	],
	"capRightW":[
		{"norm":"0.1vw","zoom":"0.2vw", "superz":"0.6vw", "code":"10400px"},
		{"norm":"0.0vw","zoom":"0.1vw", "superz":"1vw", "code":"10401px"},
		{"norm":"1.2vw","zoom":"1.2vw","superz":"1.2vw","code":"10402px"}	
	],
	"capRightBck":[
		{"norm":"0.2vw","zoom":"0.3vw", "superz":"0.6vw", "code":"10500px"},
		{"norm":"0.9vw","zoom":"1.1vw", "superz":"1.0vw", "code":"10501px"},
		{"norm":"1.2vw","zoom":"1.4vw","superz":"1.4vw","code":"10502px"},
	],
	"capRightWBck":[
		{"norm":"0.2vw","zoom":"0.3vw", "superz":"0.6vw", "code":"10600px"},
		{"norm":"1.9vw","zoom":"2.1vw", "superz":"1.0vw", "code":"10601px"},
		{"norm":"2.2vw","zoom":"2.4vw","superz":"1.4vw","code":"10602px"}	
	],
	*/
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};

export function replaceAll(target, search, replace) {
    return target.replaceAll(search, replace);
}
export function zDecode(html, z, boost) {
    for (var name in data) {
        data[name].forEach(p => {
            html = html.replaceAll(
                p.code,
                boost ? data[name][2]["superz"] : p[z]
            );
        });
    }
    return html;
}
/**
	z - "norm","zoom","superz"
	x - false - no xcoding, true - code for html
**/
export function zGetSize(name, { size, z, x }) {
    //	console.log("zGetSize",name,size,z,x,data[name][size][z]);
    if (!x) return data[name][size][z];
    else return data[name][size].code;
}
export function zGetCode(name, size) {
    return data[name][size].code;
}
export function cDecodeColor(code, options) {
    //console.log("cDecodeColor",code,options)
    if (options.x) return code;
    if (!window.colorMap) return -1;
    //console.log('cDecodeColor 2')
    if (typeof window.colorMap[code] === "undefined") return -1;
    //console.log("cDecodeColor colorMap=",window.colorMap[code]);
    const col = window.colorMap[code][+options.theme];
    //console.log("cDecodeColor returning=",col);
    return col;
}
export function cDecode(html, colorMap, theme, color, backgroundColor) {
    //console.log("cDecode",colorMap,theme)
    for (var name in colorMap) {
        //console.log("cDecode replacing ",name,colorMap[name][theme])
        html = html.replaceAll(name, colorMap[name][theme]);
        html = html.replaceAll("#abcdef", backgroundColor);
        html = html.replaceAll("#fedcba", color);
    }
    return html;
}
export function cGetThemeColor(theme, color, options) {
    if (options.x) return "#fedcba";
    return color;
}
export function cGetThemeBackgroundColor(theme, color, options) {
    if (options.x) return "#abcdef";
    return color;
}
