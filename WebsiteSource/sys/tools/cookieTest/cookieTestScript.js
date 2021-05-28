window.onload   =   function(){

    function    hiddenInput(){  //  隐藏文本框等
        document.getElementById("radioSlitText").style.visibility       =   "hidden";
        document.getElementById("radioOverallText").style.visibility    =   "hidden";
        for(let i = 0; i < 5; i++){  //  5个 input (text) 要显示
            document.getElementsByClassName("input")[i].style.visibility    =   "hidden";
        }
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
        document.getElementById("newCookie").disabled   =   false;
    }

    document.getElementById("readCookie").onclick   =   function(){
        let cookieString        =   document.cookie;
        if(cookieString === "")
            alert("没有 Cookie 可以查询！")
        else{
            let cookieName  =   prompt("需要查询的 Cookie 名字：", "");
            if(cookieName != null){
                let cookieStringList    =   cookieString.split("; ");
                let notFound    =   true;
                for(let i = 0; i < cookieStringList.length && notFound; i++){
                    let equalIndex  =   cookieStringList[i].indexOf("=");
                    if(equalIndex > 0){
                        let cookieSplitList =   [cookieStringList[i].substring(0, equalIndex), cookieStringList[i].substring(equalIndex + 1)];
                        if(cookieSplitList[0] === cookieName){
                            alert("Cookie “" + cookieName + "” 的值为：\n" + cookieSplitList[1]);
                            notFound    =   false;
                        }
                    }else if(cookieName === ""){
                        alert("Cookie “” 的值为：\n" + cookieStringList[i]);
                        notFound    =   false;
                    }
                }
                if(notFound)
                    alert("没找到名字为“" + cookieName + "”的 Cookie ！");
            }
        }
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
    }
    document.getElementById("readAllCookie").onclick     =   function(){
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
        let cookieString    =   document.cookie;
        let cookieStringList    =   cookieString.split("; ");
        let tbodyElement    =   document.getElementsByTagName("tbody")[0];
        let tbodyText       =   "";
        for(let i = 0; i < cookieStringList.length; i++){
            tbodyText   +=  "<tr>";
            let equalIndex  =   cookieStringList[i].indexOf("=");
            if(equalIndex > 0){
                let cookieSplitList =   [cookieStringList[i].substring(0, equalIndex), cookieStringList[i].substring(equalIndex + 1)];
                tbodyText   +=  "<td><input type = \"radio\" class = \"radioInput\" id = \"radio" + (i + 1) + "\"></td><td>" + cookieSplitList[0] + "</td><td>" + cookieSplitList[1] + "</td><td>?</td><td>?</td>";
            }else{
                tbodyText   +=  "<td><input type = \"radio\" class = \"radioInput\" id = \"radio" + (i + 1) + "\"></td><td></td><td>" + cookieStringList[i] + "</td><td>?</td><td>?</td>";
            }
            tbodyText   +=  "</tr>";
        }
        tbodyElement.innerHTML  =   tbodyText;
    }
    document.getElementById("newCookie").onclick     =   function(){
        this.disabled   =   true;
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
        let dateObj =   new Date();
        dateObj.setTime(dateObj.getTime() + 28800000);  //  加八小时
        dateObj.setTime(dateObj.getTime() + 10000);     //  加10秒
        document.getElementById("radioSlitText").style.visibility       =   "visible";
        document.getElementById("radioOverallText").style.visibility    =   "visible";
        document.getElementById("timeInput").value  =   dateObj.toISOString().substr(0, 19);
        for(let i = 0; i < 5; i++){ //  5个 input (text) 要显示
            document.getElementsByClassName("input")[i].style.visibility    =   "visible";
        }
        document.getElementById("storeCookie").disabled     =   false;
        document.getElementById("cancelCookie").disabled    =   false;
    }
    document.getElementById("cancelCookie").onclick =   function(){
        this.disabled   =   true;
        document.getElementById("storeCookie").disabled     =   true;
        hiddenInput();
    }
    document.getElementById("storeCookie").onclick  =   function(){
        this.disabled   =   true;
        document.getElementById("cancelCookie").disabled    =   true;
        let cookieString    =   document.getElementById("nameInput").value;
        cookieString    +=  " = " + document.getElementById("valueInput").value;
        let dateObj     =   new Date(document.getElementById("timeInput").value);
        cookieString    +=  "; expires = " + dateObj.toGMTString();
        if(document.getElementById("pathInput").value != "")
            cookieString    +=  "; path = " + document.getElementById("pathInput").value;
        document.cookie =   cookieString;
        if(document.getElementById("overallTextInput").value != ""){
            document.cookie =   document.getElementById("overallTextInput").value;
            document.getElementById("overallTextInput").value   =   "";
        }
        hiddenInput();
    }
    document.getElementById("close").onclick    =   function(){window.close();};
    // document.getElementById("overallTextInput").onfocus =   function(){};
    document.getElementById("overallCookieTextarea").value  =   document.cookie;
}
