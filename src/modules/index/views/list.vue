<template>
	<div>
		<div id="sheetBg" :style="background"></div>
		<section id="sheetInfo" class="flex">
			<div class="flex-1 tx-c">
				<img :src="imgUrl" class="sheetImg">
			</div>		
			<div class="flex-1">
				<div class="sheetName mb20 f16 c-white">{{info.name}}</div>
				<div class="creator flex flex-vertical-middle">
					<div><img :src="creator.avatarUrl" class="avatarUrl"></div>
					<span class="flex-1">{{creator.nickname}}</span>
				</div>
			</div>
		</section>
		<section id="songList">
			<div id="listTitle" class="f16 flex">
				<div class="songIndex"></div>
				<span class="itemBorder flex-1 titleText">播放列表（共{{songListLength}}首）</span>
			</div>
			<div v-for="(v,i) in songList" class="flex flex-vertical-middle songItem">
				<div class="songIndex f18">{{i+1}}</div>
				<div class="flex-1 itemBorder" @click="turnToPlaying(v,singer[i])">
					<div class="f18">{{v.name}}</div>
					<div class="c-6 singInfo">{{ singer[i] }}-{{v.al.name}}</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import { wy_musicAPI } from '../../../api/'
	import { getUrlParam } from '../../../utils/'

	export default {
		data(){
			return {
				info:'',
				creator:'',
				imgUrl:getUrlParam('url'),
				background:{
					backgroundImage:`url(${getUrlParam('url')})`
				},
				singer:[],
				songList:[],
				songListLength:''
			}
		},
		mounted(){
			this.getSheetInfoAndSongList();
		},
		methods:{
			getSheetInfoAndSongList(){
				let ops = {
					type:'playlist',
					id:getUrlParam('id'),
				}
				wy_musicAPI.get(ops)
					.then((res)=>{
						if (res.body.code===200) {
							this.info = res.body.playlist;
							this.creator = res.body.playlist.creator;
							this.songList = res.body.playlist.tracks;
							this.songListLength = res.body.playlist.tracks.length;

							for(let i in this.songList){
								let name = '';
								for(let index in this.songList[i].ar){
									name = name + this.songList[i].ar[index].name + '/';
									name = name.substring(0,name.length-1)
								}
								this.singer.push(name);
							}
						}
					})
			},
			turnToPlaying(v,singer){
				// if (v.al.picUrl) {
				// 	this.$store.commit('setAlbum', v.al.picUrl);
				// }
				let sing = {
					id:v.id,
					url:'',
					name:v.al.name,
					singer:singer,
					album:v.al.picUrl
				}
				this.$store.commit('getSong',sing);
				this.$store.commit('addToList',sing);
				/*考虑到可能会有手动刷新的操作 数据还是用url传递或者存储在localstorage*/
				window.location=`index.html#/playing?id=${v.id}&img=${v.al.picUrl}&name=${v.name}`;
			}
		}
	}
</script>

<style scoped>
	#sheetBg {background-size: cover;background-repeat: no-repeat;height: 4rem; filter: blur(50px);}
	#sheetInfo {padding: .4667rem;position: absolute;top: 0;width: 100%;box-sizing: border-box;}
	.sheetImg {width: 3rem;margin-right: .2667rem;}
	.avatarUrl {width: 1rem;border-radius: 100%;margin-right: .2667rem;}
	#songList {padding: .4667rem 0;}
	#listTitle {border-bottom: 1px solid #eee;}
	.songIndex {width: 1.5rem;text-align: center;}
	.songItem {padding: .3rem .5rem 0 0;line-height: .6667rem;}
	.itemBorder {border-bottom: 1px solid #eee;}
	.titleText {padding: .5rem 0;}
	.singInfo {padding: .0677rem 0;overflow: hidden;text-overflow:ellipsis;-webkit-line-clamp:1;    display: -webkit-box;-webkit-box-orient: vertical;}
</style>