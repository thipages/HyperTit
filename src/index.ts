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
import {THelper} from "./THelper";
export class HT {
    static node(...data:any) :TNode {
        if (data[0] instanceof Object)
            return THelper.getObjectNode(data[0]);
        else
            return THelper.getArrayNode(<any>data);
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
    static addNode(tag:string='div'):TNode {
        return TBuilder.addNode(tag);
    }
}
interface MyWindow extends Window { HyperTit: HT, HyperTitTest:HTest }
declare var window: MyWindow;
window.HyperTit = HT;
window.HyperTitTest = HTest;
