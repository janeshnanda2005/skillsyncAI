import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.errorCode}>404</h1>
            <h2 style={styles.title}>Page is Not Found</h2>
            <p style={styles.message}>
                The Page you are looking for might be removed,had its name changed or is temporarily unavailable at the moment.
            </p>
            <Link to="/home" style={styles.homeButton}>
                Back to home
            </Link>
        </div>
    )
};

const styles ={
    container : {
        display : 'flex',
        flexDirection:'Column',
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        backgroundColor:'#f8f9fa',
        fontFamily:'Arial,sans-serif',
        Padding:'20px',
    },

    errorCode : {
        fontSize:'8rem',
        fontWeight:'bold',
        color:'#dc3545',
        margin:0,
    },

    message : {
        fontSize:'1.1rem',
        color:'#6c757d',
        maxWidth:'500px',
        marginBottom:'30px',
        lineHeight:'1.5',
    },

    title: {
        fontSize:'2rem',
        color:'#343a40',
        marginBottom:'15px',
    },
    homeButton : {
        padding :'12px 24px',
        fontSize:'1rem',
        backgroundColor:'#007bff',
        color:'#fff',
        textDecoration:'none',
        borderRadius:'5px',
        fontWeight:'bold',
        transistion:'background-color 0.2s'
    }
};

export default NotFound;