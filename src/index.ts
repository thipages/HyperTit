/*
 * 	index.ts
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
export class HT {
    static getNode(data1?:any, data2?:any, data3?:any) :TNode {
        return TBuilder.getNodeFrom(data1,data2,data3);
    }
    static build(node:TNode, anchor:string='body', callback:Function=null):void {
        TBuilder.build(node, anchor);
        TBuilder.callback=callback;
    }
}
export class HTest extends HT {
    static getNodeHtml(node:TNode):string {
        return TBuilder.getNodeHtml(node)
    }
    static resetUid():void {
        TBuilder.resetUid();
    }
}
interface MyWindow extends Window { HyperTit: HT, HyperTitTest:HTest }
declare var window: MyWindow;
window.HyperTit = HT;
window.HyperTitTest = HTest;
