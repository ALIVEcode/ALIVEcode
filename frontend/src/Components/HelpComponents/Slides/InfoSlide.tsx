import { InfoSlideProps } from '../HelpProps';

const InfoSlide = ({ children, image, text, title, className }: InfoSlideProps) => {
	return (
		<div>
			<h3 className="text-3xl text-center pb-5">{title}</h3>
			{children}
		</div>
	);
};

export default InfoSlide;