import { useEffect, useState } from 'react'
import './frame.css'
import { createWorker } from 'tesseract.js'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Frame = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Upload file to convert text.");
  const [copyT, setCopyT] = useState("Copy");
  const [progress, setProgress] = useState(0);

  function handleImg (e) {
    setSelectedImage(e.target.files[0]);
  }

  async function convertImgToText(image) {
    const worker = createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          let x = m.progress * 100;
          setProgress(x);
        }
      }
    });
    
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(image);
    
    await worker.terminate();
    return text;
  }

  useEffect(() => {
    console.log(`Progress: ${progress}%`);
  }, [progress]);

  useEffect(() => {
    (async () => {
      if (selectedImage) {
        setTextResult("Uploading...");
        setProgress(0); 
        try {
          const text = await convertImgToText(selectedImage);
          console.log(text);
          setTextResult(text);
        } catch (error) {
          console.error("Error converting image to text:", error);
          setTextResult("Error converting image to text.");
        }
      }
    })();
  }, [selectedImage])

  function copyText(){
    navigator.clipboard.writeText(textResult);
    setCopyT("Copied");
    setTimeout(() => {
      setCopyT("Copy");
    }, 2000);
  }

  return (
    
    <div className='frame'>
      <div className="container">
        <div className="title">Img To Text Converter</div>
        <div className="desc">Created by Alper Ertugrul</div> 
        
        <div className="bottom">
          <div className="left">
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : "/test2.png"} alt="" className='img'/>
            <label htmlFor="upload" className='btn'>Upload Image</label>
            <input type="file" id='upload' accept="image/*" onChange={handleImg} className="btn"/> 
        </div>
        

          
        <div className="right">

          {selectedImage && progress > 0 && progress < 100 && (
            <div className="progress-bar-container">
              <div className='progress-bar-text'>{Math.floor(progress)} %</div>
              <div className="progress-bar" style={{width:`${progress}%`,height:"35px"}}></div>
            </div>
          )}

            <div className="text">{textResult}</div>
            <div className="copybtn" id='copybtn' onClick={copyText}><ContentCopyIcon/> {copyT}</div>
          </div>
        </div>

        
        
     
      </div>  
    </div>
  )
}

export default Frame

