import { useState, useEffect, useRef } from 'react';
import { ActivityPdf as ActivityPdfModel } from '../../../Models/Course/activities/activity_pdf.entity';
/* import { Document, Page } from 'react-pdf'; */
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import api from '../../../Models/api';
import FormInput from '../../UtilsComponents/FormInput/FormInput';

/**
 * Shows an activity of type Pdf
 * @returns The activity of type Pdf
 *
 * @author Maxime Gazzé
 */
const ActivityPdf = ({ activity }: { activity: ActivityPdfModel }) => {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pdfSrc, setPdfSrc] = useState('');
	const inputNumberRef = useRef<HTMLInputElement>(null);
	const pdfRefBox = useRef<HTMLDivElement>(null);
	const ref = useRef<any>(null);

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
		setNumPages(numPages);
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

	return (
		<div className="w-full desktop:px-16">
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
				of {numPages}
			</p>
			<FormInput
				type="range"
				min={1}
				max={numPages}
				value={pageNumber}
				onChange={(e: any) => handlePageChange(Number(e.target.value))}
			/>
		</div>
	);
};

export default ActivityPdf;
