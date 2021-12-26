import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FillContainer from '../FillContainer/FillContainer';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

const StyledSpinner = styled.div`
	color: var(--primary-color);

	@-webkit-keyframes rotating /* Safari and Chrome */ {
		from {
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@keyframes rotating {
		from {
			-ms-transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-ms-transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	.rotating {
		-webkit-animation: rotating 1s linear infinite;
		-moz-animation: rotating 1s linear infinite;
		-ms-animation: rotating 1s linear infinite;
		-o-animation: rotating 1s linear infinite;
		animation: rotating 1s linear infinite;
	}
`;

/**
 *	Loading effect used when loading content (the loading appears 300ms after the render)
 *
 * @param {boolean} relative if it should have a relative positioning
 * @param {SizeProp} size size of the loading logo
 *
 * @author MoSk3
 */
const LoadingScreen = ({
	relative,
	size,
}: {
	relative?: boolean;
	size?: SizeProp;
}) => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setLoading(true);
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<FillContainer
			relative={relative}
			centered
			startAtTop
			style={{ textAlign: 'center', minHeight: loading ? '100px' : undefined }}
		>
			<div>
				<StyledSpinner>
					{loading && (
						<FontAwesomeIcon
							className="rotating"
							size={size ? size : '5x'}
							icon={faSpinner}
						/>
					)}
				</StyledSpinner>
			</div>
		</FillContainer>
	);
};

export default LoadingScreen;