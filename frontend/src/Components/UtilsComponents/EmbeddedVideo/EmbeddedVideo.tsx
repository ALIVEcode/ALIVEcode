import { useMemo } from 'react';

export const parseVideoURL = (url: string) => {
	return url.match(
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/,
	);
};

type EmbeddedVideoProps = {
	url: string;
};

const EmbeddedVideo = ({ url }: EmbeddedVideoProps) => {
	const matches = useMemo(() => parseVideoURL(url), [url]);

	const videoId = matches && matches[6];

	return (
		<iframe
			className="m-auto w-full aspect-video"
			src={`https://youtube.com/embed/${videoId}`}
			title="YouTube video player"
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
		/>
	);
};

export default EmbeddedVideo;
