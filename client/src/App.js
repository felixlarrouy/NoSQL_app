import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Row, Select,  Slider, Radio,Switch, Icon, Button} from 'antd';
import Loading from './components/loading';
import {Link} from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;


const RadioGroup = Radio.Group;
const Option = Select.Option;



class App extends Component {
  state = {filters:{boroughs: "",cuisineType: "", violationCode:[], grade :[] , score:{min:0,max:200}, criticalFlag:false},loading: false}

 async componentDidMount() {
   // const response = await fetch('/cities')
   // const inspections   = await response.json()
   // const locat = [
   //   {"name": 'IHOP', "lat":40.8803571, "lng":-73.90401159999999},
   //   {"name":'IHP',"lat": 40.8805571,"lng": -73.90101159929999}
   // ];

   // this.setState({ locations:locat})
 }

boroughsChange = (value) =>{
  if(value==="ALL"){
     this.state.filters.boroughs=""
   }
  else{
    this.state.filters.boroughs=value
  }
  console.log(this.state);
}

cuisineTypeChange = (value) => {
  if(value==="ALL"){
     this.state.filters.cuisineType=""
   }
  else{
    this.state.filters.cuisineType=value
  }
  console.log(this.state);
}

violationCodeChange = (value) => {
  this.state.filters.violationCode= value
  console.log(this.state);
}

gradeChange = (value) => {
  this.state.filters.grade= value
  console.log(this.state);
}

scoreChange = (value) => {
 this.state.filters.score.min = value[0]
 this.state.filters.score.max = value[1]
 console.log(this.state);
}

criticalFlagChange = (value) => {
 this.state.filters.criticalFlag=value
 console.log(this.state);
}
    render() {
      const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            color:'white'
          };
      const { error } = this.state;
      const Boroughs = ["All","Bronx" ,"Brooklyn"]
      const cuisineType = ["All","American" ,"Pizza"]
      const violationCode = ["08A", "47B"]
      const grade = ["A", "B", "C", "D"]
      const marks = { 0: '0',200: '200'};
      return (
        <Layout className="App">
          <Header className="header">
            <Row>
              <Icon type="star" className="icon" size="large"/>
              <h1>Inspections Restaurant</h1>

            </Row>
          </Header>
          <Layout>
            <Sider>

              <h3 className="filter">Filters</h3>
              <Select defaultValue="Boroughs" style={{ width: 120 }} onChange={this.boroughsChange}>
              {Boroughs.map(res =>
                <Option value={res.toUpperCase()}>{res}</Option>
                )
              }
              </Select>

              <Select defaultValue="Cuisine Type" style={{ width: 120 }} onChange={this.cuisineTypeChange}>
              {cuisineType.map(res =>
                <Option value={res.toUpperCase()}>{res}</Option>
                )
              }
              </Select>

              <Select placeholder="Violation Code"   mode="multiple" style={{ width: 120 }} onChange={this.violationCodeChange}>
              {violationCode.map(res =>
                <Option value={res.toUpperCase()}>{res}</Option>
                )
              }
              </Select>



              <Select placeholder="Grade" mode="multiple" style={{ width: 120 }} onChange={this.gradeChange}>
              {grade.map(res =>
                <Option value={res.toUpperCase()}>{res}</Option>
                )
              }
              </Select>

              <div className="check">

                <div>
                <p>Score :</p>
                <Slider range defaultValue={[0, 200]} marks={marks} min={0} max={200} onChange={this.scoreChange}/>
                  <p>Critical Flag : </p>
                  <Switch checkedChildren={<Icon type="check" />}  unCheckedChildren={<Icon type="cross" />}  onChange={this.criticalFlagChange} />
                </div>
              </div>
              <Link to="/dev">
               <Button type="primary" icon="setting" size="large" >Dev Tools</Button></Link>
            </Sider>
            <Content className="content">

            {error ? <div><h3>Something went wrong .. </h3><span>Error : Failed to load Data</span></div>: <div></div>}
              {this.state.loading ? <Loading message="Working on it ..."/> :
                <Row gutter={48} type="flex" justify="space-around" align="center">

                </Row>
              }
            </Content>
          </Layout>
          <Footer className="footer">
            Salim LAABI, Félix LARROUY & Corentin LEMAITRE  2018
          </Footer>
          </Layout>
      );
  }
}


export default App;
