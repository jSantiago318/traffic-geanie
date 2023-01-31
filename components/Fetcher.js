
const getPredictionsPerRoute = (route) => {


          try {
            fetch('http://143.198.119.7:8020/trips', {
              method: 'GET',
            })
              .then((response) => response.json())
              .then((toDoListArray) => {
                return toDoListArray.filter((item) => item.route_id === route)
              })
          } catch (error) {
            console.log(error)
          }
  
}
export default getPredictionsPerRoute