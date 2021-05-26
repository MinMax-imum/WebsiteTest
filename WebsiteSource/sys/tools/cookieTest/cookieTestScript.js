window.onload   =   function(){
    document.getElementById("readCookie").onclick     =   function(){
        alert("读取", document.cookie);
    }
    document.getElementById("storeCookie").onclick    =   function(){
        let dateObj =   new Date();
        dateObj.setTime(dateObj.getTime() + 5000);  //  Cookie 5秒后过期
        console.log("开始", document.cookie);
        console.log("date", dateObj.toGMTString(), dateObj.toISOString());
        document.cookie =   "cna = 132; expires = " + dateObj.toGMTString() + "; path = /";
        console.log("读取", document.cookie);
    }
    document.getElementById("close").onclick    =   function(){window.close();};
}
