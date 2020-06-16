import Immutable from "immutable";
const recurseSub = ({ sub, name }) => {
    let keys = Object.keys(sub);
    //  console.log("ENTER RECURSE", { name, keys })

    let result = {};
    keys.forEach(key => {
        let node = sub[key];
        // console.log({ node })
        if (!node.sub) {
            //terminal node
            //console.log("terminal")
            result[key] = `${name}: ${node.name} [${node.description}]`;
        } else {
            // console.log("recursing", { sub: node.sub })
            let recurse = recurseSub({
                name: `${name}: ${node.name}`,
                sub: node.sub,
            });
            // console.log("recursed out", { recurse })
            let keys = Object.keys(recurse);
            keys.forEach(key => {
                result[key] = recurse[key];
            });
        }
    });
    // console.log("EXIT RECURSE", { name, result })
    return result;
};
export default function navMenu({ config, toplevel }) {
    //if (typeof config === "string") config = JSON.parse(config);
    // else config = config.toJS();
    let navmenu = config ? config.navmenu : [];
    // console.log("!!!!!!!!!!!!!!! NAVMENU", { navmenu, toplevel })
    let menu = [];
    if (!toplevel) {
        let keys = Object.keys(navmenu);
        keys.forEach(key => {
            menu[key] = navmenu[key].name;
        });
    } else {
        let top = navmenu[toplevel];
        menu = null;
        if (top) {
            // console.log({ navmenu, top, toplevel })

            let sub = top.sub;
            if (sub) {
                let name = top.name;
                let results = recurseSub({ sub, name });
                // console.log("PARSED TREE:", { results });
                menu = results;
            }
        }
    }
    return menu;
}
