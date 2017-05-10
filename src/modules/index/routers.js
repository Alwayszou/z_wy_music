const index = resolve => require(['./views/index.vue'], resolve)
const list = resolve => require(['./views/list.vue'], resolve)
const playing = resolve => require(['./views/playing.vue'], resolve)

export default [
	{
		path: '/',
        name:'',
        redirect: '/index'
	},
	{
        path: '/index',
        name:'个性推荐',
        component: index,
        meta: { keepAlive: true }
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