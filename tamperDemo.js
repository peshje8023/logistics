// ==UserScript==
// @name         TaoBao TianDan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://consign.work.cainiao.com/importation/consign/singleConsign.htm?tradeId=*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var lastTabSelectorStr = ".tabs > .tab:last-child";
    $(lastTabSelectorStr).click();

    var companySelectorStr = ".self-delivery > .ls-info > .deliver-info > .row:first-child > .col > .input-wrapper > input";

    var orderSelectorStr = ".self-delivery > .ls-info > .deliver-info > .exp-no > .col > .input-wrapper > input";

    var btn = ".btn-submit:first-child";


    var url1 = document.URL;
    var transIdStr = "tradeId=";
    var index = url1.indexOf(transIdStr);
    var taobaoOrder = url1.substring(index + transIdStr.length);

    var url = "http://localhost:5000/";
    var getData = {"key": taobaoOrder};

    function all(){
        $.ajax({
        url: url,
        data: getData,
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "success_jsonpCallback",
        jsonp: "callbackparam"
        }).done(response => {
            var retObj = JSON.parse(response);
            if(retObj["status"] == "success"){
                $(companySelectorStr).val(retObj["message"]["transCompany"]);
                $(orderSelectorStr).val(retObj["message"]["transOrder"]);
            }else{
                alert(retObj["message"]);
            }
         }).fail(() => {
             window.alert("服务没有开启，请开启")
         }).then(() => {
            $(companySelectorStr).focus();
            $(orderSelectorStr).focus();
            $(btn).focus();
            setTimeout(() => {
                $(btn).click();
            },1)
         })
    }

    if(document.hidden == false){
        all();
    }else{
       $(document).one("visibilitychange",() => {
           if(document.hidden == false){
               all();
           }
       });
    };

})();













// ==UserScript==
// @name         发货结束关闭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://consign.work.cainiao.com/importation/consign/singleConsignResult.htm?orderId=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(document.title=="发货结果"){
        open(location, '_self').close();
    }
    // Your code here...
})();