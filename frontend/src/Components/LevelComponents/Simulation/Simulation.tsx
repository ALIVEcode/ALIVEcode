import FillContainer from "../../UtilsComponents/FillContainer/FillContainer";
import { sketch } from './Sketch/simulation/sketch';
import { SimulationProps, StyledSimulation } from './simulationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { useState, useCallback, useRef, useEffect } from 'react';
import Modal from '../../UtilsComponents/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-bootstrap';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import ConnectCarForm from '../ConnectCarForm/ConnectCarForm';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

/**
 * Simulation component that draws the car and make it functionnal
 *
 * @param {(s: any) => void} init init function that has the generated sketch as an argument
 *
 * @author Ecoral360
 * @author MoSk3
 */
const Simulation = ({
	init,
	onChange,
	id,
	stopExecution,
	setShowConfetti,
}: SimulationProps) => {
	const [loading, setLoading] = useState(true);
	const [loseModalOpen, setLoseModalOpen] = useState(false);
	const [loseDescripton, setLoseDescription] = useState('');
	const [winModalOpen, setWinModalOpen] = useState(false);
	const [connectModalOpen, setConnectModalOpen] = useState(false);
	const [deathGif, setDeathGif] = useState<string>();
	const sketchRef = useRef<any>(null);
	const { t } = useTranslation();
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		forceUpdate();
		return () => {
			sketchRef.current && sketchRef.current.cleanup();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		sketchRef.current && sketchRef.current.cleanup();
		setLoading(true);
	}, [id]);

	const onLose = useCallback(
		(death_gif: string, msg: string) => {
			setDeathGif(death_gif);
			setLoseDescription(msg);
			setLoseModalOpen(true);
			stopExecution();
		},
		[stopExecution],
	);

	const onWin = useCallback(() => {
		setWinModalOpen(true);
		setShowConfetti(true);
		stopExecution();
	}, [stopExecution, setShowConfetti]);

	const onConnectCar = useCallback(() => {
		setConnectModalOpen(true);
	}, []);

	return (
		<StyledSimulation>
			<FillContainer id={id} relative style={{ backgroundColor: 'white' }}>
				<FontAwesomeIcon
					className="zoom-button"
					icon={faSquare}
					color="black"
				/>
				{$(`#${id}`).length ? (
					<>
						{loading && <LoadingScreen relative />}
						<ReactP5Wrapper
							fullscreenDiv="fullscreen-div"
							canvasDiv={$(`#${id}`)}
							zoomButton={''}
							sketch={sketch}
							onChange={onChange}
							onWin={onWin}
							onLose={onLose}
							onConnectCar={onConnectCar}
							init={(s: any) => {
								sketchRef.current = s;
								setLoading(false);
								init(s);
							}}
						/>
					</>
				) : (
					<LoadingScreen relative />
				)}
			</FillContainer>
			<FillContainer className="fullscreen-div" startAtTop />
			<Modal
				title={t('simulation.modal.lose')}
				open={loseModalOpen}
				onClose={() => setLoseModalOpen(false)}
				hideCloseButton
				centered
				centeredText
				submitText={t('simulation.modal.retry')}
			>
				<Image alt="lose gif" src={deathGif} height={200}></Image>
				<br />
				{t(loseDescripton)}
			</Modal>
			<Modal
				title={t('simulation.modal.win')}
				open={winModalOpen}
				onClose={() => {
					setWinModalOpen(false);
					setShowConfetti(false);
				}}
				hideCloseButton
				centered
				centeredText
				submitText={t('simulation.modal.continue')}
			>
				🎉🎉🎉
			</Modal>
			<FormModal
				open={connectModalOpen}
				title={t('simulation.modal.connect_car.title')}
				onClose={() => setConnectModalOpen(false)}
			>
				<ConnectCarForm onClose={() => setConnectModalOpen(false)} />
			</FormModal>
		</StyledSimulation>
	);
};

export default Simulation;