import React from 'react'
import propTypes from 'prop-types'
import {connect} from 'react-redux'

const Alert = ({ alerts}) => alerts !== null && alerts.length > 0 && alerts.map(alert =>(
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
)); 
// console.log(alerts);


Alert.propTypes ={
    alerts:propTypes.array.isRequired
}
const mapStateToProps = state => ({
    alerts : state.alert
});

// console.log(mapStateProps);


export default connect(mapStateToProps) (Alert)
