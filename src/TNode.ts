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
    static PATTERN_STYLE=/((\w|-)+):(\w|#|-)+/g;
    static PATTERN_PROPERTY=/([\w|-]+=[\w|,-]+)|[\w|-]+/g;
    static PATTERN_CLASS=/[\s|;]/g;

    parent:string|TNode;
    events:Map<string,Function>;
    id:string;

    children:Array<TNode|string>;
    classes:Set<string>;
    parentWrappers:Array<TNode>;
    styles:Map<string,string>;
    properties:Map<string,string>;

    constructor(readonly tag:string, private readonly callback:Function) {
        this.id=TBuilder.uid();
        this.parent=null;
        this.children=Array<TNode|string>();
        this.parentWrappers=Array<TNode>();
        this.styles=new Map<string,string>();
        this.properties=new Map<string,string>();
        this.classes=new Set<string>();
        this.events=new Map<string,Function>();
    }
    wrap(node:TNode):this {
        if (node.tag==='div' && !this.isAttachedToDom()) this.parentWrappers.unshift(node);
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
    removeChild(child:TNode|string):this {
        if (this.children.length!=0) {
            if (this.isAttachedToDom()) {
                let index = this.children.indexOf(child);
                if (index>1) document.getElementById(this.id).children[index].remove();
            }
            this.children = this.children.filter(item => item !== child);
        }
        return this;
    }
    removeChildAt(index:number):this {
        if (index>=0 && index<this.children.length!) {
            if (this.isAttachedToDom()) {
                document.getElementById(this.id).children[index].remove();
            }
            this.children.splice(index,1);
        }
        return this;
    }
    addStyle (keyOrRawStyle,value=null):this {
        let matches, attached=null;
        if (keyOrRawStyle) {
            if (value !== null && value.trim() !== "") {
                this.styles.set(keyOrRawStyle, value);
                if (attached === null) attached = this.isAttachedToDom();
                if (attached) this.addStyleToDom(keyOrRawStyle, value);
            } else {
                matches=keyOrRawStyle.match(TNode.PATTERN_STYLE);
                if (matches) {
                    matches.forEach((pattern) => {
                        let styles = pattern.split(":");
                        this.styles.set(styles[0], styles[1]);
                        if (attached === null) attached = this.isAttachedToDom();
                        if (attached) this.addStyleToDom(styles[0], styles[1]);
                    });
                } else {
                    // todo : send warning
                    console.log("No match: "+keyOrRawStyle);
                }
            }
        }
        return this;
    }
    removeStyle (key):this {
        this.styles.delete(key);
        if (this.isAttachedToDom()) {
            document.getElementById(this.id).style[key] = null;
            if (this.callback) this.callback (this,'style','remove',key);
        }
        return this;
    }
    // todo : optimization... replace Map formalism by Object one (type is just a string+extended format compatible)
    addEvent(type:string,listener:Function):this {
        this.events.set(type,listener);
        if (this.isAttachedToDom()) {
            document.getElementById(this.id).addEventListener(type,<any>listener);
            if (this.callback) this.callback (this,'event','add',type);
        }
        return this;
    }
    removeEvent(type:string):this {
        if (this.isAttachedToDom()) {
            document.getElementById(this.id).removeEventListener(type,<any>this.events.get(type));
            if (this.callback) this.callback (this,'event','remove',type);
        }
        this.events.delete(type);
        return this;
    }
    addClass(rawClassOrClass:string):this {
        let attached=null;
        if (rawClassOrClass) {
            rawClassOrClass.split(TNode.PATTERN_CLASS).forEach((clazz) => {
                if (!this.classes.has(clazz)) {
                    if (attached === null) attached = this.isAttachedToDom();
                    this.classes.add(clazz);
                    if (attached) this.addClassToDom(clazz);
                }
            });
        }
        return this;
    }
    removeClass(clazz:string) {
        this.classes.delete(clazz);
        if (this.isAttachedToDom()) {
            document.getElementById(this.id).classList.remove(clazz);
            if (this.callback) this.callback (this,'class','remove',clazz);
        }
        return this;
    }
    addProperty(keyOrRawProperty:string, value:string=null) {
        let attached=null;
        if (keyOrRawProperty) {
            if (value !== null) {
                if (keyOrRawProperty !== "class" && keyOrRawProperty !== "style") {
                    this.properties.set(keyOrRawProperty, value);
                    if (attached === null) attached = this.isAttachedToDom();
                    if (attached) this.addPropertyToDom(keyOrRawProperty, value);
                }
            } else {
                keyOrRawProperty.match(TNode.PATTERN_PROPERTY).forEach((pattern) => {
                    let properties = pattern.split("=");
                    properties[0]=properties[0].trim();
                    if (properties.length==1) properties.push(properties[0]);
                    this.properties.set(properties[0], properties[1]);
                    if (attached === null) attached = this.isAttachedToDom();
                    if (attached) this.addPropertyToDom(properties[0], properties[1]);
                });
            }
        }
        return this;
    }
    removeProperty(property:string) {
        if (property!=='class' && property!=='style') {
            this.properties.delete(property);
            if (this.isAttachedToDom()) {
                document.getElementById(this.id).removeAttribute(property);
                if (this.callback) this.callback (this,'property','remove',property);
            }
        }
        return this;
    }
    getProperty(property:string="value") {
        return document.getElementById(this.id)[property];
    }
    isAttachedToDom():boolean {
        let node:TNode=this;
        while (true) {
            if (node.parent instanceof TNode) node=node.parent; else break;
        }
        return (typeof(node.parent)==='string');
    }
    private addStyleToDom(key:string,value:string):void {
        document.getElementById(this.id).style[key] = value;
        if (this.callback) this.callback (this,'style','add',key+':'+value);
    }
    private addPropertyToDom(key:string,value:string):void {
        //document.getElementById(this.id).setAttribute(key, value);
        document.getElementById(this.id)[key]=value;
        if (this.callback) this.callback (this,'property','add',value!==null?key+"="+value:key);
    }
    private addClassToDom(clazz:string):void {
        document.getElementById(this.id).classList.add(clazz);
        if (this.callback) this.callback(this, 'class', 'add', clazz);
    }
}