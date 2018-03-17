import React, { Component } from 'react';
import logo from './logo.svg';
import MapContainer from './components/Container';
import './App.css';
import { Layout, Row, Select,  Slider, Radio,Switch, Icon, Button} from 'antd';
import Loading from './components/loading';
import { Input } from 'antd';
import {Link} from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;

const RadioGroup = Radio.Group;
const Option = Select.Option;



class App extends Component {
  constructor(props) {
   super(props);
  this.state = { value: "find", error:null, loading: false, resultQuery:"", query:"{}", projection:"{}"}
  this.queryChange = this.queryChange.bind(this);
  this.projectionChange = this.projectionChange.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
}
  queryTypeChange = (e) => {
      console.log('radio checked', e.target.value);
      this.setState({
        value: e.target.value,
      });

    }
   queryChange(event) {
       this.setState({query: event.target.value});
     }

     projectionChange(event) {
         this.setState({projection: event.target.value});
       }

     handleSubmit() {
       console.log(this.state.query + "  "+this.state.projection)
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

              <h3 className="filter">Query Type:</h3>
              <RadioGroup classname="queryType" onChange={this.queryTypeChange} value={this.state.value}>
                <Radio value={"find"}>Find</Radio>
                <Radio value={"aggregate"}>Aggregate</Radio>
                <Radio value={"distinct"}>Distinct</Radio>
              </RadioGroup>
                <Link to="/">
               <Button type="primary" icon="arrow-left"  size="large" >Main App</Button></Link>
            </Sider>
            <Content className="content">

            <form onSubmit={this.handleSubmit}>
            <h3>The Query :</h3>
            <textarea rows={4} value={this.state.query}  onChange={this.queryChange} />

            <h3>The Projection :</h3>
            <textarea rows={4} value={this.state.projection}  onChange={this.projectionChange}  />

            <Button type="primary" htmlType="submit">Apply query</Button>
            </form>
            {this.state.loading ? <Loading message="Working on it ..."/> :<div></div>}

            {this.state.error ? <div><h3>Something went wrong .. </h3><span>Error : Failed to load Data</span></div>:<div></div>}

            {this.state.resultQuery!=="" ? <p className="resultQuery">{this.state.resultQuery}</p> : <div></div> }
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
