// import { useCallback, useEffect, useRef, useState } from 'react';
// import './upload.css';

// export default function Upload() {
// 	// STEP 1: select element and register change event
// 	const [file, setFile] = useState(null);
// 	const previewImg = useRef();
// 	const [isUploading, setIsUploading] = useState(false);

// 	const handleFileUpload = useCallback(
// 		(e) => {
// 			console.log(e);
// 			e && setFile(e.target.files[0]);
// 			setIsUploading(true);
// 			e && console.log(e.target.files);

// 			async function handleFileUploading() {
// 				try {
// 					if (!file) return;
// 					console.log(file);
// 					const beforeUploadCheck = await beforeUpload(file);
// 					if (!beforeUploadCheck.isValid)
// 						throw beforeUploadCheck.errorMessages;

// 					const arrayBuffer = await getArrayBuffer(file);
// 					let response = await uploadFileAJAX(arrayBuffer);
// 					console.log(response);

// 					alert('File Uploaded Success');
// 					const objectURL = URL.createObjectURL(file);
// 					console.log(objectURL);
// 					previewImg.current.src = objectURL;
// 					setFile(null);
// 				} catch (error) {
// 					alert(error);
// 					console.log('Catch Error: ', error);
// 				} finally {
// 					setIsUploading(false);
// 				}
// 			}

// 			handleFileUploading();
// 		},
// 		[file]
// 	);

// 	useEffect(() => {
// 		handleFileUpload();
// 	}, [handleFileUpload, file]);

// 	// STEP 2: showPreviewImage with createObjectURL
// 	// If you prefer Base64 image, use "FileReader.readAsDataURL"

// 	// STEP 3: change file object into ArrayBuffer
// 	function getArrayBuffer(fileObj) {
// 		return new Promise((resolve, reject) => {
// 			const reader = new FileReader();
// 			// Get ArrayBuffer when FileReader on load
// 			reader.addEventListener('load', () => {
// 				resolve(reader.result);
// 			});

// 			// Get Error when FileReader on error
// 			reader.addEventListener('error', () => {
// 				reject('error occurred in getArrayBuffer');
// 			});

// 			// read the blob object as ArrayBuffer
// 			// if you nedd Base64, use reader.readAsDataURL
// 			reader.readAsArrayBuffer(fileObj);
// 		});
// 	}

// 	// STEP 4: upload file throguth AJAX
// 	// - use "new Uint8Array()"" to change ArrayBuffer into TypedArray
// 	// - TypedArray is not a truely Array,
// 	//   use "Array.from()" to change it into Array
// 	function uploadFileAJAX(arrayBuffer) {
// 		// correct it to your own API endpoint
// 		return fetch('https://jsonplaceholder.typicode.com/posts/', {
// 			headers: {
// 				version: 1,
// 				'content-type': 'application/json',
// 			},
// 			method: 'POST',
// 			body: JSON.stringify({
// 				imageId: 1,
// 				icon: Array.from(new Uint8Array(arrayBuffer)),
// 			}),
// 		})
// 			.then((res) => {
// 				if (!res.ok) {
// 					throw res.statusText;
// 				}
// 				return res.json();
// 			})
// 			.then((data) => data)
// 			.catch((err) => console.log('err', err));
// 	}

// 	// STEP 5: Create before upload checker if needed
// 	function beforeUpload(fileObject) {
// 		return new Promise((resolve) => {
// 			const validFileTypes = ['image/jpeg', 'image/png', 'video/mp4'];
// 			const isValidFileType = validFileTypes.includes(fileObject.type);
// 			let errorMessages = [];

// 			if (!isValidFileType) {
// 				errorMessages.push('You can only upload JPG or PNG file!');
// 			}

// 			const isValidFileSize = fileObject.size / 1024 / 1024 < 200;
// 			if (!isValidFileSize) {
// 				errorMessages.push('Image must smaller than 2MB!');
// 			}

// 			resolve({
// 				isValid: isValidFileType && isValidFileSize,
// 				errorMessages: errorMessages.join('\n'),
// 			});
// 		});
// 	}

// 	return (
// 		<div className="container uploadTestContainer">
// 			<h2 className="my-5 text-center">File Upload with JavaScript</h2>

// 			<label
// 				className="text-center mb-5 image-preview-wrapper"
// 				htmlFor="file-uploader"
// 			>
// 				<img
// 					src={
// 						'https://via.placeholder.com/300x300/efefef?text=Avatar'
// 					}
// 					alt="placeholder"
// 					className="img-thumbnail"
// 					data-target="image-preview"
// 					ref={previewImg}
// 				/>
// 				<div
// 					className={`spinner-wrapper position-absolute ${
// 						isUploading && 'opacity-1'
// 					}`}
// 					data-target="spinner"
// 				>
// 					<div
// 						className="spinner-border text-secondary"
// 						role="status"
// 					>
// 						<span className="sr-only">Loading...</span>
// 					</div>
// 				</div>
// 			</label>

// 			<div className="row">
// 				<div className="col-12 col-md-6 mx-auto">
// 					<div className="custom-file text-center">
// 						<input
// 							type="file"
// 							className="custom-file-input"
// 							data-target="file-uploader"
// 							id="file-uploader"
// 							onChange={(e) => handleFileUpload(e)}
// 						/>
// 						<label
// 							className="custom-file-label"
// 							htmlFor="customFile"
// 						>
// 							Choose file
// 						</label>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
