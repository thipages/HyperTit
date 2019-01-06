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
import {TBuilder} from "./TBuilder";
interface MyWindow extends Window{ ht: TBuilder }
declare var window: MyWindow;
window.ht = TBuilder;
