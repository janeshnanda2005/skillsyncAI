import { useEffect, useState } from "react";
import { useAuth } from "../components/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const API_URL =  import.meta.env.VITE_API_URL || "http://localhost:8000"

function Me(){

    const{user,logout} = useAuth();
    const navigate = useNavigate();
    const [profile,Setprofile] = useState(null);
    const displayname = user?.name || user?.email?.split("@")[0]
    const [loading,Setloading] = useState(true)
    const [error,setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {

                if(!user.access_token){
                    setError("No access token")
                    return;
                }
                
            try {
                const response = await axios.get(
                    `${API_URL}/students/students-me`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.access_token}`
                        }
                    }

                );
                Setprofile(response.data)
                setError('')
                Setloading(false)
                
            } catch (err) {
                setError(`The profile cannot be loaded now ${err.response?.data?.detail || err.message}`)
            }

            finally{
                Setloading(false);
            };
        }

        if (user) fetchProfile()
    }, [user])

    if(loading){
        return <main className="page-wrap">Loading profile...</main>
    }

    if (error){
        return(
        <main className="page-wrap">
            <div className="notice notice-error">{error}</div>
            <button className="btn btn-primary" onClick={()=>navigate("/student-details")}>Go Back to Student Details</button>
        </main>
        );
    }


    return (
        <main className="page-wrap profile-page">
            <section className="profile-hero">
                <div className="profile-identity">
                    <div className="profile-avatar" aria-hidden="true">
                        {displayname?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="eyebrow profile-eyebrow">Student profile</div>
                        <h1>{displayname}'s Profile</h1>
                        <p>{profile.domain} <span className="profile-dot">&middot;</span> {profile.dept}</p>
                    </div>
                </div>
                <div className="profile-hero-actions">
                    <button className="button button-secondary" onClick={() => navigate("/student-details")}>
                        Edit details
                    </button>
                    <button className="button button-profile-ghost" onClick={() => { logout(); navigate('/login'); }}>
                        Log out
                    </button>
                </div>
            </section>

            <section className="profile-stat-grid" aria-label="Profile highlights">
                <div className="profile-stat">
                    <span>CGPA</span>
                    <strong>{profile.cgpa}</strong>
                    <small>Academic score</small>
                </div>
                <div className="profile-stat">
                    <span>Study year</span>
                    <strong>{profile.year}</strong>
                    <small>Current academic year</small>
                </div>
                <div className="profile-stat">
                    <span>Profile ID</span>
                    <strong>#{profile.sid}</strong>
                    <small>SkillSync member</small>
                </div>
            </section>

            <section className="panel profile-details-panel">
                <div className="profile-section-heading">
                    <div>
                        <div className="eyebrow">Personal record</div>
                        <h2>Profile details</h2>
                    </div>
                    <span className="profile-status">Active profile</span>
                </div>
                <div className="profile-details-grid">
                    <div className="profile-detail">
                        <span>Email address</span>
                        <strong>{profile.email}</strong>
                    </div>
                    <div className="profile-detail">
                        <span>Department</span>
                        <strong>{profile.dept}</strong>
                    </div>
                    <div className="profile-detail profile-detail-wide">
                        <span>Career domain</span>
                        <strong>{profile.domain}</strong>
                    </div>
                </div>
            </section>

            <div className="profile-footer-note">
                <span>Keep your profile current</span>
                <button className="button button-ghost" onClick={() => navigate('/home')}>
                    Back to dashboard
                </button>
            </div>
        </main>
    )
}

export default Me;