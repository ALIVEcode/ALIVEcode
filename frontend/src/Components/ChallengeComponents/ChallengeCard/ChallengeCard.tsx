import { ChallengeCardProps } from './challengeCardTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { faPencilAlt, faPlay } from '@fortawesome/free-solid-svg-icons';
import ChallengeButton from './ChallengeButton/ChallengeButton';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Badge from '../../UtilsComponents/Badge/Badge';
import { formatDate, formatTooLong } from '../../../Types/formatting';

/**
 * Display of a challenge that contains all its informations
 * (name, description, tags, creator, etc)
 *
 * @param {boolean} enterEdit if true, when the card is clicked, it goes in editMode
 * @param {ChallengeAlive | ChallengeCode | ChallengeIoT} challenge Challenge to render
 *
 * @author Enric Soldevila
 */
const ChallengeCard = ({ challenge, enterEdit }: ChallengeCardProps) => {
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const { user } = useContext(UserContext);
	const { t } = useTranslation();

	return (
		<div className="mb-4 rounded-xl text-white bg-[color:var(--primary-color)] text-center tablet:text-left">
			<div className="flex flex-col tablet:flex-row items-center justify-between py-4 p-2 tablet:p-6 laptop:p-10 gap-4 tablet:gap-8">
				<div className="w-full">
					<div className="text-3xl tablet:text-4xl laptop:text-5xl mb-2 laptop:mb-4 break-words">
						{formatTooLong(challenge.name, 50)}
					</div>
					<div className="text-xl laptop:text-2xl text-gray-200 mb-4">
						<label className="block tablet:inline">Tags: </label>
						<Badge variant="primary" className="bg-green-500 text-xl">
							{challenge.getTypeDisplay()}
						</Badge>
						{challenge.tags.map((t, idx) => (
							<Badge
								variant="primary"
								key={idx}
								className="bg-green-300 text-xl"
							>
								{t}
							</Badge>
						))}
					</div>
					<div className="text-xs tablet:text-sm text-gray-300">
						{formatTooLong(challenge.description || t('msg.desc.empty'), 500)}
					</div>
				</div>
				<div className="flex flex-row tablet:flex-col laptop:flex-row gap-4">
					{challenge.creator && challenge.creator.id === user?.id && (
						<ChallengeButton
							onClick={() =>
								navigate(
									routes.auth.challenge_edit.path.replace(
										':challengeId',
										challenge.id,
									),
								)
							}
							bgColor="var(--secondary-color)"
							color="white"
							icon={faPencilAlt}
							size="2x"
						/>
					)}
					{/*
						
						<ChallengeButton
							bgColor="rgb(255, 58, 58)"
							color="white"
							icon={faHeart}
							size="2x"
						/>
						*/}
					<ChallengeButton
						onClick={() =>
							enterEdit
								? navigate(
										routes.auth.challenge_edit.path.replace(
											':challengeId',
											challenge.id,
										),
								  )
								: navigate(
										routes.auth.challenge_play.path.replace(
											':challengeId',
											challenge.id,
										),
								  )
						}
						left="2px"
						bgColor="var(--third-color)"
						color="white"
						icon={faPlay}
						size="2x"
					/>
				</div>
			</div>
			<div className="flex gap-1 flex-col justify-between laptop:flex-row border-t border-[color:var(--bg-shade-two-color)] !py-4 p-2 tablet:p-6 laptop:p-10 text-xs laptop:text-sm text-gray-300">
				<div>
					{t('msg.creator')}:{' '}
					{challenge.creator
						? challenge.creator.getDisplayName()
						: t('msg.deleted_user')}
				</div>
				<div>
					{t('msg.creation_date')}: {formatDate(challenge.creationDate, t)}
				</div>
				<div>
					{t('msg.update_date')}: {formatDate(challenge.updateDate, t)}
				</div>
			</div>
		</div>
	);
};

export default ChallengeCard;
