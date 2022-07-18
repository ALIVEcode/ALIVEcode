import { useState, useEffect, useRef, useContext } from 'react';
import { ActivityPdf as ActivityPdfModel } from '../../../Models/Course/activities/activity_pdf.entity';
/* import { Document, Page } from 'react-pdf'; */
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import api from '../../../Models/api';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import { useTranslation } from 'react-i18next';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { downloadBlob } from '../../../Types/files.type';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { useAlert } from 'react-alert';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

/**
 * Shows an activity of type Pdf
 * @returns The activity of type Pdf
 *
 * @author Maxime Gazzé
 */
const ActivityPdf = ({ activity }: { activity: ActivityPdfModel }) => {
	const [loaded, setLoaded] = useState(false);
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(activity.startPage ?? 1);
	const [startPage, setStartPage] = useState<number | undefined>(
		activity.startPage,
	);
	const [finishPage, setFinishPage] = useState<number | undefined>(
		activity.finishPage,
	);
	const [pdfSrc, setPdfSrc] = useState('');
	const [downloading, setDownloading] = useState(false);
	const inputNumberRef = useRef<HTMLInputElement>(null);
	const pdfRefBox = useRef<HTMLDivElement>(null);
	const ref = useRef<any>(null);
	const { t } = useTranslation();
	const { course, editMode } = useContext(CourseContext);
	const alert = useAlert();

	useEffect(() => {
		const getSrc = async (
			setSource: React.Dispatch<React.SetStateAction<string>>,
		) => {
			const url = await api.db.courses.getResourceFileInActivity(
				activity.courseElement.course.id.toString(),
				activity.id.toString(),
			);
			setSource(url);
		};
		getSrc(setPdfSrc);
	}, [activity]);

	const saveActivity = async () => {
		if (!course) return;
		await api.db.courses.updateActivity(
			{ courseId: course.id, activityId: activity.id.toString() },
			{
				startPage: activity.startPage,
				finishPage: activity.finishPage,
			},
		);
	};

	const handlePageChange = (newPageNumber: number) => {
		// Boundaries
		if (newPageNumber < 1) newPageNumber = 1;
		if (newPageNumber > numPages) newPageNumber = numPages;

		// Changing input number
		if (inputNumberRef.current)
			inputNumberRef.current.value = String(newPageNumber);
		// Setting min-width of container to prevent display bugs
		if (pdfRefBox.current)
			pdfRefBox.current.style.minHeight = pdfRefBox.current.clientHeight + 'px';

		// Updating state
		setPageNumber(newPageNumber);
	};

	const onDocumentLoadSuccess = ({ numPages }: any) => {
		setNumPages(activity.finishPage ?? numPages);
		setLoaded(true);
	};

	const gotoPrev = () => {
		const index = pageNumber - 1;
		if (index < 1) return;
		handlePageChange(index);
	};

	const gotoNext = () => {
		const index = pageNumber + 1;
		if (numPages < index) return;
		handlePageChange(index);
	};

	const handleChangeStartPage = () => {
		if (!startPage) return;
		let nb = startPage;
		if (nb < 1) nb = 1;
		if (nb > (finishPage ?? numPages)) nb = finishPage ?? numPages;
		setStartPage(startPage);

		activity.startPage = nb;
		saveActivity();
	};

	const handleChangeFinishPage = () => {
		if (!finishPage) return;
		let nb = finishPage;
		if (nb < (startPage ?? 1)) nb = startPage ?? 1;
		if (nb > numPages) nb = numPages;
		setFinishPage(nb);

		activity.finishPage = nb;
		saveActivity();
	};

	return (
		<div className="w-full desktop:px-16">
			{!loaded ? (
				<LoadingScreen relative />
			) : (
				editMode && (
					<div className="flex flex-col tablet:flex-row gap-0 tablet:gap-4">
						<InputGroup
							label="Start at page"
							type="number"
							value={startPage}
							min={1}
							max={finishPage ?? numPages}
							onChange={(e: any) => setStartPage(e.target.value)}
							onBlur={handleChangeStartPage}
							onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
								e.keyCode === 13 && handleChangeStartPage()
							}
						/>
						<InputGroup
							label="Finish at page"
							type="number"
							value={finishPage}
							min={startPage ?? 1}
							max={numPages}
							onChange={(e: any) => setFinishPage(e.target.value)}
							onBlur={handleChangeFinishPage}
							onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
								e.keyCode === 13 && handleChangeFinishPage()
							}
						/>
					</div>
				)
			)}
			<div ref={pdfRefBox}>
				<Document
					className="w-full flex justify-center"
					file={pdfSrc}
					onLoadSuccess={onDocumentLoadSuccess}
					ref={ref}
				>
					<Page className="inline-block relative" pageNumber={pageNumber}>
						<div
							className="absolute left-0 top-0 z-1 h-full w-[50%]"
							onClick={gotoPrev}
						></div>
						<div
							className="absolute right-0 top-0 z-1 h-full w-[50%]"
							onClick={gotoNext}
						></div>
					</Page>
				</Document>
			</div>
			<p className="mt-2 w-full text-center">
				Page
				<input
					type="number"
					min={1}
					max={numPages}
					className="mx-2 text-center border border-[color:var(--bg-shade-four-color)]"
					defaultValue={pageNumber}
					ref={inputNumberRef}
					onBlur={(e: any) => handlePageChange(Number(e.target.value))}
					onKeyDown={e => {
						if (e.keyCode === 13)
							handlePageChange(Number(e.currentTarget.value));
					}}
				/>
				{t('course.activity.PF.page_of')} {numPages}
			</p>
			<FormInput
				type="range"
				min={1}
				max={numPages}
				value={pageNumber}
				onChange={(e: any) => handlePageChange(Number(e.target.value))}
			/>
			<div className="w-full flex justify-end">
				<IconButton
					icon={faDownload}
					loading={downloading}
					title={t('course.activity.PF.download_file')}
					onClick={async () => {
						if (!course || !activity.resource) return;
						setDownloading(true);
						const response =
							await api.db.courses.downloadResourceFileInActivity(
								course,
								activity,
								activity.resource.extension,
							);

						if (!response) {
							alert.error('Unsupported file type');
						} else {
							if (response.status === 200) {
								downloadBlob(
									response.data,
									activity.resource?.name,
									activity.resource?.extension,
								);
							}
						}
						setDownloading(false);
					}}
				/>
			</div>
		</div>
	);
};

export default ActivityPdf;
