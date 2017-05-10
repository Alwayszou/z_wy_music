<template>	
	<div>
		<!-- 头部 -->
		<section class="topFixed">
			<div id="search_title" class="wy_b_red">
				<div class="flex flex-vertical-middle title_warp">
					<i class="iconfont f26 c-white">&#xe64f;</i>
					<div class="flex-1 index_search_warp flex">
						<i class="iconfont f16" id="search_icon">&#xe600;</i>
						<input type="search" id="index_search" placeholder="搜索音乐、歌词、电台" class="f12" @click="turnToSearch()" @input="search()" v-model="key">
					</div>
					<i class="iconfont f26 c-white" v-show="show">&#xe6ed;</i>
					<span v-show="!show" class="f22 c-white"@click="searchCancel">取消</span>
				</div>
			</div>
			<div id="tabs" v-show="show">
				<div class="flex tabs_warp">
					<div v-for="(v,i) in tabs" class="flex-1 tx-c">
						<a class="tabs_item" :class="{item_active:i==tabs_active}" @click="tabs_active=i" :style="tabsChange">{{v}}</a>	
					</div>
					<span class="tabs_active_border" :style="tabsChange"></span>
				</div>
			</div>
		</section>
		<section id="search" v-show="!show">
			<div v-for="(v,i) in searchList" class="flex flex-vertical-middle songItem">
				<div class="songIndex f18">{{i+1}}</div>
				<div class="flex-1 itemBorder" @click="turnToPlaying(v,singer[i])">
					<div class="f18">{{v.name}}</div>
					<div class="c-6 singInfo">{{ singer[i] }}-{{v.al.name}}</div>
				</div>
			</div>
		</section>
		<div v-show="show">			
			<!-- 个性推荐 -->
			<section id="recommd" class="mtf">
				<loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="top">
				    <div slot="top" class="mint-loadmore-top">
					    <div v-show="topStatus === 'drop'" id="toploadingText">个性推荐</div>
					</div>
					<div id="carousel">
						<swipe class="my-swipe" :auto="4000">
						    <swipe-item class="slide1">
						 		<img src="http://p4.music.126.net/rBwLOBIBrPgUCSNFKQDQOA==/19032546276883246.jpg" class="w100">
						  	</swipe-item>
						  	<swipe-item class="slide2">
						  		<img src="http://p3.music.126.net/KE__Tj0gIz5ZWbZVDNhp9w==/19104014532705101.jpg" class="w100">
						  	</swipe-item>
						</swipe>
					</div>
					<!-- <div id="modules" class="flex">
						<div class="flex-1 tx-c">
							<i class="iconfont f40 modules_icon">&#xe732;</i>
						</div>
						<div class="flex-1 tx-c">
							<i class="iconfont f40 modules_icon">&#xe609;</i>
						</div>
						<div class="flex-1 tx-c">
							<i class="iconfont f40 modules_icon">&#xe67b;</i>
						</div>	
					</div> -->
					<div id="song_sheet">
						<div id="modules_title" class="flex">
							<div>推荐歌单</div>
							<div class="flex-1 more">更多></div>
						</div>
						<div id="sheet" class="overh">
							<div class="single_sheet" v-for="(v,i) in sheetList" @click="turnToSheet(v.id,v.coverImgUrl)">
								<div class="playCount">{{v.playCount | countDisplay}}</div>
								<img :src="v.coverImgUrl">
								<span class="sheet_name">{{v.name}}</span>
							</div>
						</div>
					</div>
			   </loadmore>
			</section>
		</div>
	</div>
</template>

<script>
	require('vue-swipe/dist/vue-swipe.css');
	import { Swipe, SwipeItem } from 'vue-swipe';
	import { Loadmore } from 'mint-ui';
	import { songSheetList , wy_musicAPI } from '../api/'

	export default {
		components:{ Swipe, SwipeItem, Loadmore },
		data(){
			return {
				sheetList:[],
				topStatus: '',
				tabs:['个性推荐','歌单','主播电台','排行榜'],
				tabs_active:'0',
				borWidth:0,
				show:true,
				singer:[],
				searchList:[],
				key:''
			}
		},
		computed:{
			tabsChange(){
				return {
					'width': this.borWidth,
	  				'transform': "translateX(" + 100*this.tabs_active + "%)",
	  				'-webkit-transform': "-webkit-translateX(" + 100*this.tabs_active + "%)"
				}
			}
		},
		filters:{
			countDisplay(data){
				if (data<10000) {
					return data;
				}
				else {
					data = parseInt(data/10000)
				}
				return data+'万';
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				this.getSongSheetList();
				this.borWidth = 100/this.tabs.length + "%";
			},
			handleTopChange(status){
				this.topStatus = status;
			},
			loadTop(id){
				this.$refs.top.onTopLoaded(id);
			},
			getSongSheetList(){
				let ops = {
					type:'topPlayList',
					limit:'6'			
				}
				songSheetList.get(ops)
					.then((res)=>{
						if (res.body.code===200) {
							this.sheetList = res.body.playlists;
						}
					})
			},
			turnToSheet(id,imgUrl){
				window.location = `index.html#/list?id=${id}&url=${imgUrl}`
			},
			turnToSearch(){
				this.show = false;
			},
			search(){
				if (!this.key||this.key==" ") return;
				let ops = {
					type:'search',
					s:this.key
				}
				wy_musicAPI.get(ops)
					.then((res)=>{
						if (res.body.code===200) {
							this.searchList = res.body.result.songs;
							for(let i in this.searchList){
								let name = '';
								for(let index in this.searchList[i].ar){
									name = name + this.searchList[i].ar[index].name + '/';
									name = name.substring(0,name.length-1)
								}
								this.singer.push(name);
							}
						}
					})
			},
			turnToPlaying(v,singer){
				let sing = {
					id:v.id,
					url:'',
					name:v.al.name,
					singer:singer,
					album:v.al.picUrl
				}
				this.$store.commit('getSong',sing);
				this.$store.commit('addToList',sing);
				window.location=`index.html#/playing?id=${v.id}&img=${v.al.picUrl}&name=${v.name}`;
			},
			searchCancel(){
				this.show = true;
				this.key = '';
			}
		}
	}
</script>

<style scoped>
	.mtf {margin-top: 2.36rem;}
	#carousel {margin-top: 0.08rem;}
	.modules_icon {color: #d43c33;border:1px solid #d43c33; padding: .2rem;border-radius: 100%;}
	#modules_title {margin: .4667rem 0 .2667rem 0;padding-left: .2667rem;border-left: 5px solid #d43c33;}
	.more {text-align: right;padding-right: 1%;color: #999;}
	.playCount {position: absolute;width: 100%;text-align: right;background-color: rgba(0, 0, 0, 0.2);color: #fff;}
	.single_sheet {width: 32%;margin-right: 1%;box-sizing: border-box;display: inline-block;position: relative;}
	.single_sheet img {width: 100%;}
	.sheet_name {overflow: hidden;text-overflow:ellipsis;-webkit-line-clamp:2;    display: -webkit-box;-webkit-box-orient: vertical;}
	.my-swipe {height: 4rem;color: #fff;font-size: 30px;text-align: center;}
    #toploadingText {text-align: center;margin-bottom: .2667rem;}
    #index_search {border: none;width: 100%;border-radius: .4667rem;height: 1rem;padding-left: .8667rem;}
	.index_search_warp {padding: .1333rem .6667rem;}
	#search_icon {position: absolute;padding:0.2867rem .1333rem;}
	#tabs {background-color: #fff;}
	.title_warp {padding: .1333rem .6667rem;}
	.tabs_warp {padding:.1333rem 0;position: relative;}
	.item_active {color: #d43c33;}
	.tabs_active_border{position: absolute;bottom:-2px;left:0;transition: transform 300ms;-webkit-transition: -webkit-transform 300ms;}
	.tabs_active_border:after{content:"";display:block;width:60%;height:2px;margin:0 auto;background-color: #DD2727;}
	.topFixed {position: fixed;top: 0;left: 0;z-index: 99;width: 100%;}
    #search {margin-top: 1.5rem;}
	.songIndex {width: 1.5rem;text-align: center;}
	.songItem {padding: .3rem .5rem 0 0;line-height: .6667rem;}
	.itemBorder {border-bottom: 1px solid #eee;}
	.singInfo {padding: .0677rem 0;overflow: hidden;text-overflow:ellipsis;-webkit-line-clamp:1;    display: -webkit-box;-webkit-box-orient: vertical;}
</style>