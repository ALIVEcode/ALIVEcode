import { useContext } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { IoTProjectContext } from '../../../state/contexts/IoTProjectContext';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import IoTProject from '../../IoT/IoTProject/IoTProject';
import { ChallengeIoT } from '../../../Models/Challenge/challenges/challenge_iota.entity';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author Enric Soldevila
 */
const IoTChallenge = ({ initialCode }: { initialCode: string }) => {
	const { project } = useContext(IoTProjectContext);
	const { challenge: challengeUntyped } = useContext(ChallengeContext);

	const challenge = challengeUntyped as ChallengeIoT;

	if (!challenge || !project) return <LoadingScreen />;

	return <IoTProject></IoTProject>;
};

export default IoTChallenge;
