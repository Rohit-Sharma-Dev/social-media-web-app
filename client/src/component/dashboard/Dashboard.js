import React ,{useEffect}from 'react'
import propTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {Link} from 'react-router-dom'
import DashboardActions from './DashboardActions'

import {getCurrentProfile} from '../../actions/profile'
import { Fragment } from 'react'

const Dashboard = ({getCurrentProfile,auth:{ user}, profile:{profile,loading}}) => {

    useEffect(()=>{
        getCurrentProfile()
    },[getCurrentProfile])

    return (loading && profile === null ? <Spinner/> :
    <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user && user.name}
        </p>
        {profile !== null ? (
            <Fragment>
                <DashboardActions/>
            </Fragment>
        ):(
            <Fragment> 
                <p>
                    you have not setup any profile upto yet
                </p>
                <Link to='/create-profile' className="btn btn-primary my-1">
                    Create Profile
                </Link>
            </Fragment>

        )}
    </Fragment>
    )
}

Dashboard.propTypes = {
    getCurrentProfile:propTypes.func.isRequired,
    auth:propTypes.object.isRequired,
    profile:propTypes.object.isRequired,
}

const mapStateToProps=state => ({
    auth:state.auth,
    profile:state.profile
})

export default connect(mapStateToProps,{getCurrentProfile})(Dashboard)
