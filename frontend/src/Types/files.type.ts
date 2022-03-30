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
		case 'docx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
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
	}
};
