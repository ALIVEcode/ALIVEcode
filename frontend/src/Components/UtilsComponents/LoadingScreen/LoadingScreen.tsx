import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { classNames } from '../../../Types/utils';

const StyledSpinner = styled.div`
	color: var(--primary-color);
`;

/**
 *	Loading effect used when loading content (the loading appears 300ms after the render)
 *
 * @param {boolean} relative if it should have a relative positioning
 * @param {SizeProp} size size of the loading logo
 *
 * @author Enric Soldevila
 */
const LoadingScreen = ({
	relative,
	size,
	id,
	bg,
}: {
	relative?: boolean;
	size?: SizeProp;
	id?: string;
	bg?: string;
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
		<div
			className={classNames(
				'absolute w-full h-full flex items-center justify-center',
				relative && 'relative',
			)}
			style={{
				minHeight: loading ? '100px' : undefined,
				backgroundColor: bg,
			}}
			id={id}
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
		</div>
	);
};

export default LoadingScreen;
