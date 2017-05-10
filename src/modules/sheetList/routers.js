const list = resolve => require(['./views/list.vue'], resolve)
const playing = resolve => require(['./views/playing.vue'], resolve)

export default [
	{
		path: '/',
        name:'',
        redirect: '/list'
	},
	{
        path: '/list',
        name:'歌单',
        component: list
    },
    {
        path: '/playing',
        name:'正在播放',
        component: playing
    }
]