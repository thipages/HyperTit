let QUNIT={};
let METHODS = {};
let HT=window.ht;
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
    console.log("rrr");
    CALLBACK.result=new CALLBACK(node, type, action, data);
};
QUNIT.tests = {};
QUNIT.tests_callback = {};
METHODS.init=function(){
    HT.resetUid();
    CALLBACK.result=null;
};
METHODS.findFirstDiffPos=function (a, b) {
    let longerLength = Math.max(a.length, b.length);
    for (let i = 0; i < longerLength; i++) {
        if (a[i] !== b[i]) return i;
    }
    return -1;
};
QUNIT.run = function() {
    for (let prop in QUNIT.tests) {
        if ( QUNIT.tests.hasOwnProperty(prop)) {
            (function (p) {
                let test,actual, isOk, expected;
                test=QUNIT.tests[p]();
                expected=test[1];
                isOk = (expected === (actual=HT.getNodeHtml(test[0])));
                QUnit.test(prop, function (assert) {
                    if (isOk) {
                        assert.ok(true,"Passed : "+actual);
                    } else {
                        assert.ok(true, "Actual : "+actual);
                        assert.ok(true, "Expect : "+expected);
                        assert.ok(false,"Failed : "+actual.substr(0,METHODS.findFirstDiffPos(actual,expected)));
                    }
                });
            }(prop));
        }
    }
    for (let prop in QUNIT.tests_callback) {
        if ( QUNIT.tests_callback.hasOwnProperty(prop)) {
            (function (p) {
                let actual, expected;
                expected=QUNIT.tests_callback[p]();
                actual=CALLBACK.result.format2nodeId();
                QUnit.test(prop, function (assert) {
                    assert.deepEqual(actual,expected);
                });
            }(prop));
        }
    }
};
QUNIT.tests["empty_node"]=function () {
    METHODS.init();
    let node=HT.addNode();
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests["nonVoid_node"]=function () {
    METHODS.init();
    let node=HT.addNode("ul");
    return [node,`<ul id="id1"></ul>`];
};
QUNIT.tests["void_node"]=function () {
    METHODS.init();
    let node=HT.addNode("input");
    return [node,`<input id="id1"/>`];
};
QUNIT.tests["node_addStyle"]=function () {
    METHODS.init();
    let node=HT
        .addNode()
        .addStyle("color","green");
    return [node,`<div id="id1" style="color:green;"></div>`];
};
QUNIT.tests_callback["callback_void_node_addStyle"]=function () {
    METHODS.init();
    HT.callback=CALLBACK.handler;
    let child=HT
        .addNode()
        .addStyle("color","green");
    let node=HT
        .addNode();
    HT.build(node, "#HT_test");
    node.addStyle("background-color", "black");
    return ["id2","style","add", "background-color:black"];
};
QUNIT.run();