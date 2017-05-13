import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import { songSheetList } from '../api/'
Vue.use(Vuex)
Vue.use(VueResource)

const store = new Vuex.Store({
	state:{
		sing:{
			id:0,
			url:'',
			name:'',
			singer:'',
			album:''
		},
		songList: [],    // 播放列表
		currentIndex: 0, // 当前播放的歌曲位置
		playing:false,
		loading:true
	},
	getters:{
		sing: state => state.sing,
		playing: state => state.playing,
		loading: state => state.loading,
		songList: state => state.songList,
		currentIndex: state => state.currentIndex
	},
	mutations:{
		play (state) {
	      	state.playing = true;
	    },
	    pause (state) {
	      	state.playing = false;
	    },
	    setLocation (state, location) {
	      	state.sing.url = location;
	      	state.songList[state.currentIndex-1].url = location;
	    },
	    setAlbum (state, picUrl) {
	    	state.sing.album = picUrl;
	    },
	    setName (state,name) {
	    	state.sing.name = name;
	    },
	    getSong(state,song){
	    	state.sing = song;
	    },
	    addToList(state,song){
	    	let flag = false;
	    	state.songList.forEach(function(value,index){
	    		if (song.id === value.id) {
	    			flag = true;
	    			//state.currentIndex = index + 1;
	    		}
	    	})
	    	if (!flag) {
	    		state.songList.push(song);
	    		state.currentIndex = state.songList.length;
	    	}
	    },
	    playNext(state){
	    	if (state.songList.length==1) {
	    		window.alert('列表就一首歌啦');
	    		return;
	    	}
	    	state.currentIndex++;
	    	if (state.currentIndex>state.songList.length) {
	    		state.currentIndex = 1;
	    	}	    	
	    	state.sing = state.songList[state.currentIndex-1];
	    },
	    playPrev(state){
	    	if (state.songList.length==1) {
	    		window.alert('列表就一首歌啦');
	    		return;
	    	}
	    	state.currentIndex--;
	    	if (state.currentIndex<1) {
	    		state.currentIndex = state.songList.length;
	    	}
	    	state.sing = state.songList[state.currentIndex-1];
	    }
	},
	actions:{
		getSongInfo({commit,state},id){
			let ops = {
				type:'url',
				id:id,
			}
			async function getsongUrl(){
				let symbol = await songSheetList.get(ops)
										.then((res)=>{
											if (res.body.code===200) {
												let location = res.body.data[0].url;
												if (!location) {
													window.alert('无法获取歌曲地址');
												}
												commit('setLocation',location);
											}
										})
			}
			getsongUrl().then(function(){
				document.getElementById('audioPlay').play();				
			})		
		}
	}
})

export default store