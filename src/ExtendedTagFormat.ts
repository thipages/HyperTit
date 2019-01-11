/*
 * 	ExtendedTag2Nodeg2Node.ts
 *	Version 0.0.1
 * 	https://github.com/thipages/HyperTit
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	 HyperTit Tit's hypertext
 */
import {TNode} from "./TNode";
import {TBuilder} from "./TBuilder";
export class ExtendedTagFormat {
    static getNode(extendedTag?:string,content?:any,events?:object): TNode {
        return extendedTag===undefined
            ? TBuilder.getNode()
            : content===undefined
                ? ExtendedTagFormat.getNodeFromExtendedTag(extendedTag)
                : (events===undefined)
                    ? ExtendedTagFormat.getNodeWithContent(extendedTag,content)
                    : ExtendedTagFormat.getNodeWithEvents(extendedTag,content,events)
    }
    private static getNodeFromExtendedTag(extendedTag:string) :TNode {
        let node:TNode, length, matches, firstChar;
        if (extendedTag==="") {
            node=TBuilder.getNode();
        } else {
            matches=extendedTag.match(/(^\w+)|(\.\w+)|(\[.*?])|(\(.*?\))/g);
            firstChar=matches[0].substr(0,1);
            if ([".","(","["].indexOf(firstChar)>-1){
               node=TBuilder.getNode();
            } else {
               node=TBuilder.getNode(matches[0]);
               matches.shift();
            }
            length=matches.length;
            for (let index=0;index<length;index++) {
                firstChar=matches[index].substr(0,1);
                if (firstChar===".") {
                   node.addClass(matches[index].substr(1))
                } else if (firstChar==="[") {
                   node.addProperty(matches[index].slice(1,-1),null);
                } else if (firstChar==="(") {
                   node.addStyle(matches[index].slice(1,-1),null);
                }
            }
            if (matches.join("").length!==extendedTag.length) {
               // todo send a warning
            }
        }
        return node;
    }
    private static getNodeWithContent(extendedTag:string,content:any):TNode {
        let node,child;
        node= ExtendedTagFormat.getNodeFromExtendedTag(extendedTag);
        if (typeof(content==='string')) {
            node.addChild(content);
        } else if (content instanceof Array) {
            for (child in content) node.addChild(child);
        } else {
            child=TBuilder.getNodeFrom_allowsNull(content);
            if (child!==null) node.addChild(content);
        }
        return node;
    }
    private static getNodeWithEvents (extendedTag:string,content:any,events:object):TNode {
        let node;
        node=ExtendedTagFormat.getNodeWithContent(extendedTag,content);
        for (let type in events) {
            if (events.hasOwnProperty(type) && events[type] instanceof Function) {
                node.addEvent(type,events[type])
            }
        }
        return node;
    }
}