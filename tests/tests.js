const FORMAT_NATIVE ='NATIVE';
const FORMAT_OBJECT ='OBJECT';
const FORMAT_EXTEND ='EXTEND';
let FORMATS = [FORMAT_NATIVE,FORMAT_OBJECT,FORMAT_EXTEND];
let QUNIT={};
QUNIT.tests={};
QUNIT.tests_formats={};
QUNIT.tests_callback={};
let METHODS = {};
let prefixFormat;
let currentFormat;
let currentAlternative;
let HT=window.HyperTitTest;
let h=window.HyperTitTest.getNode;
let CALLBACK=function (node,type,action,data) {
    this.note=node;
    this.type=type;
    this.action=action;
    this.data=data;
    this.format2nodeId=function() {
        return [node.id,type,action,data];
    }
};
CALLBACK.handler = function (node, type, action, data) {
    CALLBACK.result=new CALLBACK(node, type, action, data);
};
METHODS.init=function(){
    HT.resetUid();
    CALLBACK.result=null;
};
METHODS.build=function(node, callback) {
    window.HyperTit.build(node, "#HT_test",callback);
};
METHODS.triggerEvent=function (node, type) {
    let event = new CustomEvent(type, { "detail": "Example of an event" });
    document.getElementById(node.id).dispatchEvent(event);
};
METHODS.findFirstDiffPos=function (a, b) {
    let longerLength = Math.max(a.length, b.length);
    for (let i = 0; i < longerLength; i++) {
        if (a[i] !== b[i]) return i;
    }
    return -1;
};
QUNIT.run = function() {
    let result;
    for (prefixFormat of FORMATS) {
        for (let prop in QUNIT.tests_formats) {
            if (QUNIT.tests_formats.hasOwnProperty(prop)) {
                for (currentAlternative=0;currentAlternative<100;currentAlternative++) {
                    currentFormat=(currentAlternative===0)?prefixFormat:prefixFormat+currentAlternative;
                    result = QUNIT.tests_formats[prop]();
                    if (result!==null && result[0] !== null && result[0] !== undefined) {
                        QUNIT.runTest(prefixFormat+"_"+currentAlternative+"_"+prop,result);
                    } else {
                        break;
                    }
                }
            }
        }
    }
    for (let prop in QUNIT.tests_callback) {
        if (QUNIT.tests_callback.hasOwnProperty(prop)) {
            (function (p) {
                let actual, expected;
                expected = QUNIT.tests_callback[p]();
                actual = CALLBACK.result ? CALLBACK.result.format2nodeId() : null
                QUnit.test("callback_"+prop, function (assert) {
                    assert.deepEqual(actual, expected);
                });
            }(prop));
        }
    }

};
QUNIT.runTest=function(name,testResult) {
    let actual, isOk, expected;
    expected = testResult[1];
    isOk = (expected === (actual = HT.getNodeHtml(testResult[0])));
    QUnit.test(name, function (assert) {
        if (isOk) {
            assert.ok(true, "Passed : " + actual);
        } else {
            assert.ok(true, "Actual : " + actual);
            assert.ok(true, "Expect : " + expected);
            assert.ok(false, "Failed : " + actual.substr(0, METHODS.findFirstDiffPos(actual, expected)));
        }
    });
};
QUnit.test("JS_CORE_spread_operator", function (assert) {
    function spread(...data) {
        return data;
    }
    let cases=[
        [spread(),0],
        [spread(""),1,'string'],
        [spread("A"),1,'string'],
        [spread({}),1,'object']
    ];
    cases.forEach ((aCase)=> {
        assert.ok(aCase[0].length===aCase[1]);
        if (aCase.length===3) assert.ok(typeof(aCase[0][0])===aCase[2]);
    });
});
QUNIT.tests_formats["empty"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode();
            break;
        case FORMAT_OBJECT:
            node=h({});
            break;
        case FORMAT_EXTEND:
            node=h();
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests_formats["non_void"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode('div');
            break;
        case FORMAT_OBJECT:
            node=h({tag:"div"});
            break;
        case FORMAT_EXTEND:
            node=h('div');
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests_formats["void"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode("input");
            break;
        case FORMAT_OBJECT:
            node=h({tag:"input"});
            break;
        case FORMAT_EXTEND:
            node=h("input");
            break;
        default:
            node=null;
    }
    return [node,`<input id="id1"/>`];
};
QUNIT.tests_formats["addStyle"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addStyle("color","green");
            break;
        case FORMAT_OBJECT:
            node=h({style:"color:green"});
            break;
        case FORMAT_EXTEND:
            node=h("(color:green)");
            break;
        case FORMAT_EXTEND+1:
            node=h("div(color:green)");
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1" style="color:green;"></div>`];
};
QUNIT.tests_formats["addMultipleStyles"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addStyle("k1","v1")
                .addStyle("k2","v2");
            break;
        case FORMAT_OBJECT:
            node=h({style:"k1:v1;k2:v2;"});
            break;
        case FORMAT_EXTEND:
            node=h("(k1:v1;k2:v2;)");
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1" style="k1:v1;k2:v2;"></div>`];
};
QUNIT.tests_formats["addClass"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addClass("myClass");
            break;
        case FORMAT_NATIVE+1:
            node=HT.getNode()
                .addClass("myClass myClass");
            break;
        case FORMAT_OBJECT:
            node=h({class:"myClass"});
            break;
        case FORMAT_OBJECT+1:
            node=h({class:"myClass myClass"});
            break;
        case FORMAT_EXTEND:
            node=h(".myClass");
            break;
        case FORMAT_EXTEND+1:
            node=h("div.myClass");
            break;
        case FORMAT_EXTEND+2:
            node=h("div.myClass.myClass");
            break;
        case FORMAT_EXTEND+3:
            node=h(".myClass.myClass");
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1" class="myClass"></div>`];
};
QUNIT.tests_formats["addMultipleClasses"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addClass("myClass1 myClass2");
            break;
        case FORMAT_NATIVE+1:
            node=HT.getNode()
                .addClass("myClass1 myClass2 myClass1");
            break;
        case FORMAT_OBJECT:
            node=h({class:"myClass1 myClass2"});
            break;
        case FORMAT_OBJECT+1:
            node=h({class:"myClass1 myClass2 myClass1"});
            break;
        case FORMAT_EXTEND:
            node=h(".myClass1.myClass2");
            break;
        case FORMAT_EXTEND+1:
            node=h("div.myClass1.myClass2");
            break;
        case FORMAT_EXTEND+2:
            node=h("div.myClass1.myClass2.myClass1");
            break;
        case FORMAT_EXTEND+3:
            node=h(".myClass1.myClass2.myClass1");
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1" class="myClass1 myClass2"></div>`];
};
QUNIT.tests_formats["addProperty_key_value"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addProperty("p","v");
            break;
        case FORMAT_NATIVE+1:
            node=HT.getNode()
                .addProperty("p=v");
            break;
        case FORMAT_OBJECT:
            node=h({p:"v"});
            break;
        case FORMAT_EXTEND:
            node=h("[p=v]");
            break;
    }
    return [node,`<div id="id1" p="v"></div>`];
};
QUNIT.tests_formats["addProperty_multiple"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addProperty("p1","v1")
                .addProperty("p2")
                .addProperty("p3=v3")
                .addProperty("p2")
                .addProperty("p4-a")
                .addProperty("p5-a","v5-,a");
            break;
        case FORMAT_OBJECT:
            node=h({p1:"v1",p2:null,p3:"v3","p4-a":null,"p5-a":"v5-,a"});
            break;
        case FORMAT_EXTEND:
            node=h("[p1=v1;p2;p3=v3;p2;p4-a;p5-a=v5-,a]");
            break;
        case FORMAT_EXTEND+1:
            node=h("[p1=v1][p2][p3=v3][p2][p4-a][p5-a=v5-,a]");
            break;
    }
    return [node,`<div id="id1" p1="v1" p2="p2" p3="v3" p4-a="p4-a" p5-a="v5-,a"></div>`];
};
QUNIT.tests_formats["addProperty_key"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT.getNode()
                .addProperty("p");
            break;
        case FORMAT_OBJECT:
            node=h({p:null});
            break;
        case FORMAT_EXTEND:
            node=h("[p]");
            break;
    }
    return [node,`<div id="id1" p="p"></div>`];
};
QUNIT.tests_formats["content_empty"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT
                .getNode('div')
                .addChild("");
            break;
        case FORMAT_OBJECT:
            node=h({tag:"div", html:""});
            break;
        case FORMAT_EXTEND:
            node=h("div","");
            break;
        case FORMAT_EXTEND+1:
            node=h("div");
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests_formats["content_string"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node = HT
                .getNode('div')
                .addChild("HyperTit");
            break;
        case FORMAT_OBJECT:
            node = h({tag: "div", html: "HyperTit"});
            break;
        case FORMAT_EXTEND:
            node=h("div","HyperTit");
            break;
        default:
            node=null
    }
    return [node,`<div id="id1">HyperTit</div>`];
};
QUNIT.tests_formats["content_array"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            node=HT
                .getNode("ul")
                .addChild(
                    HT
                        .getNode("li")
                        .addChild("item1")
                );
            break;
        case FORMAT_OBJECT:
            node=h({
                tag:"ul",
                html:[
                    {tag:"li",html:"item1"}
                ]
            });
            break;
        case FORMAT_EXTEND:
            /*node=h(
                "ul",
                [
                    h("li","item1")
                ]
            );*/
            break;
    }
    return [node,`<ul id="id1"><li id="id2">item1</li></ul>`];
};
QUNIT.tests_formats["content_array_remove_before"]=function () {
    let node;
    METHODS.init();
    switch (currentFormat) {
        // todo : create direct getNode tests_formats only
        case FORMAT_NATIVE:
        case FORMAT_OBJECT:
        case FORMAT_EXTEND:
            node=HT.getNode("ul");
            [1,2,3].forEach((index)=> {
                node.addChild (h({tag:'li', html:'item'+index}))
            });
            node.removeChild(node.children[1]);
            break;
        default:
            node=null;
    }
    return [node,`<ul id="id1"><li id="id2">item1</li><li id="id4">item3</li></ul>`];
};
QUNIT.tests_callback["addStyle"]=function () {
    let node;
    METHODS.init();
    node=HT.getNode();
    METHODS.build(node,CALLBACK.handler);
    node.addStyle("background-color", "black");
    return ["id1","style","add", "background-color:black"];
};
QUNIT.tests_callback["event_postBuild"]=function () {
    let node;
    METHODS.init();
    node=HT.getNode();
    METHODS.build(node,CALLBACK.handler);
    node.addEvent("click", ()=>{});
    return ["id1","event","add", "click"];
};
QUNIT.run();
/* TEST TEMPLATE */
/*
    let node;
    METHODS.init();
    switch (currentFormat) {
        case FORMAT_NATIVE:
            break;
        case FORMAT_OBJECT:
            break;
        case FORMAT_EXTEND:
            break;
    }
 */