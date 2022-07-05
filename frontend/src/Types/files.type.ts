// Downloads the blob on the browser
export const downloadBlob = (blob: Blob, filename: string, ext: string) => {
	// Create an object URL for the blob object
	const url = URL.createObjectURL(
		new Blob([blob], { type: `${GetMimeType(ext)}` }),
	);

	// Create a new anchor element
	const a = document.createElement('a');

	// Set the href and download attributes for the anchor element
	// You can optionally set other attributes like `title`, etc
	// Especially, if the anchor element will be attached to the DOM
	a.href = url;
	a.download = filename || 'download';

	// Click handler that releases the object URL after the element has been clicked
	// This is required for one-off downloads of the blob content
	a.click();
};

//for mime type you can also use any package
export const GetMimeType = (extension: string) => {
	if (extension.startsWith('.')) extension = extension.slice(1);
	switch (extension.toLowerCase()) {
		case 'csv':
			return 'text/csv';
		case 'cur':
			return 'application/octet-stream';
		case 'cxx':
			return 'text/plain';
		case 'dat':
			return 'application/octet-stream';
		case 'datasource':
			return 'application/xml';
		case 'dbproj':
			return 'text/plain';
		case 'dcr':
			return 'application/x-director';
		case 'dot':
			return 'application/msword';
		case 'zip':
			return 'application/zip';
		case 'jpb':
			return 'application/octet-stream';
		case 'jpe':
			return 'image/jpeg';
		case 'jpeg':
			return 'image/jpeg';
		case 'jpg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case '.doc':
			return 'application/msword';
		case 'dot ':
			return 'application/msword';
		case 'docx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		case 'dotx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.template';
		case 'docm':
			return 'application/vnd.ms-word.document.macroEnabled.12';
		case 'dotm':
			return 'application/vnd.ms-word.template.macroEnabled.12';
		case 'xls ':
			return 'application/vnd.ms-excel';
		case 'xlt ':
			return 'application/vnd.ms-excel';
		case 'xla ':
			return 'application/vnd.ms-excel';
		case 'xlsx':
			return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		case 'xltx':
			return 'application/vnd.openxmlformats-officedocument.spreadsheetml.template';
		case 'xlsm':
			return 'application/vnd.ms-excel.sheet.macroEnabled.12';
		case 'xltm':
			return 'application/vnd.ms-excel.template.macroEnabled.12';
		case 'xlam':
			return 'application/vnd.ms-excel.addin.macroEnabled.12';
		case 'xlsb':
			return 'application/vnd.ms-excel.sheet.binary.macroEnabled.12';
		case 'pdf':
			return 'application/pdf';
		case 'ppt ':
			return 'application/vnd.ms-powerpoint';
		case 'pot ':
			return 'application/vnd.ms-powerpoint';
		case 'pps ':
			return 'application/vnd.ms-powerpoint';
		case 'ppa ':
			return 'application/vnd.ms-powerpoint';
		case 'pptx':
			return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
		case 'potx':
			return 'application/vnd.openxmlformats-officedocument.presentationml.template';
		case 'ppsx':
			return 'application/vnd.openxmlformats-officedocument.presentationml.slideshow';
		case 'ppam':
			return 'application/vnd.ms-powerpoint.addin.macroEnabled.12';
		case 'pptm':
			return 'application/vnd.ms-powerpoint.presentation.macroEnabled.12';
		case 'potm':
			return 'application/vnd.ms-powerpoint.template.macroEnabled.12';
		case 'ppsm':
			return 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12';
	}
};
