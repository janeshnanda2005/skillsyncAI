import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const displayName = user?.name || user?.email?.split('@')[0] || 'Member';

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<header className="site-nav">
			<div className="nav-inner">
				<NavLink className="brand" to="/home"><span className="brand-mark">S</span>SkillSync</NavLink>
				<nav className="nav-links" aria-label="Main navigation">
					<NavLink className="nav-link" to="/home">Dashboard</NavLink>
					<NavLink className="nav-link" to="/add-skill">Skills</NavLink>
					<NavLink className="nav-link" to="/add-project">Projects</NavLink>
					<NavLink className="nav-link" to="/add-cert">Credentials</NavLink>
					<NavLink className="nav-link" to="/upload-resume">Resume</NavLink>
				</nav>
				<div className="user-menu"><span className="avatar">{displayName.charAt(0).toUpperCase()}</span><span>{displayName}</span><button className="nav-logout" onClick={handleLogout}>Log out</button></div>
			</div>
		</header>
	);
}

export function AppShell() {
	return (
		<div className="app-shell">
			<Navbar />
			<main className="site-main"><Outlet /></main>
			<Footer />
		</div>
	);
}

export function Footer() {
	return <footer className="site-footer"><div className="footer-inner"><div><NavLink className="brand footer-brand" to="/home"><span className="brand-mark">S</span>SkillSync</NavLink><p>Build a profile that keeps up with your potential.</p></div><div className="footer-links"><NavLink to="/home">Dashboard</NavLink><NavLink to="/add-skill">Skills</NavLink><NavLink to="/add-project">Projects</NavLink><NavLink to="/upload-resume">Resume</NavLink></div><div className="footer-copy">© {new Date().getFullYear()} SkillSyncAI</div></div></footer>;
}

export default Navbar;





