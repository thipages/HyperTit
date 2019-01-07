import {TNode} from "./TNode";
import {TBuilder} from "./TBuilder";
export class THelper {
    static getObjectNode (data:any):TNode {
        let node, html;
        if (!data.hasOwnProperty('tag')) data.tag='div';
        node=TBuilder.node(data.tag);
        delete data.tag;
        if (data.hasOwnProperty("class")){
            TBuilder.updateNodeClass(node,data['class']);
            delete data["class"];
        }
        if (data.hasOwnProperty("style")){
            TBuilder.updateNodeStyle(node,data['style']);
            delete data["style"];
        }
        if (data.hasOwnProperty("html")) {
            html=data['html'];
            if (typeof(html)==='string') {
                node.addChild(data['html']);
            } else if (html instanceof Array) {
                // todo : cross
                for (let child of html) {
                    // todo: cross-mode with ArrayNode
                    node.addChild(THelper.getObjectNode(child));
                }
            }
            delete data["html"];
        } else {
            node.addChild("");
        }

        for (let property in data) {
            if (data.hasOwnProperty(property)) {
                if (property.substring(0,2)==='on') {
                    if (data[property] instanceof Function)
                        node.addEvent(property.substr(2),data[property]);
                } else {
                    node.addProperty(property,data[property]);
                }
            }
        }
        return node;
    }
    static getArrayNode(...data:any): TNode {
        let node;
        if (!data) {
            node= TBuilder.node();
        } else if (typeof(data[0]==='string')) {
            node= THelper.getNodeFromExtendedTag(data[0]);
            if (data[1]) {
                if (typeof(data[1]==='string')) {

                } else if (data[1] instanceof Array) {

                } else if (data[1] instanceof Object) {
                    // todo: cross-mode with ObjectNode
                }
            }
            if (data[2] && data[2] instanceof Object) {
                THelper.addEvents(data[2]);
            }
        }
        return node;
    }
    private static getNodeFromExtendedTag(extendedTag) :TNode {
        return null;
    }
    private static addEvents (events:any):void {

    }
}