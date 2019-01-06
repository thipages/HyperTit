/*
 * 	TNode.ts
 *	Version 0.0.1
 * 	https://github.com/thipages/HyperTit
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *
 *	 HyperTit Tit's hypertext
 */
import {TBuilder} from "./TBuilder";
export class TNode {
    parent:string|TNode;
    children:Array<TNode|string>;
    classes:Array<string>;
    parentWrappers:Array<TNode>;
    styles:Map<string,string>;
    properties:Map<string,string>;
    events:Map<string,Function>;
    id:string;
    constructor(readonly tag:string, private readonly callback:Function) {
        this.id=TNode.uid("id");
        this.parent=null;
        this.children=Array<TNode|string>();
        this.parentWrappers=Array<TNode>();
        this.styles=new Map<string,string>();
        this.properties=new Map<string,string>();
        this.classes=Array<string>();
        this.events=new Map<string,Function>();
    }
    wrap(node:TNode):this {
        if (!this.isAttachedToDom()) this.parentWrappers.unshift(node);
        return this;
    }
    addStyle (key,value):this {
        this.styles.set(key,value);
        if (this.isAttachedToDom()) {
            document.getElementById(this.id).style[key] = value;
            if (this.callback) this.callback (this,'style','add',key+':'+value);
        }
        return this;
    }
    removeStyle (key):this {
        this.styles.delete(key);
        if (this.isAttachedToDom()) document.getElementById(this.id).style[key] = null;
        return this;
    }
    addChild(child:TNode|string):this {
        let targetElement, lastChild, isAttached;
        isAttached=this.isAttachedToDom();
        if (!(child instanceof TNode)) {
            if (this.children.length===0) {
                this.children.push(child);
            } else {
                this.children[0]=child;
            }
            if (isAttached) document.getElementById(this.id).innerHTML=child;
        } else {
            this.children.push(child);
            child.parent=this;
            if (isAttached) {
                if (this.children.length === 1) {
                    document.getElementById(this.id).innerHTML = TBuilder.getNodeHtml(child);
                } else {
                    lastChild = this.children[this.children.length - 2];
                    if (lastChild instanceof TNode) {
                        targetElement = document.getElementById(lastChild.id);
                        targetElement.insertAdjacentHTML("afterend", TBuilder.getNodeHtml(child));
                    }
                }
                TBuilder.registerEvents(child);
            }
        }
        return this;
    }
    // todo
    removeChild(child:TNode|string):this {
        //this.children = this.children.filter(item => item !== child);
        return this;
    }
    addEvent(type:string,listener:Function):this {
        this.events.set(type,listener);
        if (this.isAttachedToDom()) document.getElementById(this.id).addEventListener(type,<any>listener);
        return this;
    }
    removeEvent(type:string):this {
        if (this.isAttachedToDom()) document.getElementById(this.id).removeEventListener(type,<any>this.events.get(type));
        this.events.delete(type);
        return this;
    }
    addClass(clazz:string) {
        this.classes.push(clazz);
        if (this.isAttachedToDom()) document.getElementById(this.id).classList.add(clazz);
        return this;
    }
    removeClass(clazz:string) {
        this.classes = this.classes.filter(item => item !== clazz);
        if (this.isAttachedToDom()) document.getElementById(this.id).classList.remove(clazz);
        return this;
    }
    addProperty(property:string, value:string) {
        if (property!=='class' && property!=='style') {
            this.properties.set(property,value);
            if (this.isAttachedToDom()) document.getElementById(this.id).setAttribute(property, value);
        }
        return this;
    }
    removeProperty(property:string) {
        if (property!=='class' && property!=='style') {
            this.properties.delete(property);
            if (this.isAttachedToDom()) document.getElementById(this.id).removeAttribute(property);
        }
        return this;
    }
    isAttachedToDom():boolean {
        let node:TNode=this;
        while (true) {
            if (node.parent instanceof TNode) node=node.parent; else break;
        }
        return (typeof(node.parent)==='string');
    }
    static uid(prefix:string=""):string {
        let ran= '_' + Math.random().toString(36);
        return prefix+ran.substr(3, 9);
    }
}