import { FooterProps } from './footerTypes';
import './footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useRoutes from '../../../state/hooks/useRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

/**
 * Footer of ALIVEcode home page
 *
 * @author MoSk3
 */
const Footer = (props: FooterProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();

	return (
		<footer className="site-footer">
			<div className="container">
				<div className="row">
					<div className="col-sm-12 col-md-6">
						<h6>{t('home.footer.about.title')}</h6>
						<p className="text-justify">{t('home.footer.about.description')}</p>
					</div>

					<div className="col-xs-6 col-md-3">
						<h6>{t('home.footer.categories')}</h6>
						<ul className="footer-links">
							<li>
								<Link to={routes.auth.dashboard.path}>
									{t('msg.section.dashboard')}
								</Link>
							</li>
							<li>
								<Link to={routes.public.amc.path}>{t('msg.section.amc')}</Link>
							</li>
							<li>
								<Link to={routes.public.about.path}>
									{t('msg.section.about')}
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-xs-6 col-md-3">
						<h6>{t('home.footer.links')}</h6>
						<ul className="footer-links">
							<li>
								<a
									href="https://github.com/MoSk3/ALIVEcode/tree/dev"
									rel="noopener noreferrer"
									target="_blank"
								>
									GITHUB <FontAwesomeIcon icon={faGithub} />
								</a>
							</li>
							<li>
								<a
									href="https://lrima.cmaisonneuve.qc.ca/"
									rel="noopener noreferrer"
									target="_blank"
								>
									LRIMA
								</a>
							</li>
							<li>
								<a
									href="https://lrima.cmaisonneuve.qc.ca/alive/"
									rel="noopener noreferrer"
									target="_blank"
								>
									LRIMA ALIVE
								</a>
							</li>
						</ul>
					</div>
				</div>
				<hr />
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-8">
						<p className="copyright-text">
							{t('home.footer.copyright_1')} &copy;
							{t('home.footer.copyright_2')}
							<a
								href="https://lrima.cmaisonneuve.qc.ca/"
								rel="noopener noreferrer"
								target="_blank"
							>
								{' '}
								LRIMA
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;