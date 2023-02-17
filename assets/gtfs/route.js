
const route = [
{id: 'R1U', route: 'Ruta 1 Urbana', cat:'Ruta Urbana',color:'#06f8fc'},
{id: 'R2U', route: 'Ruta 2 Urbana', cat:'Ruta Urbana',color:'#b6bb00'},
{id: 'R3U', route: 'Ruta 3 Urbana', cat:'Ruta Urbana',color:'#9b9b9b'},
{id: 'RMU', route: 'Ruta el  Mani', cat:'Ruta Urbana',color:'#7b35ff'},
{id: 'R102R', route: 'Ruta Rural 102', cat:'Ruta Rural',color:'#fe3004'},
{id: 'R105R', route: 'Ruta Rural 105', cat:'Ruta Rural',color:'#007cff'},
{id: 'R106R', route: 'Ruta Rural 106', cat:'Ruta Rural',color:'#39a706'},
{id: 'R108R', route: 'Ruta Rural 108', cat:'Ruta Rural',color:'#a9a2f5'},
{id: 'R348R', route: 'Ruta Rural 348', cat:'Ruta Rural',color:'#ff7800'},
{id: 'R349R', route: 'Ruta Rural 349', cat:'Ruta Rural',color:'#fc06da'},
{id: 'RUMP', route: 'Ruta Colegio Palacio', cat:'Ruta del Colegio',color:'#c5936d'},
{id: 'RUMI', route: 'Ruta Colegio Interna', cat:'Ruta del Colegio',color:'#9ffc70'},
{id: 'RUMT', route: 'Ruta Colegio Terras', cat:'Ruta del Colegio',color:'#9ad6f8'},
{id: 'RUMZ', route: 'Ruta Colegio Zoologico', cat:'Ruta del Colegio',color:'#fda9d1'}

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