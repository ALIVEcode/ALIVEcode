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
 * @author Enric Soldevila
 */
const Footer = ({ className }: FooterProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();

	return (
		<footer
			className={
				'site-footer px-4 text-center tablet:text-left tablet:px-10 desktop:px-20 pb-10 pt-10 mt-[-4rem] text-sm ' +
				className
			}
		>
			<div className="flex flex-col tablet:flex-row gap-10">
				<div className="w-full tablet:w-1/2">
					<h6>{t('home.footer.about.title')}</h6>
					<p className="text-center tablet:text-justify">
						{t('home.footer.about.description')}
					</p>
				</div>

				<div className="w-full tablet:w-1/4">
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

				<div className="w-full tablet:w-1/4">
					<h6>{t('home.footer.links')}</h6>
					<ul className="footer-links">
						<li>
							<a
								href="https://github.com/ALIVEcode/ALIVEcode"
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
			<hr className="mt-4" />
			<div>
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
		</footer>
	);
};

export default Footer;
