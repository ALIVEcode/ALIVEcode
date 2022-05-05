import { useEffect, useState } from 'react';

/**
 * https://stackoverflow.com/questions/47686345/playing-sound-in-react-js
 * @param url
 */
const useAudio = (url: string) => {
	const [audio] = useState(new Audio(url));
	const [playing, setPlaying] = useState(false);

	const toggle = () => setPlaying(!playing);

	const play = async () => {
		try {
			await audio.play();
			setPlaying(true);
			console.log('playing');
		} catch (error) {
			console.error(error);
		}
	};

	const stop = () => {
		audio.pause();
		audio.currentTime = 0;
		setPlaying(false);
	};

	useEffect(() => {
		playing ? audio.play() : audio.pause();
	}, [playing]);

	useEffect(() => {
		audio.addEventListener('ended', stop);
		audio.load();

		return () => {
			audio.removeEventListener('ended', stop);
		};
	}, []);

	return { playing, toggle, play, stop };
};

export default useAudio;
