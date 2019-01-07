const DIRECT_NODE='D';
const OBJECT_NODE='O';
const ARRAY_NODE ='A';
let CONTEXTS = [DIRECT_NODE,OBJECT_NODE];let QUNIT={};
let METHODS = {};
let currentContext;
let HT=window.HyperTitTest;
let h=window.HyperTitTest.node;
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
    console.log("aaaa", type)
    CALLBACK.result=new CALLBACK(node, type, action, data);
};
QUNIT.tests={};
QUNIT.tests_callback={};
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
    for (currentContext of CONTEXTS) {
        for (let prop in QUNIT.tests) {
            if (QUNIT.tests.hasOwnProperty(prop)) {
                (function (p) {
                    let test, actual, isOk, expected;
                    test = QUNIT.tests[p]();
                    expected = test[1];
                    isOk = (expected === (actual = HT.getNodeHtml(test[0])));
                    QUnit.test(currentContext+"_"+prop, function (assert) {
                        if (isOk) {
                            assert.ok(true, "Passed : " + actual);
                        } else {
                            assert.ok(true, "Actual : " + actual);
                            assert.ok(true, "Expect : " + expected);
                            assert.ok(false, "Failed : " + actual.substr(0, METHODS.findFirstDiffPos(actual, expected)));
                        }
                    });
                }(prop));
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
QUNIT.tests["empty"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node=HT.node();
            break;
        case OBJECT_NODE:
            node=h({});
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests["non_void"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node=HT.node('div');
            break;
        case OBJECT_NODE:
            node=h({tag:"div"});
            break;
        case ARRAY_NODE:
            break;
        default:
    }
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests["void"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node=HT.node("input");
            break;
        case OBJECT_NODE:
            node=h({tag:"input"});
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null;
    }
    return [node,`<input id="id1"/>`];
};
QUNIT.tests["addStyle"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node=HT.node()
                .addStyle("color","green");
            break;
        case OBJECT_NODE:
            node=h({style:"color:green"});
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1" style="color:green;"></div>`];
};
QUNIT.tests["content_empty"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node=HT
                .node('div')
                .addChild("");
            break;
        case OBJECT_NODE:
            node=h({tag:"div", html:""});
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null;
    }
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests["content_string"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node = HT
                .node('div')
                .addChild("HyperTit");
            break;
        case OBJECT_NODE:
            node = h({tag: "div", html: "HyperTit"});
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null
    }
    return [node,`<div id="id1">HyperTit</div>`];
};
QUNIT.tests["content_array"]=function () {
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            node=HT
                .node("ul")
                .addChild(
                    HT
                        .node("li")
                        .addChild("item1")
                );
            break;
        case OBJECT_NODE:
            node=h({
                tag:"ul",
                html:[
                    {tag:"li",html:"item1"}
                ]
            });
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null;
    }
    return [node,`<ul id="id1"><li id="id2">item1</li></ul>`];
};

QUNIT.tests_callback["addStyle"]=function () {
    let node;
    METHODS.init();
    node=HT.node();
    METHODS.build(node,CALLBACK.handler);
    node.addStyle("background-color", "black");
    return ["id1","style","add", "background-color:black"];
};
QUNIT.tests_callback["event_postBuild"]=function () {
    let node;
    METHODS.init();
    node=HT.node();
    METHODS.build(node,CALLBACK.handler);
    node.addEvent("click", ()=>{});
    return ["id1","event","add", "click"];
};

QUNIT.run();
/* TEST TEMPLATE */
/*
    let node;
    METHODS.init();
    switch (currentContext) {
        case DIRECT_NODE:
            break;
        case OBJECT_NODE:
            break;
        case ARRAY_NODE:
            break;
        default:
            node=null;
    }
 */