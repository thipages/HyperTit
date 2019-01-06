let QUNIT={};
let METHODS = {};
let HT=window.ht;
QUNIT.tests = {};
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
};
QUNIT.tests["empty_node"]=function () {
    HT.resetUid();
    let node=HT.addNode();
    return [node,`<div id="id1"></div>`];
};
QUNIT.tests["nonVoid_node"]=function () {
    HT.resetUid();
    let node=HT.addNode("ul");
    return [node,`<ul id="id1"></ul>`];
};
QUNIT.tests["void_node"]=function () {
    HT.resetUid();
    let node=HT.addNode("input");
    return [node,`<input id="id1"/>`];
};
QUNIT.run();