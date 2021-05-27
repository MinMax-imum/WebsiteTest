window.onload   =   function(){
    document.getElementById("overallCookieTextarea").value  =   document.cookie;
    document.getElementById("readCookie").onclick   =   function(){
        let cookieName  =   prompt("需要查询的 Cookie 名字：", "");
        if(cookieName === "")
            alert("无效输入！");
        else if(cookieName){
            let cookiePath  =   prompt("需要查询的 Cookie 的 path\n默认为“/”：", "/");
            if(cookiePath === "")
                cookiePath  =   "/";
            if(cookiePath){
                let cookieString    =   document.cookie;
                let cookieNameIndex =   cookieString.indexOf(cookieName);
                if(cookieNameIndex < 0)
                    alert("无此 Cookie ！");
                else{
                    cookieString        =   cookieString.substring(cookieNameIndex);
                    let semicolonIndex  =   cookieString.indexOf("; ");
                    if(semicolonIndex < 0)
                        var cookieStringSplitList   =   cookieString.split("=");
                    else
                        var cookieStringSplitList   =   cookieString.substring(0, semicolonIndex).split("=");
                    alert("Cookie " + cookieStringSplitList[0] + " 的值为：\n" + cookieStringSplitList[1]);
                }
            }
        }
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
    }
    document.getElementById("readAllCookie").onclick     =   function(){
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
        // let cookieString    =   document.cookie;
        // let cookieSplitList  =   cookieString.split("; ");
        // let tableCookieList     =   document.getElementById("cookieList");
        // let tableCookieListText =   "";
        // tableCookieList.innerHTML   =   tableCookieListText;
    }
    document.getElementById("newCookie").onclick     =   function(){
        document.getElementById("overallCookieTextarea").value          =   document.cookie;
        document.getElementById("radioSlitText").style.visibility       =   "visible";
        document.getElementById("radioOverallText").style.visibility    =   "visible";
        for(let i = 0; i < 5; i++){  //  5个 input (text) 要显示
            document.getElementsByClassName("input")[i].style.visibility    =   "visible";
        }
        document.getElementById("storeCookie").disabled =   false;
    }
    document.getElementById("storeCookie").onclick    =   function(){

        let dateObj =   new Date();
        dateObj.setTime(dateObj.getTime() + 20000); //  Cookie 20秒后过期
        console.log("开始", document.cookie);
        console.log("date", dateObj.toGMTString(), dateObj.toISOString());
        document.cookie =   "cna = 8719; expires = " + dateObj.toGMTString() + "; path = /";
        console.log("读取", document.cookie);

        document.getElementById("radioSlitText").style.visibility       =   "hidden";
        document.getElementById("radioOverallText").style.visibility    =   "hidden";
        for(let i = 0; i < 5; i++){ //  5个 input (text) 要显示
            document.getElementsByClassName("input")[i].style.visibility    =   "hidden";
        }
        this.disabled   =   true;
        document.getElementById("overallCookieTextarea").value  =   document.cookie;
    }
    document.getElementById("close").onclick    =   function(){window.close();};
}
