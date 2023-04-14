const route =[
{id:'RR102',name:'Ruta Rural 102',cat:'Ruta Rural',color:'#fe3004', lat:'18.195225', lon:'-67.154746', latD:'0.0422', lonD:'0.0422' },
{id:'RR105',name:'Ruta Rural 105',cat:'Ruta Rural',color:'#007cff', lat:'18.199726338961813', lon:'-67.10162794687162', latD:'0.0622', lonD:'0.0622'},
{id:'RR106',name:'Ruta Rural 106',cat:'Ruta Rural',color:'#39a706', lat:'18.209543999999976', lon:'-67.101997', latD:'0.1022', lonD:'0.1022'},
{id:'RR108',name:'Ruta Rural 108',cat:'Ruta Rural',color:'#a9a2f5', lat:'18.24747756262559', lon:'-67.11452631710513', latD:'0.070', lonD:'0.070'},
{id:'RR348',name:'Ruta Rural 348',cat:'Ruta Rural',color:'#ff7800', lat:'18.172608189051786', lon:'-67.12510359906561', latD:'0.0622', lonD:'0.0622'},
{id:'RR349',name:'Ruta Rural 349',cat:'Ruta Rural',color:'#fc06da', lat:'18.189579999999992', lon:'-67.120728', latD:'0.0722', lonD:'0.0721'}
]

export function getRoutes() {
    return route
    } 
export function getRoutesCat(){
    return route.map(m => m.cat);
}

export function getRouteById(id) {
    return route.find(m => m.id === id);
    }
export function getRouteByRoute(route) {
    return route.find(m => m.route === route);
    }
export function getRouteByCat(cat) {
    return route.find(m => m.cat === cat);
    }
    
export function getRouteColor(id) {
    for (let index = 0; index < route.length; index++) {
        if (   id.toString().includes(route[index].id)) {
            return route[index].color
        }
    }
    return '#000000'
    }