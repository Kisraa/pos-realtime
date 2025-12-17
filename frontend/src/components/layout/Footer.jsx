import { useTranslate } from 'react-redux-multilingual';

export default function Footer() {
  const translate = useTranslate();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/images/logo.jpg" alt="Logo" className="footer-logo-img" />
        </div>
        <div className="footer-info">
          <div className="footer-item">
            <strong>{translate('footer.author')}:</strong> Kira Nguyễn
          </div>
          <div className="footer-item">
            <strong>{translate('footer.email')}:</strong> <a href="mailto:thanh0919234514@gmail.com">thanh0919234514@gmail.com</a>
          </div>
          <div className="footer-item">
            <strong>{translate('footer.phone')}:</strong> <a href="tel:0919234514">0919234514</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

