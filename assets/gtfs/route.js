const route =[
{id:'RR102',name:'Ruta Rural 102',cat:'Ruta Rural',color:'#fe3004'},
{id:'RR105',name:'Ruta Rural 105',cat:'Ruta Rural',color:'#007cff'},
{id:'RR106',name:'Ruta Rural 106',cat:'Ruta Rural',color:'#39a706'},
{id:'RR108',name:'Ruta Rural 108',cat:'Ruta Rural',color:'#a9a2f5'},
{id:'RR348',name:'Ruta Rural 348',cat:'Ruta Rural',color:'#ff7800'},
{id:'RR349',name:'Ruta Rural 349',cat:'Ruta Rural',color:'#fc06da'}
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