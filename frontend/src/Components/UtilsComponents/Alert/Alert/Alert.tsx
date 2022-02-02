import React from 'react';
import { AlertComponentPropsWithStyle } from 'react-alert';

const Alert: React.FC<AlertComponentPropsWithStyle> = ({
	style,
	options,
	message,
	close,
}) => {
	return (
		<div className="bg-gray-800 text-white p-2" style={style}>
			{options.type === 'info' && '!'}
			{options.type === 'success' && ':)'}
			{options.type === 'error' && ':('}
			{message}
			<button onClick={close}>X</button>
		</div>
	);
};

export default Alert;
