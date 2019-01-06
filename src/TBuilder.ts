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
export class TBuilder {
    private static _callback:Function;
    private static uid_count=0;
    static set callback(cb:Function) {
        TBuilder._callback=cb;
    }
    static addNode(tag:string='div'):TNode {
        return new TNode(tag, TBuilder.nodeCallback);
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
            wrapperParts[2]=wrapperParts[2]+parts[2];
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
}