export const  getUrlParam=function(key, url){
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i"), url = url ? (url.split("?")[1]||'') : window.location.href.split("?")[1], r;
    if (url){
        r = url.match(reg);
    }
    return r ? decodeURIComponent(r[2]) : "";
}