import React from 'react'
import './css/weather.css'
import { Line, Pie, Bubble,Doughnut, Polar,Radar,Scatter } from 'react-chartjs-2';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";


export default function Weather(props) {
    const {Weather, city} = props;
    const [WeatherData, setWeatherData] = React.useState(null);
    const [ChartData, setChartData] = React.useState({name: 'Wind', data: [], unit: null});
    const [ActiveBox, setActiveBox] = React.useState(0);
    const [temp, setTemp] = React.useState({value: null, unit: 'C'});
    console.log('props', props)
    
    React.useEffect(() => {
        Weather && setWeatherData(Weather)
        Weather && WeatherData && setTemp(() => {
            document.getElementById('C').classList.add('active')
            document.getElementById('0').classList.add('active_box')
            return {
                ...temp,
                value: (Weather[ActiveBox].main.temp-273.15)
            }
        })

        Weather && WeatherData && setChartData(() => {
            (document.getElementById('weather_chart_options').childNodes)[0].classList.add('active_chart_options')
            return {
                ...ChartData,
                name: 'Wind',
                data: [...WeatherData?.map((w,i) => (w.main.temp-273.15).toFixed(2)).slice(0,10)],
                unit: '°C'
            }
        })

    },[Weather, WeatherData])

    const data = {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: WeatherData?.map((w,i) => {if(i < 10) { return new Date(w.dt_txt).toLocaleTimeString()}}).slice(0,10),
        datasets: [{
            label: `${ChartData.name} Graph (${ChartData.unit})`,
            data: ChartData.data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }

    const getWeekDay = (day) => {
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[day];
    }

    const ChangeTempUnit = u => {
        // console.log([u, temp])

        if(temp.unit != u) {
            var uc = document.getElementById('C')
            var uf = document.getElementById('F')
            uc.classList.toggle('active')
            uf.classList.toggle('active')
            setTemp(() => {
                var val = temp.value;
                if(u == 'F') {
                    val = ((val * (9/5)) + 32) 
                }
                else {
                    val = ((val - 32) * (5/9))
                }
                return {
                    ...temp,
                    value: val,
                    unit: u
                }
            })
        }
    }

    const handleWeatherBox = i => {
        document.getElementById(ActiveBox).classList.toggle('active_box')
        document.getElementById(i).classList.toggle('active_box')
        setActiveBox(i)
        document.getElementById('C').classList.add('active')
        document.getElementById('F').classList.remove('active')
        setTemp(() => {
            return {
                ...temp,
                value: (Weather[i].main.temp-273.15),
                unit: 'C'
            }
        })

    }

    const toggleChartOption = option => {
        var d = document.getElementById('weather_chart_options').childNodes;
        document.getElementsByClassName('active_chart_options')[0] && document.getElementsByClassName('active_chart_options')[0].classList.remove('active_chart_options')
        // console.log(document.getElementsByClassName('active_chart_options'))
        let name='';
        let data = [];
        let unit = '';
       switch (option) {
            case 'T':
               d[0].classList.add('active_chart_options')
               name = 'Temperature';
               data=[...WeatherData?.map((w,i) => (w.main.temp-273.15).toFixed(2)).slice(0,10)];
               unit='°C';
               break;
            case 'W':
                d[1].classList.add('active_chart_options')
                name = 'Wind';
                data=[...WeatherData?.map((w,i) => (w.wind.speed)).slice(0,10)]
                unit='km/h'
                break;
            case 'H':
                d[2].classList.add('active_chart_options')
                name = 'Humidity';
                data=[...WeatherData?.map((w,i) => (w.main.humidity)).slice(0,10)]
                unit='%'
                break;
            case 'P':
                d[3].classList.add('active_chart_options')
                name = 'Pressure';
                data=[...WeatherData?.map((w,i) => (w.main.pressure)).slice(0,10)];
                unit= 'p'
                break;
           default:
               break;
       }
       setChartData(() => {
        // document.getElementById('weather_chart_options').childNodes
        return {
            ...ChartData,
            name: name,
            data: data,
            unit: unit
        }
    })
    }
    
    return (
    Weather && WeatherData && 
    <div className='weather_container'>
            <div className='weather_heading'>
                <div className='weather_heading_cityweather'>
                    <img src='https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png' alt='sun_img' />
                    <h1>{temp.value?.toFixed(2)}</h1>
                    <div className='weather_heading_temperature_units'><span onClick={() => ChangeTempUnit('C')} id='C'>°C</span> | <span id='F' onClick={() => ChangeTempUnit('F')}>°F</span></div>
                    <div className='weather_heading_cityweather_otherdata'>
                        <span>sea_level: {WeatherData[ActiveBox].main.sea_level} m</span>
                        <span>Humidity: {WeatherData[ActiveBox].main.humidity}%</span>
                        <span>Wind: {WeatherData[ActiveBox].wind.speed} km/h</span>
                    </div>
                </div>
                <div className='weather_heading_citydetails'>
                    <span>{city?.name}, Rajasthan</span>
                    {/* <span>{new Date(WeatherData[ActiveBox].dt_txt).getDay()}</span> */}
                    <span>{getWeekDay(new Date(WeatherData[ActiveBox].dt_txt).getDay())}</span>
                    <span>{WeatherData[ActiveBox].weather[0].description}</span>
                </div>
            </div>
            <div className='weather_chart_options' id='weather_chart_options'>
                    <div onClick={() => toggleChartOption('T')}>Temperature</div>
                    <div onClick={() => toggleChartOption('W')}>Wind</div>
                    <div onClick={() => toggleChartOption('H')}>Humidity</div>
                    <div onClick={() => toggleChartOption('P')}>Pressure</div>
                </div>
            <div className='weather_chart'>
                <Line
                data={data}
                width={800}
                height={500}
                options={{ maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }}
                />
            </div>
            
            <div className='weather_boxes'>
        {/* <AliceCarousel
        startIndex = {1}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        playButtonEnabled={true}
        dotsDisabled={true}
        items={3}
        autoPlayDirection="ltr"> */}

                {
                    WeatherData.map((w, i) => {
                        
                        return (
                            i < 10 &&
                            
                            <div className='weather_temperature_box' key={i} id={i} onClick={() => handleWeatherBox(i)}>
                                <i className="fab fa-cloudversify fa-4x"></i>
                                <div className='weather_temperature_box_details'>
                                    <h4>{(w.main.temp-273.15).toFixed(2)} °C</h4>
                                    <span>{w.wind.speed} m/s</span>
                                    <span>{new Date(w.dt_txt).toLocaleTimeString()}</span>
                                </div>
                            </div>
                            
                        )
                    })
                }
        {/* </AliceCarousel> */}

            </div>
            
        </div>
    )
}
