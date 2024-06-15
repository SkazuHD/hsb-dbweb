export class ImageLoad{

    imageFromBuffer(buffer: ArrayBuffer): string {
        // Assuming the buffer is an instance of readAsDataURL
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        // Convert binary data to a base64 encoded string
        const base64String = window.btoa(binary);
        // Return the data URI scheme
        return `data:image/jpeg;base64,${base64String}`;
    }

    setImageUrl(file: File){
        const reader = new FileReader();
        let base64Image = '';
        reader.onload = (e: any) => {
          base64Image = this.imageFromBuffer(e.target.result);
        };
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            return base64Image;
        }
       return reader 
      }
}