import React ,{Fragment} from 'react'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import './App.css';
import Navbar from './component/layout/Navbar'
import Landing from './component/layout/Landing'
import Login from './component/auth/Login'
import Register from './component/auth/Register'


const App=()=> (
  <Router>
    <Fragment>
      <Navbar/>
      <Route exact path='/' component={Landing}/>
      <section className="container">
        <Switch>
          <Route exact path='/Register' component={Register}/>
            <Route exact path='/Login' component={Login}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
)
export default App;