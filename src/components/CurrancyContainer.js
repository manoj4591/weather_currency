import React, { Component } from 'react';
import { Col, Input, Row, Button, Spin } from 'antd';
import { MapContainer, TileLayer, Marker, FeatureGroup } from 'react-leaflet';
import axios from "axios";
import moment from 'moment';

const { Search } = Input;

class CurrancyContainer extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            toggler : false,
            loader : true,
        };
        this.mapRef = React.createRef();
    }

    componentDidMount(){
        this.getCurrentLocation();
    }

    componentDidUpdate(prevProps, prevState) {
        const {lng, lat} = this.state;
        if (lat !== prevState.lat || lng !== prevState.lng) {
            this.getBounds();
        }
    }

    getCurrentLocation = () =>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                this.getCurrentLocationAndWeather(position.coords.latitude, position.coords.longitude);
                this.setState({lat : position.coords.latitude, lng : position.coords.longitude});
            });
        }

    }

    // getCurrentlocationName = (lat , lng) => {
    //     axios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=false`)
    //     .then(res => {
    //         console.log(res);
    //     });
    // }

    getCurrencyDetails = (countryId) => {
        axios.get(`https://free.currconv.com/api/v7/countries?apiKey=e5c7bdff9f8390e71524`)
            .then(res => {
                this.getExchnageRates(res.data.results[countryId].currencyId);
            });
    }

    getExchnageRates = (countryCurrencyid) => {
        axios.get(`http://data.fixer.io/api/latest?access_key=8a8806e9ac69dba4e68b67b346ee291b&symbols=USD,EUR,${countryCurrencyid}&format=2`)
            .then(res => {
                this.setState({ratesValues : res.data.rates, countryCurrency : countryCurrencyid, loader: false});
            });
    }

    getCurrentLocationAndWeather = (lat , lng) =>{
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=a3587eba2cf62510b1bd1d4f7b61dac0`)
            .then(res => {
                this.getCurrencyDetails(res.data.sys.country);
                const temp =  Math.round(res.data.main.temp - 273.15);
                this.setState({cityName : res.data.name, time : moment().format('MMM Do , h:mm a'), temperature : temp, countId: res.data.sys.country});
            });
    }

    getWheatherForNextDays = (lat , lng) => {
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=a3587eba2cf62510b1bd1d4f7b61dac0`)
            .then(res => {
                const listD = res.data.daily.splice(1, 3);
                this.setState({listData : listD, toggler : true });
            });
    }

   onSearch = (value) => {
       axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=a3587eba2cf62510b1bd1d4f7b61dac0&units=metric`)
           .then(res => {
               this.getCurrencyDetails(res.data.list[0].sys.country);
               const temp =  Math.round(res.data.list[0].main.temp);
               this.setState({cityName : res.data.list[0].name, time : moment().format('MMM Do , h:mm a'), temperature : temp, lat : res.data.list[0].coord.lat, lng :res.data.list[0].coord.lon, toggler: false, countId :res.data.list[0].sys.country});
           });
   }

   getNextThreeDays = () => {
       const { lat,  lng}= this.state;
       this.getWheatherForNextDays(lat,  lng);
   }

    getBounds = () => {
        const { lat,  lng}= this.state;
        const jsonDataset = [[lat, lng], [(lat + 1), (lng + 1)]];
        if(this.mapRef.current !== null){
            this.mapRef.current.fitBounds(jsonDataset);
        }
        this.setState({jsonData : jsonDataset});
    }

    render() {
        const { loader, lat,  lng, cityName, time, listData, temperature, toggler, ratesValues, countryCurrency, countId, jsonData }= this.state;
        return (
            <>
                <div className="example">
                    <Spin spinning={loader} tip="Fetching Data For Current Location...">
                        <Row className="padd_10">
                            <Col className="gutter-row" span={12}>
                                <Search
                                    placeholder="search city"
                                    allowClear
                                    enterButton="Search"
                                    size="large"
                                    onSearch={this.onSearch}
                                />
                            </Col>
                        </Row>
                        <Row className="padd_10">
                            <Col className="gutter-row left" span={12}>
                                {time && <div className="dateFormat">{time}</div>}
                                {cityName && countId && <div className="cityName">{cityName}, {countId}</div>}
                                {temperature && <div className="temperature">{temperature} °C</div>}
                                {cityName &&<div className="centring"><Button onClick={this.getNextThreeDays}>Next 3 Days Forcast</Button></div>}
                                {listData && toggler && <ul className="list">
                                    {listData.map((item => (
                                        <li key={item.dt} className="post">
                                            <div span={24} className="listElement">{moment.unix(item.dt).format('MMM Do , h:mm a')}</div> 
                                            <div span={24} className="listElement">{Math.round(item.temp.max)}/{Math.round(item.temp.min)} °C </div>
                                            <div span={24} className="listElement"> {item.weather[0].description}</div>
                                        </li>
                                    )))}
                                </ul>}
                            </Col>
                            <Col className="gutter-row right" span={12}>
                                {lat && lng && <MapContainer center={[lat, lng]} whenCreated={ mapInstance => { this.mapRef.current = mapInstance; } } zoom={13} scrollWheelZoom={false} bounds={jsonData}>
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <FeatureGroup>
                                        <Marker position={[lat, lng]}></Marker>
                                    </FeatureGroup>
                                </MapContainer>}
                                {ratesValues && <Row>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Currency</th>
                                                <th>price</th>
                                                <th>Change</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>USD{countryCurrency}</td>
                                                <td>{(1 / (ratesValues[countryCurrency]/ratesValues.USD))}</td>
                                                <td>{(ratesValues[countryCurrency]/ratesValues.USD)}</td>
                                            </tr>
                                            <tr>
                                                <td>EUR{countryCurrency}</td>
                                                <td>{(1 / (ratesValues[countryCurrency]/ratesValues.EUR))}</td>
                                                <td>{(ratesValues[countryCurrency])}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td>{countryCurrency}</td>
                                                <td>1</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </Row>}
                            </Col>
                        </Row>
                    </Spin>
                </div>
            </>
        );
    }
}

export default CurrancyContainer;