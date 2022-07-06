import { useState, useContext } from 'react';
import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTComponentEditor from '../IoTComponentEditor/IoTComponentEditor';
import Button from '../../../UtilsComponents/Buttons/Button';
import IoTComponentCreator from '../IoTComponentCreator/IoTComponentCreator';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

const IoTProjectInterface = ({ noTopRow }: { noTopRow?: boolean }) => {
	const [editingComponent, setEditingComponent] = useState<number>();
	const [openComponentCreator, setOpenComponentCreator] = useState(false);
	const alert = useAlert();
	const { t } = useTranslation();
	const { project, canEdit, updateId, socket } = useContext(IoTProjectContext);

	const componentManager = socket?.getComponentManager();

	if (!project || !socket) return <LoadingScreen />;
	return (
		<div
			className="w-full h-full overflow-y-auto"
			style={{ backgroundColor: 'var(--background-color)' }}
		>
			<div className="flex flex-col h-full items-center">
				<div className="p-5 py-2 tablet:py-5 tablet:p-4 w-full top-0 z-10 bg-[color:var(--background-color)] flex flex-col tablet:flex-row justify-center gap-2 tablet:gap-4">
					{canEdit && (
						<Button
							variant="secondary"
							onClick={() => setOpenComponentCreator(!openComponentCreator)}
						>
							{t('iot.project.interface.add_component')}
						</Button>
					)}
					<Button
						variant="third"
						onClick={() => {
							navigator.clipboard.writeText(updateId);
							alert.success(t('msg.id_copied'));
						}}
						icon={faClipboard}
					>
						{t('iot.project.interface.copy_project_id')}
					</Button>
				</div>
				<div className="p-2 pt-0 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
					{project.layout.components.map((c, idx) => (
						<IoTGenericComponent
							key={idx}
							setEditingComponent={c => {
								setEditingComponent(
									componentManager?.getComponents().indexOf(c),
								);
							}}
							component={c}
						/>
					))}
				</div>
				<Modal
					size="lg"
					title={t('iot.project.interface.edit_component')}
					open={editingComponent != null ? true : false}
					setOpen={bool => !bool && setEditingComponent(undefined)}
					closeCross
					hideSubmitButton
				>
					{editingComponent != null && componentManager && (
						<IoTComponentEditor
							onClose={() => setEditingComponent(undefined)}
							component={componentManager.getComponents()[editingComponent]}
						/>
					)}
				</Modal>
				<Modal
					size="xl"
					title={t('iot.project.interface.add_component')}
					open={openComponentCreator}
					setOpen={setOpenComponentCreator}
					closeCross
					hideSubmitButton
				>
					<IoTComponentCreator
						onSelect={(c: IoTComponent) => {
							if (!componentManager) return;
							setOpenComponentCreator(false);
							c = componentManager.addComponent(c);
							alert.success(t('iot.project.add_component.success'));
							setEditingComponent(componentManager.getComponents().length - 1);
						}}
					/>
				</Modal>
			</div>
		</div>
	);
};

export default IoTProjectInterface;
