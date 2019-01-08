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
import {Object2Node} from "./factory/Object2Node";
import {Array2Node} from "./factory/Array2Node";
export class TBuilder {
    private static _callback:Function;
    private static uid_count=0;
    static set callback(cb:Function) {
        TBuilder._callback=cb;
    }
    static getNode(tag:string='div'):TNode {
        return new TNode(tag, TBuilder.nodeCallback);
    }
    static getNodeFrom(data1:any,data2:any,data3:any):TNode {
        let length:number, nodeTemp:TNode|boolean;
        length= (data1===undefined)?0:(data2===undefined)?1:(data3===undefined)?2:3;
        if (length===0) {
            nodeTemp=TBuilder.getNode();
        } else {
            if (length===1) {
                nodeTemp= (data1 instanceof TNode)
                    ? data1
                    : (typeof(data1)==='string')
                        ? TBuilder.getNode(data1) // todo : to change to Array2Node
                        : (typeof(data1)==='object')
                            ? Object2Node.getNode(data1)
                            : false;
            } else {
                if (length===2) {
                    nodeTemp= (typeof(data1)==='string')
                        ? Array2Node.getNode(data1,data2,null)
                        : false;
                } else {
                    nodeTemp= (typeof(data1)==='string' && typeof(data2)==='object')
                        ? Array2Node.getNode(data1,data2,data3)
                        : false;
                }
            }
        }
        // todo : send warning through callback if boolean
        return (typeof(nodeTemp)==='boolean') ? TBuilder.getNode():nodeTemp;
        return TBuilder.getNode();
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
        element.innerHTML = TBuilder.getNodeHtml(node);
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
    private static nodeCallback(node,type,action,data) {
        if (TBuilder._callback) TBuilder._callback(node,type,action,data);
    }
    static getNodeHtml(node:TNode):string {
        let parts:[string,string,string];
        // WRAPPERS
        let wrapperParts=["","",""];
        for (let wrapper of node.parentWrappers) {
            parts=TBuilder.getParts(wrapper);
            wrapperParts[0]+=parts[0];
            wrapperParts[2]=parts[2]+wrapperParts[2];
        }
        wrapperParts[1]=TBuilder.getParts(node).join("");
        return wrapperParts.join("");
    }
    private static getParts(node:TNode):[string,string,string] {
        let properties:any, styles:string, classes:string, children:string, attrs:Array<string>;
        attrs=Array<string>();
        // ID
        if (node.id) attrs.push(`id="${node.id}"`);
        // PROPERTIES
        properties=Array<string>();
        node.properties.forEach((value,key)=> {
            properties.push(`${key}="${value}"`)
        });
        properties=properties.join(" ");
        if (properties!=="") attrs.push(properties);
        // STYLES
        styles="";
        node.styles.forEach((value,key)=> {
            styles+=key+":"+value+";";
        });
        if (styles!=="") attrs.push(`style="${styles}"`);
        // CLASSES
        classes=node.classes.join(" ");
        if (classes!=="") attrs.push(`class="${classes}"`);
        // CHILDREN OR VOID ELEMENTS
        if (!TBuilder.isVoidElement(node.tag)) {
            children = "";
            for (let child of node.children) {
                if (child instanceof TNode) {
                    children += TBuilder.getNodeHtml(child);
                } else {
                    children += child;
                }
            }
            return [`<${node.tag} ${attrs.join(" ")}>`, children, `</${node.tag}>`];
        } else {
            return [`<${node.tag} ${attrs.join(" ")}/>`, "", ""];
        }
    }
    private static isVoidElement(tag:string):boolean {
        return [
            "area","base","br","col","embed","hr","img",
            "input","link","meta","param","source","track","wbr"
        ].indexOf(tag.toLowerCase()) > -1;
    }
    static uid() {
        TBuilder.uid_count++;
        return "id"+TBuilder.uid_count;
    }
    // todo : should be elsewhere, test subclass?
    static resetUid() {
        TBuilder.uid_count=0;
    }
    static updateNodeClass(node:TNode,raw_class:string):void {
        for (let clazz of raw_class.split(" ")) {
            if (clazz.trim()!=="") {
                node.addClass(clazz);
            }
        }
    }
    static updateNodeStyle(node:TNode, raw_style:string):void {
        let style,key,value;
        for (let styles of raw_style.split(";")) {
            if (styles.trim()!=="") {
                style=styles.split(":");
                if (style.length===2) {
                    key=style[0].trim();
                    value=style[1].trim();
                    if (key!=="" && value !=="") {
                        node.addStyle(key,value);
                    }
                }
            }
        }
    }
}