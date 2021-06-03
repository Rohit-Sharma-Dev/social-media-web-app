import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({
    education:{school,degree,feildofstudy,current,to,from,description}
}) => 
    <div>
        <h3 className='text-dark'>{school}</h3>
        <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{' '}
        {!to ? 'now':<Moment format='YYYY/MM/DD'>to</Moment>}
        </p> 

        <p>
            <stron>Degree :</stron>{degree}
        </p> 
        <p>
            <stron>Feildofstudy :</stron>{feildofstudy}
        </p> 
        <p>
            <stron>Description :</stron>{description}
        </p> 

    </div>
    


ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired,
}

export default ProfileEducation
