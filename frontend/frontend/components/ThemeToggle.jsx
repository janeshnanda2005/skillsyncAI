import { useTheme } from './ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()
	const isDark = theme === 'dark'

	return (
		<button
			className={`theme-toggle ${isDark ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
			type="button"
			onClick={toggleTheme}
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
			title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
		>
			<span className="theme-toggle__track" aria-hidden="true">
				<span className="theme-toggle__thumb">{isDark ? '☾' : '☀'}</span>
			</span>
		</button>
	)
}
