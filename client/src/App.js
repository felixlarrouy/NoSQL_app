import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Row, Select,  Slider, Radio,Switch, Icon, Button, Modal} from 'antd';
import Loading from './components/loading';
import {Link} from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;
const JsonTable = require('ts-react-json-table');

const RadioGroup = Radio.Group;
const Option = Select.Option;


class App extends Component {
  constructor(props) {
    super(props)
        this.state = {boroughs: ['All'], cuisineTypes: ['All'], violationCode:[], grade :[], loading: false, results:[],
        filters:{ restaurant: {borough:"", cuisineType:""} , grade:[], violationCode:[], criticalFlag:false, score:{min:0,max:160}},
        resInspections:[],modal:false,loadingModal:false
      }
  }

async componentDidMount() {
   const response = await fetch('/criterias')
   const criterias = await response.json()
    this.setState({boroughs: criterias.boroughs, cuisineTypes: criterias.cuisineTypes, violationCode: criterias.violationCodes, grade: criterias.grades});
 }


 handleLoadingState = (loading) =>{
   this.setState({loading:loading});
 }

boroughsChange = (value) =>{
  if(value==="ALL"){
     this.state.filters.restaurant.borough=""
   }
  else{
    this.state.filters.restaurant.borough=value
  }
  this.getData()
}

cuisineTypeChange = (value) => {
  if(value==="ALL"){
     this.state.filters.restaurant.cuisineType=""
   }
  else{
    this.state.filters.restaurant.cuisineType=value
  }
  this.getData()
}

violationCodeChange = (value) => {
  this.state.filters.violationCode= value
  this.getData()
}

gradeChange = (value) => {
  this.state.filters.grade= value
  this.getData()
}

scoreChange = (value) => {
 this.state.filters.score.min = value[0]
 this.state.filters.score.max = value[1]
 this.getData()
}

criticalFlagChange = (value) => {
 this.state.filters.criticalFlag=value
 this.getData()
}

getData = ()=>{
  this.setState({loading:true})
  fetch('/query',{method :"POST",  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },body:JSON.stringify(this.state.filters)}).then(res =>{
    if (res.ok) {
         return res.json();
       } else {
         throw new Error('Failed to load the Data');
       }
  }).then( data =>{
     this.setState({
       results:data,loading:false
  }, this.handleLoadingState(false))
}).catch(err =>this.setState({ results:[] , error: err, loading:false}));
}

onClickRow = (e, item ) => {
  this.setState({
    modal:true,
    loadingModal:true
  })
  this.getInspections(item.id);


}

getInspections = (id) => {
  fetch('/inspections/' + id, {mode: 'no-cors'}).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error('Failed to load the Data');
    }
  }).then(data => {
    this.setState({
      resInspections: data,
      loadingModal:false
    });


  }).catch(err =>{
     this.setState({resInspections:[]})
   })
}

 handleOk = (e) => {
   this.setState({
     modal: false,
   });
 }

    render() {
      const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            color:'white'
          };
      const {error, boroughs,  cuisineTypes, violationCode, grade, resInspections} = this.state;

      const marks = {
        0: '0',
        40: '40',
        80: '80',
        120: '120',
        160: '160'
      }

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
             {boroughs.map(res =>
                <Option value={res.toUpperCase()}>{res}</Option>
                )
              }
              </Select>


              <Select defaultValue="Cuisine Type" style={{ width: 120 }} onChange={this.cuisineTypeChange}>
              {cuisineTypes.map(res =>
                <Option value={res}>{res}</Option>
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
                <Slider range defaultValue={[0, 160]} marks={marks} step={null} min={0} max={160} onChange={this.scoreChange}/>
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
              <div></div>
              }



              {this.state.results.length>0 ? <JsonTable id="json-table" rows={this.state.results} onClickRow={this.onClickRow} theadClassName="tableHead" excludeColumns={["id"]} TableSettings=""/>: <div></div> }

              <div>
                <Modal
                  title="Inspections"
                  visible={this.state.modal}
                  onOk={this.handleOk}
                >
                {this.state.loadingModal ? <Loading message="Working on it ..."/> :
                <div></div>
                }
                <JsonTable id="json-table" rows={this.state.resInspections} theadClassName="tableHead" excludeColumns={["id"]} TableSettings=""/>


                </Modal>
              </div>
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
