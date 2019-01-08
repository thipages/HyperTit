/*
 * 	Array2Node.ts
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
export class Array2Node {
    static getNode(extendedTag:string,content:any,events:object): TNode {
        let node;
        /*if (!data) {
            getNode= TBuilder.getNode();
        } else if (typeof(data[0]==='string')) {
            getNode= Array2Node.getNodeFromExtendedTag(data[0]);
            if (data[1]) {
                if (typeof(data[1]==='string')) {

                } else if (data[1] instanceof Array) {

                } else if (data[1] instanceof Object) {
                    // todo: cross-mode with ObjectNode
                }
            }
            if (data[2] && data[2] instanceof Object) {
                Array2Node.addEvents(data[2]);
            }
        }*/
        return TBuilder.getNode();//getNode;
    }
    private static getNodeFromExtendedTag(extendedTag) :TNode {
        return null;
    }
    private static addEvents (events:any):void {

    }
}