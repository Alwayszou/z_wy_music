<template>
	<div>
		<div class="main">
			<section id="info" class="rel">
				{{sing.name}}
				<div class="line"></div>
			</section>
			<section id="playing" class="tx-c rel">
				<audio :src="sing.url"  @timeupdate="updateTime()" @ended="audioEnd()" id="audioPlay" ref="audio"></audio>
				<div class="hlin">
					<img :src="stickImg" id="stickImg" class="ma db rel" :class="{stickStart:play,stickPause:!play}">
				</div>		
				<div id="warp">
					<div class="mask rel"></div>
					<div><img :src="sing.album" id="cover" :class="{'rotate':play}"></div>
				</div>
				<div id="lrc" class="f16 c-white mt10">{{lrcText}}</div>
			</section>
			<section id="progress" class="rel flex flex-vertical-middle">
				<div class="playingTime c-white mr10">{{playingTime | time}}</div>
				<div class="pointer" :style="{'-webkit-transform':'translateX(' + percent +'rem)' }" ref="pointer"></div>
				<div class="axis flex-1" @click="changeTime($event)"></div>
				<div class="totalTime c-white ml10">{{totalTime | time}}</div>
			</section>
			<section id="control" class="flex tx-c">
				<div class="flex-1"><img src="/static/img/prev.png" class="h100" @click="playPrev()"></div>
				<div class="flex-1"><img :src="playorpause" class="h100" @click="playMusic()"></div>
				<div class="flex-1"><img src="/static/img/next.png" class="h100" @click="playNext()"></div>
			</section>
		</div>
		<div class="container_mask"></div>
		<div class="container" :style="background"></div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { getUrlParam } from '../../../utils/'
	import * as filters from '../../../filters/'
	import { songSheetList } from '../../../api/'

	export default {
		data(){
			return {
				imgUrl:getUrlParam('img'),
				name:getUrlParam('name'),
				play:true,
				percent:0,
				lrcText:' ',
				playingTime:0,
				totalTime:0,
				playorpause:'/static/img/pause.png',
				stickImg:'../../../static/img/stick_bg.png',
				coverImg:'',
				background:{
					backgroundImage:`url(${getUrlParam('img')})`
				},
			}
		},
		computed:{
			...mapGetters([
				'sing',
				'songList',
				'currentIndex'
			])
		},
		mounted(){	
			this.$store.dispatch('getSongInfo', getUrlParam('id'));	
			this.getSingTime();
			this.getLrc();			
		},
		methods:{
			...mapMutations([
		      'play',
		      'pause'
		    ]),
		    getSingTime(){
		    	let _this = this;
		    	this.$refs.audio.onloadedmetadata = function(){			
					_this.totalTime = _this.$refs.audio.duration;
				}
		    },
		    updateTime(){
		    	if (this.$refs.audio) {
		    		this.playingTime =  this.$refs.audio.currentTime;
		    		this.percent = 4.8*(this.$refs.audio.currentTime/this.$refs.audio.duration);
		    		for(let i in this.lrc){
		    			if (parseInt(this.$refs.audio.currentTime) == this.lrc[i].time) {
		    				this.lrcText = this.lrc[i].lrc||" ";
		    			}
		    		}   	
		    	}
		    },
		    changeTime(e){
		    	this.$refs.audio.currentTime = (parseInt(e.offsetX/7.5/48*this.$refs.audio.duration));
		    },
		    audioEnd(){
		    	this.play = false;
		    	this.playorpause = '/static/img/play.png';
		    	this.playNext();
		    },
		    playMusic(){
		    	if (this.play) {
		    		this.$refs.audio.pause();
		    		this.playorpause = '/static/img/play.png';
		    	}
		    	else{
		    		this.$refs.audio.play();
		    		this.playorpause = '/static/img/pause.png';
		    	}
		    	this.play = !this.play;
		    },
		    playPrev(){
		    	let _this = this;
		    	this.$store.commit('playPrev');
		    	if (this.songList.length>1) {
		    		this.$refs.audio.currentTime = 0;
		    		this.lrc=[];
		    		this.lrcText='';
		    		this.getLrc();
		    		this.play = false;
		    		this.$refs.audio.onloadedmetadata = function(){			
						_this.$refs.audio.play();
						_this.play = true;
					}
		    	}
		    },
		    playNext(){
		    	let _this = this;
		    	this.$store.commit('playNext');
		    	if (this.songList.length>1) {
		    		this.$refs.audio.currentTime = 0;
		    		this.lrc=[];
		    		this.lrcText='';
		    		this.getLrc();
		    		this.$refs.audio.onloadedmetadata = function(){			
						_this.$refs.audio.play();
						_this.play = true;
					}
		    	}
		    },
		    getLrc(){
		    	let lrcops = {
					type:'lyric',
					id:this.sing.id,
				}
				songSheetList.get(lrcops)
					.then((res)=>{
						if (res.body.code===200) {
							let lrc = res.body.lrc.lyric.split('\n'),lrcArr=[];
							for(let i in lrc){
								let lrcObj = {},lrcLin = lrc[i].replace("[","").replace("]","-").replace(":","-").split("-");
								lrcObj.time = lrcLin[0]*60 + parseInt(lrcLin[1]);
								lrcObj.lrc = lrcLin[2];
								lrcArr.push(lrcObj);
							}
							this.lrc = lrcArr;
						}
					})
		    }
		}
	}
</script>

<style scoped>
	.container{background-size: cover;background-repeat: no-repeat;filter: blur(50px);position: absolute;top:0;width: 100%;height: 100%;background-position: center;}
	#info {height: 1rem;color: #fff;text-align: center;line-height: 1rem;}
	.line {background: radial-gradient(#d3d3d3 -90%, transparent 100%);height: 2px;position: absolute;bottom:0;width: 100%;}
	.hlin {height: 3rem;}
	#stickImg {height:4rem;position: absolute;z-index: 99;left: 0;right: 0}
	#coverImg {top: -1rem;width: 7rem;left: 1.5rem;}
	#warp {height: 6.5rem;padding: 0 1.7rem;z-index: 99;}
	#cover {position: absolute;top: 4rem;left: 2.7rem;height: 4.5rem;border-radius: 50%;z-index: 2;}
	.main {position: relative;z-index: 99;}
	.mask {background: url('/static/img/coverall.png') no-repeat;height: 100%;background-size: cover;}
	.container_mask {position: absolute;top: 0;bottom: 0;left: 0;
    z-index: 3;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.8);opacity: .6;}
    #progress {padding: 1rem 1.5rem;}
    .axis {width: 100%;height: 2px;background-color: #bdbdbd;border-radius: 10px;}
    .pointer {height: .3rem;width: .3rem;background-color: #ce3d3e;border-radius: 50%;position: absolute;left:2.5rem;}

	.rotate {animation: rotating 10s linear .3s infinite}
	@keyframes rotating {
	    0% { transform: rotate(0deg);}
	    100% { transform: rotate(360deg);}
	}
	.stickStart {animation: stickStart 1s linear;transform-origin:0 0 0;animation-fill-mode: forwards;}
	@keyframes stickStart {
	    0% { transform: rotate(-15deg);}
	    100% { transform: rotate(0deg);}
	}
	.stickPause {animation: stickPause 1s linear;transform-origin:0 0 0;animation-fill-mode: forwards;}
	@keyframes stickPause {
	    0% { transform: rotate(0deg);}
	    100% { transform: rotate(-15deg);}
	}
</style>