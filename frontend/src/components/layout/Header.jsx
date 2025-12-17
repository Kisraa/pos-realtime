import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IntlActions, useTranslate } from 'react-redux-multilingual';

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.Intl.locale);
  const translate = useTranslate();

  const changeLang = (lang) => {
    if (lang !== locale) {
      dispatch(IntlActions.setLocale(lang));
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="/images/logo.jpg" alt="Logo" className="navbar-logo-img" />
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            {translate('nav.pos')}
          </Link>
          <Link 
            to="/realtime" 
            className={`nav-link ${location.pathname === '/realtime' ? 'active' : ''}`}
          >
            {translate('nav.realtime')}
          </Link>
        </div>
      </div>

      <div className="language-switcher">
        <button 
          className={`lang-btn ${locale === 'vi' ? 'active' : ''}`}
          onClick={() => changeLang('vi')}
          type="button"
        >
          VI
        </button>
        <button 
          className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
          onClick={() => changeLang('en')}
          type="button"
        >
          EN
        </button>
      </div>
    </nav>
  );
}

