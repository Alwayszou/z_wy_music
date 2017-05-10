import Vue from 'vue'

Vue.filter('time',function(data){
	let time = parseInt(data);
	let minutes = parseInt(time/60);
	let second = time%60;
	if (minutes<10) {
		minutes = '0'+minutes;
	}
	if (second<10) {
		second = '0'+second;
	}
	return minutes+':'+second;
})