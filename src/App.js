import React,{ useState, useEffect } from 'react'
import './App.css';
import Weather from './Components/Weather';

function App() {
  const [coordinates, setCoordinates] = useState({latitude:null, longitude: null});
  const [CityData, setCityData] = useState(null)
  const [List, setListData] = useState(null)

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((res, err) => {
      if(err) return alert('somethin went wrong')
      const { latitude, longitude } = res.coords
      
      setCoordinates({
        latitude: latitude,
        longitude: longitude
      })
    });
  } else {
    alert('not supported by browser')
  }
},[])

useEffect(() => {
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=Sikar&appid=41a86039d5907457d0ab2411c82de2bc`)
  .then(res => res.json())
  .then(data => {
      // console.log(data)
      setCityData(data.city);
      setListData(data.list)
  })
  .catch(err => alert(err.message))
},[])


  return (
    <div className="App">
      <Weather city={CityData} Weather={List} />  
    </div>
  );
}


export default App;
