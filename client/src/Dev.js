import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Row, Select,  Slider, Radio,Switch, Icon, Button} from 'antd';
import Loading from './components/loading';
import { Input } from 'antd';
import {Link} from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;

const RadioGroup = Radio.Group;
const Option = Select.Option;

const API = "http://localhost:3001/"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "find", error:null, loading: false, resultQuery:{},resQuery:false, query:"{\"restaurant.cuisineType\":\"Mediterranean\"}", projection:"{\"restaurant\":1, \"_id\":0}"}
    this.queryChange = this.queryChange.bind(this);
    this.projectionChange = this.projectionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoadingState = (loading) =>{
    this.setState({loading:loading});
  }

  queryTypeChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });

  }
  queryChange(event) {
    console.log(typeof event.target.value)
     this.setState({query: event.target.value.toString()});
   }

  projectionChange(event) {
       this.setState({projection: event.target.value.toString()});
     }

  handleSubmit() {
     this.getData("dev/"+this.state.value+"/"+this.state.query+"/"+this.state.projection)
   }

   getData= (url)=>{
    this.setState({loading:true})
    fetch(url,{mode: 'no-cors'}).then(res =>{
      if (res.ok) {
           return res.json();
         } else {
           console.log("error")
           throw new Error('Failed to load the Data');
         }
    }).then( data =>{
       this.setState({
       resultQuery:JSON.stringify(data),resQuery:true, loading:false
    }, this.handleLoadingState(false))

  }).catch(err =>this.setState({ resultQuery:{} , error: err, loading:false, resQuery:false}));
  }


    render() {
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
            <Link to="/">
              <Button type="primary" icon="arrow-left"  size="large" >Main App</Button></Link>
              <h3 className="filter">Query Type:</h3>
              <RadioGroup classname="queryType" onChange={this.queryTypeChange} value={this.state.value}>
                <Radio value={"find"}>Find</Radio>
                <Radio value={"aggregate"}>Aggregate</Radio>
                <Radio value={"distinct"}>Distinct</Radio>
              </RadioGroup>


            </Sider>
            <Content className="content">

            <h3>The Query :</h3>
            <textarea rows={4} value={this.state.query}  onChange={this.queryChange} />

            <h3>The Projection :</h3>
            <textarea rows={4} value={this.state.projection}  onChange={this.projectionChange}  />

            <Button type="primary" onClick={this.handleSubmit}>Apply query</Button>
            {this.state.loading ? <Loading message="Working on it ..."/> :<div></div>}

            {this.state.error ? <div><h3>Something went wrong .. </h3><span>Error : Failed to load Data</span></div>:<div></div>}

            {this.state.resQuery ? <p className="resultQuery">{this.state.resultQuery}</p> : <div></div> }
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
