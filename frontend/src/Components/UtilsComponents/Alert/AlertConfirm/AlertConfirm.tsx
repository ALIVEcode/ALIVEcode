import { AlertConfirmProps } from './alertConfirmTypes';
import Button from '../../Buttons/Button';
import { useTranslation } from 'react-i18next';
import Modal from '../../Modal/Modal';
import { useRef, useState } from 'react';
import { classNames } from '../../../../Types/utils';

/**
 * Modal used to confirm an action (for example: deleting something)
 *
 * @param {() => void} onClose when the modal is closed
 * @param {() => void} onConfirm when the action is confirmed
 * @param {() => void} onCancel when the action is cancelled
 * @param {ModalProps} other other normal modal props
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const AlertConfirm = ({
	setOpen,
	onConfirm,
	onCancel,
	children,
	secureConfirmation,
	irreversibleText,
	...other
}: AlertConfirmProps) => {
	const { t } = useTranslation();
	const validationRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState(false);

	const secureConfirmationValidated = () => {
		if (!secureConfirmation) return true;
		switch (secureConfirmation.type) {
			case 'checkbox':
				return validationRef.current?.checked ?? true;
			case 'text':
				return (
					validationRef.current?.value === secureConfirmation.comparisonValue
				);
		}
	};

	const SecureConfirmationComponent = () => {
		if (secureConfirmation === undefined) return false;

		switch (secureConfirmation.type) {
			case 'checkbox':
				return (
					<span className="pb-4">
						<input
							ref={validationRef}
							type="checkbox"
							required
							onChange={() => setError(false)}
							className="mr-3"
						/>
						<label
							className={classNames(
								error && 'text-[color:var(--danger-color)]',
							)}
						>
							{secureConfirmation.title}
						</label>
					</span>
				);
			case 'text':
				return (
					<>
						<label
							className={classNames(
								error && 'text-[color:var(--danger-color)]',
								'pb-4',
							)}
						>
							{secureConfirmation.title}
						</label>
						<input
							ref={validationRef}
							type="text"
							required
							className="border border-[color:var(--fg-shade-one-color)] mb-4 p-1"
							onChange={() => setError(false)}
							placeholder={secureConfirmation.placeholder}
						/>
					</>
				);
			default:
				return <></>;
		}
	};

	return (
		<Modal
			hideFooter
			size="sm"
			centered
			setOpen={setOpen}
			centeredText
			closeCross
			{...other}
		>
			{irreversibleText && (
				<p className="text-red-600 pb-2 font-bold text-lg">
					{t('action.irreversible')}
				</p>
			)}
			{children}
			{SecureConfirmationComponent()}

			<div className="flex justify-evenly">
				<Button
					className="p-5"
					variant="third"
					onClick={() => {
						setOpen(false);
						onCancel && onCancel();
					}}
				>
					{t('modal.cancel')}
				</Button>
				<Button
					className="p-5"
					variant="danger"
					onClick={() => {
						if (secureConfirmationValidated()) {
							setOpen(false);
							onConfirm && onConfirm();
						} else {
							setError(true);
						}
					}}
				>
					{t('modal.confirm')}
				</Button>
			</div>
		</Modal>
	);
};

export default AlertConfirm;
