import React ,{useEffect}from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {Link} from 'react-router-dom'

import {getCurrentProfile} from '../../actions/profile'
import { Fragment } from 'react'

const Dashboard = ({getCurrentProfile,auth:{ user}, profile:{profile,loading}}) => {

    useEffect(()=>{
        getCurrentProfile()
    },[])

    return (loading && profile === null ? <Spinner/> :
    <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user && user.name}
        </p>
        {profile !== null ? (
            <Fragment>
                has
            </Fragment>
        ):(
            <Fragment> 
                <p>
                    you have not setup any profile upto yet
                </p>
                <link to='/create-profile' className="btn btn-primary my-1">
                    Create Profile
                </link>
            </Fragment>

        )}
    </Fragment>
    )
}

Dashboard.propTypes = {
    getCurrentProfile:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired,
}

const mapStateToProps=state => ({
    auth:state.auth,
    profile:state.profile
})

export default connect(mapStateToProps,{getCurrentProfile})(Dashboard)