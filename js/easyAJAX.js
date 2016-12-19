/**
 * Created by Administrator on 2016/3/16.
 */
var edison = {
    ajax: function(params) {
        /*验证*/
        params.type = params.type == undefined ? "GET" : params.type.toLocaleUpperCase();
        params.async = params.async == undefined ? true : params.async;
        /*创建对象*/
        var xhr = null;
        if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
        else xhr = new ActiveXObject("Microsoft.XMLHTTP");
        /*打开连接*/
        xhr.open(params.type, params.url, params.async);
        /*注册事件监听器*/
        xhr.onreadystatechange = function() {
            if ((xhr.status == 200 || xhr.status == 304) && xhr.readyState == 4) {
                params.success(JSON.parse(xhr.responseText));
            }
        }
        /*发送请求*/
        xhr.send(null);
    }
}