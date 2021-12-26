import { iotHomeProps } from './iotHomeTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import Link from '../../../Components/UtilsComponents/Link/Link';
import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';

const StyledDiv = styled(FillContainer)``;

/**
 * Home of the IoT branch
 *
 * @author MoSk3
 */
const IoTHome = (props: iotHomeProps) => {
	const { routes } = useRoutes();

	return (
		<StyledDiv>
			<div>
				<h1>IoT Home Page</h1>
			</div>
			<div>
				<Link dark to={routes.auth.iot_dashboard.path}>
					IoT Dashboard
				</Link>
			</div>
		</StyledDiv>
	);
};

export default IoTHome;