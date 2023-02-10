import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [{
    path: '/',
    redirect: '/custom-properties-panel'
},
{
    path: '/custom-properties-panel',
    component: () =>
        import('./../components/custom-properties-panel')
},
{
    path: '/test',
    component: () =>
        import('./../components/test')
}]

export default new Router({
    mode: 'history',
    routes
})