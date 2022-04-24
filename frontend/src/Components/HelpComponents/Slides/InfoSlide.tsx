import { InfoSlideProps } from '../HelpProps';

const InfoSlide = ({ children, image, text, title, className }: InfoSlideProps) => {
	return (
		<div>
			<h3 className="text-2xl text-center pb-3">{title}</h3>
			{children}
		</div>
	);
};

export default InfoSlide;