# 服务端

import socket
from winsound   import Beep         # 声音提示
from os.path    import exists

host    =   "192.168.0.42"
port    =   80

print("\n" + "=" * 80 + "\n")
print("服务器开启……" , end = " " * 4)
Beep(660, 500)
socketObj   =   socket.socket(socket.AF_INET, socket.SOCK_STREAM)   # socket对象
socketObj.bind((host, port))    # 绑定端口
print("服务器工作在：" + host + ":" + str(port) + "\n")
socketObj.listen(3) # 设置最大等待连接数

while True:
    print("等待客户端连接……" + "\n")
    clientSocket, addr  =   socketObj.accept()  # 接受客户端连接
    print("连接地址：" + addr[0] + ":" + str(addr[1]))
    Beep(880, 150)

    # 接收数据
    # 未来分多次接受数据，以避免数据接收不完整(需要按b"\r\n"切片后判断Content-Length)
    clientSocket.setblocking(False) # 相当于settimeout(0.0)
    try:
        recvMsg     =   clientSocket.recv(4096)
        recvStrSub  =   recvMsg.decode("UTF-8")  # 当内容非纯文本时不要这样解码
        print("接收了 " + len(recvMsg) + " 字节数据……")
    except socket.error:
        Beep(1100, 1000)
        print("连接超时：    Time Out")
        recvStrSub =   ""
    clientSocket.setblocking(True)      # 相当于settimeout(None)

    # 识别处理收到的数据
    if recvStr == "":   # 因超时而收到的空数据处理
        recvStr =   "NONE / /\r\n\r\n"

    print("正在识别处理收到的数据……")
    recvStrSplit    =   recvStr.split("\r\n\r\n", 1)    # 分离请求行请求头部和请求数据
    recvHeaderLine  =   recvStrSplit[0].splitlines()    # 分离出请求行和请求头部的各行
    requestLine     =   recvHeaderLine[0].split(" ")    # 分离出请求行的各部分
    recvRequest     =   {
        "requestMethod" :requestLine[0], 
        "requestURL"    :requestLine[1], 
        "requestVersion":requestLine[2]
    }
    requestHeader   =   {}
    for headLine in recvHeaderLine[1:]:     # 处理请求头部各行
        if headLine.find(":") > -1:
            headLineSplit       =   headLine.split(":")         # 冒号分隔信息
            headLineSplit[1]    =   headLineSplit[1].lstrip()   # 去掉空格
            requestHeader[headLineSplit[0]]     =   headLineSplit[1]    # 都不进行进一步分割
    requestDataStr  =   recvStrSplit[1]         # 请求数据(未来改为这一部分在接收时分离出来)
    print("整理后的请求行内容：")
    for i in recvRequest:
        print(" " * 4 + i + ":" + recvRequest[i])
    print()

    # 发送数据
    statusDescriptionDictionary  =  {
        200:"OK",               # 200   请求成功
        404:"Not Found",        # 404   服务器无法根据客户端的请求找到资源
        406:"Not Acceptable",   # 406   服务器无法根据客户端请求的内容特性完成请求
        408:"Request Time-out"  # 408   服务器等待客户端发送的请求时间过长而超时
    }
    statusTextDictionary  =  {
        "OK":"请求成功。",                                              # 200    
        "Not Found":"服务器无法根据客户端的请求找到资源。",                # 404    
        "Not Acceptable":"服务器无法根据客户端请求的内容特性完成请求。",    # 406    
        "Request Time-out":"服务器等待客户端发送的请求时间过长而超时。"     # 408    
    }
    contentTypeDictionary   =   {
        ".html":"text/html;Charset=UTF-8",
        ".css":"text/css;Charset=UTF-8",
        ".js":"application/x-javascript;Charset=UTF-8",
        ".png":"image/png",
        ".json":"application/json",
        ".txt":"txt/plainCharset=UTF-8"
    }
    filePath    =   recvRequest["requestURL"][1:].replace("/", "\\")
    if recvRequest["requestMethod"] == "GET":
        print("正在处理GET请求……")
        if recvRequest["requestURL"] == "/":
            filePath    =   "index.html"    # 请求主页
        print("文件路径：" + filePath)
        if exists(filePath):   # 文件存在则准备发送文件
            statusCode  =   200     # 请求成功
        else:
            print("请求文件不存在！", isLogStartBlank = False)
            statusCode  =   404     # 文件不存在
    elif recvRequest["requestMethod"] == "POST":
        print("正在处理POST请求……")
        # if recvRequest["requestURL"]需要满足的条件: # 在此处分析请求的文件有没有权限进行处理
        print("文件路径：" + filePath)
        if exists(filePath):   # 文件存在则打开文件
            statusCode  =   200     # 请求成功
            with open(filePath, "wb") as saveFile:
                saveFile.write(requestDataStr.encode("UTF-8"))
                saveFile.close()
            print("文件保存完成……")
        else:
            print("请求文件不存在！")
            statusCode  =   404     # 文件不存在则发回404错误，未来考虑创建文件
    elif recvRequest["requestMethod"] == "NONE":
        print("无法处理请求！")
        statusCode  =   408     # 接收请求超时
    else:
        print("无法处理请求！")
        statusCode  =   406     # 无法完成请求
    print("\n生成发回客户端的内容……")
    statusDescription   =   statusDescriptionDictionary[statusCode]
    if statusCode == 200:
        contentType =   contentTypeDictionary["." + filePath.split(".")[-1]]
        with open(filePath, "rb") as sendFile:
            sendBin =   sendFile.read() # 过大文件不要用这种形式
            sendFile.close()
    else:   # 根据模板生成错误页
        filePath    =   "html\\error.html\\" + str(statusCode)
        contentType =   contentTypeDictionary[".html"]
        with open("html\\error.html", "rb") as sendFile:
            sendTxt =   sendFile.read().decode("UTF-8") # 过大文件不要用这种形式
            sendFile.close()
        sendTxt =   sendTxt.replace("E_errCode_E", str(statusCode))
        sendTxt =   sendTxt.replace("E_errDescription_E", statusDescription)
        sendTxt =   sendTxt.replace("E_errText_E", statusTextDictionary[statusDescription])
        sendBin =   sendTxt.encode("UTF-8")
    contentLength   =   len(sendBin)    # 获取文件长度并添加进头信息

    sendMsg =   ("HTTP/1.1 " + str(statusCode) + " " + statusDescription + "\r\n").encode("UTF-8")
    sendMsg +=  ("Content-Type: " + contentType + "\r\n").encode("UTF-8")
    sendMsg +=   ("Content-Length: " + str(contentLength) + "\r\n").encode("UTF-8")
    sendMsg +=  "\r\n".encode("UTF-8")
    print("发回客户端的信息：\n" + sendMsg.decode("UTF-8").replace("\r\n", "\n"), end = "")
    sendMsg +=  sendBin
    if statusCode == 200:
        print("后接文件：" + filePath)
    else:
        print("后接 " + str(statusCode) + " 错误信息页面……")
    clientSocket.sendall(sendMsg)
    print("\n发送完毕，", end = "")
    clientSocket.close()
    print("关闭本次会话\n")
    print(" " * 12 + "#*" * 27 + "#" + "\n")
    Beep(440, 150)
