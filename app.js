function startScan() {
  const video = document.getElementById('video');
  const result = document.getElementById('result');
  const password = document.getElementById('password').value;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scan = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          try {
            const decrypted = CryptoJS.AES.decrypt(code.data, password);
            const text = decrypted.toString(CryptoJS.enc.Utf8);
            result.textContent = text || "復号に失敗しました";
          } catch (e) {
            result.textContent = "復号エラー";
          }
          stream.getTracks().forEach(track => track.stop());
        } else {
          requestAnimationFrame(scan);
        }
      };
      requestAnimationFrame(scan);
    })
    .catch(err => {
      result.textContent = "カメラ起動に失敗しました";
    });
}