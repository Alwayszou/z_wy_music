import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.interceptors.push((request, next) =>{
	next((response)=>{
		if (response.status==200) {
			let data;
			try {
				data = JSON.parse(response.body);
			} catch(e) {
				data = response.body;
			}
			if (data.code!=200) {
				alert('请求错误');
			}
		}
	})
})
		

export const songSheetList = Vue.resource('http://musicapi.duapp.com/api.php')
export const wy_musicAPI = Vue.resource('https://api.imjad.cn/cloudmusic/')