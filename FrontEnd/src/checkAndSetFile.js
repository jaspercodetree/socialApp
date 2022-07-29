//檢查上傳檔案類型
export function checkAndSetFile(sender) {
	// 可接受的附檔名
	var validExts = ['.png', '.jpg', '.jpeg', '.gif'];

	var fileExt = sender.value;
	fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
	if (validExts.indexOf(fileExt) < 0) {
		alert('檔案類型錯誤，只可接受圖片副檔名如下：' + validExts.toString());
		sender.value = null;
		return false;
	} else {
		return true;
	}
}
