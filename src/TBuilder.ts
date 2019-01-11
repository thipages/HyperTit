/*
 * 	TBuilder.ts
 *	Version 0.0.1
 * 	https://github.com/thipages/HyperTit
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	 HyperTit Tit's hypertext
 */
import {TNode} from "./TNode";
import {ObjectFormat} from "./ObjectFormat";
import {ExtendedTagFormat} from "./ExtendedTagFormat";
export class TBuilder {
    private static _callback:Function;
    private static uid_count=0;
    static set callback(cb:Function) {
        TBuilder._callback=cb;
    }
    private static nodeCallback(node,type,action,data) {
        if (TBuilder._callback) TBuilder._callback(node,type,action,data);
    }
    static uid() {
        TBuilder.uid_count++;
        return "id"+TBuilder.uid_count;
    }
    static resetUid() {
        TBuilder.uid_count=0;
    }

    static getNode(tag:string='div'):TNode {
        return new TNode(tag, TBuilder.nodeCallback);
    }
    static getNodeFrom(data1?:any,data2?:any,data3?:any):TNode {
        let node=TBuilder.getNodeFrom_allowsNull(data1,data2,data3);
        // todo : send warning through callback if boolean
        return (node===null) ? TBuilder.getNode():node;
    }
    static getNodeFrom_allowsNull(data1?:any, data2?:any, data3?:any):TNode|null {
        let length:number, node:TNode|null;
        length= (data1===undefined)?0:(data2===undefined)?1:(data3===undefined)?2:3;
        if (length===0) {
            node=TBuilder.getNode();
        } else {
            if (length===1) {
                node= (data1 instanceof TNode)
                    ? data1
                    : (typeof(data1)==='string')
                        ? ExtendedTagFormat.getNode(data1)
                        : (typeof(data1)==='object')
                            ? ObjectFormat.getNode(data1)
                            : null;
            } else {
                if (length===2) {
                    node= (typeof(data1)==='string')
                        ? ExtendedTagFormat.getNode(data1,data2)
                        : null;
                } else {
                    node= (typeof(data1)==='string' && typeof(data2)==='object')
                        ? ExtendedTagFormat.getNode(data1,data2,data3)
                        : null;
                }
            }
        }
        return node;
    }

    static build(node:TNode, anchor="body") {
        let id, element;
        if (anchor.substr(0,1)==="#") {
            id=anchor.substr(1);
            element=document.getElementById(id);
        } else if (anchor==='body') {
            id = "body";
            element=document.body
        } else {
            // todo: see DOMinus code
        }
        node.parent = id;
        element.innerHTML = node.getNodeHtml();
        TBuilder.registerEvents(node);
    }
    static registerEvents (node:TNode, register=true):void {
        node.events.forEach((listener, type) => {
            if (register) {
                document.getElementById(node.id).addEventListener(type,<any>listener);
            } else {
                document.getElementById(node.id).removeEventListener(type,<any>listener);
            }
        });
        for (let child of node.children) {
            if (child instanceof TNode) TBuilder.registerEvents(child,register);
        }
    }


}