/*
 * 	Object2Node.ts
 *	Version 0.0.1
 * 	https://github.com/thipages/HyperTit
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	 HyperTit Tit's hypertext
 */
import {TNode} from "../TNode";
import {TBuilder} from "../TBuilder";
export class Object2Node {
    static getNode(data: object): TNode {
        let node, html;
        if (!data.hasOwnProperty('tag')) data['tag'] = 'div';
        node = TBuilder.getNode(data['tag']);
        delete data['tag'];
        if (data.hasOwnProperty("class")) {
            TBuilder.updateNodeClass(node, data['class']);
            delete data["class"];
        }
        if (data.hasOwnProperty("style")) {
            TBuilder.updateNodeStyle(node, data['style']);
            delete data["style"];
        }
        if (data.hasOwnProperty("html")) {
            html = data['html'];
            if (typeof (html) === 'string') {
                node.addChild(data['html']);
            } else if (html instanceof Array) {
                // todo : cross
                for (let child of html) {
                    // todo: cross-mode with ArrayNode
                    node.addChild(Object2Node.getNode(child));
                }
            }
            delete data["html"];
        } else {
            node.addChild("");
        }

        for (let property in data) {
            if (data.hasOwnProperty(property)) {
                if (property.substring(0, 2) === 'on') {
                    if (data[property] instanceof Function)
                        node.addEvent(property.substr(2), data[property]);
                } else {
                    node.addProperty(property, data[property]);
                }
            }
        }
        return node;
    }
}